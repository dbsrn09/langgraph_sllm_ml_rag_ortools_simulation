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
KNOWLEDGE_DIR = ROOT_DIR / "rag" / "knowledge"
INDEX_DIR = ROOT_DIR / "rag" / "index"
INDEX_FILE = INDEX_DIR / "faiss.index"
DOCS_FILE = INDEX_DIR / "documents.json"


def _read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def _iter_source_files(knowledge_dir: Path) -> list[Path]:
    files = []
    for p in sorted(knowledge_dir.rglob("*")):
        if p.is_file() and p.suffix.lower() in {".md", ".txt", ".csv"}:
            files.append(p)
    return files


def _chunk_text(text: str, chunk_size: int, overlap: int) -> list[str]:
    clean = text.replace("\r\n", "\n").strip()
    if not clean:
        return []
    chunks: list[str] = []
    start = 0
    length = len(clean)
    while start < length:
        end = min(start + chunk_size, length)
        chunk = clean[start:end].strip()
        if chunk:
            chunks.append(chunk)
        if end >= length:
            break
        start = max(0, end - overlap)
    return chunks


def _build_documents(knowledge_dir: Path, chunk_size: int, overlap: int) -> list[dict]:
    documents: list[dict] = []
    files = _iter_source_files(knowledge_dir)
    for path in files:
        rel = str(path.relative_to(ROOT_DIR)).replace("\\", "/")
        text = _read_text(path)
        chunks = _chunk_text(text, chunk_size=chunk_size, overlap=overlap)
        for idx, chunk in enumerate(chunks):
            documents.append(
                {
                    "id": f"{rel}::chunk_{idx}",
                    "source": rel,
                    "chunk_index": idx,
                    "content": chunk,
                }
            )
    return documents


def _embed_texts(client: OpenAI, model: str, texts: list[str], batch_size: int = 64) -> np.ndarray:
    vectors: list[list[float]] = []
    for i in range(0, len(texts), batch_size):
        batch = texts[i : i + batch_size]
        resp = client.embeddings.create(model=model, input=batch)
        batch_vectors = [item.embedding for item in resp.data]
        vectors.extend(batch_vectors)
    arr = np.array(vectors, dtype=np.float32)
    if arr.ndim != 2:
        raise RuntimeError("embedding shape error")
    return arr


def build_index(
    knowledge_dir: Path,
    index_dir: Path,
    embedding_model: str,
    chunk_size: int,
    overlap: int,
) -> None:
    documents = _build_documents(knowledge_dir, chunk_size=chunk_size, overlap=overlap)
    if not documents:
        raise RuntimeError(f"no documents found in {knowledge_dir}")

    # 임베딩은 OpenAI 키만 사용
    openai_key = os.getenv("OPENAI_API_KEY")
    if not openai_key:
        raise RuntimeError("OPENAI_API_KEY is missing in .env")
    client = OpenAI(api_key=openai_key)
    model_to_use = embedding_model

    texts = [d["content"] for d in documents]
    vectors = _embed_texts(client, model_to_use, texts)

    dim = vectors.shape[1]
    index = faiss.IndexFlatIP(dim)
    faiss.normalize_L2(vectors)
    index.add(vectors)

    index_dir.mkdir(parents=True, exist_ok=True)
    faiss.write_index(index, str(index_dir / "faiss.index"))
    (index_dir / "documents.json").write_text(
        json.dumps(documents, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    print(f"documents: {len(documents)}")
    print(f"dimension: {dim}")
    print(f"saved: {index_dir}")


def main() -> None:
    load_dotenv(ROOT_DIR / ".env")
    parser = argparse.ArgumentParser()
    parser.add_argument("--knowledge-dir", type=Path, default=KNOWLEDGE_DIR)
    parser.add_argument("--index-dir", type=Path, default=INDEX_DIR)
    parser.add_argument("--embedding-model", type=str, default=os.getenv("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small"))
    parser.add_argument("--chunk-size", type=int, default=1200)
    parser.add_argument("--overlap", type=int, default=200)
    args = parser.parse_args()

    build_index(
        knowledge_dir=args.knowledge_dir,
        index_dir=args.index_dir,
        embedding_model=args.embedding_model,
        chunk_size=args.chunk_size,
        overlap=args.overlap,
    )


if __name__ == "__main__":
    main()

