from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.models import Profile

class UserRepository:
    """Repository Pattern: Decouples user data access from service logic."""
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, user_id: str) -> Optional[Profile]:
        return self.db.query(Profile).filter(Profile.id == user_id).first()

    def get_by_email(self, email: str) -> Optional[Profile]:
        return self.db.query(Profile).filter(Profile.email == email).first()

    def create(self, profile: Profile) -> Profile:
        self.db.add(profile)
        self.db.commit()
        self.db.refresh(profile)
        return profile

    def update(self, profile: Profile) -> Profile:
        self.db.commit()
        self.db.refresh(profile)
        return profile
