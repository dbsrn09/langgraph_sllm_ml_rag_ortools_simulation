from pathlib import Path
import argparse
import json
import os
import re

from dotenv import load_dotenv
from openai import AzureOpenAI

_ENV_PATH = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(_ENV_PATH)


def get_client():
    key = os.getenv("AZURE_OPENAI_KEY")
    endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    api_version = os.getenv("AZURE_OPENAI_API_VERSION")
    deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT")
    if not all([key, endpoint, api_version, deployment]):
        raise RuntimeError("Missing .env: AZURE_OPENAI_KEY, ENDPOINT, API_VERSION, DEPLOYMENT")
    return AzureOpenAI(
        api_key=key,
        api_version=api_version,
        azure_endpoint=endpoint,
    ), deployment


def _extract_json(text: str) -> dict | None:
    text = text.strip()
    m = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
    if m:
        text = m.group(1).strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        return None


def run_generate(count: int, output_path: Path) -> None:
    from schema_loader import load_schema_text

    client, deployment = get_client()
    schema_text = load_schema_text()
    if not schema_text:
        raise RuntimeError("No schema loaded. Check schema dir (schema).")

    system = """너는 내부 업무 DB용 Text-to-SQL 전문가다. 주어진 스키마만 사용해서,
한 건의 자연어 질문과 그에 맞는 SQL, 실행 결과 요약 답변, SQL을 도출한 추론(CoT), 근거(evidence)를 생성한다.
SQL은 SQL Server 문법을 쓰고, 컬럼/테이블명에 특수문자·한글이 있으면 [이렇게] 대괄호로 감싼다.
반드시 아래 JSON만 한 줄로 출력하고 다른 텍스트는 붙이지 마라.
{"question":"...", "sql":"...", "answer":"...", "cot":"...", "evidence":["..."]}"""

    user_tpl = """다음 스키마를 기준으로, 비즈니스에서 자주 나올 법한 질문 하나와 그에 대한 SQL·답변·추론·근거를 만들어줘.
질문은 한국어로, 다양한 패턴(집계, 기간필터, 거래처/품번 조건, 조인 등)으로 생성해줘.

스키마:
%s
"""

    output_path.parent.mkdir(parents=True, exist_ok=True)
    written = 0
    for i in range(count):
        resp = client.chat.completions.create(
            model=deployment,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user_tpl % schema_text},
            ],
            max_completion_tokens=2048,
        )
        raw = resp.choices[0].message.content or ""
        obj = _extract_json(raw)
        if obj and "question" in obj and "sql" in obj:
            with output_path.open("a", encoding="utf-8") as f:
                f.write(json.dumps(obj, ensure_ascii=False) + "\n")
            written += 1
        if (i + 1) % 10 == 0:
            print(f"Generated {i + 1}/{count}, written {written}")
    print(f"Done. Wrote {written} samples to {output_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate question-SQL-answer-CoT JSONL")
    parser.add_argument("--count", type=int, default=5000, help="Number of samples (default 5000)")
    parser.add_argument("--output", type=Path, default=None, help="Output JSONL path")
    args = parser.parse_args()

    out = args.output or Path(__file__).resolve().parent / "output" / "text2sql_cot.jsonl"
    run_generate(args.count, out)
