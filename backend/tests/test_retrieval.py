from app.retrieval.retriever import retriever
from app.retrieval.index import VectorIndex

def test_retrieval_returns_relevant_cases():
    res = retriever.retrieve("My battery health is dying fast on iOS 17", top_k=2)
    assert res.retrieved_count > 0
    assert res.top_similarity > 0.0
    assert len(res.cases) > 0

def test_retrieval_golden_set_exclusion():
    index = VectorIndex()
    # Ensure all golden set IDs are excluded
    assert len(index.golden_ids_excluded) > 0
    for case in index.cases:
        assert case["conversation_id"] not in index.golden_ids_excluded
