from __future__ import annotations

import argparse
import copy
import json
import sys
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any, Dict, List, Optional

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT))

from back.app.or_tools.optimizer import ItemDecisionInput, optimize_revenue_with_late_penalty


def _to_float(x: Any, default: float = 0.0) -> float:
    if x is None:
        return default
    if isinstance(x, (int, float)):
        return float(x)
    s = str(x).strip()
    if s == "":
        return default
    try:
        return float(s)
    except ValueError:
        return default


def _clip_non_negative(v: float) -> float:
    return v if v >= 0 else 0.0


@dataclass
class ScenarioSpec:
    name: str
    leadtime_delta_days: float = 0.0
    demand_multiplier: float = 1.0
    supply_multiplier: Optional[float] = None
    unmet_penalty_multiplier: float = 1.0
    delay_penalty_slope: float = 0.0
    leadtime_risk_baseline_days: Optional[float] = None

    substitution: Optional[List[Dict[str, Any]]] = None

    max_total_supply: Optional[float] = None


def _apply_substitution(
    items: List[Dict[str, Any]],
    substitution: List[Dict[str, Any]],
) -> None:
    if not substitution:
        return

    by_id = {str(it.get("item_id")): it for it in items if it.get("item_id") is not None}

    for rule in substitution:
        rate = _to_float(rule.get("rate"), 0.0)
        if rate <= 0:
            continue

        from_item_id = rule.get("from_item_id")
        to_item_id = rule.get("to_item_id")
        from_group = rule.get("from_group")
        to_group = rule.get("to_group")

        if from_item_id is not None and to_item_id is not None:
            from_it = by_id.get(str(from_item_id))
            to_it = by_id.get(str(to_item_id))
            if not from_it or not to_it:
                continue

            from_demand = _to_float(from_it.get("demand"), 0.0)
            moved = from_demand * rate
            if moved <= 0:
                continue
            from_it["demand"] = _clip_non_negative(from_demand - moved)
            to_it["demand"] = _clip_non_negative(_to_float(to_it.get("demand"), 0.0) + moved)
            continue

        if from_group is not None and to_group is not None:
            moved_total = 0.0
            from_items = [it for it in items if it.get("substitute_group") == from_group]
            to_items = [it for it in items if it.get("substitute_group") == to_group]
            if not from_items or not to_items:
                continue

            for from_it in from_items:
                from_demand = _to_float(from_it.get("demand"), 0.0)
                moved = from_demand * rate
                if moved <= 0:
                    continue
                from_it["demand"] = _clip_non_negative(from_demand - moved)
                moved_total += moved

            if moved_total > 0:
                share = moved_total / len(to_items)
                for to_it in to_items:
                    to_it["demand"] = _clip_non_negative(_to_float(to_it.get("demand"), 0.0) + share)


def simulate(
    baseline_items: List[Dict[str, Any]],
    scenario: ScenarioSpec,
) -> Dict[str, Any]:
    items = copy.deepcopy(baseline_items)

    for it in items:
        it["demand"] = _clip_non_negative(_to_float(it.get("demand"), 0.0))
        it["max_supply"] = _clip_non_negative(_to_float(it.get("max_supply"), 0.0))
        it["margin"] = _to_float(it.get("margin"), 0.0)
        it["penalty_unmet"] = _to_float(it.get("penalty_unmet"), 0.0)
        it["priority_weight"] = _to_float(it.get("priority_weight"), 1.0)
        it["lead_time_days"] = _to_float(it.get("lead_time_days"), 0.0)

    for it in items:
        it["demand"] = _clip_non_negative(it["demand"] * scenario.demand_multiplier)

    if scenario.supply_multiplier is not None:
        for it in items:
            it["max_supply"] = _clip_non_negative(it["max_supply"] * float(scenario.supply_multiplier))

    baseline_leadtime = scenario.leadtime_risk_baseline_days
    if baseline_leadtime is None:
        lt_vals = [_to_float(it.get("lead_time_days"), 0.0) for it in items]
        baseline_leadtime = sum(lt_vals) / len(lt_vals) if lt_vals else 0.0
    baseline_leadtime = float(baseline_leadtime)

    for it in items:
        it["lead_time_days"] = it["lead_time_days"] + float(scenario.leadtime_delta_days)
        if scenario.delay_penalty_slope and scenario.delay_penalty_slope != 0.0:
            denom = baseline_leadtime if abs(baseline_leadtime) > 1e-9 else 1.0
            mult = 1.0 + float(scenario.delay_penalty_slope) * ((it["lead_time_days"] - baseline_leadtime) / denom)
            if mult < 0:
                mult = 0.0
        else:
            mult = 1.0
        it["penalty_unmet"] = _clip_non_negative(it["penalty_unmet"] * scenario.unmet_penalty_multiplier * mult)

    _apply_substitution(items, scenario.substitution or [])

    ort_items: List[ItemDecisionInput] = []
    for it in items:
        ort_items.append(
            ItemDecisionInput(
                item_id=str(it["item_id"]),
                demand=it["demand"],
                max_supply=it["max_supply"],
                margin=it["margin"],
                penalty_unmet=it["penalty_unmet"],
                priority_weight=it["priority_weight"],
            )
        )

    max_total_supply = scenario.max_total_supply
    if max_total_supply is None:
        max_total_supply = sum(it.max_supply for it in ort_items)

    result = optimize_revenue_with_late_penalty(
        ort_items,
        max_total_supply=max_total_supply,
        solver_name="GLOP",
    )

    leadtime_summary = {
        "lead_time_avg_days": sum(it["lead_time_days"] for it in items) / len(items) if items else 0.0,
        "lead_time_min_days": min(it["lead_time_days"] for it in items) if items else 0.0,
        "lead_time_max_days": max(it["lead_time_days"] for it in items) if items else 0.0,
    }

    return {
        "scenario": asdict(scenario),
        "kpis": result.get("kpis", {}),
        "allocation": result.get("items", []),
        "leadtime": leadtime_summary,
        "solver": result.get("solver"),
        "status": result.get("status"),
    }


def run_abctest(
    baseline_items: List[Dict[str, Any]],
    scenarios: List[ScenarioSpec],
) -> Dict[str, Any]:
    outputs = []
    for sc in scenarios:
        outputs.append(simulate(baseline_items, sc))
    return {
        "baseline_items_count": len(baseline_items),
        "scenarios_count": len(scenarios),
        "results": outputs,
    }


def _load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--baseline", type=Path, required=True, help="baseline_items.json")
    parser.add_argument("--scenarios", type=Path, required=True, help="scenarios.json")
    args = parser.parse_args()

    baseline_items = _load_json(args.baseline)
    scenarios_raw = _load_json(args.scenarios)

    scenarios: List[ScenarioSpec] = []
    for s in scenarios_raw:
        scenarios.append(ScenarioSpec(**s))

    out = run_abctest(baseline_items, scenarios)
    print(json.dumps(out, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

