from __future__ import annotations

from back.app.or_tools.optimizer import ItemDecisionInput, optimize_revenue_with_late_penalty


def run_or_tools(query: str) -> dict:
    max_total_supply = 50.0
    if "40" in query:
        max_total_supply = 40.0

    items = [
        ItemDecisionInput(item_id="A", demand=30, max_supply=40, margin=10, penalty_unmet=5, priority_weight=1.0),
        ItemDecisionInput(item_id="B", demand=20, max_supply=20, margin=8, penalty_unmet=4, priority_weight=1.0),
    ]
    result = optimize_revenue_with_late_penalty(items=items, max_total_supply=max_total_supply)
    return result
