"""
Real-time Analytics Service for Live Dashboard Updates
Handles real-time metrics, WebSocket broadcasting, and live data processing
"""

import asyncio
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from collections import defaultdict, deque
import pandas as pd
import numpy as np
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_

from app.core.database import SessionLocal
from app.core.redis_client import redis_client
from app.models.analytics import (
    UserActivity, CourseEngagement, StudentProgress, 
    AnalyticsSnapshot, SystemMetrics
)
from app.services.websocket_manager import WebSocketManager

logger = logging.getLogger(__name__)

class RealTimeAnalyticsService:
    """Service for real-time analytics processing and broadcasting"""
    
    def __init__(self):
        self.websocket_manager = WebSocketManager()
        self.metrics_buffer = defaultdict(deque)
        self.active_sessions = {}
        self.engagement_tracker = {}
        
    async def initialize(self):
        """Initialize the real-time analytics service"""
        logger.info("Initializing Real-Time Analytics Service...")
        
        # Start background tasks
        asyncio.create_task(self._process_realtime_metrics())
        asyncio.create_task(self._broadcast_live_updates())
        asyncio.create_task(self._cleanup_stale_sessions())
        
        logger.info("Real-Time Analytics Service initialized")
    
    async def track_live_event(self, user_id: str, event_data: Dict[str, Any]):
        """Track live user events for real-time processing"""
        try:
            timestamp = datetime.utcnow()
            
            # Store in Redis for immediate processing
            event_key = f"live_event:{user_id}:{timestamp.timestamp()}"
            await redis_client.setex(
                event_key, 
                3600,  # 1 hour TTL
                json.dumps({
                    "user_id": user_id,
                    "timestamp": timestamp.isoformat(),
                    **event_data
                })
            )
            
            # Add to metrics buffer
            self.metrics_buffer[user_id].append({
                "timestamp": timestamp,
                "event": event_data
            })
            
            # Update active session
            self.active_sessions[user_id] = timestamp
            
            # Process engagement metrics
            await self._update_engagement_metrics(user_id, event_data)
            
            # Broadcast to connected clients
            await self._broadcast_user_event(user_id, event_data)
            
        except Exception as e:
            logger.error(f"Error tracking live event: {str(e)}")
    
    async def get_live_dashboard_data(self, user_id: str, role: str = "student") -> Dict[str, Any]:
        """Get live dashboard data based on user role"""
        try:
            if role == "admin":
                return await self._get_admin_live_dashboard()
            elif role == "teacher":
                return await self._get_teacher_live_dashboard(user_id)
            else:
                return await self._get_student_live_dashboard(user_id)
                
        except Exception as e:
            logger.error(f"Error getting live dashboard data: {str(e)}")
            return {}
    
    async def get_realtime_engagement_metrics(self, timeframe: str = "1h") -> Dict[str, Any]:
        """Get real-time engagement metrics"""
        try:
            hours = self._parse_timeframe(timeframe)
            cutoff_time = datetime.utcnow() - timedelta(hours=hours)
            
            db = SessionLocal()
            try:
                # Active users in timeframe
                active_users = db.query(func.count(func.distinct(UserActivity.user_id))).filter(
                    UserActivity.timestamp >= cutoff_time
                ).scalar()
                
                # Page views and interactions
                page_views = db.query(func.count(UserActivity.id)).filter(
                    and_(
                        UserActivity.timestamp >= cutoff_time,
                        UserActivity.action == 'page_view'
                    )
                ).scalar()
                
                interactions = db.query(func.count(UserActivity.id)).filter(
                    and_(
                        UserActivity.timestamp >= cutoff_time,
                        UserActivity.action.in_(['click', 'scroll', 'video_play', 'quiz_attempt'])
                    )
                ).scalar()
                
                # Average session time
                avg_session_time = db.query(func.avg(UserActivity.duration)).filter(
                    UserActivity.timestamp >= cutoff_time
                ).scalar() or 0
                
                # Course engagement rates
                course_engagement = db.query(
                    CourseEngagement.course_id,
                    func.avg(CourseEngagement.progress).label('avg_progress'),
                    func.count(CourseEngagement.user_id).label('active_students')
                ).filter(
                    CourseEngagement.last_accessed >= cutoff_time
                ).group_by(CourseEngagement.course_id).all()
                
                return {
                    "active_users": active_users or 0,
                    "page_views": page_views or 0,
                    "interactions": interactions or 0,
                    "avg_session_time": float(avg_session_time),
                    "interaction_rate": (interactions / max(page_views, 1)) * 100,
                    "course_engagement": [
                        {
                            "course_id": ce.course_id,
                            "avg_progress": float(ce.avg_progress),
                            "active_students": ce.active_students
                        } for ce in course_engagement
                    ],
                    "timestamp": datetime.utcnow().isoformat()
                }
                
            finally:
                db.close()
                
        except Exception as e:
            logger.error(f"Error getting engagement metrics: {str(e)}")
            return {}
    
    async def get_live_progress_tracking(self, user_id: Optional[str] = None) -> Dict[str, Any]:
        """Get live progress tracking data"""
        try:
            db = SessionLocal()
            try:
                query = db.query(StudentProgress)
                if user_id:
                    query = query.filter(StudentProgress.user_id == user_id)
                
                progress_data = query.filter(
                    StudentProgress.last_activity >= datetime.utcnow() - timedelta(hours=24)
                ).all()
                
                # Calculate completion rates
                total_paths = len(progress_data)
                completed_paths = len([p for p in progress_data if p.progress >= 100])
                in_progress_paths = len([p for p in progress_data if 0 < p.progress < 100])
                
                # Calculate average progress
                avg_progress = sum(p.progress for p in progress_data) / max(total_paths, 1)
                
                # Recent milestones
                recent_completions = [
                    {
                        "user_id": p.user_id,
                        "learning_path_id": p.learning_path_id,
                        "progress": p.progress,
                        "completed_at": p.completed_at.isoformat() if p.completed_at else None
                    } for p in progress_data if p.completed_at and 
                    p.completed_at >= datetime.utcnow() - timedelta(hours=1)
                ]
                
                return {
                    "total_learning_paths": total_paths,
                    "completed_paths": completed_paths,
                    "in_progress_paths": in_progress_paths,
                    "completion_rate": (completed_paths / max(total_paths, 1)) * 100,
                    "average_progress": avg_progress,
                    "recent_completions": recent_completions,
                    "timestamp": datetime.utcnow().isoformat()
                }
                
            finally:
                db.close()
                
        except Exception as e:
            logger.error(f"Error getting progress tracking: {str(e)}")
            return {}
    
    async def get_predictive_alerts(self, user_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get predictive analytics alerts"""
        try:
            db = SessionLocal()
            try:
                # Get users at risk of dropping out
                cutoff_time = datetime.utcnow() - timedelta(days=3)
                
                # Find users with declining engagement
                declining_users = db.query(
                    UserActivity.user_id,
                    func.count(UserActivity.id).label('activity_count'),
                    func.max(UserActivity.timestamp).label('last_activity')
                ).filter(
                    UserActivity.timestamp >= cutoff_time
                ).group_by(UserActivity.user_id).having(
                    func.count(UserActivity.id) < 5  # Less than 5 activities in 3 days
                ).all()
                
                alerts = []
                for user in declining_users:
                    # Calculate risk score
                    days_since_activity = (datetime.utcnow() - user.last_activity).days
                    risk_score = min(days_since_activity * 0.3 + (5 - user.activity_count) * 0.2, 1.0)
                    
                    if risk_score > 0.6:  # High risk threshold
                        alerts.append({
                            "type": "engagement_drop",
                            "user_id": user.user_id,
                            "risk_level": "high" if risk_score > 0.8 else "medium",
                            "risk_score": risk_score,
                            "recommendation": "Immediate intervention recommended",
                            "last_activity": user.last_activity.isoformat(),
                            "activity_count": user.activity_count
                        })
                
                # Get users with low progress
                low_progress_users = db.query(StudentProgress).filter(
                    and_(
                        StudentProgress.progress < 20,
                        StudentProgress.started_at <= datetime.utcnow() - timedelta(days=7)
                    )
                ).all()
                
                for progress in low_progress_users:
                    alerts.append({
                        "type": "low_progress",
                        "user_id": progress.user_id,
                        "learning_path_id": progress.learning_path_id,
                        "risk_level": "medium",
                        "progress": progress.progress,
                        "recommendation": "Consider providing additional support or resources",
                        "started_at": progress.started_at.isoformat()
                    })
                
                return alerts
                
            finally:
                db.close()
                
        except Exception as e:
            logger.error(f"Error getting predictive alerts: {str(e)}")
            return []
    
    async def _process_realtime_metrics(self):
        """Background task to process real-time metrics"""
        while True:
            try:
                # Process metrics buffer
                for user_id, events in self.metrics_buffer.items():
                    if events:
                        await self._aggregate_user_metrics(user_id, list(events))
                        events.clear()
                
                # Store system metrics
                await self._store_system_metrics()
                
                await asyncio.sleep(10)  # Process every 10 seconds
                
            except Exception as e:
                logger.error(f"Error processing real-time metrics: {str(e)}")
                await asyncio.sleep(30)
    
    async def _broadcast_live_updates(self):
        """Background task to broadcast live updates"""
        while True:
            try:
                # Get current metrics
                engagement_metrics = await self.get_realtime_engagement_metrics("15m")
                progress_data = await self.get_live_progress_tracking()
                
                # Broadcast to all connected admin/teacher clients
                update_data = {
                    "type": "live_update",
                    "engagement": engagement_metrics,
                    "progress": progress_data,
                    "timestamp": datetime.utcnow().isoformat()
                }
                
                await self.websocket_manager.broadcast_to_role("admin", update_data)
                await self.websocket_manager.broadcast_to_role("teacher", update_data)
                
                await asyncio.sleep(30)  # Broadcast every 30 seconds
                
            except Exception as e:
                logger.error(f"Error broadcasting live updates: {str(e)}")
                await asyncio.sleep(60)
    
    async def _cleanup_stale_sessions(self):
        """Clean up stale user sessions"""
        while True:
            try:
                cutoff_time = datetime.utcnow() - timedelta(minutes=30)
                stale_users = [
                    user_id for user_id, last_activity in self.active_sessions.items()
                    if last_activity < cutoff_time
                ]
                
                for user_id in stale_users:
                    del self.active_sessions[user_id]
                    if user_id in self.engagement_tracker:
                        del self.engagement_tracker[user_id]
                
                await asyncio.sleep(300)  # Clean up every 5 minutes
                
            except Exception as e:
                logger.error(f"Error cleaning up stale sessions: {str(e)}")
                await asyncio.sleep(600)
    
    async def _update_engagement_metrics(self, user_id: str, event_data: Dict[str, Any]):
        """Update real-time engagement metrics"""
        if user_id not in self.engagement_tracker:
            self.engagement_tracker[user_id] = {
                "session_start": datetime.utcnow(),
                "page_views": 0,
                "interactions": 0,
                "time_spent": 0
            }
        
        tracker = self.engagement_tracker[user_id]
        
        if event_data.get("action") == "page_view":
            tracker["page_views"] += 1
        elif event_data.get("action") in ["click", "scroll", "video_play", "quiz_attempt"]:
            tracker["interactions"] += 1
        
        if "duration" in event_data:
            tracker["time_spent"] += event_data["duration"]
    
    async def _broadcast_user_event(self, user_id: str, event_data: Dict[str, Any]):
        """Broadcast user event to relevant clients"""
        broadcast_data = {
            "type": "user_event",
            "user_id": user_id,
            "event": event_data,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Broadcast to admin and teacher dashboards
        await self.websocket_manager.broadcast_to_role("admin", broadcast_data)
        await self.websocket_manager.broadcast_to_role("teacher", broadcast_data)
    
    async def _get_admin_live_dashboard(self) -> Dict[str, Any]:
        """Get live dashboard data for admin users"""
        return {
            "active_users": len(self.active_sessions),
            "engagement_metrics": await self.get_realtime_engagement_metrics("1h"),
            "progress_tracking": await self.get_live_progress_tracking(),
            "predictive_alerts": await self.get_predictive_alerts(),
            "system_status": await self._get_system_status()
        }
    
    async def _get_teacher_live_dashboard(self, teacher_id: str) -> Dict[str, Any]:
        """Get live dashboard data for teacher users"""
        # Get courses taught by this teacher (would need course-teacher mapping)
        return {
            "engagement_metrics": await self.get_realtime_engagement_metrics("1h"),
            "progress_tracking": await self.get_live_progress_tracking(),
            "predictive_alerts": await self.get_predictive_alerts()
        }
    
    async def _get_student_live_dashboard(self, student_id: str) -> Dict[str, Any]:
        """Get live dashboard data for student users"""
        return {
            "progress_tracking": await self.get_live_progress_tracking(student_id),
            "engagement_summary": await self._get_student_engagement_summary(student_id)
        }
    
    async def _get_student_engagement_summary(self, student_id: str) -> Dict[str, Any]:
        """Get engagement summary for a specific student"""
        if student_id in self.engagement_tracker:
            tracker = self.engagement_tracker[student_id]
            session_duration = (datetime.utcnow() - tracker["session_start"]).total_seconds()
            
            return {
                "session_duration": session_duration,
                "page_views": tracker["page_views"],
                "interactions": tracker["interactions"],
                "total_time_spent": tracker["time_spent"],
                "engagement_rate": (tracker["interactions"] / max(tracker["page_views"], 1)) * 100
            }
        
        return {}
    
    async def _aggregate_user_metrics(self, user_id: str, events: List[Dict[str, Any]]):
        """Aggregate user metrics from events"""
        try:
            # Store aggregated metrics in Redis
            metrics_key = f"user_metrics:{user_id}:{datetime.utcnow().strftime('%Y%m%d%H')}"
            
            aggregated = {
                "user_id": user_id,
                "hour": datetime.utcnow().strftime('%Y%m%d%H'),
                "event_count": len(events),
                "total_duration": sum(e.get("event", {}).get("duration", 0) for e in events),
                "page_views": len([e for e in events if e.get("event", {}).get("action") == "page_view"]),
                "interactions": len([e for e in events if e.get("event", {}).get("action") in ["click", "scroll", "video_play"]])
            }
            
            await redis_client.setex(metrics_key, 86400, json.dumps(aggregated))  # 24 hour TTL
            
        except Exception as e:
            logger.error(f"Error aggregating user metrics: {str(e)}")
    
    async def _store_system_metrics(self):
        """Store system-wide metrics"""
        try:
            db = SessionLocal()
            try:
                # Store current system metrics
                metrics = [
                    SystemMetrics(
                        metric_name="active_sessions",
                        metric_value=len(self.active_sessions),
                        metric_unit="count"
                    ),
                    SystemMetrics(
                        metric_name="total_engagement_events",
                        metric_value=sum(len(events) for events in self.metrics_buffer.values()),
                        metric_unit="count"
                    )
                ]
                
                db.add_all(metrics)
                db.commit()
                
            finally:
                db.close()
                
        except Exception as e:
            logger.error(f"Error storing system metrics: {str(e)}")
    
    async def _get_system_status(self) -> Dict[str, Any]:
        """Get current system status"""
        return {
            "active_sessions": len(self.active_sessions),
            "metrics_buffer_size": sum(len(events) for events in self.metrics_buffer.values()),
            "uptime": "running",  # Would calculate actual uptime
            "memory_usage": "normal",  # Would get actual memory usage
            "cpu_usage": "normal"  # Would get actual CPU usage
        }
    
    def _parse_timeframe(self, timeframe: str) -> int:
        """Parse timeframe string to hours"""
        if timeframe.endswith('m'):
            return int(timeframe[:-1]) / 60
        elif timeframe.endswith('h'):
            return int(timeframe[:-1])
        elif timeframe.endswith('d'):
            return int(timeframe[:-1]) * 24
        else:
            return 1  # Default to 1 hour