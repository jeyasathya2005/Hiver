"""FastAPI Application Root Entry Point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.logging_config import logger
from app.api.routes_health import router as health_router
from app.api.routes_agent import router as agent_router
from app.api.routes_evaluation import router as evaluation_router
from app.api.routes_golden import router as golden_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Hiver AI Customer Support Agent with RAG, Groq LLM, and Deterministic Policy Engine"
)

# Configure CORS to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(health_router)
app.include_router(agent_router)
app.include_router(evaluation_router)
app.include_router(golden_router)

@app.on_event("startup")
def on_startup():
    logger.info(f"{settings.PROJECT_NAME} initialized.")
    logger.info(f"API Base URL: {settings.API_BASE_URL}")
    logger.info(f"Groq API Key Configured: {'YES' if settings.GROQ_API_KEY else 'NO (Offline Grounded Mode)'}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
