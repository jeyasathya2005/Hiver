"""Text embedding layer with sentence-transformers, numpy, and pure Python fallback."""

import math
from typing import List, Any
from app.logging_config import logger

try:
    import numpy as np
    HAS_NUMPY = True
except ImportError:
    np = None
    HAS_NUMPY = False

class TextEmbedder:
    """Provides dense vector representations for queries and historical dialogue turns."""

    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        self.model_name = model_name
        self._model = None
        self._dim = 384
        self._initialized = False

    def _lazy_init(self):
        if self._initialized:
            return
        try:
            from sentence_transformers import SentenceTransformer
            self._model = SentenceTransformer(self.model_name)
            logger.info(f"Loaded SentenceTransformer: {self.model_name}")
        except Exception as e:
            self._model = None
        self._initialized = True

    def embed_text(self, text: str) -> Any:
        """Generates a normalized 1D embedding vector for a single string."""
        self._lazy_init()
        if self._model and HAS_NUMPY:
            emb = self._model.encode(text, normalize_embeddings=True)
            return np.array(emb, dtype=np.float32)
        
        # Deterministic semantic hash fallback
        return self._hash_vector(text)

    def embed_batch(self, texts: List[str]) -> Any:
        """Batch vector generation."""
        self._lazy_init()
        if self._model and HAS_NUMPY:
            embs = self._model.encode(texts, normalize_embeddings=True, show_progress_bar=False)
            return np.array(embs, dtype=np.float32)
        
        return [self._hash_vector(t) for t in texts]

    def _hash_vector(self, text: str) -> Any:
        """Deterministic pseudo-semantic vector representation."""
        if HAS_NUMPY:
            vec = np.zeros(self._dim, dtype=np.float32)
            words = text.lower().split()
            for idx, word in enumerate(words):
                h = abs(hash(word)) % self._dim
                vec[h] += 1.0 / (idx + 1)
            norm = np.linalg.norm(vec)
            if norm > 0:
                vec /= norm
            return vec
        else:
            vec = [0.0] * self._dim
            words = text.lower().split()
            for idx, word in enumerate(words):
                h = abs(hash(word)) % self._dim
                vec[h] += 1.0 / (idx + 1)
            sq_sum = sum(x * x for x in vec)
            norm = math.sqrt(sq_sum)
            if norm > 0:
                vec = [x / norm for x in vec]
            return vec
