from __future__ import annotations

from .nodes import (
    compose_node,
    next_after_pop,
    pop_intent_node,
    route_node,
    run_ml_node,
    run_or_tools_node,
    run_rag_node,
    run_simulation_node,
    run_sql_node,
)
from .state import GraphState


class PipelineGraph:
    def invoke(self, state: GraphState) -> GraphState:
        s = route_node(state)
        while True:
            s = pop_intent_node(s)
            nxt = next_after_pop(s)
            if nxt == "compose":
                s = compose_node(s)
                return s
            if nxt == "sql":
                s = run_sql_node(s)
            elif nxt == "rag":
                s = run_rag_node(s)
            elif nxt == "ml":
                s = run_ml_node(s)
            elif nxt == "simulation":
                s = run_simulation_node(s)
            elif nxt == "or_tools":
                s = run_or_tools_node(s)


def build_graph() -> PipelineGraph:
    return PipelineGraph()
