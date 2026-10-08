from typing import List
from sqlalchemy.orm import Session
from app.models.models import ChatMessage

class ChatRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_history(self, user_id: str, limit: int = 30) -> List[ChatMessage]:
        return self.db.query(ChatMessage).filter(ChatMessage.user_id == user_id).order_by(ChatMessage.created_at.asc()).limit(limit).all()

    def add_message(self, user_id: str, role: str, message: str, referenced_items: str = None) -> ChatMessage:
        msg = ChatMessage(user_id=user_id, role=role, message=message, referenced_items=referenced_items)
        self.db.add(msg)
        self.db.commit()
        self.db.refresh(msg)
        return msg
