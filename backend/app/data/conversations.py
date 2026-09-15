"""Conversation Reconstruction and Resolution Evidence Assessment Pipeline."""

import re
from typing import Dict, Any, List, Optional, Tuple

class ResolutionHeuristic:
    """Transparent heuristic for determining whether historical conversations contain useful resolution evidence."""

    POSITIVE_SIGNALS = [
        r"\b(thank(s| you)?|appreciate|fixed|resolved|sorted|works now|working now|perfect|helped|great)\b",
        r"\b(approved|refund issued|replacement on the way|account unlocked|updated)\b"
    ]

    UNRESOLVED_SIGNALS = [
        r"\b(still not working|still broken|didn't work|doesn't help|useless|unhelpful|frustrat(ed|ing)|terrible)\b",
        r"\b(waiting for hours|nobody replied|ignoring me|no response)\b"
    ]

    ACTION_PATTERNS = [
        r"\b(settings > [a-z0-9 ]+)\b",
        r"\b(reportaproblem\.apple\.com|iforgot\.apple\.com|apple\.com/orderstatus)\b",
        r"\b(send us a dm|direct message|check your dms)\b",
        r"\b(restart your device|force restart|update your device)\b"
    ]

    @classmethod
    def evaluate_resolution(cls, messages: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Calculates resolution_type, resolution_confidence, and resolution_evidence.
        Does NOT claim ground truth if signals are absent or contradictory.
        """
        if not messages:
            return {
                "resolution_type": "NO_EVIDENCE",
                "resolution_confidence": 0.0,
                "resolution_evidence": "Empty dialogue"
            }

        brand_messages = [m for m in messages if not m.get("inbound", True)]
        customer_messages = [m for m in messages if m.get("inbound", True)]

        if not brand_messages:
            return {
                "resolution_type": "UNANSWERED",
                "resolution_confidence": 0.95,
                "resolution_evidence": "Customer inquiry received no brand reply."
            }

        final_msg = messages[-1]
        final_brand_msg = brand_messages[-1].get("text", "")
        customer_replies_after_brand = [
            m.get("text", "") for m in messages[messages.index(brand_messages[0]) + 1:] if m.get("inbound", True)
        ]

        # Check for customer positive acknowledgement
        customer_acknowledgement = False
        for c_text in customer_replies_after_brand:
            for pat in cls.POSITIVE_SIGNALS:
                if re.search(pat, c_text, re.IGNORECASE):
                    customer_acknowledgement = True
                    break

        # Check for negative/unresolved signals
        unresolved_detected = False
        for c_text in customer_replies_after_brand:
            for pat in cls.UNRESOLVED_SIGNALS:
                if re.search(pat, c_text, re.IGNORECASE):
                    unresolved_detected = True
                    break

        # Check for actionable brand instructions
        action_found = False
        action_desc = []
        for pat in cls.ACTION_PATTERNS:
            match = re.search(pat, final_brand_msg, re.IGNORECASE)
            if match:
                action_found = True
                action_desc.append(match.group(0))

        # Heuristic scoring
        if customer_acknowledgement and not unresolved_detected:
            return {
                "resolution_type": "CONFIRMED_RESOLVED",
                "resolution_confidence": 0.92,
                "resolution_evidence": "Customer explicitly acknowledged issue resolution or expressed gratitude after instructions."
            }
        elif unresolved_detected:
            return {
                "resolution_type": "UNRESOLVED_DISPUTE",
                "resolution_confidence": 0.85,
                "resolution_evidence": "Customer indicated proposed solution failed or remained dissatisfied."
            }
        elif action_found:
            return {
                "resolution_type": "ACTIONABLE_PROTOCOL_PROVIDED",
                "resolution_confidence": 0.78,
                "resolution_evidence": f"Official self-service guidance or diagnostic steps provided: {', '.join(action_desc)}"
            }
        elif final_msg.get("author_id") == "AppleSupport" or not final_msg.get("inbound", True):
            return {
                "resolution_type": "TERMINATED_AFTER_RESPONSE",
                "resolution_confidence": 0.65,
                "resolution_evidence": "Conversation ended after brand response with no further customer inquiry."
            }
        else:
            return {
                "resolution_type": "INCOMPLETE_OR_AMBIGUOUS",
                "resolution_confidence": 0.40,
                "resolution_evidence": "Dialogue terminated without conclusive resolution verification."
            }


class ConversationReconstructor:
    """Reconstructs customer support conversations from relational tweet IDs."""

    @classmethod
    def reconstruct_from_rows(cls, rows: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Groups tweet rows by root conversation ID."""
        by_id = {str(r["tweet_id"]): r for r in rows if r.get("tweet_id")}
        conversations = []
        visited = set()

        for tweet_id, row in by_id.items():
            if tweet_id in visited:
                continue

            # Check if this is a root tweet (not replying to any other tweet in dataset)
            in_reply_to = row.get("in_response_to_tweet_id")
            if not in_reply_to or in_reply_to not in by_id:
                # Build tree downwards
                thread = [row]
                visited.add(tweet_id)
                current = row
                
                while current.get("response_tweet_id"):
                    resp_ids = [s.strip() for s in str(current["response_tweet_id"]).split(",") if s.strip()]
                    next_tweet = None
                    for r_id in resp_ids:
                        if r_id in by_id and r_id not in visited:
                            next_tweet = by_id[r_id]
                            visited.add(r_id)
                            break
                    if next_tweet:
                        thread.append(next_tweet)
                        current = next_tweet
                    else:
                        break

                # Extract conversation metrics
                cust_msgs = [m for m in thread if m.get("inbound", True)]
                brand_msgs = [m for m in thread if not m.get("inbound", True)]

                if cust_msgs:
                    resolution_eval = ResolutionHeuristic.evaluate_resolution(thread)
                    conversations.append({
                        "conversation_id": tweet_id,
                        "messages": [
                            {
                                "tweet_id": m.get("tweet_id"),
                                "author_id": m.get("author_id"),
                                "inbound": m.get("inbound"),
                                "created_at": m.get("created_at"),
                                "text": m.get("text")
                            }
                            for m in thread
                        ],
                        "conversation_length": len(thread),
                        "customer_messages_count": len(cust_msgs),
                        "brand_messages_count": len(brand_msgs),
                        "first_customer_message": cust_msgs[0].get("text", "") if cust_msgs else "",
                        "final_brand_response": brand_msgs[-1].get("text", "") if brand_msgs else "",
                        "has_response": len(brand_msgs) > 0,
                        "resolution_type": resolution_eval["resolution_type"],
                        "resolution_confidence": resolution_eval["resolution_confidence"],
                        "resolution_evidence": resolution_eval["resolution_evidence"]
                    })

        return conversations
