from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.models import Profile
from app.services.recommendation_service import RecommendationService
from app.repositories.outfit_repository import OutfitRepository
from app.schemas.schemas import OutfitGenerateRequest, OutfitGenerateResponse, SaveOutfitRequest
from app.services.monitor_service import record_ai_request

router = APIRouter(prefix="/api/outfits", tags=["AI Outfit Recommendations"])

@router.post("/generate", response_model=OutfitGenerateResponse)
def generate_outfit(data: OutfitGenerateRequest, current_user: Profile = Depends(get_current_user), db: Session = Depends(get_db)):
    record_ai_request()
    service = RecommendationService(db)
    return service.generate_outfit(current_user.id, data)

@router.get("")
def get_saved_outfits(current_user: Profile = Depends(get_current_user), db: Session = Depends(get_db)):
    repo = OutfitRepository(db)
    outfits = repo.get_by_user(current_user.id)
    fav_ids = set(f.id for f in repo.get_favorites_by_user(current_user.id))
    
    result = []
    for o in outfits:
        result.append({
            "id": o.id,
            "name": o.name,
            "occasion": o.occasion,
            "style": o.style,
            "compatibility_score": o.compatibility_score,
            "explanation": o.explanation,
            "is_favorite": o.id in fav_ids,
            "created_at": o.created_at,
            "items": [
                {
                    "id": i.clothing_item.id,
                    "name": i.clothing_item.name,
                    "image_url": i.clothing_item.image_url,
                    "category": i.clothing_item.category,
                    "color": i.clothing_item.color
                }
                for i in o.items if i.clothing_item
            ]
        })
    return result

@router.post("")
@router.post("/save")
def save_outfit(data: SaveOutfitRequest, current_user: Profile = Depends(get_current_user), db: Session = Depends(get_db)):
    service = RecommendationService(db)
    saved = service.save_outfit(current_user.id, data)
    return {"message": "Outfit saved successfully", "outfit_id": saved.id, "id": saved.id}

@router.post("/{outfit_id}/favorite")
def toggle_favorite(outfit_id: str, current_user: Profile = Depends(get_current_user), db: Session = Depends(get_db)):
    repo = OutfitRepository(db)
    is_fav = repo.toggle_favorite(current_user.id, outfit_id)
    return {"is_favorite": is_fav}
