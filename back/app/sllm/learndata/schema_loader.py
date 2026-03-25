from pathlib import Path
import yaml


def _load_yaml(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def load_schema_text(schema_dir: Path | None = None) -> str:
    if schema_dir is None:
        project_root = Path(__file__).resolve().parents[2]
        schema_dir = project_root / "schema"
    files = [
        "SALES_ORDER_ITEMS.yaml",
        "PURCHASE_REQUEST_ITEMS.yaml",
        "INVOICE_ITEMS.yaml",
    ]
    parts = []
    for name in files:
        path = schema_dir / name
        if not path.exists():
            continue
        data = _load_yaml(path)
        if not data or "tables" not in data:
            continue
        for table_name, table_info in data["tables"].items():
            desc = table_info.get("description", "").strip().replace("\n", " ")
            parts.append(f"테이블: {table_name}")
            parts.append(f"  설명: {desc}")
            cols = table_info.get("columns") or {}
            for col, typ in cols.items():
                parts.append(f"  - {col} ({typ})")
            parts.append("")
    return "\n".join(parts)


if __name__ == "__main__":
    text = load_schema_text()
    if not text:
        print("(no schema loaded)")
    else:
        preview = text[:1500] + "..." if len(text) > 1500 else text
        print(preview)
        print(f"\n--- total {len(text)} chars ---")
