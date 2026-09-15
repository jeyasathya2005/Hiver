"""Deterministic Policy and Safety Rule Implementations."""

import re
from typing import Dict, Any, Tuple
from app.config import settings

class BaseRule:
    rule_id: str = "RULE-BASE"
    name: str = "Base Rule"
    description: str = "Base policy check"

    def evaluate(self, context: Dict[str, Any]) -> Tuple[bool, str]:
        raise NotImplementedError

class IntentConfidenceGate(BaseRule):
    rule_id = "RULE-CONF-01"
    name = "Intent Confidence Safety Gate"
    description = f"Requires intent classification confidence >= {int(settings.INTENT_CONFIDENCE_THRESHOLD*100)}%"

    def evaluate(self, context: Dict[str, Any]) -> Tuple[bool, str]:
        conf = context.get("intent_confidence", 0.0)
        passed = conf >= settings.INTENT_CONFIDENCE_THRESHOLD
        if passed:
            return True, f"Confidence {conf:.1%} meets threshold ({settings.INTENT_CONFIDENCE_THRESHOLD:.1%})"
        return False, f"Confidence {conf:.1%} below safe threshold ({settings.INTENT_CONFIDENCE_THRESHOLD:.1%})"

class HighRiskLegalRule(BaseRule):
    rule_id = "RULE-LEGAL-02"
    name = "Legal Dispute and Threat Guardrail"
    description = "Triggers human escalation on lawsuits, attorneys, legal claims, or physical threats"

    PATTERNS = [
        r"\b(lawyer|attorney|lawsuit|sue|legal action|court|consumer court|ftc complaint)\b",
        r"\b(bomb|threat|kill|violence|harm|weapon)\b",
        r"\b(extortion|blackmail|ransom)\b"
    ]

    def evaluate(self, context: Dict[str, Any]) -> Tuple[bool, str]:
        msg = context.get("message", "").lower()
        for p in self.PATTERNS:
            m = re.search(p, msg, re.IGNORECASE)
            if m:
                return False, f"High-risk trigger detected: '{m.group(0)}'"
        return True, "No legal or regulatory dispute keywords found"

class PiiCredentialRule(BaseRule):
    rule_id = "RULE-PII-03"
    name = "PII and Sensitive Credential Guardrail"
    description = "Prevents processing of raw credit card numbers, passwords, CVV, or social security numbers"

    PII_REGEX = [
        r"\b(?:\d[ -]*?){13,16}\b",                # Credit Card
        r"\b\d{3}-\d{2}-\d{4}\b",                 # SSN
        r"\b(password|passcode|pin|cvv)\s*[:=]\s*\S+\b"  # Plaintext secrets
    ]

    def evaluate(self, context: Dict[str, Any]) -> Tuple[bool, str]:
        text = f"{context.get('message', '')} {context.get('draft_reply', '')}"
        for p in self.PII_REGEX:
            if re.search(p, text, re.IGNORECASE):
                return False, "Sensitive customer credential or payment card pattern detected"
        return True, "No raw customer credentials or payment cards detected"

class FinancialDisputeRule(BaseRule):
    rule_id = "RULE-FIN-04"
    name = "Financial Refund & Chargeback Policy"
    description = f"Limits auto-handling of refund amounts to <= ${int(settings.MAX_REFUND_AUTO_THRESHOLD)}"

    def evaluate(self, context: Dict[str, Any]) -> Tuple[bool, str]:
        msg = context.get("message", "")
        # Find monetary amounts
        amounts = re.findall(r"\$(\d+(?:\.\d{2})?)", msg)
        for amt_str in amounts:
            try:
                amt = float(amt_str)
                if amt > settings.MAX_REFUND_AUTO_THRESHOLD:
                    return False, f"Disputed amount ${amt:.2f} exceeds auto-handle threshold of ${settings.MAX_REFUND_AUTO_THRESHOLD:.2f}"
            except ValueError:
                pass

        if any(w in msg.lower() for w in ["chargeback", "unauthorized charge", "fraudulent transaction"]):
            return False, "Unauthorized charge/chargeback claims require human billing investigation"

        return True, "Within automated financial tolerance"

class RetrievalGroundingRule(BaseRule):
    rule_id = "RULE-GROUND-05"
    name = "Historical Resolution Grounding Check"
    description = f"Requires top retrieval similarity >= {int(settings.RETRIEVAL_SIMILARITY_THRESHOLD*100)}%"

    def evaluate(self, context: Dict[str, Any]) -> Tuple[bool, str]:
        retrieved = context.get("retrieved_cases", [])
        if not retrieved:
            return False, "No historical precedents found in retrieval database"

        top_sim = max([getattr(c, "similarity", c.get("similarity", 0.0)) for c in retrieved])
        if top_sim < settings.RETRIEVAL_SIMILARITY_THRESHOLD:
            return False, f"Top precedent similarity {top_sim:.1%} below required {settings.RETRIEVAL_SIMILARITY_THRESHOLD:.1%}"

        return True, f"Historical grounding verified (top similarity: {top_sim:.1%})"

class ReplyValidationRule(BaseRule):
    rule_id = "RULE-VAL-06"
    name = "Reply Hallucination and Unsupported Action Guardrail"
    description = "Prevents generated replies from promising unverified refunds or claiming actions already executed"

    FORBIDDEN_PROMISES = [
        r"\b(i have refunded|refund has been processed|money has been returned)\b",
        r"\b(i unlocked your account|account has been restored)\b",
        r"\b(free replacement|waiving all fees|guarantee a brand new)\b"
    ]

    def evaluate(self, context: Dict[str, Any]) -> Tuple[bool, str]:
        reply = context.get("draft_reply", "").lower()
        for pat in self.FORBIDDEN_PROMISES:
            m = re.search(pat, reply, re.IGNORECASE)
            if m:
                return False, f"Generated reply attempted invented action: '{m.group(0)}'"
        return True, "Generated draft contains no unverified promises or hallucinated completed actions"
