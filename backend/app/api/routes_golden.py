"""Golden Set evaluation dataset and interactive labeling endpoints."""

import csv
from pathlib import Path
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException
from app.config import settings
from app.agent.schemas import GoldenLabelRequest
from app.logging_config import logger

router = APIRouter(prefix="/api/golden-set", tags=["Golden Set Benchmark"])

@router.get("")
def get_golden_set():
    """Returns golden evaluation benchmark items with distribution summary."""
    items = []
    filepath = settings.GOLDEN_SET_PATH
    if filepath.exists():
        with open(filepath, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                items.append(row)

    intent_counts: Dict[str, int] = {}
    action_counts: Dict[str, int] = {}
    for it in items:
        intent = it.get("expected_intent", "unknown")
        action = it.get("expected_action", "unknown")
        intent_counts[intent] = intent_counts.get(intent, 0) + 1
        action_counts[action] = action_counts.get(action, 0) + 1

    return {
        "total_items": len(items),
        "intent_distribution": intent_counts,
        "action_distribution": action_counts,
        "items": items
    }

@router.post("/label")
def submit_golden_set_label(request: GoldenLabelRequest):
    """Allows support reviewers to submit or audit ground truth labels in real time."""
    logger.info(f"Reviewer submitted label for {request.item_id}: {request.labeled_intent} - {request.labeled_action}")
    return {
        "success": True,
        "item_id": request.item_id,
        "message": "Golden Set annotation successfully recorded for inter-rater consensus audit.",
        "labeled_intent": request.labeled_intent,
        "labeled_action": request.labeled_action
    }
