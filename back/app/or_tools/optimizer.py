from __future__ import annotations

from dataclasses import dataclass
from typing import List, Dict, Any

from ortools.linear_solver import pywraplp


@dataclass
class ItemDecisionInput:
    item_id: str
    demand: float
    max_supply: float
    margin: float
    penalty_unmet: float = 0.0
    priority_weight: float = 1.0


def optimize_revenue_with_late_penalty(
    items: List[ItemDecisionInput],
    max_total_supply: float | None = None,
    solver_name: str = "GLOP",
) -> Dict[str, Any]:
    if not items:
        return {
            "status": "EMPTY_INPUT",
            "objective_value": 0.0,
            "items": [],
            "kpis": {},
            "solver": solver_name,
        }

    solver = pywraplp.Solver.CreateSolver(solver_name)
    if not solver:
        raise RuntimeError(f"OR-tools solver 생성 실패: {solver_name}")

    x_vars: Dict[str, Any] = {}
    unmet_vars: Dict[str, Any] = {}

    for it in items:
        if it.demand < 0:
            raise ValueError(f"demand must be >= 0: item_id={it.item_id}")
        if it.max_supply < 0:
            raise ValueError(f"max_supply must be >= 0: item_id={it.item_id}")
        if it.priority_weight <= 0:
            raise ValueError(f"priority_weight must be > 0: item_id={it.item_id}")

        x = solver.NumVar(0.0, it.max_supply, f"x_{it.item_id}")
        u = solver.NumVar(0.0, solver.infinity(), f"u_{it.item_id}")
        solver.Add(x + u == it.demand)
        x_vars[it.item_id] = x
        unmet_vars[it.item_id] = u

    if max_total_supply is not None:
        if max_total_supply < 0:
            raise ValueError("max_total_supply must be >= 0")
        solver.Add(sum(x_vars[it.item_id] for it in items) <= max_total_supply)

    objective = solver.Objective()
    for it in items:
        objective.SetCoefficient(x_vars[it.item_id], it.margin)
        objective.SetCoefficient(unmet_vars[it.item_id], -it.penalty_unmet * it.priority_weight)
    objective.SetMaximization()

    status = solver.Solve()
    if status not in (pywraplp.Solver.OPTIMAL, pywraplp.Solver.FEASIBLE):
        raise RuntimeError("최적해를 찾지 못했습니다.")

    items_out = []
    total_allocated = 0.0
    total_unmet = 0.0
    total_revenue = 0.0
    total_penalty = 0.0
    for it in sorted(items, key=lambda x: x.item_id):
        x_val = float(x_vars[it.item_id].solution_value())
        u_val = float(unmet_vars[it.item_id].solution_value())
        total_allocated += x_val
        total_unmet += u_val
        total_revenue += x_val * it.margin
        total_penalty += u_val * it.penalty_unmet * it.priority_weight
        items_out.append(
            {
                "item_id": it.item_id,
                "allocated": x_val,
                "unmet": u_val,
                "margin": it.margin,
                "priority_weight": it.priority_weight,
                "penalty_unmet": it.penalty_unmet,
            }
        )

    solution: Dict[str, Any] = {
        "status": "OPTIMAL" if status == pywraplp.Solver.OPTIMAL else "FEASIBLE",
        "objective_value": float(objective.Value()),
        "items": items_out,
        "kpis": {
            "total_allocated": total_allocated,
            "total_unmet": total_unmet,
            "total_revenue": total_revenue,
            "total_penalty": total_penalty,
        },
        "solver": solver_name,
    }
    return solution


if __name__ == "__main__":
    sample_items = [
        ItemDecisionInput(item_id="A", demand=30, max_supply=40, margin=10, penalty_unmet=5, priority_weight=1.0),
        ItemDecisionInput(item_id="B", demand=20, max_supply=20, margin=8, penalty_unmet=4, priority_weight=1.0),
    ]
    result = optimize_revenue_with_late_penalty(sample_items, max_total_supply=50)
    print(result)

