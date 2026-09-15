"""High-level historical conversation retriever."""

from typing import List
from app.retrieval.schemas import RetrievedCase, RetrievalResult
from app.retrieval.index import VectorIndex

class HistoricalRetriever:
    """Orchestrates similarity retrieval for agent generation and user exploration."""

    def __init__(self):
        self.index = VectorIndex()

    def retrieve(self, customer_message: str, top_k: int = 3) -> RetrievalResult:
        cases = self.index.search(customer_message, top_k=top_k)
        top_sim = cases[0].similarity if cases else 0.0

        return RetrievalResult(
            query=customer_message,
            retrieved_count=len(cases),
            top_similarity=top_sim,
            cases=cases,
            golden_set_excluded=True
        )

retriever = HistoricalRetriever()
