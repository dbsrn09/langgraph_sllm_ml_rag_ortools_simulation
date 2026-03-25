from __future__ import annotations

import json
import os

from openai import AzureOpenAI

from .schema_validator import validate_plan_payload


SYSTEM = (
    "입력 intents를 실행 순서 steps로 변환하라. "
    "규칙: 데이터 조회(sql) -> 계산(ml/simulation/or_tools) -> 근거(rag) 순서 우선. "
    "없는 것은 제외. 반드시 JSON만 출력: {\"steps\": [..]}"
)


def plan_with_llm(query: str, intents: list[str]) -> dict:
    client = AzureOpenAI(
        api_key=os.getenv("AZURE_OPENAI_KEY"),
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
    )
    model = os.getenv("AZURE_OPENAI_DEPLOYMENT")
    if not model:
        raise RuntimeError("AZURE_OPENAI_DEPLOYMENT is missing")

    user = json.dumps({"query": query, "intents": intents}, ensure_ascii=False)
    resp = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": user},
        ],
        temperature=0,
    )
    text = (resp.choices[0].message.content or "").strip()
    payload = json.loads(text)
    checked = validate_plan_payload(payload)
    if checked["ok"]:
        return checked["payload"]
    raise RuntimeError(f"plan schema invalid: {checked['error']}")
