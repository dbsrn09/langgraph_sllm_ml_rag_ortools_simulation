from __future__ import annotations

import sys
from time import perf_counter
from pathlib import Path
from pprint import pformat

from dotenv import load_dotenv

CURRENT_DIR = Path(__file__).resolve().parent
ROOT_DIR = CURRENT_DIR.parent
PROJECT_ROOT = CURRENT_DIR.parents[2]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from back.app.langgraph.graph import build_graph


def _find_trace(out: dict, node_name: str) -> dict | None:
    for t in out.get("traces", []):
        if t.get("node") == node_name:
            return t
    return None


def _preview_output(node_name: str, output: dict) -> str:
    if node_name in {"sql", "ml"} and isinstance(output, dict):
        copied = dict(output)
        rows = copied.get("rows")
        if isinstance(rows, list):
            copied["rows_preview"] = rows[:3]
            copied["rows_count"] = len(rows)
            copied.pop("rows", None)
        return pformat(copied, width=120, sort_dicts=False)
    if node_name == "rag" and isinstance(output, dict):
        copied = dict(output)
        docs = copied.get("documents")
        if isinstance(docs, list):
            copied["documents_preview"] = docs[:2]
            copied["documents_count"] = len(docs)
            copied.pop("documents", None)
        return pformat(copied, width=120, sort_dicts=False)
    return pformat(output, width=120, sort_dicts=False)


def main() -> None:
    load_dotenv(PROJECT_ROOT / ".env")

    app = build_graph()

    print("=" * 80)
    print("LangGraph Chatbot")
    print("=" * 80)
    print("종료: exit")
    print("=" * 80)

    while True:
        query = input("\n질문 > ").strip()
        if not query:
            continue
        if query.lower() in {"exit", "quit", "q"}:
            break

        t0 = perf_counter()
        out = app.invoke({"query": query})
        total_ms = int((perf_counter() - t0) * 1000)

        router_trace = _find_trace(out, "intent_router") or {}
        planner_trace = _find_trace(out, "execution_planner") or {}
        response_trace = _find_trace(out, "response") or {}

        print(f"\n[의도 분기 | {router_trace.get('elapsed_ms', 0)} ms]")
        print(out.get("intents", []))

        print(f"\n[실행 순서 | {planner_trace.get('elapsed_ms', 0)} ms]")
        print(out.get("planned_steps", []))

        print("\n[노드별 출력]")
        for step in out.get("planned_steps", []):
            node_trace = _find_trace(out, step)
            if not node_trace:
                print(f"- {step}: trace 없음")
                continue
            status = node_trace.get("status")
            elapsed_ms = node_trace.get("elapsed_ms", 0)
            if status == "ok":
                print(f"- {step} | {elapsed_ms} ms")
                print(_preview_output(step, node_trace.get("output", {})))
            else:
                print(f"- {step} | {elapsed_ms} ms | error: {node_trace.get('error', '')}")

        print(f"\n[최종 답변 | {response_trace.get('elapsed_ms', 0)} ms]")
        print(out.get("final_answer", ""))
        print(f"\n[총 소요 시간] {total_ms} ms")
        if out.get("errors"):
            print("\n[노드 오류]")
            for e in out["errors"]:
                print("-", e)


if __name__ == "__main__":
    main()
