from __future__ import annotations

import json
import os

from openai import AzureOpenAI


SYSTEM_PROMPT = (
    "당신은 운영 데이터 분석 챗봇입니다. "
    "주어진 모듈 결과를 바탕으로 한국어로 간결하게 답변하세요. "
    "답변은 핵심 요약 2~4줄, 필요 시 근거/수치 목록을 포함하세요."
)


def build_response(query: str, results: dict, errors: list[str]) -> str:
    api_key = os.getenv("AZURE_OPENAI_KEY")
    endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    api_version = os.getenv("AZURE_OPENAI_API_VERSION")
    deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT")
    if not all([api_key, endpoint, api_version, deployment]):
        raise RuntimeError("Azure 출력 생성 설정이 누락되었습니다.")

    client = AzureOpenAI(
        api_key=api_key,
        azure_endpoint=endpoint,
        api_version=api_version,
    )
    payload = {
        "query": query,
        "results": results,
        "errors": errors,
    }
    user_prompt = "다음 실행 결과를 종합해 최종 답변을 작성하세요.\n\n" + json.dumps(
        payload, ensure_ascii=False, indent=2
    )
    resp = client.chat.completions.create(
        model=deployment,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.2,
    )
    return resp.choices[0].message.content or ""
