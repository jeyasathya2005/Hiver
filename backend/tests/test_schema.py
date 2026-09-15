import pytest
from app.data.loader import DatasetLoader, REQUIRED_COLUMNS

def test_dataset_loader_schema_validation():
    loader = DatasetLoader()
    valid_header = ["tweet_id", "author_id", "inbound", "created_at", "text", "response_tweet_id", "in_response_to_tweet_id"]
    assert loader.validate_schema(valid_header) is True

def test_dataset_loader_missing_columns():
    loader = DatasetLoader()
    invalid_header = ["tweet_id", "text"]
    with pytest.raises(ValueError):
        loader.validate_schema(invalid_header)

def test_loader_analyzes_sample():
    loader = DatasetLoader()
    stats = loader.analyze_dataset_statistics()
    assert "total_rows" in stats
    assert stats["total_rows"] > 0
    assert stats["inbound_percentage"] > 0
