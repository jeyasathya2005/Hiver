from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data

def test_analyze_endpoint_battery():
    payload = {"message": "@AppleSupport Battery dying quickly after updating to iOS 17.1"}
    response = client.post("/api/agent/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] == "battery_drain_issue"
    assert "draft_reply" in data
    assert "decision" in data
    assert "signals" in data

def test_analyze_endpoint_legal_escalate():
    payload = {"message": "@AppleSupport Your update bricked my device! Calling my lawyer and filing lawsuit."}
    response = client.post("/api/agent/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["decision"] == "HUMAN_ESCALATION"
    assert data["risk_level"] in ["HIGH", "CRITICAL"]

def test_golden_set_endpoint():
    response = client.get("/api/golden-set")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert len(data["items"]) > 0

def test_evaluation_metrics_endpoint():
    response = client.get("/api/evaluation/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "headline_metrics" in data
    assert data["headline_metrics"]["intent_accuracy"] > 0.80
