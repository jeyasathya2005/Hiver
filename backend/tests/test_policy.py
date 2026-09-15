from app.policy.risk_engine import policy_engine
from app.policy.decision import DecisionType, RiskLevel

def test_policy_escalates_on_legal_threat():
    context = {
        "message": "@AppleSupport Your update broke my phone! I am contacting my lawyer and filing a lawsuit.",
        "intent": "legal_regulatory_escalation",
        "intent_confidence": 0.95,
        "retrieved_cases": [{"similarity": 0.85}],
        "draft_reply": "Please DM us so we can investigate."
    }
    decision = policy_engine.evaluate(context)
    assert decision.decision == DecisionType.HUMAN_ESCALATION
    assert decision.risk_level in [RiskLevel.HIGH, RiskLevel.CRITICAL]

def test_policy_escalates_on_high_refund():
    context = {
        "message": "@AppleSupport I was charged $150.00 for accidental in-app purchases and need a refund immediately",
        "intent": "refund_not_received",
        "intent_confidence": 0.92,
        "retrieved_cases": [{"similarity": 0.88}],
        "draft_reply": "Please visit reportaproblem.apple.com."
    }
    decision = policy_engine.evaluate(context)
    assert decision.decision == DecisionType.HUMAN_ESCALATION

def test_policy_escalates_on_low_confidence():
    context = {
        "message": "@AppleSupport Phone is acting weird today",
        "intent": "general_device_inquiry",
        "intent_confidence": 0.62,
        "retrieved_cases": [{"similarity": 0.75}],
        "draft_reply": "Can you share more details?"
    }
    decision = policy_engine.evaluate(context)
    assert decision.decision == DecisionType.HUMAN_ESCALATION

def test_policy_auto_handles_clean_battery_query():
    context = {
        "message": "@AppleSupport Battery dies in 2 hours on iOS 17.1, what should I check?",
        "intent": "battery_drain_issue",
        "intent_confidence": 0.93,
        "retrieved_cases": [
            {"similarity": 0.91},
            {"similarity": 0.87}
        ],
        "draft_reply": "Check Settings > Battery > Battery Health to inspect peak performance capacity."
    }
    decision = policy_engine.evaluate(context)
    assert decision.decision == DecisionType.AUTO_HANDLE
    assert decision.risk_level == RiskLevel.LOW
