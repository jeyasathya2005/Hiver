from app.data.conversations import ConversationReconstructor, ResolutionHeuristic

def test_reconstruction_two_turn():
    rows = [
        {"tweet_id": "1", "author_id": "cust1", "inbound": True, "created_at": "2023-01-01", "text": "Help with battery", "response_tweet_id": "2", "in_response_to_tweet_id": None},
        {"tweet_id": "2", "author_id": "AppleSupport", "inbound": False, "created_at": "2023-01-01", "text": "Check Settings > Battery", "response_tweet_id": None, "in_response_to_tweet_id": "1"}
    ]
    convs = ConversationReconstructor.reconstruct_from_rows(rows)
    assert len(convs) == 1
    assert convs[0]["conversation_length"] == 2
    assert convs[0]["has_response"] is True
    assert "battery" in convs[0]["first_customer_message"].lower()

def test_resolution_heuristic_positive_acknowledgement():
    messages = [
        {"inbound": True, "text": "Need help with refund"},
        {"inbound": False, "text": "Visit reportaproblem.apple.com to claim"},
        {"inbound": True, "text": "Got the refund, thanks so much!"}
    ]
    eval_res = ResolutionHeuristic.evaluate_resolution(messages)
    assert eval_res["resolution_type"] == "CONFIRMED_RESOLVED"
    assert eval_res["resolution_confidence"] > 0.85

def test_resolution_heuristic_unresolved_dispute():
    messages = [
        {"inbound": True, "text": "Battery draining"},
        {"inbound": False, "text": "Update to iOS 17.1"},
        {"inbound": True, "text": "Didn't work, still broken and useless!"}
    ]
    eval_res = ResolutionHeuristic.evaluate_resolution(messages)
    assert eval_res["resolution_type"] == "UNRESOLVED_DISPUTE"
