"""
StyleSense AI - Virtual Try-On Strategy Interface
"""
from abc import ABC, abstractmethod
from typing import Dict, Any

class TryOnProvider(ABC):
    @abstractmethod
    def simulate_try_on(self, person_image_url: str, garments: Dict[str, Any]) -> Dict[str, Any]:
        pass
