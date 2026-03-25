from __future__ import annotations

import re
import warnings
import sys
from pathlib import Path

import joblib
import pandas as pd
from dotenv import load_dotenv

REPO_ROOT = Path(__file__).resolve().parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

APP_ROOT = REPO_ROOT / "back" / "app"

from back.app.db.duckdb_client import run_sql
from back.app.db.sql_normalizer import normalize
from back.app.rag.retriever import retrieve
from back.app.simulation.simulator import ScenarioSpec, simulate
from test.sllm_test import ask_sllm


CSV_PATH = APP_ROOT / "data" / "processed" / "PURCHASE_REQUEST_ITEMS.csv"
MODEL_PATH = APP_ROOT / "modellearn" / "artifacts" / "stop_classifier_rf.joblib"
load_dotenv(REPO_ROOT / ".env")

EXAMPLE_QUESTIONS = [
    "지난 30일 기준 중단 위험이 높은 구매요청 상위 10건 보여줘",
    "공급 가능량이 20% 줄면 미충족 수요와 패널티가 어떻게 변해?",
    "납기 지연 원인 분석 기준을 근거 문서와 함께 요약해줘",
    "중단 확률 0.6 이상 건만 담당자별로 묶어서 보여줘",
    "요청부서별 구매요청 건수 상위 5개 보여줘",
]

LEAKAGE_COLS = {
    "중단", "target", "중단일", "중단사유", "중단처리자", "중단요청",
    "확정", "진행상태", "진행조회", "원천조회",
    "구매요청번호", "자재소요번호", "생산계획번호", "PONO",
}


def cast_to_str(X):
    return X.astype(str)


def print_examples() -> None:
    print("=" * 80)
    print("통합 데모 테스트 (sLLM / RAG / Simulation / ML)")
    print("=" * 80)
    for i, q in enumerate(EXAMPLE_QUESTIONS, start=1):
        print(f"{i}. {q}")
    print("-" * 80)
    print("종료: exit")
    print("=" * 80)


def _load_ml_inputs() -> tuple[pd.DataFrame, object]:
    if not CSV_PATH.exists():
        raise FileNotFoundError(f"CSV 없음: {CSV_PATH}")
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"모델 없음: {MODEL_PATH}")

    df = pd.read_csv(CSV_PATH, encoding="utf-8", low_memory=False)
    model = joblib.load(MODEL_PATH)
    return df, model


def _ml_predict_topk(df: pd.DataFrame, model: object, top_k: int = 10, threshold: float | None = None) -> pd.DataFrame:
    feature_cols = [c for c in df.columns if c not in LEAKAGE_COLS]
    X = df[feature_cols].copy()
    prob = model.predict_proba(X)[:, 1]

    out = df.copy()
    out["중단확률"] = prob
    if threshold is not None:
        out = out[out["중단확률"] >= threshold].copy()
    out = out.sort_values("중단확률", ascending=False)
    return out.head(top_k)


def handle_ml(query: str) -> None:
    df, model = _load_ml_inputs()

    m = re.search(r"0\.(\d+)", query)
    threshold = float(f"0.{m.group(1)}") if m else None
    top_k = 10
    k_match = re.search(r"상위\s*(\d+)", query)
    if k_match:
        top_k = int(k_match.group(1))

    warnings.filterwarnings(
        "ignore",
        message="Skipping features without any observed values",
        category=UserWarning,
    )
    rows = _ml_predict_topk(df, model, top_k=top_k, threshold=threshold)
    cols = [c for c in ["요청일", "요청부서", "요청담당자", "품번", "품명", "중단확률"] if c in rows.columns]
    print("\n[ML 결과]")
    if rows.empty:
        print("(조건에 맞는 결과 없음)")
        return
    if "담당자별" in query and "요청담당자" in rows.columns:
        g = (
            rows.groupby("요청담당자", dropna=False)["중단확률"]
            .agg(["count", "mean", "max"])
            .reset_index()
            .sort_values("max", ascending=False)
        )
        g.columns = ["요청담당자", "건수", "평균중단확률", "최대중단확률"]
        print(g.to_string(index=False))
    else:
        print(rows[cols].to_string(index=False))


def _build_baseline_from_df(df: pd.DataFrame, max_items: int = 20) -> list[dict]:
    group_cols = [c for c in ["품번", "품명"] if c in df.columns]
    if not group_cols:
        raise ValueError("시뮬레이션용 품목 컬럼이 없습니다.")

    qty_col = "구매요청수량" if "구매요청수량" in df.columns else None
    if qty_col is None:
        raise ValueError("시뮬레이션용 수량 컬럼(구매요청수량)이 없습니다.")

    tmp = df.copy()
    tmp[qty_col] = pd.to_numeric(tmp[qty_col], errors="coerce").fillna(0.0)
    g = tmp.groupby(group_cols, dropna=False)[qty_col].sum().reset_index()
    g = g.sort_values(qty_col, ascending=False).head(max_items)

    baseline = []
    for _, r in g.iterrows():
        demand = float(r[qty_col])
        baseline.append(
            {
                "item_id": str(r[group_cols[0]]),
                "demand": demand,
                "max_supply": demand,
                "margin": 10.0,
                "penalty_unmet": 5.0,
                "priority_weight": 1.0,
                "lead_time_days": 14.0,
                "substitute_group": None,
            }
        )
    return baseline


def handle_simulation(query: str) -> None:
    df = pd.read_csv(CSV_PATH, encoding="utf-8", low_memory=False)
    baseline = _build_baseline_from_df(df, max_items=20)

    pct = 20.0
    m = re.search(r"(\d+)\s*%", query)
    if m:
        pct = float(m.group(1))
    supply_multiplier = max(0.0, 1.0 - pct / 100.0)

    scenario = ScenarioSpec(
        name=f"supply_minus_{int(pct)}",
        supply_multiplier=supply_multiplier,
    )
    out = simulate(baseline, scenario)
    kpis = out.get("kpis", {})

    print("\n[Simulation 결과]")
    print(f"시나리오: 공급 {int(pct)}% 감소 (multiplier={supply_multiplier:.2f})")
    print(
        f"total_allocated={kpis.get('total_allocated', 0):.2f}, "
        f"total_unmet={kpis.get('total_unmet', 0):.2f}, "
        f"total_revenue={kpis.get('total_revenue', 0):.2f}, "
        f"total_penalty={kpis.get('total_penalty', 0):.2f}"
    )


def handle_rag(query: str) -> None:
    rows = retrieve(query=query, top_k=3)
    print("\n[RAG 결과]")
    if not rows:
        print("(검색 결과 없음)")
        return
    for r in rows:
        print("-" * 80)
        print(f"[{r['rank']}] score={r['score']:.4f} source={r['source']}")
        print(r["content"][:300].replace("\n", " "))


def handle_sql(query: str) -> None:
    raw_sql = ask_sllm(query)
    converted_sql = normalize(raw_sql)
    rows = run_sql(converted_sql)

    print("\n[sLLM SQL]")
    print(converted_sql)
    print("\n[SQL 결과 상위 10행]")
    if not rows:
        print("(결과 없음)")
        return
    for i, row in enumerate(rows[:10], 1):
        print(f"{i}. {row}")


def route_and_run(query: str) -> None:
    q = query.lower()
    try:
        if ("중단" in query and ("위험" in query or "확률" in query or "상위" in query)):
            handle_ml(query)
        elif ("공급" in query and "%" in query) or "패널티" in query or "시나리오" in query:
            handle_simulation(query)
        elif "근거" in query or "요약" in query or "분석 기준" in query:
            handle_rag(query)
        else:
            handle_sql(query)
    except Exception as e:
        print(f"\n[실행 오류] {e}")


def run_input_loop() -> None:
    while True:
        user_input = input("\n질문 > ").strip()
        if not user_input:
            continue
        if user_input.lower() in {"exit", "quit", "q"}:
            print("종료합니다.")
            break
        route_and_run(user_input)


if __name__ == "__main__":
    print_examples()
    run_input_loop()
