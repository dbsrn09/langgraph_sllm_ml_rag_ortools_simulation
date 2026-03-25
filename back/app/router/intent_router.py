from __future__ import annotations

import json
import os

from openai import AzureOpenAI

from .schema_validator import validate_intent_payload


SYSTEM = (
    "질문을 보고 필요한 실행 노드를 intents 배열로만 판단하라. "
    "허용값: sql, rag, ml, simulation, or_tools. "
    "반드시 JSON만 출력: {\"intents\": [..]}"
)


def route_with_llm(query: str) -> dict:
    client = AzureOpenAI(
        api_key=os.getenv("AZURE_OPENAI_KEY"),
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
    )
    model = os.getenv("AZURE_OPENAI_DEPLOYMENT")
    if not model:
        raise RuntimeError("AZURE_OPENAI_DEPLOYMENT is missing")

    resp = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": query},
        ],
        temperature=0,
    )
    text = (resp.choices[0].message.content or "").strip()
    payload = json.loads(text)
    checked = validate_intent_payload(payload)
    if checked["ok"]:
        return checked["payload"]
    raise RuntimeError(f"intent schema invalid: {checked['error']}")
