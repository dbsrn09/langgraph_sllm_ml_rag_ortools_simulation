from __future__ import annotations

import sys
from pathlib import Path
from time import perf_counter

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

BACK_DIR = Path(__file__).resolve().parent
ROOT_DIR = BACK_DIR.parent
APP_DIR = BACK_DIR / "app"

if str(APP_DIR) not in sys.path:
    sys.path.insert(0, str(APP_DIR))
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

load_dotenv(ROOT_DIR / ".env")

from back.app.langgraph.graph import build_graph


class ChatRequest(BaseModel):
    query: str


app = FastAPI(title="LangGraph Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_graph = build_graph()


@app.get("/health")
def health() -> dict:
    return {"ok": True}


@app.post("/api/langgraph/chat")
def langgraph_chat(req: ChatRequest) -> dict:
    t0 = perf_counter()
    out = _graph.invoke({"query": req.query})
    out["total_ms"] = int((perf_counter() - t0) * 1000)
    return out
