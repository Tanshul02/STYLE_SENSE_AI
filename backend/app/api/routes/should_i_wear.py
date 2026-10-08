"""
StyleSense AI - Should I Wear This Router
"""
from fastapi import APIRouter
from app.ai.scoring_engine import StyleScoringEngine
from app.ai.variation_generator import OutfitVariationGenerator
from app.schemas.schemas import ShouldIWearRequest, ShouldIWearResponse

router = APIRouter(prefix="/api/should-i-wear-this", tags=["Should I Wear This"])

@router.post("", response_model=ShouldIWearResponse)
def review_outfit(req: ShouldIWearRequest):
    eval_res = StyleScoringEngine.evaluate(req.items, req.occasion, req.weather or "moderate")
    score = eval_res["final_score"]

    if score >= 9.0:
        verdict = "STUNNING EDITORIAL MATCH"
    elif score >= 7.8:
        verdict = "APPROVED WITH REFINED TWEAKS"
    else:
        verdict = "CONSIDER STYLING REVISION"

    strengths = [
        "Proportions harmonize cleanly across garments.",
        "Color scheme creates pleasant focal balance."
    ]
    improvements = [
        "Incorporate a textured leather accessory to sharpen definition.",
        "Ensure footwear formality strictly aligns with event protocol."
    ]

    variations = OutfitVariationGenerator.generate_variations(req.items, req.occasion, req.weather or "moderate")
    elevated = variations[0] if variations else None

    return ShouldIWearResponse(
        verdict=verdict,
        score=score,
        stars=eval_res["stars"],
        breakdown=eval_res["breakdown"],
        strengths=strengths,
        improvements=improvements,
        elevated_variation=elevated
    )
