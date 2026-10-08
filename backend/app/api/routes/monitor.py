from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.monitor_service import MonitorService
from app.schemas.schemas import CloudMetricsResponse

router = APIRouter(prefix="/api/monitor", tags=["Cloud Monitoring & Telemetry"])

@router.get("/metrics", response_model=CloudMetricsResponse)
def get_metrics(db: Session = Depends(get_db)):
    service = MonitorService(db)
    return service.get_cloud_metrics()
