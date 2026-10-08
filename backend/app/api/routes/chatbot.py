from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.models import Profile
from app.services.chatbot_service import ChatbotService
from app.repositories.chat_repository import ChatRepository
from app.schemas.schemas import ChatRequest, ChatResponse
from app.services.monitor_service import record_ai_request

router = APIRouter(prefix="/api/chat", tags=["AI Fashion Bestie Chatbot"])

@router.post("", response_model=ChatResponse)
def send_chat_message(data: ChatRequest, current_user: Profile = Depends(get_current_user), db: Session = Depends(get_db)):
    record_ai_request()
    service = ChatbotService(db)
    return service.process_message(current_user.id, data.message)

@router.get("/history")
def get_history(current_user: Profile = Depends(get_current_user), db: Session = Depends(get_db)):
    repo = ChatRepository(db)
    msgs = repo.get_history(current_user.id, limit=30)
    return [
        {"id": m.id, "role": m.role, "message": m.message, "created_at": m.created_at}
        for m in msgs
    ]
