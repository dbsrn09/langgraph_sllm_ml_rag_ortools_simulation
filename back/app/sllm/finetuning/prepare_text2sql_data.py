from __future__ import annotations

from pathlib import Path
import json


BASE_DIR = Path(__file__).resolve().parents[1]
RAW_PATH = BASE_DIR / "learndata" / "output" / "text2sql_cot.jsonl"
OUT_PATH = BASE_DIR / "finetuning" / "text2sql_train.jsonl"


def main() -> None:
    if not RAW_PATH.exists():
        raise FileNotFoundError(f"raw jsonl not found: {RAW_PATH}")

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)

    n_in = 0
    n_out = 0
    with RAW_PATH.open("r", encoding="utf-8") as fin, OUT_PATH.open(
        "w", encoding="utf-8"
    ) as fout:
        for line in fin:
            line = line.strip()
            if not line:
                continue
            n_in += 1
            try:
                obj = json.loads(line)
            except json.JSONDecodeError:
                continue

            question = obj.get("question")
            sql = obj.get("sql")
            if not question or not sql:
                continue

            rec = {
                "prompt": question.strip(),
                "completion": sql.strip(),
            }
            fout.write(json.dumps(rec, ensure_ascii=False) + "\n")
            n_out += 1

    print(f"read: {n_in}, wrote: {n_out} -> {OUT_PATH}")


if __name__ == "__main__":
    main()

