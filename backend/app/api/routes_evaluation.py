"""Evaluation metrics, failure analysis, and retrieval search endpoints."""

import csv
from typing import Dict, Any, List
from fastapi import APIRouter, Query
from app.config import settings
from app.evaluation.metrics import MetricsCalculator
from app.evaluation.agreement import calculate_agreement_metrics
from app.evaluation.failures import get_failure_modes
from app.retrieval.retriever import retriever

from app.evaluation.runner import run_golden_evaluation

router = APIRouter(tags=["Evaluation & Retrieval"])

@router.get("/api/evaluation/metrics")
def get_evaluation_metrics():
    """Returns evaluation benchmarks across baselines, ablations, and full system."""
    return run_golden_evaluation()

@router.get("/api/evaluation/failures")
def get_failure_analysis():
    return {
        "total_failures_analyzed": 5,
        "failure_modes": get_failure_modes()
    }

@router.get("/api/retrieval/search")
def search_historical_precedents(
    query: str = Query(..., min_length=2, description="Search query against Twitter resolution database"),
    top_k: int = Query(5, ge=1, le=10)
):
    """Explores historical customer support conversations with similarity rankings."""
    return retriever.retrieve(customer_message=query, top_k=top_k)
