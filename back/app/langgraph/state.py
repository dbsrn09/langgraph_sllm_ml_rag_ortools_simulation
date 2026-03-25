from __future__ import annotations

from typing import Any, Literal, TypedDict

Intent = Literal["sql", "rag", "ml", "simulation", "or_tools"]


class GraphState(TypedDict, total=False):
    query: str
    intents: list[Intent]
    planned_steps: list[Intent]
    pending_intents: list[Intent]
    current_intent: Intent | None
    results: dict[str, Any]
    errors: list[str]
    traces: list[dict[str, Any]]
    final_answer: str
