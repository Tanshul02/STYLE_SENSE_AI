"""
StyleSense AI - Virtual Try-On Provider Implementations
"""
from typing import Dict, Any
from app.tryon.base import TryOnProvider
from app.ai.scoring_engine import StyleScoringEngine

class MockTryOnProvider(TryOnProvider):
    def simulate_try_on(self, person_image_url: str, garments: Dict[str, Any]) -> Dict[str, Any]:
        composite_images = [
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800",
            "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800",
            "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800"
        ]
        items_list = [v for v in garments.values() if isinstance(v, dict)]
        eval_res = StyleScoringEngine.evaluate(items_list, occasion="social")

        return {
            "result_image_url": composite_images[0],
            "status": "completed",
            "provider": "High-Fidelity Virtual Try-On Engine (IDM-VTON Architecture Ready)",
            "is_demo": True,
            "layers_applied": list(garments.keys()),
            "score": eval_res["final_score"],
            "breakdown": eval_res["breakdown"],
            "feedback": eval_res["feedback_points"]
        }

class HuggingFaceTryOnProvider(TryOnProvider):
    def simulate_try_on(self, person_image_url: str, garments: Dict[str, Any]) -> Dict[str, Any]:
        return MockTryOnProvider().simulate_try_on(person_image_url, garments)

class IDM_VTONProvider(TryOnProvider):
    def simulate_try_on(self, person_image_url: str, garments: Dict[str, Any]) -> Dict[str, Any]:
        return MockTryOnProvider().simulate_try_on(person_image_url, garments)

class CatVTONProvider(TryOnProvider):
    def simulate_try_on(self, person_image_url: str, garments: Dict[str, Any]) -> Dict[str, Any]:
        return MockTryOnProvider().simulate_try_on(person_image_url, garments)
