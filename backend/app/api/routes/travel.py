from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.models import Profile
from app.services.travel_service import TravelService
from app.schemas.schemas import TravelPackRequest, TravelPackResponse
from app.services.monitor_service import record_ai_request

router = APIRouter(prefix="/api/travel", tags=["Travel AI & Weather Integration"])

@router.post("/pack", response_model=TravelPackResponse)
def pack_with_ai(data: TravelPackRequest, current_user: Profile = Depends(get_current_user), db: Session = Depends(get_db)):
    record_ai_request()
    service = TravelService(db)
    return service.generate_packing_plan(current_user.id, data)
