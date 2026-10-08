from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.repositories.wardrobe_repository import WardrobeRepository
from app.repositories.outfit_repository import OutfitRepository
from app.models.models import Outfit
from app.ai.recommendation_engine import recommendation_engine
from app.schemas.schemas import OutfitGenerateRequest, OutfitGenerateResponse, SaveOutfitRequest
from app.patterns.observer.event_bus import event_bus

class RecommendationService:
    def __init__(self, db: Session):
        self.wardrobe_repo = WardrobeRepository(db)
        self.outfit_repo = OutfitRepository(db)

    def generate_outfit(self, user_id: str, req: OutfitGenerateRequest) -> OutfitGenerateResponse:
        wardrobe = self.wardrobe_repo.get_all_by_user(user_id)
        context = req.model_dump()
        
        recommendations = recommendation_engine.build_recommendations(wardrobe, context)
        
        if not recommendations:
            # Generate demonstration look if wardrobe is empty
            from app.schemas.schemas import ClothingItemResponse, ScoreBreakdown, OutfitRecommendation
            from datetime import datetime
            dummy_breakdown = ScoreBreakdown(
                occasion_match=92.0, style_compatibility=90.0, color_compatibility=95.0,
                weather_compatibility=88.0, user_preference_match=85.0, final_score=91.5
            )
            demo_items = [
                ClothingItemResponse(
                    id="demo-1", user_id=user_id, name="Black Oversized Blazer",
                    image_url="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600",
                    category="Jackets", color="Black", style="Formal", season="All-Season",
                    occasion="College Farewell", formality="High", description="Tailored modern silhouette",
                    created_at=datetime.utcnow()
                ),
                ClothingItemResponse(
                    id="demo-2", user_id=user_id, name="Ivory Linen Shirt",
                    image_url="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600",
                    category="Shirts", color="Ivory", style="Elegant", season="Summer",
                    occasion="College Farewell", formality="Medium", description="Breathable organic linen",
                    created_at=datetime.utcnow()
                ),
                ClothingItemResponse(
                    id="demo-3", user_id=user_id, name="Black Straight Fit Trousers",
                    image_url="https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600",
                    category="Trousers", color="Black", style="Formal", season="All-Season",
                    occasion="College Farewell", formality="High", description="Classic pleated silhouette",
                    created_at=datetime.utcnow()
                ),
                ClothingItemResponse(
                    id="demo-4", user_id=user_id, name="Formal Leather Loafers",
                    image_url="https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600",
                    category="Footwear", color="Black", style="Formal", season="All-Season",
                    occasion="College Farewell", formality="High", description="Burnished leather finish",
                    created_at=datetime.utcnow()
                )
            ]
            primary = OutfitRecommendation(
                id="demo-primary",
                title="Look 1 — Editorial Farewell Ensemble",
                items=demo_items,
                compatibility_score=91.5,
                explanation="This outfit creates an elegant silhouette while the neutral palette keeps the look sophisticated and suitable for a formal farewell.",
                score_breakdown=dummy_breakdown,
                alternative_suggestion="Swap the blazer for a dark cardigan for an evening afterparty."
            )
            recommendations = [primary]

        primary_look = recommendations[0]
        alts = recommendations[1:] if len(recommendations) > 1 else []

        # Observer Event Notification
        event_bus.notify("outfit_generated", {
            "user_id": user_id,
            "occasion": req.occasion,
            "score": primary_look.compatibility_score
        })

        return OutfitGenerateResponse(
            primary_outfit=primary_look,
            alternative_outfits=alts,
            weather_context=f"Calibrated for {req.weather} weather (~{req.temperature}°C).",
            styling_tips=[
                "Keep accessories understated to let the tailoring speak for itself.",
                "Ensure shirt cuffs extend 1/2 inch beyond blazer sleeves for editorial proportion.",
                "Opt for a textured belt matching the finish of your footwear."
            ]
        )

    def save_outfit(self, user_id: str, req: SaveOutfitRequest) -> Outfit:
        outfit = Outfit(
            user_id=user_id,
            name=req.name,
            occasion=req.occasion,
            style=req.style,
            compatibility_score=req.compatibility_score,
            explanation=req.explanation,
            score_breakdown=str(req.score_breakdown or {})
        )
        saved = self.outfit_repo.create_outfit(outfit, req.clothing_item_ids)
        event_bus.notify("outfit_saved", {"user_id": user_id, "outfit_id": saved.id, "name": saved.name})
        return saved
