from typing import List, Optional
from sqlalchemy.orm import Session
from app.repositories.wardrobe_repository import WardrobeRepository
from app.models.models import ClothingItem
from app.schemas.schemas import ClothingItemCreate, ClothingItemUpdate
from app.patterns.strategy.analyzer import ManualClothingAnalyzer
from app.patterns.observer.event_bus import event_bus

class WardrobeService:
    def __init__(self, db: Session):
        self.repo = WardrobeRepository(db)
        self.analyzer = ManualClothingAnalyzer()

    def get_user_wardrobe(self, user_id: str, category: Optional[str] = None) -> List[ClothingItem]:
        return self.repo.get_all_by_user(user_id, category)

    def add_clothing_item(self, user_id: str, data: ClothingItemCreate) -> ClothingItem:
        # Use Strategy pattern to analyze and validate metadata
        analyzed = self.analyzer.analyze(data.image_url, data.model_dump())
        
        item = ClothingItem(
            user_id=user_id,
            name=analyzed["name"],
            image_url=data.image_url,
            category=analyzed["category"],
            color=analyzed["color"],
            style=analyzed["style"],
            season=analyzed["season"],
            occasion=analyzed["occasion"],
            formality=analyzed["formality"],
            description=data.description or f"Smart wardrobe piece: {analyzed['name']}"
        )
        saved = self.repo.create(item)
        
        # Observer Pattern Event Notification
        event_bus.notify("clothing_uploaded", {
            "user_id": user_id,
            "item_id": saved.id,
            "category": saved.category,
            "name": saved.name
        })
        return saved

    def update_clothing_item(self, user_id: str, item_id: str, data: ClothingItemUpdate) -> Optional[ClothingItem]:
        item = self.repo.get_by_id(item_id, user_id)
        if not item:
            return None
        for key, val in data.model_dump(exclude_unset=True).items():
            setattr(item, key, val)
        return self.repo.update(item)

    def delete_clothing_item(self, user_id: str, item_id: str) -> bool:
        item = self.repo.get_by_id(item_id, user_id)
        if not item:
            return False
        self.repo.delete(item)
        return True
