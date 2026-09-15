from app.agent.classifier import classifier
from app.data.intents import intent_taxonomy

def test_intent_taxonomy_validation():
    valid_names = intent_taxonomy.get_valid_intent_names()
    assert "battery_drain_issue" in valid_names
    assert "refund_not_received" in valid_names
    assert "legal_regulatory_escalation" in valid_names
    assert intent_taxonomy.validate_intent("invalid_intent_xyz") is False

def test_classifier_battery_intent():
    intent, conf = classifier.classify("My iPhone battery dies in 2 hours after the latest update")
    assert intent == "battery_drain_issue"
    assert conf >= 0.85

def test_classifier_refund_intent():
    intent, conf = classifier.classify("I was charged $9.99 for Apple Music and want a refund")
    assert intent == "refund_not_received"
    assert conf >= 0.85

def test_classifier_low_confidence_fallback():
    intent, conf = classifier.classify("Phone acting weird today")
    assert conf < 0.80
