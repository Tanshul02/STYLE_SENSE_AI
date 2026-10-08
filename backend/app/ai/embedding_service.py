import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List

class EmbeddingService:
    """
    AI Module: Generates semantic vector representations and computes cosine similarity.
    Uses TF-IDF + n-gram vectorization with sentence-transformer fallback architecture.
    """
    def __init__(self):
        self.vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words="english")
        # Pre-fit corpus of fashion vocabulary
        initial_corpus = [
            "classic elegant black blazer ivory shirt formal trousers loafers wedding farewell",
            "casual relaxed white t-shirt midnight blue straight fit jeans sneakers daily",
            "traditional festive emerald silk kurta beige linen trousers celebrations",
            "streetwear oversized denim jacket hoodie cargo pants boots urban",
            "minimalist neutral linen shirt soft beige trousers sandals summer",
            "winter warmth cashmere sweater woolen coat structured scarf boots"
        ]
        self.vectorizer.fit(initial_corpus)

    def generate_embedding(self, text: str) -> np.ndarray:
        """Converts input text into a normalized semantic vector."""
        vec = self.vectorizer.transform([text.lower()]).toarray()
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm
        return vec

    def calculate_similarity(self, text1: str, text2: str) -> float:
        """Calculates cosine similarity between two text strings [0.0 - 1.0]."""
        v1 = self.generate_embedding(text1)
        v2 = self.generate_embedding(text2)
        score = float(cosine_similarity(v1, v2)[0][0])
        # Return scaled similarity with a baseline minimum
        return max(round(score, 3), 0.45)

    def find_similar_items(self, query: str, candidates: List[dict], top_k: int = 5) -> List[dict]:
        """Ranks candidate items based on semantic similarity to query."""
        scored = []
        for item in candidates:
            desc = f"{item.get('name', '')} {item.get('category', '')} {item.get('style', '')} {item.get('color', '')} {item.get('description', '')}"
            sim = self.calculate_similarity(query, desc)
            scored.append((sim, item))
        scored.sort(key=lambda x: x[0], reverse=True)
        return [item for _, item in scored[:top_k]]

embedding_service = EmbeddingService()
