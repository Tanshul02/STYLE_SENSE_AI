from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.repositories.chat_repository import ChatRepository
from app.repositories.wardrobe_repository import WardrobeRepository
from app.repositories.product_repository import ProductRepository
from app.patterns.factory.ai_provider_factory import AIProviderFactory
from app.schemas.schemas import ChatResponse, ClothingItemResponse

class ChatbotService:
    def __init__(self, db: Session):
        self.chat_repo = ChatRepository(db)
        self.wardrobe_repo = WardrobeRepository(db)
        self.product_repo = ProductRepository(db)

    def process_message(self, user_id: str, message: str) -> ChatResponse:
        # Record user query
        self.chat_repo.add_message(user_id=user_id, role="user", message=message)
        
        # 1. Fetch user wardrobe first (wardrobe-prioritization rule)
        wardrobe = self.wardrobe_repo.get_all_by_user(user_id)
        
        # 2. Get AI Provider via Factory Pattern
        provider = AIProviderFactory.get_provider()
        
        context = {
            "wardrobe_items": wardrobe,
            "user_id": user_id
        }
        
        history = [
            {"role": m.role, "content": m.message}
            for m in self.chat_repo.get_history(user_id, limit=6)
        ]
        
        reply_text = provider.generate_response(message, history, context)
        
        # Save assistant message
        self.chat_repo.add_message(user_id=user_id, role="assistant", message=reply_text)
        
        # Identify if any wardrobe items or catalog products should be attached
        suggested_wardrobe = [ClothingItemResponse.model_validate(w) for w in wardrobe[:2]]
        
        products = self.product_repo.get_all()[:3]
        suggested_products = [
            {"id": p.id, "name": p.name, "price": p.price, "image_url": p.image_url, "brand": p.brand}
            for p in products
        ]
            
        return ChatResponse(
            reply=reply_text,
            sender="StyleSense",
            wardrobe_items_suggested=suggested_wardrobe,
            catalog_products_suggested=suggested_products,
            provider_used=provider.__class__.__name__
        )
