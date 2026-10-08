"""
StyleSense AI - Agent Planner
"""
from typing import Dict, Any, List

class AgentPlanner:
    @classmethod
    def plan(cls, user_message: str, context: Dict[str, Any]) -> Dict[str, Any]:
        msg = user_message.lower()
        
        intent = "general_styling"
        subgoals = []
        tools_sequence = []

        if any(w in msg for w in ["wedding", "traditional", "ethnic", "diwali", "eid"]):
            intent = "traditional_event_styling"
            subgoals = [
                "1. Analyze cultural dress code and ceremonial etiquette",
                "2. Query traditional wardrobe and complementary catalog items",
                "3. Perform chromatic harmony and rich palette verification",
                "4. Suggest traditional footwear and metallic accessories",
                "5. Calculate 0-10 style score and present look"
            ]
            tools_sequence = ["OccasionTool", "WardrobeTool", "ColorHarmonyTool", "AccessoryTool", "OutfitScoringTool"]

        elif any(w in msg for w in ["office", "interview", "presentation", "meeting", "corporate", "formal"]):
            intent = "professional_styling"
            subgoals = [
                "1. Check corporate dress code guidelines and formality baseline",
                "2. Filter tailored tops, trousers, and structured blazers",
                "3. Verify monochromatic or neutral color balance",
                "4. Evaluate 0-10 style score and add executive accessories"
            ]
            tools_sequence = ["OccasionTool", "WardrobeTool", "ColorHarmonyTool", "OutfitScoringTool", "AccessoryTool"]

        elif any(w in msg for w in ["buy", "shop", "product", "recommend items", "need"]):
            intent = "shopping_expansion"
            subgoals = [
                "1. Identify wardrobe gaps and user search criteria",
                "2. Perform semantic product search across luxury catalog",
                "3. Score compatibility with existing wardrobe items"
            ]
            tools_sequence = ["ProductSearchTool", "WardrobeTool", "StyleCompatibilityTool"]

        elif any(w in msg for w in ["paris", "goa", "tokyo", "milan", "swiss", "travel", "vacation", "trip", "packing", "flight"]):
            intent = "destination_capsule_curation"
            subgoals = [
                "1. Analyze destination climate, latitude, and local dress codes",
                "2. Synthesize weather-proof 3-piece capsule wardrobe",
                "3. Verify temperature compatibility and layering insulation",
                "4. Query complementary footwear and travel accessories"
            ]
            tools_sequence = ["DestinationStylingTool", "WeatherTool", "ProductSearchTool", "OutfitScoringTool"]

        elif any(w in msg for w in ["delivery", "fast", "urgent", "sooner", "shipping", "arrive", "transit"]):
            intent = "delivery_expediting"
            subgoals = [
                "1. Check fulfillment seller network and courier timelines",
                "2. Query express 24-48h air dispatch options (+₹150 express option)",
                "3. Locate alternative regional hubs for same-day dispatch"
            ]
            tools_sequence = ["DeliveryExpediterTool", "ShippingEtaTool", "ProductSearchTool"]

        elif any(w in msg for w in ["pair", "match", "wear with", "combine", "capsule", "styling"]):
            intent = "style_pairing"
            subgoals = [
                "1. Identify anchor garment silhouette and texture",
                "2. Compute complementary bottom, footwear, and jewelry pairings",
                "3. Verify color wheel harmony and proportion balance"
            ]
            tools_sequence = ["StylePairingTool", "OutfitPairingsTool", "AccessoryTool"]

        elif any(w in msg for w in ["weather", "rain", "cold", "summer", "winter"]):
            intent = "climate_adaptive_styling"
            subgoals = [
                "1. Evaluate weather insulation and textile breathability",
                "2. Select adaptive wardrobe layers",
                "3. Score outfit compatibility against climate"
            ]
            tools_sequence = ["WeatherTool", "WardrobeTool", "OutfitScoringTool"]

        else:
            intent = "daily_curation"
            subgoals = [
                "1. Recall user fashion memory and preferred styles",
                "2. Retrieve user wardrobe items",
                "3. Compose stylish coordinated ensemble",
                "4. Calculate 0-10 explainable style score"
            ]
            tools_sequence = ["WardrobeTool", "ColorHarmonyTool", "OutfitGeneratorTool", "OutfitScoringTool"]

        return {
            "intent": intent,
            "subgoals": subgoals,
            "tools_sequence": tools_sequence
        }
