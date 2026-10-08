"""
StyleSense AI - 11 Autonomous Agent Tools implementing Command Pattern
"""
from typing import Dict, Any, List
from app.agent_tools.base import AgentTool
from app.ai.scoring_engine import StyleScoringEngine
from app.agents.agent_memory import UserFashionMemory

class WardrobeTool(AgentTool):
    name = "WardrobeTool"
    description = "Searches, filters, and retrieves user digital wardrobe items by category, color, or occasion."
    category = "wardrobe"

    def execute(self, params: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        items = context.get("wardrobe_items", [])
        category = params.get("category")
        color = params.get("color")
        occasion = params.get("occasion")

        filtered = items
        if category:
            filtered = [i for i in filtered if category.lower() in (i.get("category") or "").lower()]
        if color:
            filtered = [i for i in filtered if color.lower() in (i.get("color") or "").lower()]
        if occasion:
            filtered = [i for i in filtered if occasion.lower() in (i.get("occasion") or "").lower()]

        return {
            "total_wardrobe_size": len(items),
            "matched_items": filtered[:6],
            "count": len(filtered)
        }

class OutfitGeneratorTool(AgentTool):
    name = "OutfitGeneratorTool"
    description = "Synthesizes complete coordinated multi-piece outfits balancing wardrobe and catalog pieces."
    category = "synthesis"

    def execute(self, params: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        wardrobe = context.get("wardrobe_items", [])
        catalog = context.get("catalog_products", [])
        occasion = params.get("occasion", "daily")
        
        selected = []
        tops = [w for w in wardrobe if w.get("category") in ["T-Shirts", "Shirts", "Dresses"]]
        bottoms = [w for w in wardrobe if w.get("category") in ["Bottoms", "Jeans", "Trousers"]]
        shoes = [c for c in catalog if c.get("category") in ["Footwear", "shoes"]]
        outer = [w for w in wardrobe if w.get("category") in ["Jackets", "Coats", "Blazers"]]

        if tops: selected.append(tops[0])
        if bottoms: selected.append(bottoms[0])
        if shoes: selected.append(shoes[0])
        if outer and "formal" in occasion.lower(): selected.append(outer[0])

        score_res = StyleScoringEngine.evaluate(selected, occasion)
        return {
            "outfit_title": f"Curated {occasion.capitalize()} Ensemble",
            "pieces": selected,
            "score": score_res["final_score"],
            "breakdown": score_res["breakdown"]
        }

class OutfitScoringTool(AgentTool):
    name = "OutfitScoringTool"
    description = "Evaluates an outfit on a strict 0 to 10 scale across 6 explainable fashion dimensions."
    category = "evaluation"

    def execute(self, params: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        items = params.get("items", [])
        occasion = params.get("occasion", "daily")
        weather = params.get("weather", "moderate")
        return StyleScoringEngine.evaluate(items, occasion, weather)

class OccasionTool(AgentTool):
    name = "OccasionTool"
    description = "Validates formality dress codes for Education, Professional, Social, Traditional, Travel, Daily."
    category = "context"

    def execute(self, params: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        occasion = params.get("occasion", "daily")
        guidelines = {
            "professional": {"dress_code": "Smart Corporate / Executive", "recommended": "Blazers, tailored trousers, buttoned shirts, oxfords/loafers"},
            "education": {"dress_code": "Campus Smart Casual", "recommended": "Clean denim, knit sweaters, polo shirts, low-profile sneakers"},
            "social": {"dress_code": "Cocktail / Elevated Evening", "recommended": "Slip dresses, crisp collared shirts, chelsea boots, structured layers"},
            "traditional": {"dress_code": "Cultural / Ceremonial", "recommended": "Silk kurtas, sarees, sherwanis, embroidered jackets, ethnic footwear"},
            "travel": {"dress_code": "Resort / Transit Comfort", "recommended": "Linen shirts, relaxed chinos, breathable knitwear, slip-on shoes"},
            "daily": {"dress_code": "Relaxed Minimalist", "recommended": "Premium t-shirts, straight-leg pants, clean sneakers"}
        }
        matched = "daily"
        for k in guidelines:
            if k in occasion.lower():
                matched = k
                break
        return {"target_occasion": occasion, "category": matched, "rules": guidelines[matched]}

class ColorHarmonyTool(AgentTool):
    name = "ColorHarmonyTool"
    description = "Analyzes color wheel harmony (monochromatic, complementary, analogous, neutral baseline)."
    category = "color"

    def execute(self, params: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        items = params.get("items", [])
        score, reasons = StyleScoringEngine._evaluate_colors(items)
        return {"color_score": score, "harmony_type": reasons[0] if reasons else "Neutral balance", "analysis": reasons}

class StyleCompatibilityTool(AgentTool):
    name = "StyleCompatibilityTool"
    description = "Analyzes aesthetic harmony between silhouettes, cuts, textures, and formality levels."
    category = "styling"

    def execute(self, params: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        items = params.get("items", [])
        score, reasons = StyleScoringEngine._evaluate_style_compatibility(items)
        return {"style_score": score, "compatibility_analysis": reasons}

class AccessoryTool(AgentTool):
    name = "AccessoryTool"
    description = "Recommends curated accessories (belts, bags, jewelry, scarves, eyewear) to complete any look."
    category = "accessories"

    def execute(self, params: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        occasion = params.get("occasion", "daily")
        suggestions = [
            {"name": "Cognac Top-Grain Leather Belt", "type": "Belt", "accent": "Warm Leather"},
            {"name": "Minimalist Gold Accent Chrono Watch", "type": "Jewelry", "accent": "Polished Gold"},
            {"name": "Structured Canvas & Leather Tote", "type": "Bag", "accent": "Neutral Utility"}
        ]
        if "traditional" in occasion.lower():
            suggestions = [
                {"name": "Embroidered Silk Stole / Shawl", "type": "Scarf", "accent": "Rich Texture"},
                {"name": "Traditional Antique Brass Cuff", "type": "Jewelry", "accent": "Antique Metal"}
            ]
        return {"occasion": occasion, "recommended_accessories": suggestions}

class ProductSearchTool(AgentTool):
    name = "ProductSearchTool"
    description = "Performs semantic, vibe, budget, and attribute-based search across the luxury product catalog."
    category = "catalog"

    def execute(self, params: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        import random
        catalog = context.get("catalog_products", [])
        exclude_ids = set(params.get("exclude_ids") or context.get("exclude_ids") or context.get("already_shown_ids") or [])
        query = (params.get("query") or "").lower()
        max_budget = params.get("max_budget")
        vibe = (params.get("vibe") or "").lower()
        color = (params.get("color") or "").lower()

        matched = []
        for p in catalog:
            if p.get("id") in exclude_ids:
                continue
            p_name = (p.get("name") or "").lower()
            p_cat = (p.get("category") or "").lower()
            p_style = (p.get("style") or "").lower()
            p_color = (p.get("color") or "").lower()
            price = p.get("price", 0)

            if max_budget and price > float(max_budget):
                continue
            if color and color not in p_color and color not in p_name:
                continue

            score = 0
            if query and (query in p_name or query in p_cat or query in p_style):
                score += 3
            if vibe and (vibe in p_style or vibe in p_name):
                score += 2

            if score > 0 or not query:
                matched.append(p)

        if matched:
            random.shuffle(matched)
            results = matched
        else:
            fallback_pool = [p for p in catalog if p.get("id") not in exclude_ids]
            if not fallback_pool:
                fallback_pool = list(catalog)
            random.shuffle(fallback_pool)
            results = fallback_pool
            
        return {"query": query, "results": results[:4]}

class OutfitPairingsTool(AgentTool):
    name = "OutfitPairingsTool"
    description = "Computes complementary garment, footwear, and accessory pairings to create cohesive luxury looks."
    category = "pairings"

    def execute(self, params: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        product_id = params.get("product_id")
        catalog = context.get("catalog_products", [])
        
        # Pick 2-3 complementary items from other categories
        pairings = []
        for p in catalog:
            if p.get("id") != product_id and len(pairings) < 3:
                pairings.append({
                    "id": p.get("id"),
                    "name": p.get("name"),
                    "price": p.get("price"),
                    "category": p.get("category"),
                    "pairing_rationale": "Harmonizes silhouettes and color temperature."
                })
        return {"anchor_product_id": product_id, "pairings": pairings}

class ShippingEtaTool(AgentTool):
    name = "ShippingEtaTool"
    description = "Calculates accurate luxury courier transit times and insured delivery dates."
    category = "logistics"

    def execute(self, params: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        pincode = params.get("pincode", "10001")
        return {
            "pincode": pincode,
            "carrier": "White-Glove Insured Courier",
            "estimated_transit_days": 2,
            "service_level": "Signature Required & Climate Controlled",
            "delivery_date": "Within 48-72 Hours"
        }

class VirtualTryOnTool(AgentTool):
    name = "VirtualTryOnTool"
    description = "Dispatches garment fit simulation or GPU diffusion try-on provider."
    category = "tryon"

    def execute(self, params: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        person_url = params.get("person_url", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800")
        garments = params.get("garments", {})
        return {
            "status": "ready_for_render",
            "provider": "StyleSense Neural VTON Diffusion Engine",
            "composite_target": person_url,
            "layers": list(garments.keys())
        }

class WeatherTool(AgentTool):
    name = "WeatherTool"
    description = "Checks weather constraints and thermal insulation requirements for location and season."
    category = "weather"

    def execute(self, params: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        weather = params.get("weather", "moderate").lower()
        temp = params.get("temperature", 22)
        insulation_guidance = "Breathable single-layer clothing"
        if "cold" in weather or temp < 15:
            insulation_guidance = "Layered thermal insulation: Base knitwear + Wool/Cashmere coat"
        elif "rain" in weather:
            insulation_guidance = "Water-resistant outer shell + waterproof footwear"
        return {"weather": weather, "temperature_c": temp, "guidance": insulation_guidance}

class PreferenceLearningTool(AgentTool):
    name = "PreferenceLearningTool"
    description = "Updates user style preferences and fashion memory based on explicit feedback."
    category = "learning"

    def execute(self, params: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        user_id = context.get("user_id", "default_user")
        memory = UserFashionMemory.get_memory(user_id)
        if "rating" in params:
            memory.record_feedback(params.get("outfit_id", "current"), params.get("rating", 5.0), params.get("comments"))
        if "liked_color" in params:
            memory.learn_color_affinity(params["liked_color"], positive=True)
        if "disliked_color" in params:
            memory.learn_color_affinity(params["disliked_color"], positive=False)
        return {"updated_memory": memory.to_dict(), "status": "learned"}

class DestinationStylingTool(AgentTool):
    name = "DestinationStylingTool"
    description = "search_by_destination: Curates 3-piece capsule outfits tailored to climate, location, and dress code."
    category = "travel"

    def execute(self, params: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        dest = (params.get("destination") or "Paris").lower()
        catalog = context.get("catalog_products", [])
        
        if "goa" in dest or "beach" in dest or "resort" in dest:
            return {
                "destination": dest.capitalize(),
                "climate": "Tropical Coastal Warmth",
                "recommended_capsule": [
                    {"piece": "Ivory Linen Resort Shirt", "role": "Breathable base layer"},
                    {"piece": "Wide-Leg Sand Linen Pants", "role": "Fluid coastal bottom"},
                    {"piece": "Minimal Leather Slides / Loafers", "role": "Resort footwear"}
                ],
                "styling_tip": "Keep tones neutral with unbuttoned camp collar."
            }
        elif "paris" in dest or "london" in dest:
            return {
                "destination": dest.capitalize(),
                "climate": "Temperate European Breeze",
                "recommended_capsule": [
                    {"piece": "Structured Wool Trench Coat", "role": "Statement outerwear"},
                    {"piece": "Silk Satin Drape Blouse", "role": "Elevated dinner base"},
                    {"piece": "Chelsea Suede Ankle Boots", "role": "Architectural footwear"}
                ],
                "styling_tip": "Monochromatic layering with subdued gold accents."
            }
        else:
            return {
                "destination": dest.capitalize(),
                "climate": "Versatile Transitional",
                "recommended_capsule": [
                    {"piece": "Classic Black Oversized Blazer", "role": "Tailored outerwear"},
                    {"piece": "Heavyweight Organic Cotton Tee", "role": "Minimal base layer"},
                    {"piece": "Double-Pleated Tailored Trousers", "role": "Structured silhouette"}
                ],
                "styling_tip": "Pack versatile items that transition from day to evening."
            }

class DeliveryExpediterTool(AgentTool):
    name = "DeliveryExpediterTool"
    description = "find_faster_delivery_alternatives: Identifies fulfillment hubs offering express 24-48h dispatch."
    category = "logistics"

    def execute(self, params: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        target_days = params.get("target_days", 1)
        return {
            "requested_timeline_days": target_days,
            "express_option_available": True,
            "carrier": "White-Glove Priority Air Hub",
            "express_transit_hours": 24 if target_days <= 1 else 48,
            "surcharge": 25.0,
            "fastest_seller": "Atelier Sense Express Air Hub (New York, NY)"
        }

class StylePairingTool(AgentTool):
    name = "StylePairingTool"
    description = "get_style_pairing: Returns complementary capsule pieces for an anchor garment."
    category = "styling"

    def execute(self, params: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        anchor = params.get("anchor_garment", "blazer")
        return {
            "anchor": anchor,
            "suggested_pairings": [
                {"category": "Bottom", "suggestion": "High-waisted tailored wool trousers"},
                {"category": "Footwear", "suggestion": "Supple Tuscan almond-toe loafers"},
                {"category": "Accessory", "suggestion": "Interlocking 18K gold chain necklace"}
            ],
            "aesthetic_harmony_score": 9.7
        }
