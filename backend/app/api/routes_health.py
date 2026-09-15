"""Health check and Brand metadata endpoints."""

from fastapi import APIRouter
from app.config import settings
from app.data.brand_selection import BrandSelector

router = APIRouter(tags=["Health & Brand"])

@router.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "groq_configured": bool(settings.GROQ_API_KEY),
        "groq_model": settings.GROQ_MODEL
    }

@router.get("/api/brand/selected")
def get_selected_brand():
    return BrandSelector.get_selected_brand()
