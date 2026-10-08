import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.repositories.user_repository import UserRepository
from app.models.models import Profile
from app.schemas.schemas import UserRegister, UserLogin, TokenResponse, ProfileResponse, UserPreferencesUpdate
from app.api.deps import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/signup", response_model=TokenResponse)
def signup(data: UserRegister, db: Session = Depends(get_db)):
    repo = UserRepository(db)
    if repo.get_by_email(data.email):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
        
    user = Profile(
        full_name=data.full_name,
        email=data.email,
        hashed_password=get_password_hash(data.password),
        avatar_url=f"https://api.dicebear.com/7.x/adventurer/svg?seed={data.full_name.replace(' ', '')}",
        style_preferences=json.dumps(["Casual", "Elegant", "Minimalist"]),
        favorite_colors=json.dumps(["Black", "Ivory", "Emerald"]),
        fashion_goals=json.dumps(["Elevate daily style", "Curate capsule wardrobe"])
    )
    saved = repo.create(user)
    token = create_access_token({"sub": saved.id, "email": saved.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": saved.id,
            "full_name": saved.full_name,
            "email": saved.email,
            "avatar_url": saved.avatar_url,
            "style_preferences": json.loads(saved.style_preferences),
            "favorite_colors": json.loads(saved.favorite_colors),
            "fashion_goals": json.loads(saved.fashion_goals),
        }
    }

@router.post("/login", response_model=TokenResponse)
def login(data: UserLogin, db: Session = Depends(get_db)):
    repo = UserRepository(db)
    user = repo.get_by_email(data.email)
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
        
    token = create_access_token({"sub": user.id, "email": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "avatar_url": user.avatar_url,
            "style_preferences": json.loads(user.style_preferences),
            "favorite_colors": json.loads(user.favorite_colors),
            "fashion_goals": json.loads(user.fashion_goals),
        }
    }

@router.get("/me", response_model=ProfileResponse)
def get_profile(current_user: Profile = Depends(get_current_user)):
    return ProfileResponse(
        id=current_user.id,
        full_name=current_user.full_name,
        email=current_user.email,
        avatar_url=current_user.avatar_url,
        style_preferences=json.loads(current_user.style_preferences),
        favorite_colors=json.loads(current_user.favorite_colors),
        fashion_goals=json.loads(current_user.fashion_goals),
        created_at=current_user.created_at
    )

@router.put("/preferences", response_model=ProfileResponse)
def update_preferences(data: UserPreferencesUpdate, current_user: Profile = Depends(get_current_user), db: Session = Depends(get_db)):
    repo = UserRepository(db)
    current_user.style_preferences = json.dumps(data.style_preferences)
    current_user.favorite_colors = json.dumps(data.favorite_colors)
    current_user.fashion_goals = json.dumps(data.fashion_goals)
    updated = repo.update(current_user)
    return ProfileResponse(
        id=updated.id,
        full_name=updated.full_name,
        email=updated.email,
        avatar_url=updated.avatar_url,
        style_preferences=json.loads(updated.style_preferences),
        favorite_colors=json.loads(updated.favorite_colors),
        fashion_goals=json.loads(updated.fashion_goals),
        created_at=updated.created_at
    )
