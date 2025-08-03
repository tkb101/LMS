"""
Configuration settings for the EduPath Analytics Backend
"""

from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    """Application settings"""
    
    # Application
    APP_NAME: str = "EduPath Analytics API"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/edupath_analytics"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # AI Services
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    
    # Security
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # External Integrations
    GOOGLE_CLASSROOM_CLIENT_ID: Optional[str] = None
    GOOGLE_CLASSROOM_CLIENT_SECRET: Optional[str] = None
    MOODLE_API_URL: Optional[str] = None
    MOODLE_API_TOKEN: Optional[str] = None
    BLACKBOARD_API_URL: Optional[str] = None
    BLACKBOARD_API_KEY: Optional[str] = None
    
    # Analytics
    ANALYTICS_BATCH_SIZE: int = 100
    ANALYTICS_PROCESSING_INTERVAL: int = 60  # seconds
    
    # WebSocket
    WEBSOCKET_HEARTBEAT_INTERVAL: int = 30  # seconds
    
    # Background Tasks
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"
    
    # Monitoring
    ENABLE_METRICS: bool = True
    METRICS_PORT: int = 8001
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create settings instance
settings = Settings()

# Validate required settings
if not settings.GEMINI_API_KEY:
    print("Warning: GEMINI_API_KEY not set. AI features will be limited.")

if settings.DEBUG:
    print(f"Running in DEBUG mode")
    print(f"Database URL: {settings.DATABASE_URL}")
    print(f"Redis URL: {settings.REDIS_URL}")