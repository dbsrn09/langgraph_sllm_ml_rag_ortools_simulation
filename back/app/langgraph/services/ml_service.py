from __future__ import annotations

import re
from pathlib import Path
import __main__

import joblib
import pandas as pd


ROOT = Path(__file__).resolve().parents[2]
CSV_PATH = ROOT / "data" / "processed" / "PURCHASE_REQUEST_ITEMS.csv"
MODEL_PATH = ROOT / "modellearn" / "artifacts" / "stop_classifier_rf.joblib"

LEAKAGE_COLS = {
    "중단", "target", "중단일", "중단사유", "중단처리자", "중단요청",
    "확정", "진행상태", "진행조회", "원천조회",
    "구매요청번호", "자재소요번호", "생산계획번호", "PONO",
}


def cast_to_str(X):
    return X.astype(str)


setattr(__main__, "cast_to_str", cast_to_str)


def run_ml(query: str) -> dict:
    if not CSV_PATH.exists():
        raise FileNotFoundError(f"CSV not found: {CSV_PATH}")
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model not found: {MODEL_PATH}")

    df = pd.read_csv(CSV_PATH, encoding="utf-8", low_memory=False)
    model = joblib.load(MODEL_PATH)
    X = df[[c for c in df.columns if c not in LEAKAGE_COLS]].copy()
    prob = model.predict_proba(X)[:, 1]

    top_k = 10
    k_match = re.search(r"상위\s*(\d+)", query)
    if k_match:
        top_k = int(k_match.group(1))

    th = None
    m = re.search(r"0\.(\d+)", query)
    if m:
        th = float(f"0.{m.group(1)}")

    out = df.copy()
    out["중단확률"] = prob
    if th is not None:
        out = out[out["중단확률"] >= th].copy()
    out = out.sort_values("중단확률", ascending=False).head(top_k)

    if "담당자별" in query and "요청담당자" in out.columns:
        grouped = (
            out.groupby("요청담당자", dropna=False)["중단확률"]
            .agg(["count", "mean", "max"])
            .reset_index()
            .sort_values("max", ascending=False)
        )
        grouped.columns = ["요청담당자", "건수", "평균중단확률", "최대중단확률"]
        return {"mode": "grouped", "rows": grouped.to_dict(orient="records")}

    cols = [c for c in ["요청일", "요청부서", "요청담당자", "품번", "품명", "중단확률"] if c in out.columns]
    return {"mode": "topk", "rows": out[cols].to_dict(orient="records")}
