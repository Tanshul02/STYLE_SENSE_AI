from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict

# User & Auth
class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class UserPreferencesUpdate(BaseModel):
    style_preferences: List[str] = []
    favorite_colors: List[str] = []
    fashion_goals: List[str] = []

class ProfileResponse(BaseModel):
    id: str
    full_name: str
    email: str
    avatar_url: Optional[str] = None
    style_preferences: List[str] = []
    favorite_colors: List[str] = []
    fashion_goals: List[str] = []
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# Clothing / Wardrobe
class ClothingItemCreate(BaseModel):
    name: str
    image_url: str
    category: str
    color: str
    style: str
    season: str
    occasion: str
    formality: str
    description: Optional[str] = None

class ClothingItemUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    color: Optional[str] = None
    style: Optional[str] = None
    season: Optional[str] = None
    occasion: Optional[str] = None
    formality: Optional[str] = None
    description: Optional[str] = None

class ClothingItemResponse(BaseModel):
    id: str
    user_id: str
    name: str
    image_url: str
    category: str
    color: str
    style: str
    season: str
    occasion: str
    formality: str
    description: Optional[str] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# Outfit Generation
class OutfitGenerateRequest(BaseModel):
    occasion: str
    style: str
    weather: Optional[str] = "Moderate"
    temperature: Optional[float] = 24.0
    preferred_color: Optional[str] = None
    formality: Optional[str] = "Medium"
    gender_preference: Optional[str] = "Unisex"

class ScoreBreakdown(BaseModel):
    occasion_match: float
    style_compatibility: float
    color_compatibility: float
    weather_compatibility: float
    user_preference_match: float
    final_score: float

class OutfitRecommendation(BaseModel):
    id: Optional[str] = None
    title: str
    items: List[ClothingItemResponse]
    compatibility_score: float
    explanation: str
    score_breakdown: ScoreBreakdown
    alternative_suggestion: Optional[str] = None

class OutfitGenerateResponse(BaseModel):
    primary_outfit: OutfitRecommendation
    alternative_outfits: List[OutfitRecommendation] = []
    weather_context: str
    styling_tips: List[str] = []

class SaveOutfitRequest(BaseModel):
    name: str
    occasion: str
    style: str
    compatibility_score: float
    explanation: str
    clothing_item_ids: List[str]
    score_breakdown: Optional[Dict[str, float]] = None

# Chat
class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    reply: str
    sender: str = "StyleSense"
    wardrobe_items_suggested: List[ClothingItemResponse] = []
    catalog_products_suggested: List[Dict[str, Any]] = []
    provider_used: str

# Products & Cart
class ProductResponse(BaseModel):
    id: str
    name: str
    description: str
    price: float
    category: str
    audience: str
    gender: str = "unisex"
    style: str
    color: str
    image_url: str
    brand: str
    rating: float
    sellers: Optional[List[Dict[str, Any]]] = None
    accessories: Optional[List[Dict[str, Any]]] = None
    created_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

class CartItemCreate(BaseModel):
    product_id: str
    quantity: int = 1

class CartItemUpdate(BaseModel):
    quantity: int

class CartItemResponse(BaseModel):
    id: str
    product: ProductResponse
    quantity: int
    subtotal: float

class CartSummaryResponse(BaseModel):
    items: List[CartItemResponse]
    subtotal: float
    estimated_tax: float
    shipping: float
    total: float
    item_count: int

# Travel Assistant
class TravelPackRequest(BaseModel):
    destination: str
    days: int
    purpose: str
    expected_weather: str

class TravelPackResponse(BaseModel):
    destination: str
    duration_days: int
    weather_notes: str
    packing_checklist: List[Dict[str, Any]]
    recommended_outfits: List[OutfitRecommendation]
    missing_wardrobe_items: List[Dict[str, Any]]
    accessories: List[str]

# Virtual Try-On
class VirtualTryOnRequest(BaseModel):
    user_image_url: str
    product_id: Optional[str] = None
    clothing_item_id: Optional[str] = None
    garment_image_url: Optional[str] = None
    composite_image_url: Optional[str] = None

class VirtualTryOnResponse(BaseModel):
    job_id: Optional[str] = None
    result_image_url: str
    status: str
    is_demo: bool = False
    provider: str
    message: str

class CartQuoteItem(BaseModel):
    product_id: str
    size: Optional[str] = "M"
    quantity: int = 1

class CartQuoteRequest(BaseModel):
    items: List[CartQuoteItem]

class CartQuoteResponse(BaseModel):
    subtotal: float
    estimated_tax: float
    shipping: float
    total: float
    item_count: int
    items_detail: List[Dict[str, Any]] = []

# Cloud Monitoring
class CloudMetricsResponse(BaseModel):
    total_api_requests: int
    ai_recommendation_requests: int
    active_users: int
    storage_usage_mb: float
    average_response_time_ms: float
    cloud_services_status: Dict[str, str]
    recent_activities: List[Dict[str, Any]]

# Agent & Advanced Fit Studio Schemas
class AgentChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None
    already_shown_ids: Optional[List[str]] = []

class AgentTraceStep(BaseModel):
    step_num: int
    tool_name: str
    description: str
    input_params: Dict[str, Any]
    output_summary: str
    duration_ms: float

class AgentChatResponse(BaseModel):
    reply: str
    intent: str
    plan_summary: List[str]
    traces: List[AgentTraceStep]
    final_score: float
    memory_status: Dict[str, Any]
    catalog_products_suggested: Optional[List[Dict[str, Any]]] = []

class AgentMemoryResponse(BaseModel):
    user_id: str
    preferred_styles: List[str]
    preferred_colors: List[str]
    avoided_colors: List[str]
    body_silhouette_pref: str
    feedback_count: int
    last_updated: str

class AgentFeedbackRequest(BaseModel):
    outfit_id: str
    rating: float
    comments: Optional[str] = None
    liked_color: Optional[str] = None
    disliked_color: Optional[str] = None

class FitStudioSimulateRequest(BaseModel):
    person_image_url: str
    garments: Dict[str, Any]
    model_id: Optional[str] = None
    provider: Optional[str] = "mock"

class FitStudioSimulateResponse(BaseModel):
    result_image_url: str
    status: str
    provider: str
    is_demo: bool
    layers_applied: List[str]
    score: float
    breakdown: Dict[str, float]
    feedback: List[str]

class ShouldIWearRequest(BaseModel):
    items: List[Dict[str, Any]]
    occasion: str
    destination: Optional[str] = None
    weather: Optional[str] = "moderate"
    user_photo_url: Optional[str] = None

class ShouldIWearResponse(BaseModel):
    verdict: str
    score: float
    stars: float
    breakdown: Dict[str, float]
    strengths: List[str]
    improvements: List[str]
    elevated_variation: Optional[Dict[str, Any]] = None

class LookComparisonRequest(BaseModel):
    look_a_name: str = "Look A"
    look_a_items: List[Dict[str, Any]]
    look_b_name: str = "Look B"
    look_b_items: List[Dict[str, Any]]
    occasion: str = "daily"

class LookComparisonResponse(BaseModel):
    score_a: float
    score_b: float
    breakdown_a: Dict[str, float]
    breakdown_b: Dict[str, float]
    winner: str
    winner_name: str
    reasoning: str
    key_differences: List[str]

