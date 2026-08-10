"""
SAi (Sudan AI) Platform Configuration Module
Python 3.12+ FastAPI Application Settings
"""

import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SAi - Sudan AI Platform"
    VERSION: str = "2.5.0"
    API_V1_STR: str = "/api/v1"
    
    # Environment & Security
    ENV: str = os.getenv("NODE_ENV", "production")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    ELEVENLABS_API_KEY: str = os.getenv("ELEVENLABS_API_KEY", "")
    APP_URL: str = os.getenv("APP_URL", "https://sudan-ai.vercel.app")
    
    # Developer Contact Info
    DEVELOPER_NAME: str = "Kamal Gafar Zakaria"
    DEVELOPER_EMAIL: str = "mekoogk@gmail.com"
    DEVELOPER_WHATSAPP: str = "00249919980435"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
