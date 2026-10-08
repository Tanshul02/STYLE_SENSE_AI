from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.repositories.wardrobe_repository import WardrobeRepository
from app.repositories.product_repository import ProductRepository
from app.patterns.adapter.weather_adapter import MockWeatherProvider
from app.schemas.schemas import TravelPackRequest, TravelPackResponse, OutfitRecommendation, ClothingItemResponse, ScoreBreakdown
from datetime import datetime

class TravelService:
    def __init__(self, db: Session):
        self.wardrobe_repo = WardrobeRepository(db)
        self.product_repo = ProductRepository(db)
        self.weather_adapter = MockWeatherProvider()

    def generate_packing_plan(self, user_id: str, req: TravelPackRequest) -> TravelPackResponse:
        weather_info = self.weather_adapter.get_weather(req.destination)
        is_cold = weather_info["is_cold"]
        wardrobe = self.wardrobe_repo.get_all_by_user(user_id)
        
        # Checklist generation
        checklist = [
            {"category": "Essentials", "item": "Passport, ID & Boarding Passes", "packed": False},
            {"category": "Essentials", "item": "Universal Travel Adapter & Chargers", "packed": False},
            {"category": "Footwear", "item": "Comfortable Walking Sneakers", "packed": False},
        ]
        
        if is_cold:
            checklist.extend([
                {"category": "Outerwear", "item": "Thermal Base Layer Sets (x2)", "packed": False},
                {"category": "Outerwear", "item": "Insulated Wool Coat / Puffer Jacket", "packed": False},
                {"category": "Tops", "item": "Heavy Knit Sweaters & Cardigans (x3)", "packed": False},
                {"category": "Accessories", "item": "Cashmere Scarf & Fleece Gloves", "packed": False},
            ])
        else:
            checklist.extend([
                {"category": "Tops", "item": "Breathable Linen / Cotton Shirts (x4)", "packed": False},
                {"category": "Bottoms", "item": "Lightweight Chinos or Denim (x2)", "packed": False},
                {"category": "Accessories", "item": "UV Sunglasses & Wide-Brim Hat", "packed": False},
                {"category": "Skincare", "item": "Broad-Spectrum SPF 50 Sunscreen", "packed": False},
            ])

        # Prioritize wardrobe items
        pydantic_wardrobe = [ClothingItemResponse.model_validate(item) for item in wardrobe[:3]]
        
        demo_breakdown = ScoreBreakdown(
            occasion_match=94.0, style_compatibility=92.0, color_compatibility=90.0,
            weather_compatibility=95.0, user_preference_match=88.0, final_score=92.8
        )
        
        travel_look = OutfitRecommendation(
            id="travel-look-1",
            title=f"Transit & Exploration Ensemble for {req.destination}",
            items=pydantic_wardrobe,
            compatibility_score=92.8,
            explanation=f"Optimized for {weather_info['condition']} in {req.destination}. Prioritizes wrinkle-resistant layers that transition from travel transit to dining.",
            score_breakdown=demo_breakdown,
            alternative_suggestion="Layer a lightweight trench coat over shoulders during airport temperature drops."
        )

        missing_items = [
            {"name": "Packable Windproof Umbrella", "reason": "Unpredictable mountain shower protection", "suggested_price": 24.99},
            {"name": "Merino Wool Thermal Socks (3-Pack)", "reason": "All-day walking thermal comfort", "suggested_price": 18.50}
        ]

        return TravelPackResponse(
            destination=req.destination,
            duration_days=req.days,
            weather_notes=f"Forecast: {weather_info['temperature']}°C, {weather_info['condition']}.",
            packing_checklist=checklist,
            recommended_outfits=[travel_look],
            missing_wardrobe_items=missing_items,
            accessories=["Minimalist Tote Bag", "Polarized Sunglasses", "Reusable Water Bottle"]
        )
