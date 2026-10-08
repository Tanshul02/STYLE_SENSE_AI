from abc import ABC, abstractmethod
from typing import List, Dict, Any

class RecommendationStrategy(ABC):
    """
    Strategy Pattern Interface:
    Defines the contract for interchangeable outfit recommendation algorithms.
    """
    @abstractmethod
    def evaluate(self, items: List[Any], context: Dict[str, Any]) -> float:
        """Calculates a normalized score [0.0 - 1.0] for the given item collection."""
        pass

class OccasionBasedStrategy(RecommendationStrategy):
    """Evaluates compatibility between clothing items and the target occasion formality."""
    FORMALITY_WEIGHTS = {
        "High": ["Blazer", "Suit", "Trousers", "Oxford Shirt", "Kurta", "Dress", "Loafers"],
        "Medium": ["Shirt", "Jeans", "Trousers", "Jacket", "Sneakers", "Sweater"],
        "Low": ["T-Shirt", "Jeans", "Sneakers", "Shorts", "Hoodie"]
    }

    def evaluate(self, items: List[Any], context: Dict[str, Any]) -> float:
        target_occasion = context.get("occasion", "Casual").lower()
        target_formality = context.get("formality", "Medium")
        
        matches = 0
        for item in items:
            item_occasion = getattr(item, "occasion", "").lower()
            item_formality = getattr(item, "formality", "Medium")
            
            # Exact occasion match
            if target_occasion in item_occasion or item_occasion in target_occasion:
                matches += 1.0
            # Formality alignment
            elif item_formality == target_formality:
                matches += 0.75
            else:
                matches += 0.40
        return round(matches / max(len(items), 1), 2)

class WeatherBasedStrategy(RecommendationStrategy):
    """Evaluates suitability of garments according to expected weather and temperature."""
    def evaluate(self, items: List[Any], context: Dict[str, Any]) -> float:
        temp = context.get("temperature", 24.0)
        weather = context.get("weather", "Moderate").lower()
        
        score = 0.0
        for item in items:
            category = getattr(item, "category", "").lower()
            season = getattr(item, "season", "").lower()
            
            if temp < 16 or "cold" in weather or "winter" in weather:
                # Cold weather favors jackets, sweaters, trousers
                if category in ["jackets", "sweaters", "trousers", "jeans"]:
                    score += 1.0
                elif season in ["winter", "all-season"]:
                    score += 0.8
                else:
                    score += 0.3
            elif temp > 28 or "hot" in weather or "summer" in weather:
                # Hot weather favors shirts, t-shirts, linen, light wear
                if category in ["t-shirts", "shirts", "tops"]:
                    score += 1.0
                elif category in ["jackets", "sweaters"]:
                    score += 0.1  # Incompatible with high heat
                else:
                    score += 0.7
            else:
                # Moderate/Pleasant weather
                score += 0.85
        return round(score / max(len(items), 1), 2)

class PreferenceBasedStrategy(RecommendationStrategy):
    """Evaluates alignment with the user's favorite colors, styles, and onboarding choices."""
    def evaluate(self, items: List[Any], context: Dict[str, Any]) -> float:
        pref_colors = [c.lower() for c in context.get("preferred_colors", [])]
        target_color = context.get("preferred_color", "").lower()
        if target_color and target_color not in pref_colors:
            pref_colors.append(target_color)
            
        pref_styles = [s.lower() for s in context.get("style_preferences", [])]
        target_style = context.get("style", "").lower()
        if target_style and target_style not in pref_styles:
            pref_styles.append(target_style)
            
        score = 0.0
        for item in items:
            item_color = getattr(item, "color", "").lower()
            item_style = getattr(item, "style", "").lower()
            
            color_match = 1.0 if (item_color in pref_colors or not pref_colors) else 0.4
            style_match = 1.0 if (item_style in pref_styles or not pref_styles) else 0.5
            score += (color_match * 0.5) + (style_match * 0.5)
            
        return round(score / max(len(items), 1), 2)

class SemanticSimilarityStrategy(RecommendationStrategy):
    """Evaluates semantic similarity between context description and item metadata."""
    def __init__(self, embedding_service=None):
        self.embedding_service = embedding_service

    def evaluate(self, items: List[Any], context: Dict[str, Any]) -> float:
        if not self.embedding_service:
            return 0.80
        query_text = f"{context.get('occasion', '')} {context.get('style', '')} {context.get('preferred_color', '')}"
        scores = []
        for item in items:
            item_desc = f"{getattr(item, 'name', '')} {getattr(item, 'category', '')} {getattr(item, 'color', '')} {getattr(item, 'style', '')}"
            sim = self.embedding_service.calculate_similarity(query_text, item_desc)
            scores.append(sim)
        return round(sum(scores) / max(len(scores), 1), 2)
