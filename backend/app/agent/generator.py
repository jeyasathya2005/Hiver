"""AI Support Reply Generator using Groq with strict evidence grounding."""

from typing import List, Dict, Any
from app.llm.groq_client import groq_service
from app.data.intents import intent_taxonomy
from app.retrieval.schemas import RetrievedCase

class ReplyGenerator:
    """Generates draft customer replies grounded in retrieved historical precedents."""

    def generate(
        self,
        customer_message: str,
        predicted_intent: str,
        retrieved_cases: List[RetrievedCase]
    ) -> Dict[str, Any]:
        intent_def = intent_taxonomy.get_definition(predicted_intent)
        resolution_patterns = intent_def.resolution_patterns if intent_def else []

        return groq_service.generate_reply(
            customer_message=customer_message,
            predicted_intent=predicted_intent,
            retrieved_cases=retrieved_cases,
            resolution_patterns=resolution_patterns
        )

reply_generator = ReplyGenerator()
