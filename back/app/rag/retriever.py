from __future__ import annotations

import argparse
import json
import os
from pathlib import Path

import faiss
import numpy as np
from dotenv import load_dotenv
from openai import OpenAI


ROOT_DIR = Path(__file__).resolve().parent.parent
INDEX_DIR = ROOT_DIR / "rag" / "index"
INDEX_FILE = INDEX_DIR / "faiss.index"
DOCS_FILE = INDEX_DIR / "documents.json"


def _load_index(index_file: Path, docs_file: Path) -> tuple[faiss.Index, list[dict]]:
    if not index_file.exists() or not docs_file.exists():
        raise FileNotFoundError("index files not found. run rag/index_builder.py first.")
    index = faiss.read_index(str(index_file))
    docs = json.loads(docs_file.read_text(encoding="utf-8"))
    return index, docs


def _embed_query(client: OpenAI, model: str, query: str) -> np.ndarray:
    resp = client.embeddings.create(model=model, input=[query])
    vec = np.array(resp.data[0].embedding, dtype=np.float32).reshape(1, -1)
    faiss.normalize_L2(vec)
    return vec


def _create_embedding_client_and_model(embedding_model: str | None = None) -> tuple[OpenAI, str]:
    # 임베딩은 OpenAI 키만 사용
    openai_key = os.getenv("OPENAI_API_KEY")
    if not openai_key:
        raise RuntimeError("OPENAI_API_KEY is missing in .env")
    model = embedding_model or os.getenv("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small")
    return OpenAI(api_key=openai_key), model


def retrieve(query: str, top_k: int = 5, embedding_model: str | None = None) -> list[dict]:
    client, model = _create_embedding_client_and_model(embedding_model=embedding_model)
    index, docs = _load_index(INDEX_FILE, DOCS_FILE)
    qv = _embed_query(client, model, query)
    scores, indices = index.search(qv, top_k)

    out: list[dict] = []
    for rank, (idx, score) in enumerate(zip(indices[0], scores[0]), start=1):
        if idx < 0 or idx >= len(docs):
            continue
        d = docs[idx]
        out.append(
            {
                "rank": rank,
                "score": float(score),
                "id": d["id"],
                "source": d["source"],
                "content": d["content"],
            }
        )
    return out


def main() -> None:
    load_dotenv(ROOT_DIR / ".env")
    parser = argparse.ArgumentParser()
    parser.add_argument("--query", type=str, required=True)
    parser.add_argument("--top-k", type=int, default=5)
    parser.add_argument("--embedding-model", type=str, default=None)
    args = parser.parse_args()

    rows = retrieve(query=args.query, top_k=args.top_k, embedding_model=args.embedding_model)
    for r in rows:
        print("=" * 80)
        print(f"[{r['rank']}] score={r['score']:.4f} source={r['source']}")
        print(r["content"][:800])
    if not rows:
        print("(no result)")


if __name__ == "__main__":
    main()

