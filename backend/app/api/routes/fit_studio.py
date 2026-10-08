"""
StyleSense AI - AI Fit Studio Router
"""
from fastapi import APIRouter
from app.tryon.factory import TryOnProviderFactory
from app.schemas.schemas import FitStudioSimulateRequest, FitStudioSimulateResponse

router = APIRouter(prefix="/api/fit-studio", tags=["AI Fit Studio"])

PRESET_AVATARS = [
    {"id": "model-w-1", "name": "Elena (High-Fashion Studio)", "gender": "Women", "image_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800"},
    {"id": "model-m-1", "name": "Marcus (Tailored Editorial)", "gender": "Men", "image_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800"},
    {"id": "model-w-2", "name": "Aria (Contemporary Chic)", "gender": "Women", "image_url": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800"},
    {"id": "model-m-2", "name": "David (Senior Executive)", "gender": "Seniors", "image_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800"},
    {"id": "model-k-1", "name": "Leo (Kids Studio)", "gender": "Kids", "image_url": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800"}
]

@router.get("/models")
def get_model_avatars():
    return {"models": PRESET_AVATARS}

@router.post("/simulate", response_model=FitStudioSimulateResponse)
def simulate_fitting(req: FitStudioSimulateRequest):
    provider = TryOnProviderFactory.get_provider(req.provider or "mock")
    res = provider.simulate_try_on(req.person_image_url, req.garments)
    return FitStudioSimulateResponse(**res)
