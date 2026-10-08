import logging
from typing import Optional
from app.core.config import get_settings
from app.ai.llm_provider import LLMProvider, MockProvider, HuggingFaceProvider, OpenAIProvider, GeminiProvider

logger = logging.getLogger("AIProviderFactory")

class AIProviderFactory:
    """
    Factory Pattern:
    Encapsulates creation and dynamic selection of LLM and AI reasoning providers.
    Ensures seamless fallback to MockProvider when external cloud APIs are unavailable.
    """
    @staticmethod
    def get_provider(provider_type: Optional[str] = None) -> LLMProvider:
        settings = get_settings()
        selected = (provider_type or settings.AI_PROVIDER).lower()
        
        # 1. Google Gemini 1.5 Flash
        if (selected == "gemini" or not selected or selected == "auto") and settings.GEMINI_API_KEY:
            try:
                return GeminiProvider(api_key=settings.GEMINI_API_KEY)
            except Exception as e:
                logger.warning(f"Failed to initialize Gemini provider ({e}), falling back.")
        
        # 2. OpenAI GPT-4o-mini
        if selected == "openai" and settings.OPENAI_API_KEY:
            try:
                return OpenAIProvider(api_key=settings.OPENAI_API_KEY)
            except Exception as e:
                logger.warning(f"Failed to initialize OpenAI provider ({e}), falling back.")
                
        # 3. HuggingFace Inference
        if selected == "huggingface" and settings.HUGGINGFACE_API_KEY:
            try:
                return HuggingFaceProvider(api_key=settings.HUGGINGFACE_API_KEY)
            except Exception as e:
                logger.warning(f"Failed to initialize HuggingFace provider ({e}), falling back.")
                
        # 4. High-Fashion Expert Local Autonomous Fallback
        return MockProvider()
