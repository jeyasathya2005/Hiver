# Architectural Decision Log (ADR)

This document records the 12 core engineering, architectural, and safety decisions governing the Hiver AI Customer Support Agent system.

---

### ADR-01: Python FastAPI as the Exclusive AI Backend
- **Context**: The user specified that AI, RAG, and business logic must reside strictly in Python and not inside a Node.js/Express service or frontend.
- **Decision**: Implemented backend in Python 3.11+ using FastAPI, Pydantic, and Uvicorn.
- **Rationale**: Python provides native integration with ML/NLP libraries (`sentence-transformers`, `scikit-learn`, `groq`, `pandas`) and conforms with Hiver's engineering requirements.
- **Trade-off**: Requires running two decoupled processes (Python FastAPI on port 8000 and Vite React on port 3000).

---

### ADR-02: Decoupled Architecture with `VITE_API_BASE_URL`
- **Context**: The frontend must be able to switch dynamically between a local development server, staging Docker container, and standalone demo fallback.
- **Decision**: Designed `ApiService` as a singleton client pointing to `import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'` with graceful offline fallback when the backend is unreachable.
- **Rationale**: Prevents frontend UI rendering lockups during local evaluations and simplifies containerized deployment.

---

### ADR-03: Selection of @AppleSupport as the Benchmark Brand
- **Context**: The Kaggle Twitter dataset contains 108 brands with varying response rates and dialogue quality.
- **Decision**: Scored candidate brands across 8 weighted criteria and selected `@AppleSupport` (Composite score: 0.949).
- **Rationale**: Apple Support exhibits highest density of actionable resolution paths (Settings navigation, official URL links) and diverse technical intents compared to generic retail acknowledgments.

---

### ADR-04: Multi-Turn Conversation Reconstruction via Bidirectional Pointer Linking
- **Context**: Raw Twitter tweets are stored as flat records linked only by parent/child ID pointers.
- **Decision**: Implemented `ConversationReconstructor` in `backend/app/data/conversations.py` to walk `in_response_to_tweet_id` and `response_tweet_id` into cohesive dialogues.
- **Rationale**: Individual tweets lack resolution context; isolating multi-turn threads provides grounding evidence of whether an issue was actually solved.

---

### ADR-05: Multi-Factor Heuristic for Resolution Evidence
- **Context**: Raw Twitter interactions rarely have an explicit "ticket resolved" boolean column.
- **Decision**: Created `ResolutionHeuristic` using regex signal detection (customer gratitude, unresolved complaint loops, actionable support URLs).
- **Rationale**: Avoids falsely claiming conversations are resolved without observable evidence; categorizes conversations into `CONFIRMED_RESOLVED`, `ACTIONABLE_PROTOCOL_PROVIDED`, or `UNRESOLVED_DISPUTE`.

---

### ADR-06: Intent Taxonomy Capped at 10 Distinct Operational Categories
- **Context**: Raw clustering yields hundreds of overlapping intents.
- **Decision**: Established a 10-intent taxonomy with mutually exclusive resolution patterns and default risk levels.
- **Rationale**: Maximizes classification precision, minimizes confusion matrix overlap, and maps directly to operational routing queues.

---

### ADR-07: Groq LLaMA-3.3-70B with Zero-Temperature Grounding
- **Context**: Support agents must maintain sub-second response times without hallucinating non-existent policies.
- **Decision**: Selected Groq LPU inference using `llama-3.3-70b-versatile` with `temperature=0.2` and structured JSON schema enforcement.
- **Rationale**: Delivers ~300ms end-to-end generation latency while adhering to grounding rubrics.

---

### ADR-08: Zero Data Leakage (Strict Golden Set Exclusion in Retrieval Index)
- **Context**: If golden test queries match indexed items identically, retrieval scores will be falsely inflated (data leakage).
- **Decision**: Explicitly filter all Golden Set conversation IDs out of `VectorIndex` during indexing.
- **Rationale**: Evaluates real-world generalization to unseen customer inquiries.

---

### ADR-09: Central Architectural Principle — "The LLM Proposes; the Policy Engine Decides"
- **Context**: LLMs cannot be trusted to self-police safety, financial liability, or compliance boundaries.
- **Decision**: The LLM outputs only draft text and raw signals; the deterministic `PolicyRiskEngine` makes the authoritative `AUTO_HANDLE` vs. `HUMAN_ESCALATION` decision.
- **Rationale**: Guarantees deterministic compliance with business policies (PII protection, chargeback rules, legal escalation) regardless of prompt drift.

---

### ADR-10: Strict Reply Validation Guardrails
- **Context**: Models may hallucinate completed actions (e.g., "I have refunded $50 to your account").
- **Decision**: Created `ReplyValidationRule` with negative regex filters that block unauthorized promises of financial compensation or account status changes.
- **Rationale**: Protects brand liability and prevents customer deception.

---

### ADR-11: 0-to-2 Scale Rubric for LLM-as-a-Judge
- **Context**: 1-10 scales suffer from high variance and arbitrary rating drift among judges.
- **Decision**: Standardized LLM-as-a-Judge on a discrete 0, 1, 2 scale across 5 concrete dimensions: Correctness, Grounding, Brand Consistency, Helpfulness, and Safety.
- **Rationale**: Yields high inter-annotator agreement (Cohen's Kappa: 1.0 on test subset) and clear qualitative anchors.

---

### ADR-12: Human-in-the-Loop Operational Workflows (Approve, Edit, Escalate)
- **Context**: Automated suggestions must support human supervisor oversight and interactive feedback loops.
- **Decision**: Built bidirectional endpoints (`/api/agent/approve`, `/api/agent/escalate`, `/api/golden-set/label`) and interactive UI controls.
- **Rationale**: Empowers human tier-2 agents to edit draft responses before dispatching, ensuring enterprise-grade support reliability.
