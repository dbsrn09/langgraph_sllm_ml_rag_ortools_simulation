from __future__ import annotations

from back.app.db.duckdb_client import run_sql
from back.app.db.sql_normalizer import normalize
from test.sllm_test import ask_sllm


def run_sql_query(query: str) -> dict:
    raw_sql = ask_sllm(query)
    sql = normalize(raw_sql)
    rows = run_sql(sql)
    return {
        "raw_sql": raw_sql,
        "sql": sql,
        "rows": rows[:20],
        "row_count": len(rows),
    }
