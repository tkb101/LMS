"""
Database models for analytics and tracking
"""

from sqlalchemy import Column, Integer, String, DateTime, Float, Text, Boolean, JSON, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

Base = declarative_base()

class UserActivity(Base):
    """Track user activities and interactions"""
    __tablename__ = "user_activities"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False, index=True)
    action = Column(String, nullable=False)  # e.g., 'page_view', 'video_watch', 'quiz_attempt'
    resource_type = Column(String, nullable=False)  # e.g., 'course', 'module', 'quiz'
    resource_id = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    duration = Column(Integer, default=0)  # Duration in seconds
    metadata = Column(JSON, nullable=True)  # Additional event data
    
    def __repr__(self):
        return f"<UserActivity(user_id='{self.user_id}', action='{self.action}', timestamp='{self.timestamp}')>"

class CourseEngagement(Base):
    """Track user engagement with courses"""
    __tablename__ = "course_engagements"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False, index=True)
    course_id = Column(String, nullable=False, index=True)
    progress = Column(Float, default=0.0)  # Progress percentage (0-100)
    time_spent = Column(Integer, default=0)  # Total time spent in seconds
    last_accessed = Column(DateTime, default=datetime.utcnow, nullable=False)
    completion_date = Column(DateTime, nullable=True)
    rating = Column(Float, nullable=True)  # User rating (1-5)
    
    def __repr__(self):
        return f"<CourseEngagement(user_id='{self.user_id}', course_id='{self.course_id}', progress={self.progress})>"

class LearningPath(Base):
    """Learning path definitions"""
    __tablename__ = "learning_paths"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    creator_id = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    is_public = Column(Boolean, default=False)
    difficulty_level = Column(String, nullable=True)  # beginner, intermediate, advanced
    estimated_duration = Column(Integer, nullable=True)  # Duration in hours
    prerequisites = Column(JSON, nullable=True)  # List of prerequisite skills/courses
    learning_objectives = Column(JSON, nullable=True)  # List of learning objectives
    course_sequence = Column(JSON, nullable=False)  # Ordered list of course IDs
    
    def __repr__(self):
        return f"<LearningPath(id='{self.id}', title='{self.title}')>"

class StudentProgress(Base):
    """Track student progress through learning paths"""
    __tablename__ = "student_progress"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False, index=True)
    learning_path_id = Column(String, ForeignKey('learning_paths.id'), nullable=False)
    progress = Column(Float, default=0.0)  # Overall progress percentage (0-100)
    current_milestone = Column(Integer, default=0)  # Current milestone/course index
    time_spent = Column(Integer, default=0)  # Total time spent in seconds
    started_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    last_activity = Column(DateTime, default=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime, nullable=True)
    
    # Relationship
    learning_path = relationship("LearningPath", backref="student_progress")
    
    def __repr__(self):
        return f"<StudentProgress(user_id='{self.user_id}', learning_path_id='{self.learning_path_id}', progress={self.progress})>"

class AnalyticsSnapshot(Base):
    """Store periodic analytics snapshots for historical analysis"""
    __tablename__ = "analytics_snapshots"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    snapshot_type = Column(String, nullable=False)  # 'daily', 'weekly', 'monthly'
    snapshot_date = Column(DateTime, nullable=False, index=True)
    user_id = Column(String, nullable=True, index=True)  # Null for system-wide snapshots
    course_id = Column(String, nullable=True, index=True)  # Null for user-wide snapshots
    learning_path_id = Column(String, nullable=True, index=True)
    metrics = Column(JSON, nullable=False)  # Snapshot data
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f"<AnalyticsSnapshot(type='{self.snapshot_type}', date='{self.snapshot_date}')>"

class PredictiveInsight(Base):
    """Store AI-generated predictive insights"""
    __tablename__ = "predictive_insights"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False, index=True)
    insight_type = Column(String, nullable=False)  # 'completion_risk', 'recommendation', 'intervention'
    confidence_score = Column(Float, nullable=False)  # 0.0 to 1.0
    prediction = Column(JSON, nullable=False)  # Prediction data
    context = Column(JSON, nullable=True)  # Context used for prediction
    generated_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    expires_at = Column(DateTime, nullable=True)  # When this insight expires
    is_active = Column(Boolean, default=True)
    
    def __repr__(self):
        return f"<PredictiveInsight(user_id='{self.user_id}', type='{self.insight_type}', confidence={self.confidence_score})>"

class SystemMetrics(Base):
    """Store system-wide metrics and performance data"""
    __tablename__ = "system_metrics"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    metric_name = Column(String, nullable=False, index=True)
    metric_value = Column(Float, nullable=False)
    metric_unit = Column(String, nullable=True)  # 'count', 'percentage', 'seconds', etc.
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    metadata = Column(JSON, nullable=True)  # Additional metric data
    
    def __repr__(self):
        return f"<SystemMetrics(name='{self.metric_name}', value={self.metric_value}, timestamp='{self.timestamp}')>"

class IntegrationLog(Base):
    """Log external system integrations"""
    __tablename__ = "integration_logs"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    integration_type = Column(String, nullable=False)  # 'google_classroom', 'moodle', 'blackboard'
    action = Column(String, nullable=False)  # 'sync', 'import', 'export'
    status = Column(String, nullable=False)  # 'success', 'error', 'pending'
    user_id = Column(String, nullable=True)  # User who initiated the action
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    request_data = Column(JSON, nullable=True)  # Request payload
    response_data = Column(JSON, nullable=True)  # Response data
    error_message = Column(Text, nullable=True)  # Error details if status is 'error'
    
    def __repr__(self):
        return f"<IntegrationLog(type='{self.integration_type}', action='{self.action}', status='{self.status}')>"

class RecommendationFeedback(Base):
    """Store user feedback on AI recommendations"""
    __tablename__ = "recommendation_feedback"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, nullable=False, index=True)
    recommendation_id = Column(String, nullable=False)  # Reference to the recommendation
    feedback_type = Column(String, nullable=False)  # 'helpful', 'not_helpful', 'irrelevant'
    rating = Column(Integer, nullable=True)  # 1-5 rating
    comment = Column(Text, nullable=True)  # Optional user comment
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f"<RecommendationFeedback(user_id='{self.user_id}', type='{self.feedback_type}', rating={self.rating})>"