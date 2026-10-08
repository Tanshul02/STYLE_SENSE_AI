import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_products_with_accessories_and_gender():
    response = client.get("/api/products")
    assert response.status_code == 200
    products = response.json()
    assert len(products) > 0

    # Ensure every product has accessories populated and gender set
    for p in products:
        assert "gender" in p
        assert p["gender"] in ["men", "women", "unisex"]
        assert "accessories" in p
        assert isinstance(p["accessories"], list)
        assert len(p["accessories"]) >= 4
        # Verify accessory schema
        for acc in p["accessories"]:
            assert "title" in acc
            assert "category" in acc
            assert "price" in acc
            assert "reason" in acc

def test_virtual_tryon_speed_and_completion():
    # Test virtual tryon execution with studio preset
    payload = {
        "user_image_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80",
        "product_id": "prod-w-1",
        "garment_image_url": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&auto=format&fit=crop&q=80"
    }
    response = client.post("/api/tryon", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "completed"
    assert "result_image_url" in data
    assert data["result_image_url"].startswith("data:image")
    assert len(data["result_image_url"]) > 500

def test_gender_filtering_segregation():
    # Women's filter
    resp_women = client.get("/api/products?gender=women")
    assert resp_women.status_code == 200
    women_prods = resp_women.json()
    for p in women_prods:
        assert p["gender"] in ["women", "unisex"]
        # Ensure no pure men's items
        assert "bandhgala" not in p["name"].lower()
        assert "tuxedo" not in p["name"].lower()

    # Men's filter
    resp_men = client.get("/api/products?gender=men")
    assert resp_men.status_code == 200
    men_prods = resp_men.json()
    for p in men_prods:
        assert p["gender"] in ["men", "unisex"]
        # Ensure no pure women's items
        assert "saree" not in p["name"].lower()
        assert "slip dress" not in p["name"].lower()
        assert "gown" not in p["name"].lower()
