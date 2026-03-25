from __future__ import annotations

from back.app.rag.retriever import retrieve


def run_rag(query: str, top_k: int = 3) -> dict:
    rows = retrieve(query=query, top_k=top_k)
    return {"documents": rows}
