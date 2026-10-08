from app.ai.scoring_engine import StyleScoringEngine
from app.ai.variation_generator import OutfitVariationGenerator

def test_scoring_engine_scale_and_formula():
    items = [
        {"name": "Silk Navy Shirt", "category": "Shirts", "color": "Navy", "style": "Elegant", "occasion": "Office", "formality": "High"},
        {"name": "Charcoal Wool Trousers", "category": "Bottoms", "color": "Charcoal", "style": "Formal", "occasion": "Office", "formality": "High"},
        {"name": "Italian Oxford Shoes", "category": "Footwear", "color": "Black", "style": "Classic", "occasion": "Office", "formality": "High"}
    ]
    res = StyleScoringEngine.evaluate(items, occasion="professional", weather="moderate")
    
    assert 0.0 <= res["final_score"] <= 10.0
    assert 0.0 <= res["stars"] <= 5.0
    assert "breakdown" in res
    assert "occasion_match" in res["breakdown"]
    assert "color_harmony" in res["breakdown"]
    assert "style_compatibility" in res["breakdown"]
    assert "fit_formality" in res["breakdown"]
    assert "weather_appropriateness" in res["breakdown"]
    assert "accessory_synergy" in res["breakdown"]
    assert len(res["feedback_points"]) >= 1

def test_variation_generator():
    items = [
        {"name": "White Linen Shirt", "category": "Shirts", "color": "White", "style": "Casual", "formality": "Medium"},
        {"name": "Tailored Chinos", "category": "Bottoms", "color": "Beige", "style": "Casual", "formality": "Medium"}
    ]
    variations = OutfitVariationGenerator.generate_variations(items, occasion="daily")
    assert len(variations) >= 3
    types = [v["type"] for v in variations]
    assert "add_accessories" in types
    assert "make_formal" in types
    assert "make_casual" in types
    for v in variations:
        assert 0.0 <= v["projected_score"] <= 10.0
