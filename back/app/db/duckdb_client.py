from __future__ import annotations

from pathlib import Path
from typing import Any

import duckdb

_ROOT = Path(__file__).resolve().parent.parent
_DATA_DIR = _ROOT / "data" / "processed"
_DB_FILE = _ROOT / "db" / "project.duckdb"

_CSV_TABLES: dict[str, str] = {
    "SALES_ORDER_ITEMS.csv": "SALES_ORDER_ITEMS",
    "INVOICE_ITEMS.csv": "INVOICE_ITEMS",
    "PURCHASE_REQUEST_ITEMS.csv": "PURCHASE_REQUEST_ITEMS",
}

_conn: duckdb.DuckDBPyConnection | None = None


def _load_csvs(con: duckdb.DuckDBPyConnection) -> None:
    for csv_name, table_name in _CSV_TABLES.items():
        csv_path = _DATA_DIR / csv_name
        if not csv_path.exists():
            print(f"[db] 경고: {csv_path} 파일 없음 — 건너뜀")
            continue

        safe_path = str(csv_path).replace("\\", "/")

        con.execute(f'DROP TABLE IF EXISTS "{table_name}"')
        con.execute(
            f"""
            CREATE TABLE "{table_name}" AS
            SELECT * FROM read_csv_auto(
                '{safe_path}',
                header=true,
                encoding='utf-8',
                ignore_errors=true
            )
            """
        )
        row_count = con.execute(f'SELECT COUNT(*) FROM "{table_name}"').fetchone()[0]
        print(f"[db] {table_name:30s} → {row_count:,}행 로드 완료")


def _get_connection() -> duckdb.DuckDBPyConnection:
    global _conn
    if _conn is not None:
        return _conn

    print(f"[db] DuckDB 파일: {_DB_FILE}")
    _conn = duckdb.connect(str(_DB_FILE))

    existing = {row[0] for row in _conn.execute("SHOW TABLES").fetchall()}
    need_load = any(t not in existing for t in _CSV_TABLES.values())

    if need_load:
        print("[db] CSV 로드 시작...")
        _load_csvs(_conn)
        print("[db] CSV 로드 완료")
    else:
        print("[db] 기존 테이블 재사용")

    return _conn


def get_connection() -> duckdb.DuckDBPyConnection:
    return _get_connection()


def run_sql(sql: str) -> list[dict[str, Any]]:
    con = _get_connection()
    result = con.execute(sql)
    cols = [desc[0] for desc in result.description]
    rows = result.fetchall()
    return [dict(zip(cols, row)) for row in rows]


def reload_csvs() -> None:
    global _conn
    if _conn is not None:
        _conn.close()
        _conn = None
    if _DB_FILE.exists():
        _DB_FILE.unlink()
    _get_connection()


if __name__ == "__main__":
    print("=== 테이블 목록 ===")
    con = get_connection()
    tables = con.execute("SHOW TABLES").fetchall()
    for t in tables:
        print(f"  {t[0]}")

    print("\n=== SALES_ORDER_ITEMS 상위 3행 ===")
    rows = run_sql('SELECT "수주번호", "거래처", "품번", "매출금액" FROM "SALES_ORDER_ITEMS" LIMIT 3')
    for r in rows:
        print(r)

    print("\n=== INVOICE_ITEMS 상위 3행 ===")
    rows = run_sql('SELECT "거래명세서번호", "거래처", "품번", "판매금액" FROM "INVOICE_ITEMS" LIMIT 3')
    for r in rows:
        print(r)

    print("\n=== PURCHASE_REQUEST_ITEMS 상위 3행 ===")
    rows = run_sql('SELECT "구매요청번호", "거래처", "품번", "요청납기일" FROM "PURCHASE_REQUEST_ITEMS" LIMIT 3')
    for r in rows:
        print(r)
