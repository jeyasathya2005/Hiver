"""Pydantic schemas for the Agent Pipeline and REST APIs."""

from typing import List, Dict, Any, Optional
try:
    from pydantic import BaseModel, Field
except ImportError:
    class BaseModel:
        def __init__(self, **kwargs):
            for k, v in kwargs.items():
                setattr(self, k, v)
        def model_dump(self):
            return self.__dict__
    def Field(default=None, **kwargs):
        return default
from app.retrieval.schemas import RetrievedCase
from app.policy.decision import DecisionType, RiskLevel, PolicyRuleAudit

class AnalyzeRequest(BaseModel):
    message: str = Field(..., min_length=1, description="Customer Twitter support message")
    conversation_id: Optional[str] = None
    brand: Optional[str] = "AppleSupport"

class AnalyzeResponse(BaseModel):
    conversation_id: str
    message: str
    intent: str
    intent_confidence: float = Field(..., ge=0.0, le=1.0)
    retrieved_cases: List[RetrievedCase]
    draft_reply: str
    decision: DecisionType
    decision_reason: str
    risk_level: RiskLevel
    policy_verdict: str
    signals: Dict[str, float]
    policy_rules: List[PolicyRuleAudit]
    processing_time_ms: int
    is_demo: bool = False

class ApproveRequest(BaseModel):
    conversation_id: str
    reply: str
    reviewer_notes: Optional[str] = None

class ApproveResponse(BaseModel):
    success: bool
    conversation_id: str
    message: str
    timestamp: str

class EscalateRequest(BaseModel):
    conversation_id: str
    reason: str
    target_queue: Optional[str] = "Tier-2 Technical & Escalation Support"
    reviewer_notes: Optional[str] = None

class EscalateResponse(BaseModel):
    success: bool
    conversation_id: str
    target_queue: str
    reason: str
    timestamp: str

class GoldenLabelRequest(BaseModel):
    item_id: str
    labeled_intent: str
    labeled_action: DecisionType
    annotator_rating: int = Field(..., ge=1, le=5)
    annotator_notes: Optional[str] = None
