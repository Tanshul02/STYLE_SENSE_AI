from app.tryon.factory import TryOnProviderFactory
from app.tryon.providers import MockTryOnProvider, HuggingFaceTryOnProvider

def test_tryon_provider_factory():
    provider_mock = TryOnProviderFactory.get_provider("mock")
    assert isinstance(provider_mock, MockTryOnProvider)

    provider_hf = TryOnProviderFactory.get_provider("huggingface")
    assert isinstance(provider_hf, HuggingFaceTryOnProvider)

def test_tryon_simulation_execution():
    provider = TryOnProviderFactory.get_provider("mock")
    garments = {
        "top": {"name": "Linen Shirt", "category": "Shirts", "color": "White"},
        "bottom": {"name": "Pleated Trousers", "category": "Bottoms", "color": "Black"}
    }
    res = provider.simulate_try_on("https://example.com/person.jpg", garments)
    assert res["status"] == "completed"
    assert "result_image_url" in res
    assert res["is_demo"] is True
    assert 0.0 <= res["score"] <= 10.0
    assert len(res["layers_applied"]) == 2
