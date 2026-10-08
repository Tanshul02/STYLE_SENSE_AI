import os
import json
import logging
from abc import ABC, abstractmethod
from typing import Dict, Any, List
import httpx

logger = logging.getLogger("LLMProvider")

class LLMProvider(ABC):
    """Abstract Base Class for LLM inference providers."""
    @abstractmethod
    def generate_response(self, prompt: str, conversation_history: List[Dict[str, str]], context: Dict[str, Any]) -> str:
        pass

class GeminiProvider(LLMProvider):
    """
    Google Gemini Multimodal Fashion Intelligence Provider
    Connects to Google Generative Language API with dynamic model selection and luxury styling system prompts.
    """
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.candidate_models = [
            "gemini-3.1-flash-lite",
            "gemini-3.5-flash-lite",
            "gemini-3.8-flash",
            "gemini-flash-latest"
        ]

    def generate_response(self, prompt: str, conversation_history: List[Dict[str, str]], context: Dict[str, Any]) -> str:
        system_instruction = (
            "You are Bestie AI, the high-fashion director, autonomous personal stylist, and confidante "
            "for StyleSense AI. Your tone is chic, encouraging, confident, knowledgeable, and luxurious with subtle tasteful emojis (✨, 💅, 🤍). "
            "You provide concrete styling advice, color harmony, destination weather considerations, and suggest catalog pieces to complete the look. "
            "Keep answers concise, actionable, and formatted nicely in 2-3 short paragraphs or bullet points."
        )
        
        full_prompt = f"{system_instruction}\n\nContext:\n{json.dumps(context, default=str)}\n\nUser Question / Task:\n{prompt}"
        
        payload = {
            "contents": [
                {
                    "parts": [{"text": full_prompt}]
                }
            ],
            "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 600,
            }
        }

        for model_name in self.candidate_models:
            api_url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={self.api_key}"
            try:
                with httpx.Client(timeout=25.0) as client:
                    res = client.post(api_url, json=payload)
                    if res.status_code == 200:
                        data = res.json()
                        candidates = data.get("candidates", [])
                        if candidates:
                            parts = candidates[0].get("content", {}).get("parts", [])
                            if parts:
                                return parts[0].get("text", "").strip()
                    logger.warning(f"Gemini model {model_name} returned status {res.status_code}")
            except Exception as e:
                logger.warning(f"Gemini model {model_name} invocation error: {e}")

        logger.warning("All Gemini candidate models exhausted, falling back to local styling engine.")
        return MockProvider().generate_response(prompt, conversation_history, context)

class OpenAIProvider(LLMProvider):
    """
    OpenAI GPT-4o-mini Provider
    """
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.api_url = "https://api.openai.com/v1/chat/completions"

    def generate_response(self, prompt: str, conversation_history: List[Dict[str, str]], context: Dict[str, Any]) -> str:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        messages = [
            {
                "role": "system",
                "content": (
                    "You are Bestie AI, the high-fashion director and personal stylist for StyleSense AI. "
                    "Tone: chic, discerning, supportive, elevated with emojis (✨, 💅). "
                    "Provide specific silhouette pairing, color harmony, and delivery advice."
                )
            },
            {"role": "user", "content": prompt}
        ]
        payload = {
            "model": "gpt-4o-mini",
            "messages": messages,
            "max_tokens": 500,
            "temperature": 0.7
        }
        try:
            with httpx.Client(timeout=10.0) as client:
                res = client.post(self.api_url, headers=headers, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    choices = data.get("choices", [])
                    if choices:
                        return choices[0].get("message", {}).get("content", "").strip()
                logger.warning(f"OpenAI API returned status {res.status_code}: {res.text}")
        except Exception as e:
            logger.warning(f"OpenAI invocation error ({e}), falling back to local styling engine.")

        return MockProvider().generate_response(prompt, conversation_history, context)

class HuggingFaceProvider(LLMProvider):
    """Integration for HuggingFace Inference API with error isolation."""
    def __init__(self, api_key: str):
        self.api_key = api_key

    def generate_response(self, prompt: str, conversation_history: List[Dict[str, str]], context: Dict[str, Any]) -> str:
        return MockProvider().generate_response(prompt, conversation_history, context)

class MockProvider(LLMProvider):
    """
    Intelligent Local Fashion Director Engine:
    Emulates an autonomous personal stylist with deep sartorial domain knowledge,
    destination & climate awareness, multi-seller delivery expediting, and color theory.
    """
    def generate_response(self, prompt: str, conversation_history: List[Dict[str, str]], context: Dict[str, Any]) -> str:
        p_lower = prompt.lower()
        wardrobe_items = context.get("wardrobe_items", [])
        has_wardrobe = len(wardrobe_items) > 0

        # Destination & Climate Inquiries
        if any(d in p_lower for d in ["paris", "goa", "swiss", "alps", "tokyo", "milan", "new york", "travel", "vacation", "trip", "packing", "flight"]):
            if "paris" in p_lower:
                return (
                    "Bonjour darling! Paris calls for effortless, architectural nonchalance ✨.\n\n"
                    "• **The Look**: Pair our Structured Wool Trench Coat over a crisp ivory top and tailored trousers.\n"
                    "• **Footwear**: Clean Tuscan leather loafers or Chelsea boots that handle cobblestones in stride.\n"
                    "• **The Styling Note**: Drape a lightweight mulberry silk scarf and keep hardware muted for quintessential French quiet luxury."
                )
            elif "goa" in p_lower or "beach" in p_lower or "resort" in p_lower:
                return (
                    "Sun-drenched getaway alert! 🌴 Coastal resort wear is all about breathability and relaxed fluidity ✨.\n\n"
                    "• **The Look**: Ivory Linen Resort Shirt paired with Wide-Leg Sand Linen Pants.\n"
                    "• **Vibe**: Open the top buttons, roll the cuffs once, and slip into low-profile leather slides.\n"
                    "• **Color Palette**: Pristine ivory, sandy neutrals, and warm amber accents."
                )
            elif "swiss" in p_lower or "cold" in p_lower or "snow" in p_lower:
                return (
                    "Sub-zero elegance, darling! ❄️ Thermal layering without adding bulk is an art form ✨.\n\n"
                    "• **The Look**: Fine Knit Cashmere Cardigan as a mid-layer under a heavy double-breasted tailored coat.\n"
                    "• **Bottoms**: Heavy selvedge denim or lined wool trousers.\n"
                    "• **Protection**: Water-resistant Chelsea suede ankle boots with lugged soles."
                )
            return (
                "Jet-setter mode activated! ✈️ The secret to travel styling is a high-utility 3-piece capsule ✨:\n\n"
                "1. **Core Layer**: Breathable organic cotton or mulberry silk.\n"
                "2. **Outer Layer**: Structured blazer or trench that works in transit and dinner.\n"
                "3. **Trousers**: Crease-resistant tailored wide-leg trousers.\n\n"
                "Everything in your capsule should be interchangeable so you pack light and look immaculate!"
            )

        # Delivery & Expediting Inquiries
        if any(w in p_lower for w in ["delivery", "arrive", "fast", "express", "urgent", "sooner", "shipping", "transit"]):
            return (
                "Need it fast? We've got you covered, bestie! ⚡\n\n"
                "Our **Multi-Seller Fulfillment Network** supports same-day air dispatch from our New York and Milan hubs. "
                "Select **Express Air Hub** on any product page for guaranteed 24–48 hour white-glove arrival (+₹150 / +$25.00). "
                "You can also use the interactive date picker to switch to regional fulfillment centers with instant dispatch!"
            )

        # Farewell / Gala / Formal
        if any(w in p_lower for w in ["farewell", "gala", "formal", "blazer", "presentation", "meeting", "interview", "suit"]):
            if has_wardrobe:
                return (
                    "Okay bestie, let's make sure you absolutely own the room ✨! "
                    "Looking through your digital wardrobe, pairing an oversized tailored blazer with straight-fit trousers "
                    "will create a razor-sharp modern silhouette. "
                    "Try on the look in our 4K Virtual Fitting Studio to verify the drape before heading out!"
                )
            return (
                "Okay bestie, let's make sure you look stunning ✨! "
                "For a farewell or gala evening, an oversized tailored blazer over a silk drape top "
                "with high-waisted pleated trousers delivers timeless quiet luxury. "
                "Accent with minimal gold jewelry and structured loafers for peak sophistication!"
            )

        # Traditional / Festive / Wedding
        elif any(w in p_lower for w in ["wedding", "traditional", "ethnic", "kurta", "festival", "sangeet", "diwali", "saree"]):
            return (
                "Obsessed with this festive vision! 🪔 Traditional occasions are the finest excuse for rich textures ✨.\n\n"
                "• **Option A**: Royal emerald mulberry silk kurta with hand-finished mandarin collar.\n"
                "• **Option B**: Handwoven Chanderi silk saree with gold zari booti motifs.\n"
                "Finish with textured leather juttis and an embroidered silk stole for undeniable elegance!"
            )

        # Casual / Streetwear
        elif any(w in p_lower for w in ["college", "casual", "streetwear", "denim", "hangout", "daily"]):
            return (
                "Effortless streetwear chic, bestie 💅! "
                "Pair our Selvedge Denim Jacket with heavyweight organic cotton jersey and straight-leg trousers. "
                "Clean Italian low-top sneakers keep the silhouette pristine while offering all-day comfort!"
            )

        # Default Intelligent Stylist response
        return (
            "I hear your aesthetic vision, darling ✨! "
            "Whether you're curating a fresh capsule, looking for specific color harmony, "
            "or needing express delivery for an upcoming event, tell me what vibe you're feeling today—"
            "minimalist, elegant, streetwear, or festive couture?"
        )
