"""
StyleSense AI - Virtual Try-On Provider Factory
"""
from app.tryon.base import TryOnProvider
from app.tryon.providers import MockTryOnProvider, HuggingFaceTryOnProvider, IDM_VTONProvider, CatVTONProvider

class TryOnProviderFactory:
    @staticmethod
    def get_provider(provider_type: str = "mock") -> TryOnProvider:
        p = provider_type.lower()
        if "huggingface" in p:
            return HuggingFaceTryOnProvider()
        elif "idm" in p:
            return IDM_VTONProvider()
        elif "catvton" in p:
            return CatVTONProvider()
        return MockTryOnProvider()
