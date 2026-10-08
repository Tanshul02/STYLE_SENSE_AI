from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.models import Outfit, OutfitItem, Favorite

class OutfitRepository:
    """Repository Pattern: Manages saved outfits, associations, and favorites."""
    def __init__(self, db: Session):
        self.db = db

    def get_by_user(self, user_id: str) -> List[Outfit]:
        return self.db.query(Outfit).filter(Outfit.user_id == user_id).order_by(Outfit.created_at.desc()).all()

    def get_by_id(self, outfit_id: str, user_id: str) -> Optional[Outfit]:
        return self.db.query(Outfit).filter(Outfit.id == outfit_id, Outfit.user_id == user_id).first()

    def create_outfit(self, outfit: Outfit, item_ids: List[str]) -> Outfit:
        self.db.add(outfit)
        self.db.flush()
        for item_id in item_ids:
            link = OutfitItem(outfit_id=outfit.id, clothing_item_id=item_id)
            self.db.add(link)
        self.db.commit()
        self.db.refresh(outfit)
        return outfit

    def toggle_favorite(self, user_id: str, outfit_id: str) -> bool:
        fav = self.db.query(Favorite).filter(Favorite.user_id == user_id, Favorite.outfit_id == outfit_id).first()
        if fav:
            self.db.delete(fav)
            self.db.commit()
            return False
        else:
            new_fav = Favorite(user_id=user_id, outfit_id=outfit_id)
            self.db.add(new_fav)
            self.db.commit()
            return True

    def get_favorites_by_user(self, user_id: str) -> List[Outfit]:
        favs = self.db.query(Favorite).filter(Favorite.user_id == user_id).all()
        fav_ids = [f.outfit_id for f in favs]
        return self.db.query(Outfit).filter(Outfit.id.in_(fav_ids)).all()
