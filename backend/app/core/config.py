from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    APP_NAME: str = "StyleSense AI"
    APP_ENV: str = "development"
    SECRET_KEY: str = "stylesense_super_secret_jwt_key_demo_2026_fashion_ai"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    DATABASE_URL: str = "sqlite:///./stylesense.db"
    
    # Supabase Cloud Integration
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    
    # AI Providers
    AI_PROVIDER: str = "gemini"  # gemini, openai, huggingface, mock
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    HUGGINGFACE_API_KEY: str = ""
    TRYON_API_KEY: str = ""
    
    # Weather
    WEATHER_PROVIDER: str = "mock"
    WEATHER_API_KEY: str = ""
    
    STORAGE_PROVIDER: str = "local"
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

@lru_cache()
def get_settings() -> Settings:
    """Singleton pattern implementation for global settings."""
    return Settings()
