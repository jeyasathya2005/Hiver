"""Schemas for historical conversation retrieval."""

from typing import Optional, List
try:
    from pydantic import BaseModel, Field
except ImportError:
    class BaseModel:
        def __init__(self, **kwargs):
            for k, v in kwargs.items():
                setattr(self, k, v)
        def model_dump(self):
            return self.__dict__
    def Field(default=None, **kwargs):
        return default

class RetrievedCase(BaseModel):
    conversation_id: str
    customer_message: str
    brand_response: str
    resolution: str
    similarity: float = Field(0.0, ge=0.0, le=1.0)
    created_at: Optional[str] = None
    resolution_confidence: Optional[float] = 0.85

class RetrievalResult(BaseModel):
    query: str
    retrieved_count: int
    top_similarity: float
    cases: List[RetrievedCase]
    golden_set_excluded: bool = True
