"""
Google Classroom Integration Service
Handles synchronization with Google Classroom API
"""

import asyncio
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import httpx
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from app.core.config import settings
from app.core.database import SessionLocal
from app.models.analytics import IntegrationLog, UserActivity, CourseEngagement

logger = logging.getLogger(__name__)

class GoogleClassroomService:
    """Service for Google Classroom integration"""
    
    def __init__(self):
        self.service = None
        self.credentials = None
        self.initialized = False
    
    async def initialize(self):
        """Initialize Google Classroom service"""
        try:
            if settings.GOOGLE_CLASSROOM_CLIENT_ID and settings.GOOGLE_CLASSROOM_CLIENT_SECRET:
                # Initialize OAuth2 credentials (would need proper OAuth flow)
                self.initialized = True
                logger.info("Google Classroom service initialized")
            else:
                logger.warning("Google Classroom credentials not provided")
        except Exception as e:
            logger.error(f"Failed to initialize Google Classroom service: {str(e)}")
    
    async def sync_courses(self, user_id: str) -> Dict[str, Any]:
        """Sync courses from Google Classroom"""
        if not self.initialized:
            return {"error": "Google Classroom service not initialized"}
        
        try:
            # Log integration attempt
            await self._log_integration("sync", "pending", user_id)
            
            # Get courses from Google Classroom
            courses = await self._get_classroom_courses()
            
            # Process and store courses
            synced_courses = []
            for course in courses:
                processed_course = await self._process_classroom_course(course, user_id)
                if processed_course:
                    synced_courses.append(processed_course)
            
            # Log successful sync
            await self._log_integration("sync", "success", user_id, {
                "courses_synced": len(synced_courses)
            })
            
            return {
                "status": "success",
                "courses_synced": len(synced_courses),
                "courses": synced_courses,
                "timestamp": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error syncing Google Classroom courses: {str(e)}")
            await self._log_integration("sync", "error", user_id, error_message=str(e))
            return {"error": f"Failed to sync courses: {str(e)}"}
    
    async def sync_assignments(self, course_id: str, user_id: str) -> Dict[str, Any]:
        """Sync assignments from a Google Classroom course"""
        if not self.initialized:
            return {"error": "Google Classroom service not initialized"}
        
        try:
            # Get assignments from Google Classroom
            assignments = await self._get_classroom_assignments(course_id)
            
            # Process assignments
            synced_assignments = []
            for assignment in assignments:
                processed_assignment = await self._process_classroom_assignment(assignment, course_id, user_id)
                if processed_assignment:
                    synced_assignments.append(processed_assignment)
            
            return {
                "status": "success",
                "assignments_synced": len(synced_assignments),
                "assignments": synced_assignments,
                "timestamp": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error syncing assignments: {str(e)}")
            return {"error": f"Failed to sync assignments: {str(e)}"}
    
    async def sync_student_submissions(self, course_id: str, assignment_id: str) -> Dict[str, Any]:
        """Sync student submissions for an assignment"""
        if not self.initialized:
            return {"error": "Google Classroom service not initialized"}
        
        try:
            # Get submissions from Google Classroom
            submissions = await self._get_classroom_submissions(course_id, assignment_id)
            
            # Process submissions and update analytics
            processed_submissions = []
            for submission in submissions:
                processed_submission = await self._process_classroom_submission(submission, course_id, assignment_id)
                if processed_submission:
                    processed_submissions.append(processed_submission)
                    
                    # Track submission activity
                    await self._track_submission_activity(processed_submission)
            
            return {
                "status": "success",
                "submissions_synced": len(processed_submissions),
                "submissions": processed_submissions,
                "timestamp": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error syncing submissions: {str(e)}")
            return {"error": f"Failed to sync submissions: {str(e)}"}
    
    async def get_classroom_analytics(self, course_id: str, timeframe: str = "7d") -> Dict[str, Any]:
        """Get analytics data from Google Classroom"""
        if not self.initialized:
            return {"error": "Google Classroom service not initialized"}
        
        try:
            # Calculate timeframe
            days = int(timeframe.rstrip('d'))
            start_date = datetime.utcnow() - timedelta(days=days)
            
            # Get course activity
            course_activity = await self._get_classroom_activity(course_id, start_date)
            
            # Get student engagement
            student_engagement = await self._get_classroom_engagement(course_id, start_date)
            
            # Get assignment completion rates
            assignment_completion = await self._get_assignment_completion_rates(course_id)
            
            return {
                "course_id": course_id,
                "timeframe": timeframe,
                "activity": course_activity,
                "engagement": student_engagement,
                "assignment_completion": assignment_completion,
                "timestamp": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error getting classroom analytics: {str(e)}")
            return {"error": f"Failed to get analytics: {str(e)}"}
    
    async def export_analytics_to_classroom(self, course_id: str, analytics_data: Dict[str, Any]) -> Dict[str, Any]:
        """Export analytics data back to Google Classroom"""
        if not self.initialized:
            return {"error": "Google Classroom service not initialized"}
        
        try:
            # Format analytics for Google Classroom
            formatted_data = await self._format_analytics_for_classroom(analytics_data)
            
            # Create or update course materials with analytics
            result = await self._update_classroom_materials(course_id, formatted_data)
            
            return {
                "status": "success",
                "exported_items": result.get("items_updated", 0),
                "timestamp": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error exporting analytics: {str(e)}")
            return {"error": f"Failed to export analytics: {str(e)}"}
    
    async def _get_classroom_courses(self) -> List[Dict[str, Any]]:
        """Get courses from Google Classroom API"""
        # Mock implementation - would use actual Google Classroom API
        return [
            {
                "id": "course_1",
                "name": "Introduction to Python",
                "description": "Learn Python programming basics",
                "ownerId": "teacher_1",
                "creationTime": datetime.utcnow().isoformat(),
                "updateTime": datetime.utcnow().isoformat(),
                "enrollmentCode": "abc123",
                "courseState": "ACTIVE",
                "alternateLink": "https://classroom.google.com/c/course_1"
            },
            {
                "id": "course_2",
                "name": "Data Science Fundamentals",
                "description": "Introduction to data science concepts",
                "ownerId": "teacher_2",
                "creationTime": datetime.utcnow().isoformat(),
                "updateTime": datetime.utcnow().isoformat(),
                "enrollmentCode": "def456",
                "courseState": "ACTIVE",
                "alternateLink": "https://classroom.google.com/c/course_2"
            }
        ]
    
    async def _get_classroom_assignments(self, course_id: str) -> List[Dict[str, Any]]:
        """Get assignments from Google Classroom API"""
        # Mock implementation
        return [
            {
                "id": "assignment_1",
                "title": "Python Basics Quiz",
                "description": "Test your knowledge of Python basics",
                "courseId": course_id,
                "creationTime": datetime.utcnow().isoformat(),
                "updateTime": datetime.utcnow().isoformat(),
                "dueDate": {
                    "year": 2024,
                    "month": 12,
                    "day": 31
                },
                "maxPoints": 100,
                "workType": "ASSIGNMENT",
                "state": "PUBLISHED"
            }
        ]
    
    async def _get_classroom_submissions(self, course_id: str, assignment_id: str) -> List[Dict[str, Any]]:
        """Get student submissions from Google Classroom API"""
        # Mock implementation
        return [
            {
                "id": "submission_1",
                "userId": "student_1",
                "courseId": course_id,
                "courseWorkId": assignment_id,
                "creationTime": datetime.utcnow().isoformat(),
                "updateTime": datetime.utcnow().isoformat(),
                "state": "TURNED_IN",
                "assignedGrade": 85,
                "draftGrade": 85
            }
        ]
    
    async def _process_classroom_course(self, course: Dict[str, Any], user_id: str) -> Dict[str, Any]:
        """Process and normalize a Google Classroom course"""
        return {
            "id": course["id"],
            "title": course["name"],
            "description": course.get("description", ""),
            "instructor_id": course["ownerId"],
            "created_at": course["creationTime"],
            "updated_at": course["updateTime"],
            "enrollment_code": course.get("enrollmentCode"),
            "status": course.get("courseState", "ACTIVE").lower(),
            "classroom_link": course.get("alternateLink"),
            "source": "google_classroom",
            "synced_by": user_id,
            "synced_at": datetime.utcnow().isoformat()
        }
    
    async def _process_classroom_assignment(self, assignment: Dict[str, Any], course_id: str, user_id: str) -> Dict[str, Any]:
        """Process and normalize a Google Classroom assignment"""
        return {
            "id": assignment["id"],
            "title": assignment["title"],
            "description": assignment.get("description", ""),
            "course_id": course_id,
            "created_at": assignment["creationTime"],
            "updated_at": assignment["updateTime"],
            "due_date": self._parse_classroom_date(assignment.get("dueDate")),
            "max_points": assignment.get("maxPoints", 0),
            "work_type": assignment.get("workType", "ASSIGNMENT").lower(),
            "status": assignment.get("state", "PUBLISHED").lower(),
            "source": "google_classroom",
            "synced_by": user_id,
            "synced_at": datetime.utcnow().isoformat()
        }
    
    async def _process_classroom_submission(self, submission: Dict[str, Any], course_id: str, assignment_id: str) -> Dict[str, Any]:
        """Process and normalize a Google Classroom submission"""
        return {
            "id": submission["id"],
            "student_id": submission["userId"],
            "course_id": course_id,
            "assignment_id": assignment_id,
            "submitted_at": submission["creationTime"],
            "updated_at": submission["updateTime"],
            "status": submission.get("state", "CREATED").lower(),
            "grade": submission.get("assignedGrade"),
            "draft_grade": submission.get("draftGrade"),
            "source": "google_classroom",
            "synced_at": datetime.utcnow().isoformat()
        }
    
    async def _track_submission_activity(self, submission: Dict[str, Any]):
        """Track submission as user activity"""
        try:
            db = SessionLocal()
            try:
                activity = UserActivity(
                    user_id=submission["student_id"],
                    action="assignment_submission",
                    resource_type="assignment",
                    resource_id=submission["assignment_id"],
                    timestamp=datetime.fromisoformat(submission["submitted_at"].replace('Z', '+00:00')),
                    metadata={
                        "course_id": submission["course_id"],
                        "grade": submission.get("grade"),
                        "source": "google_classroom"
                    }
                )
                
                db.add(activity)
                db.commit()
                
            finally:
                db.close()
                
        except Exception as e:
            logger.error(f"Error tracking submission activity: {str(e)}")
    
    async def _get_classroom_activity(self, course_id: str, start_date: datetime) -> Dict[str, Any]:
        """Get course activity from Google Classroom"""
        # Mock implementation - would use actual API
        return {
            "total_posts": 25,
            "student_posts": 18,
            "teacher_posts": 7,
            "announcements": 3,
            "assignments_created": 2,
            "submissions_received": 45
        }
    
    async def _get_classroom_engagement(self, course_id: str, start_date: datetime) -> Dict[str, Any]:
        """Get student engagement metrics from Google Classroom"""
        # Mock implementation
        return {
            "active_students": 28,
            "total_students": 30,
            "engagement_rate": 93.3,
            "avg_posts_per_student": 1.8,
            "avg_assignment_completion_time": 2.5  # days
        }
    
    async def _get_assignment_completion_rates(self, course_id: str) -> Dict[str, Any]:
        """Get assignment completion rates"""
        # Mock implementation
        return {
            "total_assignments": 5,
            "avg_completion_rate": 87.5,
            "on_time_submissions": 78.2,
            "late_submissions": 9.3,
            "missing_submissions": 12.5
        }
    
    async def _format_analytics_for_classroom(self, analytics_data: Dict[str, Any]) -> Dict[str, Any]:
        """Format analytics data for Google Classroom export"""
        return {
            "title": "Learning Analytics Report",
            "description": f"Generated on {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')}",
            "content": json.dumps(analytics_data, indent=2),
            "type": "analytics_report"
        }
    
    async def _update_classroom_materials(self, course_id: str, formatted_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update Google Classroom with analytics materials"""
        # Mock implementation - would use actual API
        return {
            "items_updated": 1,
            "material_id": "analytics_report_123",
            "updated_at": datetime.utcnow().isoformat()
        }
    
    async def _log_integration(self, action: str, status: str, user_id: str, request_data: Dict[str, Any] = None, error_message: str = None):
        """Log integration activity"""
        try:
            db = SessionLocal()
            try:
                log_entry = IntegrationLog(
                    integration_type="google_classroom",
                    action=action,
                    status=status,
                    user_id=user_id,
                    request_data=request_data,
                    error_message=error_message
                )
                
                db.add(log_entry)
                db.commit()
                
            finally:
                db.close()
                
        except Exception as e:
            logger.error(f"Error logging integration: {str(e)}")
    
    def _parse_classroom_date(self, date_obj: Optional[Dict[str, int]]) -> Optional[str]:
        """Parse Google Classroom date format"""
        if not date_obj:
            return None
        
        try:
            return datetime(
                year=date_obj.get("year", 2024),
                month=date_obj.get("month", 1),
                day=date_obj.get("day", 1)
            ).isoformat()
        except Exception:
            return None