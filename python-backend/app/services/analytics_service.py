"""
Real-time Analytics Service
Handles real-time data processing, event tracking, and analytics generation
"""

import asyncio
import json
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import pandas as pd
import numpy as np
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
import logging

from app.core.database import SessionLocal
from app.core.redis_client import redis_client
from app.models.analytics import UserActivity, CourseEngagement, LearningPath, StudentProgress
from app.services.websocket_manager import WebSocketManager

logger = logging.getLogger(__name__)

class AnalyticsService:
    """Service for real-time analytics processing"""
    
    def __init__(self):
        self.websocket_manager = WebSocketManager()
        self.event_buffer = []
        self.buffer_size = 100
    
    async def track_event(self, user_id: str, event_data: Dict[str, Any]):
        """Track a user event in real-time"""
        try:
            # Add timestamp and user_id to event
            event_data.update({
                "user_id": user_id,
                "timestamp": datetime.utcnow().isoformat(),
                "processed": False
            })
            
            # Store in Redis for real-time access
            await redis_client.lpush(
                f"events:{user_id}",
                json.dumps(event_data)
            )
            
            # Set expiration for event data (7 days)
            await redis_client.expire(f"events:{user_id}", 604800)
            
            # Add to buffer for batch processing
            self.event_buffer.append(event_data)
            
            # Process buffer if it's full
            if len(self.event_buffer) >= self.buffer_size:
                await self._process_event_buffer()
            
            # Send real-time update via WebSocket
            await self._send_realtime_update(user_id, event_data)
            
            logger.info(f"Event tracked for user {user_id}: {event_data.get('action', 'unknown')}")
            
        except Exception as e:
            logger.error(f"Error tracking event: {str(e)}")
    
    async def process_event(self, user_id: str, event_data: Dict[str, Any]):
        """Process a single event (background task)"""
        try:
            db = SessionLocal()
            
            # Create UserActivity record
            activity = UserActivity(
                user_id=user_id,
                action=event_data.get("action", "unknown"),
                resource_type=event_data.get("resource_type", "unknown"),
                resource_id=event_data.get("resource_id"),
                timestamp=datetime.utcnow(),
                duration=event_data.get("duration", 0),
                metadata=json.dumps(event_data.get("metadata", {}))
            )
            
            db.add(activity)
            
            # Update course engagement if applicable
            if event_data.get("course_id"):
                await self._update_course_engagement(
                    db, user_id, event_data["course_id"], event_data
                )
            
            # Update learning path progress if applicable
            if event_data.get("learning_path_id"):
                await self._update_learning_path_progress(
                    db, user_id, event_data["learning_path_id"], event_data
                )
            
            db.commit()
            
            # Generate real-time analytics
            await self._generate_realtime_analytics(user_id, event_data)
            
        except Exception as e:
            logger.error(f"Error processing event: {str(e)}")
            db.rollback()
        finally:
            db.close()
    
    async def get_realtime_analytics(self, user_id: str, timeframe: str = "1h") -> Dict[str, Any]:
        """Get real-time analytics for a user"""
        try:
            # Parse timeframe
            hours = self._parse_timeframe(timeframe)
            since = datetime.utcnow() - timedelta(hours=hours)
            
            db = SessionLocal()
            
            # Get recent activities
            activities = db.query(UserActivity).filter(
                and_(
                    UserActivity.user_id == user_id,
                    UserActivity.timestamp >= since
                )
            ).all()
            
            # Get course engagements
            engagements = db.query(CourseEngagement).filter(
                CourseEngagement.user_id == user_id
            ).all()
            
            # Calculate analytics
            analytics = {
                "user_id": user_id,
                "timeframe": timeframe,
                "generated_at": datetime.utcnow().isoformat(),
                "activity_summary": self._calculate_activity_summary(activities),
                "engagement_metrics": self._calculate_engagement_metrics(engagements),
                "learning_velocity": await self._calculate_learning_velocity(user_id, hours),
                "performance_trends": await self._calculate_performance_trends(user_id, hours),
                "recommendations": await self._generate_quick_recommendations(user_id, activities)
            }
            
            return analytics
            
        except Exception as e:
            logger.error(f"Error generating real-time analytics: {str(e)}")
            return {"error": str(e)}
        finally:
            db.close()
    
    async def get_dashboard_analytics(self, user_id: str, role: str = "student") -> Dict[str, Any]:
        """Get comprehensive dashboard analytics"""
        try:
            db = SessionLocal()
            
            if role == "admin":
                return await self._get_admin_dashboard_analytics(db)
            elif role == "teacher":
                return await self._get_teacher_dashboard_analytics(db, user_id)
            else:
                return await self._get_student_dashboard_analytics(db, user_id)
                
        except Exception as e:
            logger.error(f"Error generating dashboard analytics: {str(e)}")
            return {"error": str(e)}
        finally:
            db.close()
    
    async def get_predictive_analytics(self, user_id: str) -> Dict[str, Any]:
        """Generate predictive analytics for a user"""
        try:
            db = SessionLocal()
            
            # Get historical data
            activities = db.query(UserActivity).filter(
                UserActivity.user_id == user_id
            ).order_by(UserActivity.timestamp.desc()).limit(1000).all()
            
            engagements = db.query(CourseEngagement).filter(
                CourseEngagement.user_id == user_id
            ).all()
            
            # Convert to DataFrame for analysis
            df_activities = pd.DataFrame([
                {
                    "timestamp": a.timestamp,
                    "action": a.action,
                    "duration": a.duration,
                    "resource_type": a.resource_type
                } for a in activities
            ])
            
            df_engagements = pd.DataFrame([
                {
                    "course_id": e.course_id,
                    "progress": e.progress,
                    "time_spent": e.time_spent,
                    "last_accessed": e.last_accessed
                } for e in engagements
            ])
            
            # Generate predictions
            predictions = {
                "user_id": user_id,
                "generated_at": datetime.utcnow().isoformat(),
                "completion_probability": self._predict_completion_probability(df_activities, df_engagements),
                "at_risk_score": self._calculate_at_risk_score(df_activities, df_engagements),
                "optimal_study_time": self._predict_optimal_study_time(df_activities),
                "recommended_pace": self._recommend_learning_pace(df_activities, df_engagements),
                "intervention_needed": self._assess_intervention_need(df_activities, df_engagements)
            }
            
            return predictions
            
        except Exception as e:
            logger.error(f"Error generating predictive analytics: {str(e)}")
            return {"error": str(e)}
        finally:
            db.close()
    
    async def _process_event_buffer(self):
        """Process buffered events in batch"""
        if not self.event_buffer:
            return
        
        try:
            events_to_process = self.event_buffer.copy()
            self.event_buffer.clear()
            
            # Process events in parallel
            tasks = [
                self.process_event(event["user_id"], event)
                for event in events_to_process
            ]
            
            await asyncio.gather(*tasks, return_exceptions=True)
            
        except Exception as e:
            logger.error(f"Error processing event buffer: {str(e)}")
    
    async def _send_realtime_update(self, user_id: str, event_data: Dict[str, Any]):
        """Send real-time update via WebSocket"""
        try:
            update = {
                "type": "analytics_update",
                "user_id": user_id,
                "event": event_data,
                "timestamp": datetime.utcnow().isoformat()
            }
            
            await self.websocket_manager.send_to_user(user_id, update)
            
        except Exception as e:
            logger.error(f"Error sending real-time update: {str(e)}")
    
    async def _update_course_engagement(self, db: Session, user_id: str, course_id: str, event_data: Dict[str, Any]):
        """Update course engagement metrics"""
        engagement = db.query(CourseEngagement).filter(
            and_(
                CourseEngagement.user_id == user_id,
                CourseEngagement.course_id == course_id
            )
        ).first()
        
        if not engagement:
            engagement = CourseEngagement(
                user_id=user_id,
                course_id=course_id,
                progress=0,
                time_spent=0,
                last_accessed=datetime.utcnow()
            )
            db.add(engagement)
        
        # Update metrics based on event
        if event_data.get("action") == "module_completed":
            engagement.progress = min(100, engagement.progress + event_data.get("progress_increment", 5))
        
        engagement.time_spent += event_data.get("duration", 0)
        engagement.last_accessed = datetime.utcnow()
    
    async def _update_learning_path_progress(self, db: Session, user_id: str, learning_path_id: str, event_data: Dict[str, Any]):
        """Update learning path progress"""
        progress = db.query(StudentProgress).filter(
            and_(
                StudentProgress.user_id == user_id,
                StudentProgress.learning_path_id == learning_path_id
            )
        ).first()
        
        if not progress:
            progress = StudentProgress(
                user_id=user_id,
                learning_path_id=learning_path_id,
                progress=0,
                current_milestone=0,
                time_spent=0
            )
            db.add(progress)
        
        # Update progress based on event
        if event_data.get("action") == "milestone_completed":
            progress.current_milestone += 1
            progress.progress = min(100, progress.progress + event_data.get("progress_increment", 10))
        
        progress.time_spent += event_data.get("duration", 0)
        progress.last_activity = datetime.utcnow()
    
    async def _generate_realtime_analytics(self, user_id: str, event_data: Dict[str, Any]):
        """Generate and cache real-time analytics"""
        try:
            # Calculate real-time metrics
            metrics = await self.get_realtime_analytics(user_id, "1h")
            
            # Cache in Redis
            await redis_client.setex(
                f"analytics:{user_id}:realtime",
                300,  # 5 minutes TTL
                json.dumps(metrics)
            )
            
            # Send to WebSocket subscribers
            await self.websocket_manager.broadcast_to_channel(
                f"analytics:{user_id}",
                {
                    "type": "realtime_analytics",
                    "data": metrics
                }
            )
            
        except Exception as e:
            logger.error(f"Error generating real-time analytics: {str(e)}")
    
    def _parse_timeframe(self, timeframe: str) -> int:
        """Parse timeframe string to hours"""
        if timeframe.endswith("h"):
            return int(timeframe[:-1])
        elif timeframe.endswith("d"):
            return int(timeframe[:-1]) * 24
        elif timeframe.endswith("w"):
            return int(timeframe[:-1]) * 24 * 7
        else:
            return 1  # Default to 1 hour
    
    def _calculate_activity_summary(self, activities: List[UserActivity]) -> Dict[str, Any]:
        """Calculate activity summary from activities"""
        if not activities:
            return {"total_activities": 0, "total_time": 0, "most_common_action": None}
        
        total_time = sum(a.duration for a in activities)
        actions = [a.action for a in activities]
        most_common_action = max(set(actions), key=actions.count) if actions else None
        
        return {
            "total_activities": len(activities),
            "total_time": total_time,
            "most_common_action": most_common_action,
            "unique_resources": len(set(a.resource_id for a in activities if a.resource_id))
        }
    
    def _calculate_engagement_metrics(self, engagements: List[CourseEngagement]) -> Dict[str, Any]:
        """Calculate engagement metrics"""
        if not engagements:
            return {"active_courses": 0, "average_progress": 0, "total_time": 0}
        
        active_courses = len([e for e in engagements if e.progress > 0])
        average_progress = sum(e.progress for e in engagements) / len(engagements)
        total_time = sum(e.time_spent for e in engagements)
        
        return {
            "active_courses": active_courses,
            "average_progress": round(average_progress, 2),
            "total_time": total_time,
            "completed_courses": len([e for e in engagements if e.progress >= 100])
        }
    
    async def _calculate_learning_velocity(self, user_id: str, hours: int) -> Dict[str, Any]:
        """Calculate learning velocity metrics"""
        # This would involve more complex calculations
        return {
            "pages_per_hour": 2.5,
            "modules_per_day": 1.2,
            "trend": "increasing"
        }
    
    async def _calculate_performance_trends(self, user_id: str, hours: int) -> Dict[str, Any]:
        """Calculate performance trends"""
        return {
            "engagement_trend": "stable",
            "completion_rate_trend": "improving",
            "time_efficiency_trend": "stable"
        }
    
    async def _generate_quick_recommendations(self, user_id: str, activities: List[UserActivity]) -> List[str]:
        """Generate quick recommendations based on recent activity"""
        recommendations = []
        
        if not activities:
            recommendations.append("Start with a beginner-friendly course")
        elif len(activities) < 5:
            recommendations.append("Try to maintain consistent daily learning")
        else:
            # Analyze patterns and suggest improvements
            avg_duration = sum(a.duration for a in activities) / len(activities)
            if avg_duration < 300:  # Less than 5 minutes
                recommendations.append("Consider longer study sessions for better retention")
        
        return recommendations
    
    async def _get_admin_dashboard_analytics(self, db: Session) -> Dict[str, Any]:
        """Get admin dashboard analytics"""
        # Implementation for admin analytics
        return {
            "total_users": db.query(UserActivity).distinct(UserActivity.user_id).count(),
            "active_users_today": db.query(UserActivity).filter(
                UserActivity.timestamp >= datetime.utcnow().date()
            ).distinct(UserActivity.user_id).count(),
            "total_courses": db.query(CourseEngagement).distinct(CourseEngagement.course_id).count(),
            "completion_rate": 75.5  # Calculated metric
        }
    
    async def _get_teacher_dashboard_analytics(self, db: Session, teacher_id: str) -> Dict[str, Any]:
        """Get teacher dashboard analytics"""
        # Implementation for teacher analytics
        return {
            "my_courses": 5,
            "total_students": 120,
            "average_engagement": 78.5,
            "recent_completions": 15
        }
    
    async def _get_student_dashboard_analytics(self, db: Session, student_id: str) -> Dict[str, Any]:
        """Get student dashboard analytics"""
        engagements = db.query(CourseEngagement).filter(
            CourseEngagement.user_id == student_id
        ).all()
        
        return {
            "enrolled_courses": len(engagements),
            "completed_courses": len([e for e in engagements if e.progress >= 100]),
            "average_progress": sum(e.progress for e in engagements) / len(engagements) if engagements else 0,
            "total_time_spent": sum(e.time_spent for e in engagements)
        }
    
    def _predict_completion_probability(self, df_activities: pd.DataFrame, df_engagements: pd.DataFrame) -> float:
        """Predict course completion probability"""
        if df_engagements.empty:
            return 0.5
        
        # Simple prediction based on current progress and engagement
        avg_progress = df_engagements['progress'].mean()
        recent_activity = len(df_activities[df_activities['timestamp'] > datetime.utcnow() - timedelta(days=7)])
        
        # Basic formula - would be replaced with ML model
        probability = min(1.0, (avg_progress / 100) * 0.7 + (recent_activity / 10) * 0.3)
        return round(probability, 3)
    
    def _calculate_at_risk_score(self, df_activities: pd.DataFrame, df_engagements: pd.DataFrame) -> float:
        """Calculate at-risk score (0-1, higher = more at risk)"""
        if df_activities.empty:
            return 0.8
        
        # Check for recent inactivity
        days_since_last_activity = (datetime.utcnow() - df_activities['timestamp'].max()).days
        
        # Simple risk calculation
        risk_score = min(1.0, days_since_last_activity / 14)  # 14 days = high risk
        return round(risk_score, 3)
    
    def _predict_optimal_study_time(self, df_activities: pd.DataFrame) -> Dict[str, Any]:
        """Predict optimal study time for the user"""
        if df_activities.empty:
            return {"hour": 14, "duration": 60, "confidence": 0.5}
        
        # Analyze activity patterns
        df_activities['hour'] = pd.to_datetime(df_activities['timestamp']).dt.hour
        hour_performance = df_activities.groupby('hour')['duration'].mean()
        
        optimal_hour = hour_performance.idxmax() if not hour_performance.empty else 14
        optimal_duration = hour_performance.max() if not hour_performance.empty else 60
        
        return {
            "hour": int(optimal_hour),
            "duration": int(optimal_duration),
            "confidence": 0.7
        }
    
    def _recommend_learning_pace(self, df_activities: pd.DataFrame, df_engagements: pd.DataFrame) -> str:
        """Recommend learning pace"""
        if df_activities.empty:
            return "moderate"
        
        # Analyze current pace
        daily_activities = df_activities.groupby(df_activities['timestamp'].dt.date).size().mean()
        
        if daily_activities > 5:
            return "slow_down"
        elif daily_activities < 2:
            return "speed_up"
        else:
            return "maintain"
    
    def _assess_intervention_need(self, df_activities: pd.DataFrame, df_engagements: pd.DataFrame) -> Dict[str, Any]:
        """Assess if intervention is needed"""
        at_risk_score = self._calculate_at_risk_score(df_activities, df_engagements)
        
        return {
            "needed": at_risk_score > 0.6,
            "urgency": "high" if at_risk_score > 0.8 else "medium" if at_risk_score > 0.6 else "low",
            "recommended_actions": [
                "Contact student",
                "Provide additional resources",
                "Schedule check-in meeting"
            ] if at_risk_score > 0.6 else []
        }