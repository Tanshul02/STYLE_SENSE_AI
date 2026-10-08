"""
StyleSense AI - Outfit Variation & Elevation Generator
"""
from typing import List, Dict, Any
from app.ai.scoring_engine import StyleScoringEngine

class OutfitVariationGenerator:
    PRESET_CATALOG = [
        {"id": "p-acc-1", "name": "Handcrafted Cognac Leather Belt", "category": "Accessories", "color": "Cognac", "style": "Classic", "formality": "High", "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"},
        {"id": "p-acc-2", "name": "Minimalist Gold Accent Chronograph", "category": "Accessories", "color": "Gold", "style": "Minimalist", "formality": "High", "image_url": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500"},
        {"id": "p-shoes-1", "name": "Artisan Burnished Italian Leather Loafers", "category": "Footwear", "color": "Brown", "style": "Elegant", "formality": "High", "image_url": "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500"},
        {"id": "p-shoes-2", "name": "Minimalist Monochrome Leather Sneakers", "category": "Footwear", "color": "White", "style": "Minimalist", "formality": "Medium", "image_url": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500"},
        {"id": "p-top-1", "name": "Tailored Silk Linen Evening Shirt", "category": "Shirts", "color": "Ivory", "style": "Elegant", "formality": "High", "image_url": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500"},
        {"id": "p-outer-1", "name": "Unstructured Cashmere Blend Camel Blazer", "category": "Jackets", "color": "Beige", "style": "Smart Casual", "formality": "High", "image_url": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500"}
    ]

    @classmethod
    def generate_variations(
        cls,
        base_items: List[Dict[str, Any]],
        occasion: str = "daily",
        weather: str = "moderate"
    ) -> List[Dict[str, Any]]:
        variations = []
        base_eval = StyleScoringEngine.evaluate(base_items, occasion, weather)
        base_score = base_eval["final_score"]

        # 1. Elevate with Luxury Accessories
        acc_items = list(base_items)
        belt = cls.PRESET_CATALOG[0]
        watch = cls.PRESET_CATALOG[1]
        acc_items.extend([belt, watch])
        eval_acc = StyleScoringEngine.evaluate(acc_items, occasion, weather)
        variations.append({
            "type": "add_accessories",
            "title": "Elevate with Signature Accessories",
            "description": "Layered with artisan cognac leather belt and gold chronometer for instant editorial polish.",
            "items": acc_items,
            "projected_score": eval_acc["final_score"],
            "score_delta": round(eval_acc["final_score"] - base_score, 1),
            "added_items": [belt, watch]
        })

        # 2. Formalize Look (Add Blazer + Italian Loafers)
        formal_items = [it for it in base_items if it.get("category") not in ["Footwear", "Jackets"]]
        blazer = cls.PRESET_CATALOG[5]
        loafers = cls.PRESET_CATALOG[2]
        formal_items.extend([blazer, loafers])
        eval_formal = StyleScoringEngine.evaluate(formal_items, "professional", weather)
        variations.append({
            "type": "make_formal",
            "title": "Sharpened Tailored Formal Look",
            "description": "Swaps into an unstructured camel cashmere blazer and burnished loafers for executive presence.",
            "items": formal_items,
            "projected_score": eval_formal["final_score"],
            "score_delta": round(eval_formal["final_score"] - base_score, 1),
            "added_items": [blazer, loafers]
        })

        # 3. Modern Contemporary Casual (Sneaker Swap)
        casual_items = [it for it in base_items if it.get("category") != "Footwear"]
        sneakers = cls.PRESET_CATALOG[3]
        casual_items.append(sneakers)
        eval_cas = StyleScoringEngine.evaluate(casual_items, "daily", weather)
        variations.append({
            "type": "make_casual",
            "title": "Effortless Smart Casual Swap",
            "description": "Pair with minimalist monochrome sneakers for weekend brunch, travel, and social comfort.",
            "items": casual_items,
            "projected_score": eval_cas["final_score"],
            "score_delta": round(eval_cas["final_score"] - base_score, 1),
            "added_items": [sneakers]
        })

        return variations
