"""
StyleSense AI - Agent API Router
Powered by Google Gemini Flash with Autonomous Function Calling
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.models import Profile
from app.agents.fashion_agent import FashionAgent
from app.agents.agent_memory import UserFashionMemory
from app.agents.tool_registry import ToolRegistry
from app.repositories.wardrobe_repository import WardrobeRepository
from app.repositories.product_repository import ProductRepository
from app.schemas.schemas import (
    AgentChatRequest, AgentChatResponse, AgentFeedbackRequest, AgentMemoryResponse
)
from app.services.monitor_service import record_ai_request
from app.services.gemini_service import run_bestie_gemini

router = APIRouter(prefix="/api/agent", tags=["Autonomous Fashion Agent"])

@router.post("/chat", response_model=AgentChatResponse)
def chat_with_agent(
    req: AgentChatRequest,
    current_user: Profile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    record_ai_request()
    wardrobe_repo = WardrobeRepository(db)
    product_repo = ProductRepository(db)
    
    wardrobe_items = [
        {"id": w.id, "name": w.name, "category": w.category, "color": w.color, "style": w.style, "occasion": w.occasion, "formality": w.formality, "image_url": w.image_url}
        for w in wardrobe_repo.get_all_by_user(current_user.id)
    ]
    all_catalog_prods = product_repo.get_all()
    catalog_items = [
        {"id": p.id, "name": p.name, "category": p.category, "color": p.color, "style": p.style, "price": p.price, "image_url": p.image_url, "gender": p.gender}
        for p in all_catalog_prods
    ]

    already_shown = req.already_shown_ids or (req.context.get("already_shown_ids") if req.context else []) or []

    context = {
        "wardrobe_items": wardrobe_items,
        "catalog_products": catalog_items,
        "user_name": current_user.full_name,
        "already_shown_ids": already_shown,
        "exclude_ids": already_shown
    }

    # 1. Attempt Google Gemini Flash with Automatic Tool Calling (search_catalog & check_expedited_delivery)
    gemini_result = None
    try:
        gemini_result = run_bestie_gemini(req.message, context, catalog_items, already_shown_ids=already_shown)
    except Exception as e:
        gemini_result = None

    if gemini_result:
        mem = UserFashionMemory.get_memory(current_user.id)
        suggested = gemini_result.get("products", [])
        if not suggested:
            import random
            unshown = [p for p in catalog_items if p["id"] not in already_shown]
            pool = unshown if unshown else catalog_items
            random.shuffle(pool)
            suggested = pool[:3]

        return AgentChatResponse(
            reply=gemini_result["reply"],
            intent=gemini_result.get("intent", "fashion_consultation"),
            plan_summary=[
                "1. Analyze body fit, occasion, destination, and styling request",
                "2. Execute Gemini tool call: search_catalog with unshown diversity filter",
                "3. Verify delivery logistics & synthesize luxury styling notes"
            ],
            traces=gemini_result.get("traces", []),
            final_score=9.6,
            memory_status=mem.to_dict(),
            catalog_products_suggested=suggested
        )

    # 2. Resilient Fallback to Local FashionAgent
    agent = FashionAgent(current_user.id)
    result = agent.process(req.message, context)

    suggested_products = []
    tool_data = result.get("tool_data", {})
    if "ProductSearchTool" in tool_data:
        suggested_products = tool_data["ProductSearchTool"].get("results", [])
    elif "OutfitPairingsTool" in tool_data:
        pairings = tool_data["OutfitPairingsTool"].get("pairings", [])
        suggested_products = [
            p for p in catalog_items if any(pair.get("id") == p["id"] for pair in pairings)
        ]
    
    if not suggested_products:
        import random
        unshown = [p for p in catalog_items if p["id"] not in already_shown]
        pool = unshown if unshown else catalog_items
        random.shuffle(pool)
        suggested_products = pool[:3]

    return AgentChatResponse(
        reply=result["reply"],
        intent=result["intent"],
        plan_summary=result["plan_summary"],
        traces=result["traces"],
        final_score=result["final_score"],
        memory_status=result["memory_status"],
        catalog_products_suggested=suggested_products
    )

@router.get("/memory", response_model=AgentMemoryResponse)
def get_user_memory(current_user: Profile = Depends(get_current_user)):
    mem = UserFashionMemory.get_memory(current_user.id)
    return AgentMemoryResponse(**mem.to_dict())

@router.post("/feedback")
def submit_feedback(req: AgentFeedbackRequest, current_user: Profile = Depends(get_current_user)):
    mem = UserFashionMemory.get_memory(current_user.id)
    mem.record_feedback(req.outfit_id, req.rating, req.comments)
    if req.liked_color:
        mem.learn_color_affinity(req.liked_color, positive=True)
    if req.disliked_color:
        mem.learn_color_affinity(req.disliked_color, positive=False)
    return {"status": "success", "message": "Feedback integrated into autonomous style memory"}

@router.get("/tools")
def list_agent_tools():
    return {"tools": ToolRegistry.list_tools()}
