"""
EduPath Real-Time Analytics Backend
Main FastAPI application with real-time analytics, AI integration, and LMS connectivity
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
import asyncio
import json
import logging
from typing import List, Dict, Any, Optional
import uvicorn
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

# Import our modules
from app.core.config import settings
from app.core.database import engine, SessionLocal
from app.core.redis_client import redis_client
from app.models import Base
from app.api.routes import analytics, recommendations, predictions, integrations, websocket_routes
from app.api.routes.realtime_analytics import router as realtime_router
from app.services.gemini_service import GeminiService
from app.services.analytics_service import AnalyticsService
from app.services.websocket_manager import WebSocketManager
from app.services.realtime_analytics import RealTimeAnalyticsService
from app.services.google_classroom_service import GoogleClassroomService
from app.services.background_tasks import start_background_tasks

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize services
websocket_manager = WebSocketManager()
analytics_service = AnalyticsService()
gemini_service = GeminiService()
realtime_analytics_service = RealTimeAnalyticsService()
classroom_service = GoogleClassroomService()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    logger.info("Starting EduPath Analytics Backend...")
    
    # Create database tables
    Base.metadata.create_all(bind=engine)
    
    # Initialize Redis connection
    await redis_client.ping()
    logger.info("Redis connection established")
    
    # Start background tasks
    asyncio.create_task(start_background_tasks())
    
    # Initialize AI services
    await gemini_service.initialize()
    logger.info("Gemini AI service initialized")
    
    # Initialize real-time analytics
    await realtime_analytics_service.initialize()
    logger.info("Real-time analytics service initialized")
    
    # Initialize Google Classroom integration
    await classroom_service.initialize()
    logger.info("Google Classroom service initialized")
    
    yield
    
    # Shutdown
    logger.info("Shutting down EduPath Analytics Backend...")
    await redis_client.close()

# Create FastAPI app
app = FastAPI(
    title="EduPath Analytics API",
    description="Real-time analytics and AI-powered recommendations for educational platforms",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Validate JWT token and return user info"""
    # TODO: Implement JWT validation
    return {"user_id": "user123", "role": "admin"}

# Include API routes
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["Analytics"])
app.include_router(recommendations.router, prefix="/api/v1/recommendations", tags=["Recommendations"])
app.include_router(predictions.router, prefix="/api/v1/predictions", tags=["Predictions"])
app.include_router(integrations.router, prefix="/api/v1/integrations", tags=["Integrations"])
app.include_router(realtime_router, prefix="/api/v1/realtime-analytics", tags=["Real-time Analytics"])

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "EduPath Analytics API",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    try:
        # Check database
        db = SessionLocal()
        db.execute("SELECT 1")
        db.close()
        db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
    
    try:
        # Check Redis
        await redis_client.ping()
        redis_status = "healthy"
    except Exception as e:
        redis_status = f"unhealthy: {str(e)}"
    
    return {
        "status": "running",
        "database": db_status,
        "redis": redis_status,
        "timestamp": datetime.utcnow().isoformat()
    }

# WebSocket endpoint for real-time analytics
@app.websocket("/ws/analytics/{user_id}")
async def websocket_analytics(websocket: WebSocket, user_id: str, role: str = "student"):
    """WebSocket endpoint for real-time analytics updates"""
    await websocket_manager.connect(websocket, user_id, role)
    try:
        while True:
            # Keep connection alive and handle incoming messages
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Process different message types
            if message.get("type") == "subscribe":
                # Subscribe to specific analytics channels
                channels = message.get("channels", [])
                await websocket_manager.subscribe_to_channels(user_id, channels)
                
            elif message.get("type") == "track_event":
                # Track user events in real-time
                event_data = message.get("data", {})
                await realtime_analytics_service.track_live_event(user_id, event_data)
                
    except WebSocketDisconnect:
        websocket_manager.disconnect(user_id)
        logger.info(f"WebSocket disconnected for user: {user_id}")

# Real-time event tracking endpoint
@app.post("/api/v1/events/track")
async def track_event(
    event_data: Dict[str, Any],
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user)
):
    """Track user events for real-time analytics"""
    background_tasks.add_task(
        analytics_service.process_event,
        current_user["user_id"],
        event_data
    )
    return {"status": "event_tracked", "timestamp": datetime.utcnow().isoformat()}

# Gemini AI integration endpoint
@app.post("/api/v1/ai/generate-insights")
async def generate_ai_insights(
    query: Dict[str, Any],
    current_user: dict = Depends(get_current_user)
):
    """Generate AI-powered insights using Gemini"""
    try:
        insights = await gemini_service.generate_insights(
            query.get("prompt", ""),
            query.get("context", {}),
            current_user["user_id"]
        )
        return {"insights": insights, "timestamp": datetime.utcnow().isoformat()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

# Smart recommendations endpoint
@app.get("/api/v1/recommendations/{user_id}")
async def get_smart_recommendations(
    user_id: str,
    limit: int = 10,
    current_user: dict = Depends(get_current_user)
):
    """Get AI-powered smart recommendations for a user"""
    try:
        recommendations = await gemini_service.get_smart_recommendations(
            user_id, limit
        )
        return {
            "recommendations": recommendations,
            "user_id": user_id,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation service error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )