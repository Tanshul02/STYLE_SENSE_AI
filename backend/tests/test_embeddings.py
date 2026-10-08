from app.ai.embedding_service import embedding_service

def test_embedding_generation():
    vec = embedding_service.generate_embedding("classic formal black blazer")
    assert vec is not None
    assert vec.shape[0] == 1

def test_cosine_similarity_matching():
    score_high = embedding_service.calculate_similarity(
        "formal college farewell elegant look",
        "black oversized blazer and ivory formal trousers"
    )
    score_diff = embedding_service.calculate_similarity(
        "formal college farewell elegant look",
        "neon swimsuit and flip flops"
    )
    assert score_high >= score_diff
