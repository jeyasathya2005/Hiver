"""Intent Taxonomy schema, validator, and mapping."""

import json
from pathlib import Path
from typing import Dict, Any, List, Optional
try:
    from pydantic import BaseModel
except ImportError:
    class BaseModel:
        def __init__(self, **kwargs):
            for k, v in kwargs.items():
                setattr(self, k, v)
        def model_dump(self):
            return self.__dict__
from app.config import settings

class IntentDefinition(BaseModel):
    intent: str
    description: str
    examples: List[str]
    resolution_patterns: List[str]
    default_action: str = "AUTO_HANDLE"
    risk_level: str = "LOW"

class IntentTaxonomy:
    """Manages brand-specific intent taxonomy."""

    def __init__(self, taxonomy_file: Optional[Path] = None):
        self.file_path = taxonomy_file or (settings.PROCESSED_DATA_DIR / "intent_taxonomy.json")
        self.intents: Dict[str, IntentDefinition] = {}
        self._load()

    def _load(self):
        if self.file_path.exists():
            with open(self.file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                for item in data.get("intents", []):
                    self.intents[item["intent"]] = IntentDefinition(**item)
        else:
            # Default fallback taxonomy
            default_intents = [
                IntentDefinition(
                    intent="battery_drain_issue",
                    description="Battery draining quickly or device overheating after update",
                    examples=["Battery drains 50% in an hour", "Phone getting very hot"],
                    resolution_patterns=["Check Settings > Battery > Battery Health"]
                ),
                IntentDefinition(
                    intent="refund_not_received",
                    description="Inquiries or requests for refunds on subscriptions or apps",
                    examples=["Want refund for accidental purchase"],
                    resolution_patterns=["Direct to reportaproblem.apple.com"]
                ),
                IntentDefinition(
                    intent="account_access_lockout",
                    description="Apple ID locked or forgotten passcode",
                    examples=["Apple ID locked for security"],
                    resolution_patterns=["Direct to iforgot.apple.com"]
                ),
                IntentDefinition(
                    intent="legal_regulatory_escalation",
                    description="Legal disputes, attorney involvement, or lawsuit threats",
                    examples=["Contacting my lawyer", "Filing a lawsuit"],
                    resolution_patterns=["Mandatory human escalation to legal queue"],
                    default_action="HUMAN_ESCALATION",
                    risk_level="CRITICAL"
                )
            ]
            self.intents = {item.intent: item for item in default_intents}

    def get_valid_intent_names(self) -> List[str]:
        return list(self.intents.keys())

    def validate_intent(self, intent_name: str) -> bool:
        return intent_name in self.intents

    def get_definition(self, intent_name: str) -> Optional[IntentDefinition]:
        return self.intents.get(intent_name)

intent_taxonomy = IntentTaxonomy()
