"""Decision Enums and Output Schemas for the Policy Engine."""

from enum import Enum
from typing import Dict, Any, List, Optional
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

class DecisionType(str, Enum):
    AUTO_HANDLE = "AUTO_HANDLE"
    HUMAN_ESCALATION = "HUMAN_ESCALATION"

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class PolicyRuleAudit(BaseModel):
    rule_id: str
    name: str
    description: str
    passed: bool
    detail: str

class PolicyDecisionResult(BaseModel):
    decision: DecisionType
    decision_reason: str
    risk_level: RiskLevel
    policy_verdict: str
    signals: Dict[str, float]
    policy_rules: List[PolicyRuleAudit]
