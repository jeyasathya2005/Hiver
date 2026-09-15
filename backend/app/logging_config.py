"""Structured Logging and Observability Configuration."""

import logging
import sys
import hashlib
from typing import Dict, Any

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)

logger = logging.getLogger("hiver.agent")

def hash_customer_text(text: str) -> str:
    """Anonymize and hash customer text for secure telemetry."""
    return hashlib.sha256(text.encode("utf-8")).hexdigest()[:12]

def log_agent_run(run_metadata: Dict[str, Any]):
    """Structured audit log for every incoming query decision."""
    msg = (
        f"[AGENT_RUN] conv_id={run_metadata.get('conversation_id')} "
        f"hash={hash_customer_text(run_metadata.get('message', ''))} "
        f"intent={run_metadata.get('intent')} "
        f"conf={run_metadata.get('intent_confidence', 0.0):.2f} "
        f"retrieved_k={len(run_metadata.get('retrieved_cases', []))} "
        f"decision={run_metadata.get('decision')} "
        f"risk={run_metadata.get('risk_level')} "
        f"latency_ms={run_metadata.get('processing_time_ms', 0)}"
    )
    logger.info(msg)
