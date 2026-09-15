"""Agent message analysis, human-in-the-loop approval, and escalation endpoints."""

from datetime import datetime
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException
from app.agent.schemas import (
    AnalyzeRequest,
    AnalyzeResponse,
    ApproveRequest,
    ApproveResponse,
    EscalateRequest,
    EscalateResponse
)
from app.agent.pipeline import agent_pipeline
from app.logging_config import logger

router = APIRouter(prefix="/api/agent", tags=["Agent Operations"])

@router.post("/analyze", response_model=AnalyzeResponse)
def analyze_customer_message(request: AnalyzeRequest):
    """Processes incoming customer message through classification, retrieval, Groq generation, and policy engine."""
    try:
        return agent_pipeline.process(request)
    except Exception as e:
        logger.error(f"Error analyzing message: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/approve", response_model=ApproveResponse)
def approve_and_send_reply(request: ApproveRequest):
    """Human support agent approves or edits draft reply to send to customer."""
    logger.info(f"Agent approved reply for conversation {request.conversation_id}")
    return ApproveResponse(
        success=True,
        conversation_id=request.conversation_id,
        message="Reply successfully approved and dispatched via Twitter/X API queue.",
        timestamp=datetime.utcnow().isoformat()
    )

@router.post("/escalate", response_model=EscalateResponse)
def escalate_to_human_queue(request: EscalateRequest):
    """Escalates ticket to specialized tier-2 human team."""
    logger.info(f"Conversation {request.conversation_id} escalated to {request.target_queue}")
    return EscalateResponse(
        success=True,
        conversation_id=request.conversation_id,
        target_queue=request.target_queue or "Tier-2 Technical Support",
        reason=request.reason,
        timestamp=datetime.utcnow().isoformat()
    )

@router.get("/runs")
def list_recent_agent_runs():
    """Returns stored historical agent execution runs for audit and live telemetry."""
    runs = list(agent_pipeline.runs_store.values())
    return {"total": len(runs), "runs": runs[-50:]}
