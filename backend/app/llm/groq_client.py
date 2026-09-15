"""Groq API Integration Layer."""

import json
from typing import Dict, Any, Optional
from app.config import settings
from app.llm.prompts import AGENT_SYSTEM_PROMPT
from app.logging_config import logger

class GroqClient:
    """Client for generating evidence-grounded replies via Groq LLaMA models."""

    def __init__(self):
        self.api_key = settings.GROQ_API_KEY
        self.model = settings.GROQ_MODEL
        self._client = None
        self._initialized = False

    def _init_client(self):
        if self._initialized:
            return
        if self.api_key:
            try:
                from groq import Groq
                self._client = Groq(api_key=self.api_key)
                logger.info(f"Initialized Groq client with model: {self.model}")
            except Exception as e:
                logger.error(f"Failed to initialize Groq SDK: {e}")
                self._client = None
        else:
            logger.info("GROQ_API_KEY not provided. Running in deterministic offline template mode.")
            self._client = None
        self._initialized = True

    def generate_reply(
        self,
        customer_message: str,
        predicted_intent: str,
        retrieved_cases: list,
        resolution_patterns: list
    ) -> Dict[str, Any]:
        """Generates a reply strictly grounded in historical resolutions."""
        self._init_client()

        # Format historical context
        evidence_text = ""
        for idx, c in enumerate(retrieved_cases[:2]):
            cust_text = getattr(c, "customer_message", c.get("customer_message", ""))
            brand_text = getattr(c, "brand_response", c.get("brand_response", ""))
            evidence_text += f"\nPrecedent {idx+1}:\nCustomer: {cust_text}\nOfficial Brand Resolution: {brand_text}\n"

        user_prompt = f"""Incoming Customer Tweet: "{customer_message}"
Predicted Intent: {predicted_intent}
Approved Brand Resolution Patterns: {'; '.join(resolution_patterns)}

Historical Support Precedents:{evidence_text}

Generate the JSON response following the system prompt directives."""

        if self._client:
            try:
                response = self._client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": AGENT_SYSTEM_PROMPT},
                        {"role": "user", "content": user_prompt}
                    ],
                    response_format={"type": "json_object"},
                    temperature=0.2,
                    max_tokens=200
                )
                content = response.choices[0].message.content
                data = json.loads(content)
                return {
                    "draft_reply": data.get("draft_reply", ""),
                    "risk_level": data.get("risk_level", "LOW"),
                    "evidence_summary": data.get("evidence_summary", "Grounded in historical precedents."),
                    "model_used": self.model
                }
            except Exception as e:
                logger.error(f"Groq API call error: {e}")

        # Deterministic grounded fallback template based on closest historical resolution
        if retrieved_cases:
            top_precedent = retrieved_cases[0]
            brand_resp = getattr(top_precedent, "brand_response", top_precedent.get("brand_response", ""))
            return {
                "draft_reply": brand_resp,
                "risk_level": "LOW",
                "evidence_summary": f"Directly grounded in verified historical case #{getattr(top_precedent, 'conversation_id', top_precedent.get('conversation_id', '115822'))}.",
                "model_used": "offline-grounded-template"
            }

        return {
            "draft_reply": "We're here to help. Please send us a direct message with your device model and current software version so a specialist can assist.",
            "risk_level": "MEDIUM",
            "evidence_summary": "Default standard intake template due to absence of specific historical match.",
            "model_used": "offline-fallback"
        }

groq_service = GroqClient()
