from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.models import ClothingItem

class WardrobeRepository:
    """Repository Pattern: Encapsulates digital wardrobe persistence."""
    def __init__(self, db: Session):
        self.db = db

    def get_all_by_user(self, user_id: str, category: Optional[str] = None) -> List[ClothingItem]:
        query = self.db.query(ClothingItem).filter(ClothingItem.user_id == user_id)
        if category and category != "All":
            query = query.filter(ClothingItem.category == category)
        return query.order_by(ClothingItem.created_at.desc()).all()

    def get_by_id(self, item_id: str, user_id: str) -> Optional[ClothingItem]:
        return self.db.query(ClothingItem).filter(ClothingItem.id == item_id, ClothingItem.user_id == user_id).first()

    def create(self, item: ClothingItem) -> ClothingItem:
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def update(self, item: ClothingItem) -> ClothingItem:
        self.db.commit()
        self.db.refresh(item)
        return item

    def delete(self, item: ClothingItem) -> None:
        self.db.delete(item)
        self.db.commit()
