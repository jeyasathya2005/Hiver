"""Intent classification pipeline with confidence calibration and taxonomy enforcement."""

import re
from typing import Tuple, Dict, Any
from app.data.intents import intent_taxonomy
from app.logging_config import logger

class IntentClassifier:
    """Classifies customer message into approved brand intent taxonomy."""

    INTENT_RULES = [
        ("legal_regulatory_escalation", [r"\b(lawyer|attorney|lawsuit|sue|court|legal action)\b"], 0.96),
        ("fraud_security_threat", [r"\b(hacked|ransom|stolen|unauthorized charge|identity theft)\b"], 0.94),
        ("battery_drain_issue", [r"\b(battery|drain|dies|overheat|battery health|charge)\b"], 0.93),
        ("refund_not_received", [r"\b(refund|money back|charged|cancel subscription|billing)\b"], 0.91),
        ("account_access_lockout", [r"\b(locked|apple id|passcode|iforgot|disabled|two-factor)\b"], 0.92),
        ("icloud_storage_billing", [r"\b(icloud|storage full|backup failed|manage storage)\b"], 0.91),
        ("hardware_order_delay", [r"\b(order|shipping|delivery|tracking|carrier|ups|fedex)\b"], 0.89),
        ("bluetooth_wifi_connectivity", [r"\b(bluetooth|wifi|wi-fi|airpods|disconnect|pair)\b"], 0.90),
        ("app_store_crash_update", [r"\b(crash|freez|app store|update stuck|unable to purchase)\b"], 0.88),
    ]

    def classify(self, message: str) -> Tuple[str, float]:
        """Returns validated (intent, intent_confidence)."""
        msg_clean = message.lower().strip()

        # Empty or single-word edge cases
        if not msg_clean or len(msg_clean) < 4:
            return "general_device_inquiry", 0.35

        # Check explicit rules
        for intent_name, patterns, conf in self.INTENT_RULES:
            for pat in patterns:
                if re.search(pat, msg_clean):
                    if intent_taxonomy.validate_intent(intent_name):
                        return intent_name, conf

        # Low-confidence fallback for vague or ambiguous questions
        if any(w in msg_clean for w in ["weird", "slow", "broken", "issue", "help", "problem"]):
            return "general_device_inquiry", 0.62

        return "general_device_inquiry", 0.74

classifier = IntentClassifier()
