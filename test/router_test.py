from __future__ import annotations

import sys
from pathlib import Path

from dotenv import load_dotenv

REPO_ROOT = Path(__file__).resolve().parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from back.app.router.execution_planner import plan_with_llm
from back.app.router.intent_router import route_with_llm


EXAMPLES = [
    "지난 30일 기준 중단 위험이 높은 구매요청 상위 10건 보여줘",
    "공급 가능량이 20% 줄면 미충족 수요와 패널티가 어떻게 변해?",
    "납기 지연 원인 분석 기준을 근거 문서와 함께 요약해줘",
    "요청부서별 구매요청 건수 상위 5개 보여줘",
]


def main() -> None:
    load_dotenv(REPO_ROOT / ".env")

    print("=" * 80)
    print("Router LLM Test")
    print("=" * 80)
    for i, q in enumerate(EXAMPLES, start=1):
        print(f"{i}. {q}")
    print("-" * 80)
    print("종료: exit")
    print("=" * 80)

    while True:
        query = input("\n질문 > ").strip()
        if not query:
            continue
        if query.lower() in {"exit", "quit", "q"}:
            break
        try:
            routed = route_with_llm(query)
            planned = plan_with_llm(query, routed["intents"])
            print("\n[intent json]")
            print(routed)
            print("\n[plan json]")
            print(planned)
        except Exception as e:
            print(f"\n[실행 오류] {e}")


if __name__ == "__main__":
    main()
