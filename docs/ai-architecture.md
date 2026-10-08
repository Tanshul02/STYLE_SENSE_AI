# StyleSense AI — Artificial Intelligence Architecture

## Multi-Criteria Hybrid Scoring Engine

### Mathematical Formula:
$$\text{Final Score} = 0.30 \cdot S_{\text{occasion}} + 0.25 \cdot S_{\text{style}} + 0.20 \cdot S_{\text{color}} + 0.15 \cdot S_{\text{weather}} + 0.10 \cdot S_{\text{pref}}$$

Where:
* **$S_{\text{occasion}}$ (30%)**: Evaluates category formality against occasion expectations (e.g. Blazers & Oxford Shirts for College Farewell or Formal Meetings).
* **$S_{\text{style}}$ (25%)**: Evaluates style semantics using vector cosine similarity against aesthetic categories (Elegant, Minimalist, Streetwear).
* **$S_{\text{color}}$ (20%)**: Evaluates color coordination based on classical palette theory and neutral anchoring (Black, Ivory, Navy, Beige).
* **$S_{\text{weather}}$ (15%)**: Evaluates temperature and meteorological conditions ($< 16^\circ\text{C}$ prioritizes wool coats and layered knitwear).
* **$S_{\text{pref}}$ (10%)**: Measures alignment with the user's onboarded favorite styles and goals.

## Vector Embeddings & Semantic Search
The `EmbeddingService` generates dense vector representations from garment names, categories, colors, and styling descriptions.

```text
User Query ("Minimalist elegant outfit for formal farewell")
                     │
                     ▼
             EmbeddingService
                     │
                     ▼
          Semantic Query Vector
                     │
                     ▼
             Cosine Similarity
                     │
                     ▼
           Ranked Outfit Items
```

## Conversational Fashion Bestie Architecture
Implemented via `AIProviderFactory`, allowing dynamic runtime selection of:
1. `HuggingFaceProvider` (Inference API integration)
2. `OpenAIProvider` (Architecture ready)
3. `MockProvider` (High-fidelity local reasoning engine with wardrobe prioritization)
