from __future__ import annotations

from typing import Any

VALID_NODES = {"sql", "rag", "ml", "simulation", "or_tools"}


def validate_intent_payload(payload: Any) -> dict:
    if not isinstance(payload, dict):
        return {"ok": False, "error": "payload must be object"}
    intents = payload.get("intents")
    if not isinstance(intents, list) or not intents:
        return {"ok": False, "error": "intents must be non-empty list"}
    if any(i not in VALID_NODES for i in intents):
        return {"ok": False, "error": f"invalid intent found: {intents}"}
    return {"ok": True, "payload": {"intents": intents}}


def validate_plan_payload(payload: Any) -> dict:
    if not isinstance(payload, dict):
        return {"ok": False, "error": "payload must be object"}
    steps = payload.get("steps")
    if not isinstance(steps, list) or not steps:
        return {"ok": False, "error": "steps must be non-empty list"}
    if any(s not in VALID_NODES for s in steps):
        return {"ok": False, "error": f"invalid step found: {steps}"}
    return {"ok": True, "payload": {"steps": steps}}
