from __future__ import annotations

from time import perf_counter

from back.app.router.execution_planner import plan_with_llm
from back.app.router.intent_router import route_with_llm
from .services import (
    build_response,
    run_ml,
    run_or_tools,
    run_rag,
    run_simulation,
    run_sql_query,
)
from .state import GraphState, Intent


def _elapsed_ms(start: float) -> int:
    return int((perf_counter() - start) * 1000)


def route_node(state: GraphState) -> GraphState:
    query = state["query"]
    t_router = perf_counter()
    routed = route_with_llm(query)
    router_ms = _elapsed_ms(t_router)
    intents = routed["intents"]
    t_planner = perf_counter()
    planned = plan_with_llm(query, intents)
    planner_ms = _elapsed_ms(t_planner)
    steps = planned["steps"]
    traces = list(state.get("traces", []))
    traces.append(
        {
            "node": "intent_router",
            "status": "ok",
            "elapsed_ms": router_ms,
            "output": {"intents": intents},
        }
    )
    traces.append(
        {
            "node": "execution_planner",
            "status": "ok",
            "elapsed_ms": planner_ms,
            "output": {"steps": steps},
        }
    )
    return {
        **state,
        "intents": intents,
        "planned_steps": list(steps),
        "pending_intents": list(steps),
        "current_intent": None,
        "results": {},
        "errors": [],
        "traces": traces,
    }


def pop_intent_node(state: GraphState) -> GraphState:
    pending = list(state.get("pending_intents", []))
    if not pending:
        return {**state, "current_intent": None, "pending_intents": []}
    current = pending.pop(0)
    return {**state, "current_intent": current, "pending_intents": pending}


def run_sql_node(state: GraphState) -> GraphState:
    results = dict(state.get("results", {}))
    errors = list(state.get("errors", []))
    traces = list(state.get("traces", []))
    t0 = perf_counter()
    try:
        results["sql"] = run_sql_query(state["query"])
        traces.append(
            {
                "node": "sql",
                "status": "ok",
                "elapsed_ms": _elapsed_ms(t0),
                "output": results["sql"],
            }
        )
    except Exception as e:
        errors.append(f"sql: {e}")
        traces.append(
            {
                "node": "sql",
                "status": "error",
                "elapsed_ms": _elapsed_ms(t0),
                "error": str(e),
            }
        )
    return {**state, "results": results, "errors": errors, "traces": traces}


def run_rag_node(state: GraphState) -> GraphState:
    results = dict(state.get("results", {}))
    errors = list(state.get("errors", []))
    traces = list(state.get("traces", []))
    t0 = perf_counter()
    try:
        results["rag"] = run_rag(state["query"])
        traces.append(
            {
                "node": "rag",
                "status": "ok",
                "elapsed_ms": _elapsed_ms(t0),
                "output": results["rag"],
            }
        )
    except Exception as e:
        errors.append(f"rag: {e}")
        traces.append(
            {
                "node": "rag",
                "status": "error",
                "elapsed_ms": _elapsed_ms(t0),
                "error": str(e),
            }
        )
    return {**state, "results": results, "errors": errors, "traces": traces}


def run_ml_node(state: GraphState) -> GraphState:
    results = dict(state.get("results", {}))
    errors = list(state.get("errors", []))
    traces = list(state.get("traces", []))
    t0 = perf_counter()
    try:
        results["ml"] = run_ml(state["query"])
        traces.append(
            {
                "node": "ml",
                "status": "ok",
                "elapsed_ms": _elapsed_ms(t0),
                "output": results["ml"],
            }
        )
    except Exception as e:
        errors.append(f"ml: {e}")
        traces.append(
            {
                "node": "ml",
                "status": "error",
                "elapsed_ms": _elapsed_ms(t0),
                "error": str(e),
            }
        )
    return {**state, "results": results, "errors": errors, "traces": traces}


def run_simulation_node(state: GraphState) -> GraphState:
    results = dict(state.get("results", {}))
    errors = list(state.get("errors", []))
    traces = list(state.get("traces", []))
    t0 = perf_counter()
    try:
        results["simulation"] = run_simulation(state["query"])
        traces.append(
            {
                "node": "simulation",
                "status": "ok",
                "elapsed_ms": _elapsed_ms(t0),
                "output": results["simulation"],
            }
        )
    except Exception as e:
        errors.append(f"simulation: {e}")
        traces.append(
            {
                "node": "simulation",
                "status": "error",
                "elapsed_ms": _elapsed_ms(t0),
                "error": str(e),
            }
        )
    return {**state, "results": results, "errors": errors, "traces": traces}


def run_or_tools_node(state: GraphState) -> GraphState:
    results = dict(state.get("results", {}))
    errors = list(state.get("errors", []))
    traces = list(state.get("traces", []))
    t0 = perf_counter()
    try:
        results["or_tools"] = run_or_tools(state["query"])
        traces.append(
            {
                "node": "or_tools",
                "status": "ok",
                "elapsed_ms": _elapsed_ms(t0),
                "output": results["or_tools"],
            }
        )
    except Exception as e:
        errors.append(f"or_tools: {e}")
        traces.append(
            {
                "node": "or_tools",
                "status": "error",
                "elapsed_ms": _elapsed_ms(t0),
                "error": str(e),
            }
        )
    return {**state, "results": results, "errors": errors, "traces": traces}


def compose_node(state: GraphState) -> GraphState:
    traces = list(state.get("traces", []))
    t0 = perf_counter()
    try:
        answer = build_response(
            query=state["query"],
            results=state.get("results", {}),
            errors=state.get("errors", []),
        )
        traces.append(
            {
                "node": "response",
                "status": "ok",
                "elapsed_ms": _elapsed_ms(t0),
                "output": {"answer_len": len(answer)},
            }
        )
    except Exception as e:
        answer = f"출력 생성 실패: {e}\n\nresults={state.get('results', {})}\nerrors={state.get('errors', [])}"
        traces.append(
            {
                "node": "response",
                "status": "error",
                "elapsed_ms": _elapsed_ms(t0),
                "error": str(e),
            }
        )
    return {**state, "final_answer": answer, "traces": traces}


def next_after_pop(state: GraphState) -> str:
    current: Intent | None = state.get("current_intent")
    if current is None:
        return "compose"
    return current
