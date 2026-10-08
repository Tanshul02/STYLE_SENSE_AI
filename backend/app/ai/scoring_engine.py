"""
StyleSense AI - 0 to 10 Explainable Style Scoring Engine
Formula:
Score = 0.30 * Occasion + 0.20 * Color + 0.20 * Style + 0.15 * Fit + 0.10 * Weather + 0.05 * Accessories
All scores strictly normalized from 0.0 to 10.0.
"""
from typing import Dict, Any, List, Optional

class StyleScoringEngine:
    OCCASION_HIERARCHY = {
        "education": {"college", "university", "campus", "study", "library", "lecture"},
        "professional": {"office", "work", "business", "interview", "corporate", "conference", "presentation"},
        "social": {"party", "date", "cocktail", "dinner", "brunch", "evening", "club"},
        "traditional": {"wedding", "festival", "ceremony", "cultural", "ethnic", "diwali", "eid"},
        "travel": {"vacation", "flight", "resort", "sightseeing", "beach", "weekend"},
        "daily": {"casual", "errands", "lounge", "home", "gym", "coffee", "daily"}
    }

    NEUTRAL_COLORS = {"black", "white", "gray", "grey", "beige", "cream", "navy", "khaki", "tan", "charcoal", "ivory"}
    WARM_COLORS = {"red", "orange", "terracotta", "yellow", "gold", "rust", "amber", "peach", "cognac", "coral"}
    COOL_COLORS = {"blue", "cyan", "green", "emerald", "olive", "teal", "purple", "violet", "indigo", "sage"}

    @classmethod
    def evaluate(
        cls,
        items: List[Dict[str, Any]],
        occasion: str = "daily",
        weather: str = "moderate",
        user_preferences: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        occ_score, occ_reasons = cls._evaluate_occasion(items, occasion)
        color_score, color_reasons = cls._evaluate_colors(items)
        style_score, style_reasons = cls._evaluate_style_compatibility(items)
        fit_score, fit_reasons = cls._evaluate_fit_formality(items, occasion)
        weather_score, weather_reasons = cls._evaluate_weather(items, weather)
        acc_score, acc_reasons = cls._evaluate_accessories(items)

        raw_final = (
            0.30 * occ_score +
            0.20 * color_score +
            0.20 * style_score +
            0.15 * fit_score +
            0.10 * weather_score +
            0.05 * acc_score
        )
        
        final_score = round(max(1.0, min(10.0, raw_final)), 1)
        stars = round((final_score / 2.0), 1)

        feedback = []
        feedback.extend(color_reasons[:1])
        feedback.extend(occ_reasons[:1])
        feedback.extend(style_reasons[:1])
        if acc_reasons:
            feedback.extend(acc_reasons[:1])

        return {
            "final_score": final_score,
            "stars": stars,
            "display": f"{final_score:.1f} / 10",
            "breakdown": {
                "occasion_match": round(occ_score, 1),
                "color_harmony": round(color_score, 1),
                "style_compatibility": round(style_score, 1),
                "fit_formality": round(fit_score, 1),
                "weather_appropriateness": round(weather_score, 1),
                "accessory_synergy": round(acc_score, 1)
            },
            "feedback_points": feedback
        }

    @classmethod
    def _evaluate_occasion(cls, items: List[Dict[str, Any]], target_occasion: str) -> tuple[float, List[str]]:
        target = target_occasion.lower().strip()
        matched_category = "daily"
        for cat, keywords in cls.OCCASION_HIERARCHY.items():
            if target == cat or any(kw in target for kw in keywords):
                matched_category = cat
                break

        item_occasions = [it.get("occasion", "").lower() for it in items]
        matches = 0
        for occ in item_occasions:
            if matched_category in occ or target in occ:
                matches += 1
            elif matched_category == "daily" and any(k in occ for k in ["casual", "daily"]):
                matches += 1
            elif matched_category == "professional" and any(k in occ for k in ["office", "formal", "business"]):
                matches += 1

        ratio = matches / max(1, len(items))
        score = min(9.9, max(5.5, 6.0 + (ratio * 3.8)))

        reasons = [
            f"Outfit silhouette strongly resonates with {matched_category.capitalize()} attire standards.",
            f"Key garments match dress code guidelines for {target_occasion}."
        ]
        return score, reasons

    @classmethod
    def _evaluate_colors(cls, items: List[Dict[str, Any]]) -> tuple[float, List[str]]:
        colors = [it.get("color", "").lower().strip() for it in items if it.get("color")]
        if not colors:
            return 8.0, ["Clean neutral baseline palette."]

        unique_colors = list(set(colors))
        neutrals = [c for c in unique_colors if any(n in c for n in cls.NEUTRAL_COLORS)]
        warm = [c for c in unique_colors if any(w in c for w in cls.WARM_COLORS)]
        cool = [c for c in unique_colors if any(k in c for k in cls.COOL_COLORS)]

        if len(unique_colors) == 1:
            return 9.6, ["Monochromatic tonal elegance creates an effortlessly sleek, cohesive silhouette."]
        elif len(neutrals) == len(unique_colors):
            return 9.4, ["Minimalist neutral ensemble provides understated timeless sophistication."]
        elif len(neutrals) >= 1 and (len(warm) + len(cool)) <= 2:
            return 9.2, ["Balanced color pairing anchoring rich tones against refined neutrals."]
        elif len(warm) > 0 and len(cool) > 0:
            return 8.6, ["Dynamic complementary contrast infuses visual energy and personality."]
        else:
            return 8.4, ["Harmonious analogous palette producing smooth visual transitions."]

    @classmethod
    def _evaluate_style_compatibility(cls, items: List[Dict[str, Any]]) -> tuple[float, List[str]]:
        styles = [it.get("style", "").lower() for it in items if it.get("style")]
        if not styles:
            return 8.5, ["Balanced versatile styling."]

        unique_styles = set(styles)
        if len(unique_styles) == 1:
            return 9.5, [f"Pure {list(unique_styles)[0].capitalize()} continuity across all layered pieces."]
        
        clash = ("formal" in styles and "streetwear" in styles) or ("bohemian" in styles and "corporate" in styles)
        if clash:
            return 7.2, ["Bold high-low contrast; fine-tune footwear or outer layer for heightened polish."]
        
        return 9.0, ["Contemporary fusion gracefully balancing structured tailoring with relaxed ease."]

    @classmethod
    def _evaluate_fit_formality(cls, items: List[Dict[str, Any]], occasion: str) -> tuple[float, List[str]]:
        formalities = [it.get("formality", "Medium").lower() for it in items]
        low_cnt = formalities.count("low")

        if "formal" in occasion.lower() or "office" in occasion.lower():
            if low_cnt > 1:
                return 7.5, ["Elevate formality by swapping relaxed garments for crisp, structured tailoring."]
            return 9.3, ["Clean tailored proportions deliver commanding posture and professional poise."]
        
        return 9.1, ["Ergonomic proportions offer both elevated comfort and clean modern lines."]

    @classmethod
    def _evaluate_weather(cls, items: List[Dict[str, Any]], weather: str) -> tuple[float, List[str]]:
        w = weather.lower()
        categories = [it.get("category", "").lower() for it in items]

        if "cold" in w or "winter" in w:
            has_outerwear = any(c in categories for c in ["jackets", "coats", "sweaters", "blazers", "cardigans", "hoodies"])
            if has_outerwear:
                return 9.5, ["Thermal layering shields against cold while maintaining refined structure."]
            return 6.8, ["Recommended: Add an insulating trench coat or wool knit for chilly weather."]
        elif "hot" in w or "summer" in w:
            has_heavy = any(c in categories for c in ["heavy jackets", "trench coat", "wool coat"])
            if has_heavy:
                return 7.0, ["Consider swapping heavy outerwear for lightweight linen or breathable cotton."]
            return 9.4, ["Breathable airy fabric selection optimized for heat and humidity."]
        
        return 9.0, ["Versatile mid-season weight adaptable to varying temperatures."]

    @classmethod
    def _evaluate_accessories(cls, items: List[Dict[str, Any]]) -> tuple[float, List[str]]:
        categories = [it.get("category", "").lower() for it in items]
        has_acc = any(c in ["accessories", "bags", "jewelry", "watches", "belts", "scarves", "sunglasses"] for c in categories)
        has_shoes = any(c in ["footwear", "shoes", "boots", "sneakers", "heels", "loafers"] for c in categories)

        if has_acc and has_shoes:
            return 9.8, ["Complete head-to-toe styling with cohesive accessories and footwear."]
        elif has_shoes:
            return 8.9, ["Footwear securely grounds the silhouette; consider a watch or bag to complete."]
        elif has_acc:
            return 8.5, ["Tasteful accent pieces provide refined personal character."]
        else:
            return 7.8, ["Add a signature accessory (leather belt, watch, or statement bag) for peak polish."]
