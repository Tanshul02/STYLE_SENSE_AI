from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.models import Profile
from app.services.wardrobe_service import WardrobeService
from app.schemas.schemas import ClothingItemCreate, ClothingItemUpdate, ClothingItemResponse

router = APIRouter(prefix="/api/wardrobe", tags=["Smart Digital Wardrobe"])

@router.get("", response_model=List[ClothingItemResponse])
def get_wardrobe(category: Optional[str] = None, current_user: Profile = Depends(get_current_user), db: Session = Depends(get_db)):
    service = WardrobeService(db)
    return service.get_user_wardrobe(current_user.id, category)

@router.post("", response_model=ClothingItemResponse, status_code=status.HTTP_201_CREATED)
def upload_clothing(data: ClothingItemCreate, current_user: Profile = Depends(get_current_user), db: Session = Depends(get_db)):
    service = WardrobeService(db)
    return service.add_clothing_item(current_user.id, data)

@router.put("/{item_id}", response_model=ClothingItemResponse)
def update_clothing(item_id: str, data: ClothingItemUpdate, current_user: Profile = Depends(get_current_user), db: Session = Depends(get_db)):
    service = WardrobeService(db)
    updated = service.update_clothing_item(current_user.id, item_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Clothing item not found")
    return updated

@router.delete("/{item_id}")
def delete_clothing(item_id: str, current_user: Profile = Depends(get_current_user), db: Session = Depends(get_db)):
    service = WardrobeService(db)
    if not service.delete_clothing_item(current_user.id, item_id):
        raise HTTPException(status_code=404, detail="Clothing item not found")
    return {"message": "Clothing item deleted successfully"}
