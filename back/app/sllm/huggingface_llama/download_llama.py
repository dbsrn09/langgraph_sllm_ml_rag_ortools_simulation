from __future__ import annotations
from pathlib import Path
from dotenv import load_dotenv
from huggingface_hub import snapshot_download

_ENV_PATH = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(_ENV_PATH)

def main() -> None:
    import os

    model_id = "meta-llama/Meta-Llama-3.1-8B-Instruct"

    if os.environ.get("RUNPOD") == "1":
        target_dir = Path("/workspace/llama3_1_8b_instruct")
    else:
        base_dir = Path(__file__).resolve().parent
        target_dir = base_dir / "models" / model_id.replace("/", "_")
        target_dir.parent.mkdir(parents=True, exist_ok=True)

    token = os.environ.get("HF_TOKEN") or None
    print(f"Downloading {model_id} to {target_dir} ...")

    snapshot_download(
        repo_id=model_id,
        local_dir=str(target_dir),
        local_dir_use_symlinks=False,
        token=token,
    )

    print("Done.")


if __name__ == "__main__":
    main()

