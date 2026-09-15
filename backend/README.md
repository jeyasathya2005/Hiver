# Python FastAPI Backend: Hiver AI Customer Support Agent

This backend service implements the REST API layer for the AI Customer Support Agent built for the Hiver SDE Intern take-home assignment.

## Architecture Principles

1. **Mandate**: *"The LLM proposes; the policy engine decides."*
2. **Backend Isolation**: Groq API (`llama-3.3-70b-versatile`) is accessed exclusively from this Python backend. No API keys are exposed to the frontend.
3. **Kaggle Dataset Curation**: Based on the Kaggle *"Customer Support on Twitter"* dataset, filtered and reconstructed for `@AppleSupport` (106,123 tweets).
4. **Zero Data Leakage**: Golden-set evaluation conversations are strictly partitioned away from the vector retrieval store.

---

## Quickstart Setup

### 1. Create Virtual Environment
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Set Environment Variables
Create a `.env` file in the `backend/` directory:
```env
GROQ_API_KEY=your_groq_api_key_here
PORT=8000
```

### 4. Run the FastAPI Server
```bash
uvicorn main:app --reload --port 8000
```

The server will be available at:
- API Base: `http://localhost:8000`
- Interactive OpenAPI Docs: `http://localhost:8000/docs`

---

## Standard Endpoints Implemented

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health, Groq connection, and vector index size |
| `GET` | `/api/brand` | Brand metadata and reconstructed dialogue statistics |
| `POST` | `/api/agent/analyze` | Intent classification, RAG retrieval, Groq generation, and Policy Engine verdict |
| `POST` | `/api/agent/approve` | Confirm and log automated dispatch |
| `POST` | `/api/agent/escalate` | Route conversation to human tier queue |
| `GET` | `/api/evaluation/summary`| Evaluation metrics, baselines, and ablations |
| `GET` | `/api/decisions` | 12 Architectural Decision Records |
| `GET` | `/api/golden-set` | 250 Hand-labelled test benchmark conversations |
