from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "StyleSense" in data["app"]

def test_products_catalog():
    response = client.get("/api/products")
    assert response.status_code == 200
    products = response.json()
    assert len(products) > 0
    assert any("Blazer" in p["name"] for p in products)

def test_cloud_monitor_metrics():
    response = client.get("/api/monitor/metrics")
    assert response.status_code == 200
    metrics = response.json()
    assert "cloud_services_status" in metrics
    assert "total_api_requests" in metrics
