"""
Real-time Analytics API Routes
Provides endpoints for live analytics data and real-time updates
"""

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query
from typing import Dict, List, Any, Optional
from datetime import datetime
import logging

from app.services.realtime_analytics import RealTimeAnalyticsService
from app.services.google_classroom_service import GoogleClassroomService
from app.core.database import get_db
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)
router = APIRouter()

# Initialize services
realtime_service = RealTimeAnalyticsService()
classroom_service = GoogleClassroomService()

@router.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    await realtime_service.initialize()
    await classroom_service.initialize()

@router.post("/track-event")
async def track_live_event(
    event_data: Dict[str, Any],
    background_tasks: BackgroundTasks,
    user_id: str = Query(..., description="User ID"),
    db: Session = Depends(get_db)
):
    """Track a live user event for real-time analytics"""
    try:
        background_tasks.add_task(
            realtime_service.track_live_event,
            user_id,
            event_data
        )
        
        return {
            "status": "success",
            "message": "Event tracked successfully",
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error tracking live event: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to track event: {str(e)}")

@router.get("/dashboard/{user_id}")
async def get_live_dashboard(
    user_id: str,
    role: str = Query("student", description="User role"),
    db: Session = Depends(get_db)
):
    """Get live dashboard data for a user"""
    try:
        dashboard_data = await realtime_service.get_live_dashboard_data(user_id, role)
        
        return {
            "status": "success",
            "data": dashboard_data,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error getting live dashboard: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get dashboard data: {str(e)}")

@router.get("/engagement-metrics")
async def get_realtime_engagement(
    timeframe: str = Query("1h", description="Timeframe (e.g., 1h, 6h, 1d)"),
    db: Session = Depends(get_db)
):
    """Get real-time engagement metrics"""
    try:
        metrics = await realtime_service.get_realtime_engagement_metrics(timeframe)
        
        return {
            "status": "success",
            "metrics": metrics,
            "timeframe": timeframe,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error getting engagement metrics: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get engagement metrics: {str(e)}")

@router.get("/progress-tracking")
async def get_live_progress(
    user_id: Optional[str] = Query(None, description="Specific user ID (optional)"),
    db: Session = Depends(get_db)
):
    """Get live progress tracking data"""
    try:
        progress_data = await realtime_service.get_live_progress_tracking(user_id)
        
        return {
            "status": "success",
            "data": progress_data,
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error getting progress tracking: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get progress data: {str(e)}")

@router.get("/predictive-alerts")
async def get_predictive_alerts(
    user_id: Optional[str] = Query(None, description="Specific user ID (optional)"),
    db: Session = Depends(get_db)
):
    """Get predictive analytics alerts"""
    try:
        alerts = await realtime_service.get_predictive_alerts(user_id)
        
        return {
            "status": "success",
            "alerts": alerts,
            "count": len(alerts),
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error getting predictive alerts: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get alerts: {str(e)}")

# Google Classroom Integration Endpoints

@router.post("/integrations/google-classroom/sync-courses")
async def sync_classroom_courses(
    user_id: str = Query(..., description="User ID"),
    db: Session = Depends(get_db)
):
    """Sync courses from Google Classroom"""
    try:
        result = await classroom_service.sync_courses(user_id)
        
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error syncing classroom courses: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to sync courses: {str(e)}")

@router.post("/integrations/google-classroom/sync-assignments/{course_id}")
async def sync_classroom_assignments(
    course_id: str,
    user_id: str = Query(..., description="User ID"),
    db: Session = Depends(get_db)
):
    """Sync assignments from a Google Classroom course"""
    try:
        result = await classroom_service.sync_assignments(course_id, user_id)
        
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error syncing assignments: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to sync assignments: {str(e)}")

@router.post("/integrations/google-classroom/sync-submissions/{course_id}/{assignment_id}")
async def sync_classroom_submissions(
    course_id: str,
    assignment_id: str,
    db: Session = Depends(get_db)
):
    """Sync student submissions for an assignment"""
    try:
        result = await classroom_service.sync_student_submissions(course_id, assignment_id)
        
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error syncing submissions: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to sync submissions: {str(e)}")

@router.get("/integrations/google-classroom/analytics/{course_id}")
async def get_classroom_analytics(
    course_id: str,
    timeframe: str = Query("7d", description="Timeframe (e.g., 7d, 30d)"),
    db: Session = Depends(get_db)
):
    """Get analytics data from Google Classroom"""
    try:
        analytics = await classroom_service.get_classroom_analytics(course_id, timeframe)
        
        if "error" in analytics:
            raise HTTPException(status_code=400, detail=analytics["error"])
        
        return analytics
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting classroom analytics: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get analytics: {str(e)}")

@router.post("/integrations/google-classroom/export-analytics/{course_id}")
async def export_analytics_to_classroom(
    course_id: str,
    analytics_data: Dict[str, Any],
    db: Session = Depends(get_db)
):
    """Export analytics data to Google Classroom"""
    try:
        result = await classroom_service.export_analytics_to_classroom(course_id, analytics_data)
        
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error exporting analytics: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to export analytics: {str(e)}")

# Live Data Streaming Endpoints

@router.get("/stream/engagement")
async def stream_engagement_data(
    timeframe: str = Query("5m", description="Streaming timeframe"),
    db: Session = Depends(get_db)
):
    """Get streaming engagement data for real-time charts"""
    try:
        # Get current engagement metrics
        current_metrics = await realtime_service.get_realtime_engagement_metrics(timeframe)
        
        # Format for streaming
        stream_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "active_users": current_metrics.get("active_users", 0),
            "page_views": current_metrics.get("page_views", 0),
            "interactions": current_metrics.get("interactions", 0),
            "interaction_rate": current_metrics.get("interaction_rate", 0),
            "avg_session_time": current_metrics.get("avg_session_time", 0)
        }
        
        return {
            "status": "success",
            "data": stream_data,
            "timeframe": timeframe
        }
        
    except Exception as e:
        logger.error(f"Error streaming engagement data: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to stream data: {str(e)}")

@router.get("/stream/progress")
async def stream_progress_data(
    db: Session = Depends(get_db)
):
    """Get streaming progress data for real-time charts"""
    try:
        # Get current progress data
        progress_data = await realtime_service.get_live_progress_tracking()
        
        # Format for streaming
        stream_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "completion_rate": progress_data.get("completion_rate", 0),
            "average_progress": progress_data.get("average_progress", 0),
            "active_learners": progress_data.get("in_progress_paths", 0),
            "recent_completions": len(progress_data.get("recent_completions", []))
        }
        
        return {
            "status": "success",
            "data": stream_data
        }
        
    except Exception as e:
        logger.error(f"Error streaming progress data: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to stream progress data: {str(e)}")

@router.get("/health")
async def health_check():
    """Health check for real-time analytics service"""
    return {
        "status": "healthy",
        "service": "real-time analytics",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }