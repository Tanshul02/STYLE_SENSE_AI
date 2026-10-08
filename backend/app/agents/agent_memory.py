"""
StyleSense AI - User Fashion Memory
"""
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

class UserFashionMemory:
    _instances: Dict[str, "UserFashionMemory"] = {}

    def __init__(self, user_id: str):
        self.user_id = user_id
        self.preferred_styles: List[str] = ["Smart Casual", "Minimalist"]
        self.preferred_colors: List[str] = ["Black", "Navy", "Cream", "Terracotta"]
        self.avoided_colors: List[str] = ["Neon Green", "Hot Pink"]
        self.body_silhouette_pref: str = "Tailored Clean"
        self.past_feedback: List[Dict[str, Any]] = []
        self.last_updated = datetime.now(timezone.utc)

    @classmethod
    def get_memory(cls, user_id: str) -> "UserFashionMemory":
        if user_id not in cls._instances:
            cls._instances[user_id] = cls(user_id)
        return cls._instances[user_id]

    def record_feedback(self, outfit_id: str, rating: float, comments: Optional[str] = None):
        self.past_feedback.append({
            "outfit_id": outfit_id,
            "rating": rating,
            "comments": comments,
            "timestamp": datetime.now(timezone.utc).isoformat()
        })
        self.last_updated = datetime.now(timezone.utc)

    def learn_color_affinity(self, color: str, positive: bool = True):
        if positive and color not in self.preferred_colors:
            self.preferred_colors.append(color)
        elif not positive and color not in self.avoided_colors:
            self.avoided_colors.append(color)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "user_id": self.user_id,
            "preferred_styles": self.preferred_styles,
            "preferred_colors": self.preferred_colors,
            "avoided_colors": self.avoided_colors,
            "body_silhouette_pref": self.body_silhouette_pref,
            "feedback_count": len(self.past_feedback),
            "last_updated": self.last_updated.isoformat()
        }
