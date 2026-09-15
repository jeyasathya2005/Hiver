"""Deterministic Risk Engine: Orchestrates Policy Checks."""

from typing import Dict, Any, List
from app.policy.decision import DecisionType, RiskLevel, PolicyDecisionResult, PolicyRuleAudit
from app.policy.rules import (
    IntentConfidenceGate,
    HighRiskLegalRule,
    PiiCredentialRule,
    FinancialDisputeRule,
    RetrievalGroundingRule,
    ReplyValidationRule
)

class PolicyRiskEngine:
    """The central authority deciding AUTO_HANDLE vs HUMAN_ESCALATION."""

    def __init__(self):
        self.rules = [
            IntentConfidenceGate(),
            HighRiskLegalRule(),
            PiiCredentialRule(),
            FinancialDisputeRule(),
            RetrievalGroundingRule(),
            ReplyValidationRule()
        ]

    def evaluate(self, context: Dict[str, Any]) -> PolicyDecisionResult:
        rule_audits: List[PolicyRuleAudit] = []
        violations: List[str] = []
        has_critical = False

        for rule in self.rules:
            passed, detail = rule.evaluate(context)
            rule_audits.append(PolicyRuleAudit(
                rule_id=rule.rule_id,
                name=rule.name,
                description=rule.description,
                passed=passed,
                detail=detail
            ))
            if not passed:
                violations.append(detail)
                if "legal" in rule.rule_id.lower() or "threat" in detail.lower():
                    has_critical = True

        # Compute signal weights
        conf = context.get("intent_confidence", 0.0)
        retrieved = context.get("retrieved_cases", [])
        top_sim = max([getattr(c, "similarity", c.get("similarity", 0.0)) for c in retrieved]) if retrieved else 0.0
        resolution_score = 0.88 if len(retrieved) >= 2 else (0.75 if len(retrieved) == 1 else 0.0)

        signals = {
            "intent_confidence": round(conf, 3),
            "retrieval_quality": round(top_sim, 3),
            "resolution_evidence": round(resolution_score, 3)
        }

        # Policy Engine Decision (Mandate: 'The LLM proposes; the policy engine decides')
        if violations:
            decision = DecisionType.HUMAN_ESCALATION
            risk_level = RiskLevel.CRITICAL if has_critical else RiskLevel.HIGH
            reason = f"Human escalation required: {'; '.join(violations[:2])}"
            policy_verdict = "ESCALATE_TO_HUMAN_TIER"
        else:
            decision = DecisionType.AUTO_HANDLE
            risk_level = RiskLevel.LOW
            reason = "High intent confidence, clean safety guardrails, and strong verified historical resolution evidence."
            policy_verdict = "APPROVED_FOR_AUTO_SEND"

        return PolicyDecisionResult(
            decision=decision,
            decision_reason=reason,
            risk_level=risk_level,
            policy_verdict=policy_verdict,
            signals=signals,
            policy_rules=rule_audits
        )

policy_engine = PolicyRiskEngine()
