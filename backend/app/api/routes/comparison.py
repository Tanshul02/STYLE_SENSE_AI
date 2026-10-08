"""
StyleSense AI - Head-to-Head Look Comparison Router
"""
from fastapi import APIRouter
from app.ai.scoring_engine import StyleScoringEngine
from app.schemas.schemas import LookComparisonRequest, LookComparisonResponse

router = APIRouter(prefix="/api/compare-looks", tags=["Look Comparison"])

@router.post("", response_model=LookComparisonResponse)
def compare_looks(req: LookComparisonRequest):
    eval_a = StyleScoringEngine.evaluate(req.look_a_items, req.occasion)
    eval_b = StyleScoringEngine.evaluate(req.look_b_items, req.occasion)

    score_a = eval_a["final_score"]
    score_b = eval_b["final_score"]

    winner = "Look A" if score_a >= score_b else "Look B"
    winner_name = req.look_a_name if winner == "Look A" else req.look_b_name
    diff = abs(round(score_a - score_b, 1))

    reasoning = (
        f"{winner} takes the lead with superior coordination (+{diff} pts). "
        f"Its chromatic balance and proportion synergy deliver higher visual impact for {req.occasion}."
    )

    key_differences = [
        f"Look A Occasion Score: {eval_a['breakdown']['occasion_match']} vs Look B: {eval_b['breakdown']['occasion_match']}",
        f"Look A Color Harmony: {eval_a['breakdown']['color_harmony']} vs Look B: {eval_b['breakdown']['color_harmony']}",
        f"Look A Style Synergy: {eval_a['breakdown']['style_compatibility']} vs Look B: {eval_b['breakdown']['style_compatibility']}"
    ]

    return LookComparisonResponse(
        score_a=score_a,
        score_b=score_b,
        breakdown_a=eval_a["breakdown"],
        breakdown_b=eval_b["breakdown"],
        winner=winner,
        winner_name=winner_name,
        reasoning=reasoning,
        key_differences=key_differences
    )
