from __future__ import annotations

import re
from pathlib import Path

import pandas as pd

from back.app.simulation.simulator import ScenarioSpec, simulate


ROOT = Path(__file__).resolve().parents[2]
CSV_PATH = ROOT / "data" / "processed" / "PURCHASE_REQUEST_ITEMS.csv"


def _build_baseline(df: pd.DataFrame, max_items: int = 20) -> list[dict]:
    qty_col = "구매요청수량"
    if qty_col not in df.columns:
        raise ValueError("구매요청수량 컬럼이 없습니다.")
    if "품번" not in df.columns:
        raise ValueError("품번 컬럼이 없습니다.")

    tmp = df.copy()
    tmp[qty_col] = pd.to_numeric(tmp[qty_col], errors="coerce").fillna(0.0)
    grouped = tmp.groupby("품번", dropna=False)[qty_col].sum().reset_index()
    grouped = grouped.sort_values(qty_col, ascending=False).head(max_items)

    baseline: list[dict] = []
    for _, r in grouped.iterrows():
        demand = float(r[qty_col])
        baseline.append(
            {
                "item_id": str(r["품번"]),
                "demand": demand,
                "max_supply": demand,
                "margin": 10.0,
                "penalty_unmet": 5.0,
                "priority_weight": 1.0,
                "lead_time_days": 14.0,
                "substitute_group": None,
            }
        )
    return baseline


def run_simulation(query: str) -> dict:
    if not CSV_PATH.exists():
        raise FileNotFoundError(f"CSV not found: {CSV_PATH}")
    df = pd.read_csv(CSV_PATH, encoding="utf-8", low_memory=False)
    baseline = _build_baseline(df)

    pct = 20.0
    m = re.search(r"(\d+)\s*%", query)
    if m:
        pct = float(m.group(1))
    supply_multiplier = max(0.0, 1.0 - pct / 100.0)

    scenario = ScenarioSpec(name=f"supply_minus_{int(pct)}", supply_multiplier=supply_multiplier)
    out = simulate(baseline, scenario)
    return {
        "scenario": out.get("scenario", {}),
        "kpis": out.get("kpis", {}),
        "status": out.get("status", ""),
    }
