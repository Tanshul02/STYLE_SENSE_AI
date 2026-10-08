import pytest
from app.ai.recommendation_engine import HybridOutfitRecommendationEngine
from app.schemas.schemas import ScoreBreakdown

class DummyItem:
    def __init__(self, name, category, color, style, season, occasion, formality):
        self.name = name
        self.category = category
        self.color = color
        self.style = style
        self.season = season
        self.occasion = occasion
        self.formality = formality

def test_hybrid_scoring_weights():
    engine = HybridOutfitRecommendationEngine()
    items = [
        DummyItem("Black Blazer", "Jackets", "Black", "Formal", "All-Season", "College Farewell", "High"),
        DummyItem("Ivory Shirt", "Shirts", "Ivory", "Elegant", "Summer", "College Farewell", "Medium"),
        DummyItem("Black Trousers", "Trousers", "Black", "Formal", "All-Season", "College Farewell", "High"),
        DummyItem("Loafers", "Footwear", "Black", "Formal", "All-Season", "College Farewell", "High")
    ]
    context = {
        "occasion": "College Farewell",
        "style": "Elegant",
        "preferred_color": "Black",
        "weather": "Moderate",
        "temperature": 22.0,
        "formality": "High"
    }
    breakdown = engine.calculate_score(items, context)
    
    assert isinstance(breakdown, ScoreBreakdown)
    assert breakdown.final_score >= 80.0
    assert breakdown.occasion_match >= 70.0
    assert breakdown.color_compatibility >= 80.0

def test_recommendation_explanation():
    engine = HybridOutfitRecommendationEngine()
    items = [DummyItem("Black Blazer", "Jackets", "Black", "Formal", "All-Season", "Farewell", "High")]
    context = {"occasion": "College Farewell", "style": "Formal"}
    breakdown = engine.calculate_score(items, context)
    explanation = engine.generate_explanation(items, context, breakdown)
    
    assert "silhouette" in explanation or "College Farewell" in explanation
    assert str(breakdown.final_score) in explanation
