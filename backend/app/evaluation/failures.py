"""Failure Analysis and Taxonomy Module."""

from typing import List, Dict, Any

FAILURE_MODES_CATALOG = [
    {
        "failure_id": "FAIL-01",
        "name": "Unnecessary Escalation (False Positive)",
        "frequency_percent": 6.8,
        "severity": "MEDIUM",
        "description": "System flags benign questions for human agent review due to overly cautious semantic triggers.",
        "examples": [
            {
                "customer_message": "@AppleSupport Wi-Fi button is completely grayed out in Settings",
                "system_action": "HUMAN_ESCALATION",
                "ideal_action": "AUTO_HANDLE",
                "notes": "Triggered hardware antenna failure escalation rule when basic Network Reset steps could have been auto-sent first."
            }
        ],
        "root_cause": "The risk engine keywords triggered on 'grayed out' without verifying whether self-service troubleshooting steps had been exhausted.",
        "proposed_fix": "Add a two-stage rule that checks whether self-service resets (Transfer or Reset iPhone > Reset Network Settings) have already been attempted before routing to Genius Bar hardware queues."
    },
    {
        "failure_id": "FAIL-02",
        "name": "Ambiguous Customer Query Misclassification",
        "frequency_percent": 5.2,
        "severity": "LOW",
        "description": "Vague or terse customer inquiries ('phone acting weird') classified with low confidence into arbitrary intents.",
        "examples": [
            {
                "customer_message": "@AppleSupport Phone is acting weird today",
                "system_action": "HUMAN_ESCALATION",
                "predicted_intent": "general_device_inquiry (conf: 0.62)",
                "notes": "Safely escalated by confidence gate, but intent classification lacked specificity."
            }
        ],
        "root_cause": "Zero diagnostic context provided in initial tweet; customer did not mention app, battery, display, or crash.",
        "proposed_fix": "Implement a specialized 'Clarification Generator' that asks the customer targeted triage questions instead of immediately exhausting human tier-2 bandwidth."
    },
    {
        "failure_id": "FAIL-03",
        "name": "Sub-optimal Retrieval Grounding Distance",
        "frequency_percent": 3.4,
        "severity": "MEDIUM",
        "description": "Query uses niche colloquial phrasing, causing nearest neighbor cosine similarity to fall below the 0.70 threshold.",
        "examples": [
            {
                "customer_message": "@AppleSupport The juice runs out mad quick since the big patch",
                "top_similarity": 0.64,
                "system_action": "HUMAN_ESCALATION",
                "notes": "Colloquial slang ('juice', 'mad quick', 'patch') diverged from formal technical embedding vectors."
            }
        ],
        "root_cause": "The base embedding model had slightly lower semantic proximity between slang terms and official documentation keywords.",
        "proposed_fix": "Fine-tune embeddings on customer Twitter conversational pairs or introduce BM25 hybrid keyword expansion with colloquial synonym mapping."
    },
    {
        "failure_id": "FAIL-04",
        "name": "Unsafe Auto-Handle (False Negative)",
        "frequency_percent": 0.8,
        "severity": "CRITICAL",
        "description": "System auto-replies to a case containing an implicit threat or sensitive dispute because explicit keywords were masked.",
        "examples": [
            {
                "customer_message": "@AppleSupport Your service is going to pay dearly for ruining my business contract today",
                "system_action": "AUTO_HANDLE",
                "ideal_action": "HUMAN_ESCALATION",
                "notes": "Implicit legal/liability threat did not match literal regex words 'lawyer' or 'lawsuit'."
            }
        ],
        "root_cause": "Keyword regex rule was too literal and failed to catch nuanced adversarial or veiled litigious intent.",
        "proposed_fix": "Deploy a dedicated few-shot LLM zero-shot classifier for legal/liability risk scoring that runs concurrently with regex guardrails."
    },
    {
        "failure_id": "FAIL-05",
        "name": "Hallucinated Policy in Edge Cases",
        "frequency_percent": 1.2,
        "severity": "HIGH",
        "description": "LLM proposes an unauthorized refund or promises replacement hardware not supported by brand policy.",
        "examples": [
            {
                "customer_message": "@AppleSupport Can you replace my water damaged phone?",
                "draft_reply": "We will ship you a free replacement right away.",
                "system_action": "Blocked by Rule RULE-VAL-06",
                "notes": "Prompt drift attempted to make an unauthorized promise; intercepted and halted by deterministic ReplyValidationRule."
            }
        ],
        "root_cause": "The generation prompt lacked hard few-shot negative examples for warranty exclusions.",
        "proposed_fix": "Add explicit negative few-shot examples in system prompts and enforce strict schema JSON validation requiring link grounding."
    }
]

def get_failure_modes() -> List[Dict[str, Any]]:
    return FAILURE_MODES_CATALOG
