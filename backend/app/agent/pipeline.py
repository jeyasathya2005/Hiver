"""Complete AI Support Agent Pipeline Orchestrator."""

import time
import uuid
from typing import Dict, Any, Optional
from app.agent.schemas import AnalyzeRequest, AnalyzeResponse
from app.agent.classifier import classifier
from app.retrieval.retriever import retriever
from app.agent.generator import reply_generator
from app.policy.risk_engine import policy_engine
from app.logging_config import log_agent_run, logger

class AgentPipeline:
    """Orchestrates end-to-end processing of customer messages."""

    def __init__(self):
        self.runs_store: Dict[str, Dict[str, Any]] = {}

    def process(self, request: AnalyzeRequest) -> AnalyzeResponse:
        start_time = time.time()
        conv_id = request.conversation_id or f"conv-{uuid.uuid4().hex[:8]}"
        raw_msg = request.message.strip()

        # 1. Preprocessing & Intent Classification
        intent, intent_conf = classifier.classify(raw_msg)

        # 2. Historical Retrieval (RAG from Twitter corpus)
        retrieval_res = retriever.retrieve(raw_msg, top_k=3)

        # 3. Evidence-Grounded Reply Generation
        llm_output = reply_generator.generate(
            customer_message=raw_msg,
            predicted_intent=intent,
            retrieved_cases=retrieval_res.cases
        )
        draft_reply = llm_output.get("draft_reply", "")

        # 4. Deterministic Policy & Risk Engine Evaluation
        policy_context = {
            "conversation_id": conv_id,
            "message": raw_msg,
            "intent": intent,
            "intent_confidence": intent_conf,
            "retrieved_cases": retrieval_res.cases,
            "draft_reply": draft_reply
        }
        policy_decision = policy_engine.evaluate(policy_context)

        latency_ms = int((time.time() - start_time) * 1000)

        response_data = AnalyzeResponse(
            conversation_id=conv_id,
            message=raw_msg,
            intent=intent,
            intent_confidence=intent_conf,
            retrieved_cases=retrieval_res.cases,
            draft_reply=draft_reply,
            decision=policy_decision.decision,
            decision_reason=policy_decision.decision_reason,
            risk_level=policy_decision.risk_level,
            policy_verdict=policy_decision.policy_verdict,
            signals=policy_decision.signals,
            policy_rules=policy_decision.policy_rules,
            processing_time_ms=latency_ms,
            is_demo=False
        )

        # 5. Store Agent Run & Observability Logging
        run_record = response_data.model_dump()
        self.runs_store[conv_id] = run_record
        log_agent_run(run_record)

        return response_data

agent_pipeline = AgentPipeline()
