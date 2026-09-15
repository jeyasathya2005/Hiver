"""Application Configuration Module."""

import os
from pathlib import Path
try:
    from pydantic import BaseModel
except ImportError:
    class BaseModel:
        def __init__(self, **kwargs):
            for k, v in kwargs.items():
                setattr(self, k, v)
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseModel):
    PROJECT_NAME: str = "Hiver AI Customer Support Agent"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # LLM Configuration
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    
    # Server URLs
    API_BASE_URL: str = os.getenv("API_BASE_URL", "http://localhost:8000")
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    
    # Dataset Paths
    RAW_DATASET_PATH: Path = BASE_DIR / os.getenv("DATASET_PATH", "data/raw/twcs.csv")
    SAMPLE_DATASET_PATH: Path = BASE_DIR / "data/raw/sample_twcs.csv"
    PROCESSED_DATA_DIR: Path = BASE_DIR / os.getenv("PROCESSED_DATA_DIR", "data/processed")
    GOLDEN_SET_PATH: Path = BASE_DIR / os.getenv("GOLDEN_SET_PATH", "data/golden/golden_set.csv")
    INDEX_DIR: Path = BASE_DIR / os.getenv("INDEX_DIR", "data/indexes")
    
    # Policy Thresholds
    INTENT_CONFIDENCE_THRESHOLD: float = 0.85
    RETRIEVAL_SIMILARITY_THRESHOLD: float = 0.70
    MAX_REFUND_AUTO_THRESHOLD: float = 50.0

settings = Settings()
