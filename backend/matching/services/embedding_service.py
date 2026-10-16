from sentence_transformers import SentenceTransformer


MODEL_NAME = "all-MiniLM-L6-v2"


_model = None


def get_embedding_model():
    """
    Load the Sentence Transformer model only once.
    """

    global _model

    if _model is None:
        _model = SentenceTransformer(MODEL_NAME)

    return _model


def generate_embedding(text):
    """
    Generate an embedding vector for the given text.
    """

    if not text or not text.strip():
        return []

    model = get_embedding_model()

    embedding = model.encode(
        text,
        normalize_embeddings=True
    )

    return embedding.tolist()