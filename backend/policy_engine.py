"""
Deterministic Policy Engine for Hiver Customer Support AI Agent.
Core mandate: 'The LLM proposes; the policy engine decides.'
"""

import re
from typing import Dict, Any, List, Tuple

class PolicyRule:
    def __init__(self, rule_id: str, name: str, description: str):
        self.rule_id = rule_id
        self.name = name
        self.description = description

    def evaluate(self, context: Dict[str, Any]) -> Tuple[bool, str]:
        raise NotImplementedError

class IntentConfidenceGate(PolicyRule):
    def __init__(self, threshold: float = 0.85):
        super().__init__(
            "RULE-CONF-01",
            "Intent Confidence Safety Gate",
            f"Requires intent classification confidence >= {int(threshold*100)}%"
        )
        self.threshold = threshold

    def evaluate(self, context: Dict[str, Any]) -> Tuple[bool, str]:
        conf = context.get("intent_confidence", 0.0)
        passed = conf >= self.threshold
        reason = f"Confidence {conf:.1%} exceeds {self.threshold:.1%} threshold" if passed else f"Confidence {conf:.1%} below safe threshold {self.threshold:.1%}"
        return passed, reason

class HighRiskKeywordsRule(PolicyRule):
    RISK_PATTERNS = [
        r"\b(lawsuit|lawyer|attorney|sue|legal action|court|consumer court)\b",
        r"\b(fraud|stolen|scam|unauthorized charge|identity theft)\b",
        r"\b(cancel my card|chargeback|dispute charge)\b",
        r"\b(bomb|threat|kill|violence|harm)\b"
    ]

    def __init__(self):
        super().__init__(
            "RULE-RISK-02",
            "High-Risk Keyword & Legal Guardrail",
            "Triggers human escalation on legal, fraud, safety, or regulatory threats"
        )

    def evaluate(self, context: Dict[str, Any]) -> Tuple[bool, str]:
        message = context.get("message", "").lower()
        for pattern in self.RISK_PATTERNS:
            match = re.search(pattern, message, re.IGNORECASE)
            if match:
                return False, f"Flagged high-risk keyword pattern: '{match.group(0)}'"
        return True, "No critical risk or legal dispute triggers found"

class PiiProtectionRule(PolicyRule):
    PII_PATTERNS = [
        r"\b\d{4}[ -]?\d{4}[ -]?\d{4}[ -]?\d{4}\b",  # Credit Card
        r"\b\d{3}-\d{2}-\d{4}\b",                      # SSN
        r"\b(password|passcode|pin|cvv)\s*[:=]\s*\S+\b" # Secrets
    ]

    def __init__(self):
        super().__init__(
            "RULE-PII-03",
            "PII & Sensitive Credential Redaction Check",
            "Prevents automated processing of raw credit cards, passwords, or SSNs"
        )

    def evaluate(self, context: Dict[str, Any]) -> Tuple[bool, str]:
        message = context.get("message", "")
        reply = context.get("draft_reply", "")
        combined = f"{message} {reply}"
        for pattern in self.PII_PATTERNS:
            if re.search(pattern, combined, re.IGNORECASE):
                return False, "Detected sensitive PII or credential pattern"
        return True, "No exposed sensitive customer credentials detected"

class FinancialDisputeRule(PolicyRule):
    REFUND_THRESHOLD = 50.0

    def __init__(self):
        super().__init__(
            "RULE-FIN-04",
            "Financial Refund & Monetary Threshold Policy",
            f"Escalates refunds > ${int(self.REFUND_THRESHOLD)} to human agent billing queue"
        )

    def evaluate(self, context: Dict[str, Any]) -> Tuple[bool, str]:
        intent = context.get("intent", "")
        message = context.get("message", "")
        
        # Look for dollar amounts
        amounts = re.findall(r"\$(\d+(?:\.\d{2})?)", message)
        for amt_str in amounts:
            try:
                amt = float(amt_str)
                if amt > self.REFUND_THRESHOLD:
                    return False, f"Refund amount ${amt:.2f} exceeds auto-handle limit of ${self.REFUND_THRESHOLD:.2f}"
            except ValueError:
                pass

        if "chargeback" in message.lower() or "unauthorized charge" in message.lower():
            return False, "Unauthorized charges require direct Tier-2 verification"

        return True, "Within automated financial tolerance"

class RetrievalGroundingCheck(PolicyRule):
    def __init__(self, min_cases: int = 1, min_similarity: float = 0.70):
        super().__init__(
            "RULE-GROUND-05",
            "Historical Resolution Grounding Check",
            f"Requires at least {min_cases} retrieved case with similarity >= {int(min_similarity*100)}%"
        )
        self.min_cases = min_cases
        self.min_similarity = min_similarity

    def evaluate(self, context: Dict[str, Any]) -> Tuple[bool, str]:
        retrieved = context.get("retrieved_cases", [])
        if not retrieved or len(retrieved) < self.min_cases:
            return False, f"Insufficient historical precedents (found {len(retrieved)}, required {self.min_cases})"
        
        max_sim = max([c.get("similarity", 0.0) for c in retrieved]) if retrieved else 0.0
        if max_sim < self.min_similarity:
            return False, f"Top similarity score {max_sim:.1%} is below minimum confidence threshold {self.min_similarity:.1%}"

        return True, f"Strong historical grounding verified (top similarity: {max_sim:.1%})"


class PolicyEngine:
    def __init__(self):
        self.rules: List[PolicyRule] = [
            IntentConfidenceGate(threshold=0.85),
            HighRiskKeywordsRule(),
            PiiProtectionRule(),
            FinancialDisputeRule(),
            RetrievalGroundingCheck(min_cases=1, min_similarity=0.70)
        ]

    def evaluate(self, context: Dict[str, Any]) -> Dict[str, Any]:
        rule_evaluations = []
        all_passed = True
        failed_reasons = []

        for rule in self.rules:
            passed, detail = rule.evaluate(context)
            rule_evaluations.append({
                "rule_id": rule.rule_id,
                "name": rule.name,
                "description": rule.description,
                "passed": passed,
                "detail": detail
            })
            if not passed:
                all_passed = False
                failed_reasons.append(detail)

        # Risk level determination
        if not all_passed:
            decision = "HUMAN_ESCALATION"
            risk_level = "HIGH" if any("legal" in r.lower() or "pii" in r.lower() or "threat" in r.lower() for r in failed_reasons) else "MEDIUM"
            reason = f"Escalated by Policy Engine: {'; '.join(failed_reasons)}"
            policy_verdict = "REVISE_OR_ESCALATE"
        else:
            decision = "AUTO_HANDLE"
            risk_level = "LOW"
            reason = "Safe for automated dispatch. High classification confidence, clean guardrail audit, and verified historical grounding."
            policy_verdict = "APPROVED_FOR_AUTO_SEND"

        return {
            "decision": decision,
            "decision_reason": reason,
            "risk_level": risk_level,
            "policy_verdict": policy_verdict,
            "policy_rules": rule_evaluations
        }
