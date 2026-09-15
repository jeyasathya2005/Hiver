from app.policy.rules import ReplyValidationRule

def test_blocks_hallucinated_refund_execution():
    rule = ReplyValidationRule()
    context = {
        "message": "Need refund for app",
        "draft_reply": "I have refunded $49 to your card already."
    }
    passed, detail = rule.evaluate(context)
    assert passed is False
    assert "invented action" in detail

def test_blocks_invented_account_unlock():
    rule = ReplyValidationRule()
    context = {
        "message": "Apple ID locked",
        "draft_reply": "I unlocked your account for you right now."
    }
    passed, detail = rule.evaluate(context)
    assert passed is False

def test_passes_valid_grounded_instructions():
    rule = ReplyValidationRule()
    context = {
        "message": "Apple ID locked",
        "draft_reply": "You can initiate self-service recovery at iforgot.apple.com using your trusted device."
    }
    passed, detail = rule.evaluate(context)
    assert passed is True
