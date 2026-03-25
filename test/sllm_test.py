import json
import urllib.request
import urllib.error
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from back.app.db.duckdb_client import run_sql
from back.app.db.sql_normalizer import normalize

OLLAMA_URL   = "http://127.0.0.1:11434/api/generate"
OLLAMA_MODEL = "text2sql-sllm"

EXAMPLES = [
    "거래처별 매출 상위 10개 알려줘",
    "최근 3개월 수주 건수",
    "세종대학교 납기 지연 건수",
    "화장품 고객 매출 TOP 5",
    "품목별 구매요청 수량 합계",
]


def ask_sllm(question: str) -> str:
    body = json.dumps({
        "model": OLLAMA_MODEL,
        "prompt": question,
        "stream": False,
        "options": {"temperature": 0},
    }).encode("utf-8")

    req = urllib.request.Request(
        url=OLLAMA_URL,
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            payload = json.loads(resp.read().decode("utf-8"))
            return payload.get("response", "").strip()
    except urllib.error.URLError as e:
        return f"[Ollama 연결 실패] {e}"


def main():
    print("=" * 60)
    print("  sLLM Text-to-SQL 테스트")
    print("=" * 60)
    print("\n[예시 질문]")
    for i, q in enumerate(EXAMPLES, 1):
        print(f"  {i}. {q}")
    print()

    while True:
        question = input("질문 입력 (종료: q): ").strip()
        if question.lower() == "q":
            print("종료")
            break
        if not question:
            continue

        print("\n[sLLM 호출 중...]")
        raw_sql = ask_sllm(question)

        print("\n[sLLM 원본 출력]")
        print(raw_sql)

        converted_sql = normalize(raw_sql)

        print("\n[DuckDB 변환 결과]")
        print(converted_sql)
        print("\n[DuckDB 실행 결과]")
        try:
            rows = run_sql(converted_sql)
            if not rows:
                print("(결과 없음)")
            else:
                for i, row in enumerate(rows[:20], 1):
                    print(f"{i}. {row}")
                if len(rows) > 20:
                    print(f"... 총 {len(rows)}행 (상위 20행만 표시)")
        except Exception as e:
            print(f"[DuckDB 실행 실패] {e}")
        print("-" * 60)


if __name__ == "__main__":
    main()
