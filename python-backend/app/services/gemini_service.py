"""
Gemini AI Service for smart recommendations and insights
"""

import google.generativeai as genai
from typing import Dict, List, Any, Optional
import json
import asyncio
from datetime import datetime
import logging
from app.core.config import settings
from app.core.database import SessionLocal
from app.models.analytics import UserActivity, CourseEngagement

logger = logging.getLogger(__name__)

class GeminiService:
    """Service for Gemini AI integration"""
    
    def __init__(self):
        self.model = None
        self.initialized = False
    
    async def initialize(self):
        """Initialize Gemini AI service"""
        try:
            if settings.GEMINI_API_KEY:
                genai.configure(api_key=settings.GEMINI_API_KEY)
                self.model = genai.GenerativeModel('gemini-pro')
                self.initialized = True
                logger.info("Gemini AI service initialized successfully")
            else:
                logger.warning("Gemini API key not provided. AI features will be limited.")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini AI service: {str(e)}")
    
    async def generate_insights(self, prompt: str, context: Dict[str, Any], user_id: str) -> Dict[str, Any]:
        """Generate AI-powered insights based on user data and context"""
        if not self.initialized:
            return {"error": "AI service not initialized"}
        
        try:
            # Get user analytics data for context
            user_data = await self._get_user_analytics_context(user_id)
            
            # Construct enhanced prompt with context
            enhanced_prompt = self._build_insights_prompt(prompt, context, user_data)
            
            # Generate response
            response = await asyncio.to_thread(
                self.model.generate_content, enhanced_prompt
            )
            
            # Parse and structure the response
            insights = self._parse_insights_response(response.text)
            
            return {
                "insights": insights,
                "confidence": self._calculate_confidence(insights),
                "generated_at": datetime.utcnow().isoformat(),
                "user_id": user_id
            }
            
        except Exception as e:
            logger.error(f"Error generating insights: {str(e)}")
            return {"error": f"Failed to generate insights: {str(e)}"}
    
    async def get_smart_recommendations(self, user_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Get AI-powered smart recommendations for a user"""
        if not self.initialized:
            return []
        
        try:
            # Get user profile and learning history
            user_profile = await self._get_user_profile(user_id)
            learning_history = await self._get_learning_history(user_id)
            
            # Generate recommendations prompt
            prompt = self._build_recommendations_prompt(user_profile, learning_history, limit)
            
            # Get AI recommendations
            response = await asyncio.to_thread(
                self.model.generate_content, prompt
            )
            
            # Parse recommendations
            recommendations = self._parse_recommendations_response(response.text)
            
            # Enhance with additional metadata
            enhanced_recommendations = await self._enhance_recommendations(recommendations, user_id)
            
            return enhanced_recommendations[:limit]
            
        except Exception as e:
            logger.error(f"Error generating recommendations: {str(e)}")
            return []
    
    async def analyze_learning_patterns(self, user_id: str) -> Dict[str, Any]:
        """Analyze user learning patterns using AI"""
        if not self.initialized:
            return {"error": "AI service not initialized"}
        
        try:
            # Get comprehensive user data
            activity_data = await self._get_user_activity_data(user_id)
            engagement_data = await self._get_user_engagement_data(user_id)
            
            # Build analysis prompt
            prompt = self._build_pattern_analysis_prompt(activity_data, engagement_data)
            
            # Generate analysis
            response = await asyncio.to_thread(
                self.model.generate_content, prompt
            )
            
            # Parse and structure analysis
            analysis = self._parse_pattern_analysis(response.text)
            
            return {
                "patterns": analysis,
                "user_id": user_id,
                "analyzed_at": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error analyzing learning patterns: {str(e)}")
            return {"error": f"Failed to analyze patterns: {str(e)}"}
    
    async def predict_student_success(self, user_id: str) -> Dict[str, Any]:
        """Predict student success probability using AI"""
        if not self.initialized:
            return {"error": "AI service not initialized"}
        
        try:
            # Get comprehensive student data
            student_data = await self._get_comprehensive_student_data(user_id)
            
            # Build prediction prompt
            prompt = self._build_success_prediction_prompt(student_data)
            
            # Generate prediction
            response = await asyncio.to_thread(
                self.model.generate_content, prompt
            )
            
            # Parse prediction
            prediction = self._parse_success_prediction(response.text)
            
            return {
                "prediction": prediction,
                "user_id": user_id,
                "predicted_at": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error predicting student success: {str(e)}")
            return {"error": f"Failed to predict success: {str(e)}"}
    
    def _build_insights_prompt(self, prompt: str, context: Dict[str, Any], user_data: Dict[str, Any]) -> str:
        """Build enhanced prompt for insights generation"""
        return f"""
        As an AI educational analyst, provide insights based on the following:
        
        User Query: {prompt}
        
        Context: {json.dumps(context, indent=2)}
        
        User Analytics Data: {json.dumps(user_data, indent=2)}
        
        Please provide:
        1. Key insights and observations
        2. Actionable recommendations
        3. Potential areas of concern
        4. Opportunities for improvement
        5. Confidence level (1-10)
        
        Format your response as structured JSON with clear categories.
        """
    
    def _build_recommendations_prompt(self, user_profile: Dict[str, Any], learning_history: Dict[str, Any], limit: int) -> str:
        """Build prompt for smart recommendations"""
        return f"""
        As an AI educational advisor, recommend {limit} learning resources/courses for this user:
        
        User Profile: {json.dumps(user_profile, indent=2)}
        
        Learning History: {json.dumps(learning_history, indent=2)}
        
        Please recommend courses/resources that:
        1. Match the user's skill level and interests
        2. Fill knowledge gaps
        3. Support career goals
        4. Consider learning preferences
        5. Are appropriately challenging
        
        For each recommendation, provide:
        - Title and description
        - Relevance score (1-10)
        - Reasoning
        - Prerequisites
        - Expected outcomes
        
        Format as JSON array.
        """
    
    def _build_pattern_analysis_prompt(self, activity_data: Dict[str, Any], engagement_data: Dict[str, Any]) -> str:
        """Build prompt for learning pattern analysis"""
        return f"""
        Analyze the learning patterns for this student:
        
        Activity Data: {json.dumps(activity_data, indent=2)}
        
        Engagement Data: {json.dumps(engagement_data, indent=2)}
        
        Identify:
        1. Learning preferences (time, format, pace)
        2. Engagement patterns
        3. Strengths and weaknesses
        4. Risk factors
        5. Optimal learning strategies
        
        Provide actionable insights for both student and instructors.
        Format as structured JSON.
        """
    
    def _build_success_prediction_prompt(self, student_data: Dict[str, Any]) -> str:
        """Build prompt for success prediction"""
        return f"""
        Predict the likelihood of student success based on:
        
        Student Data: {json.dumps(student_data, indent=2)}
        
        Provide:
        1. Success probability (0-100%)
        2. Key success factors
        3. Risk factors
        4. Intervention recommendations
        5. Timeline predictions
        
        Format as structured JSON with confidence intervals.
        """
    
    async def _get_user_analytics_context(self, user_id: str) -> Dict[str, Any]:
        """Get user analytics data for context"""
        db = SessionLocal()
        try:
            # Get recent activity
            activities = db.query(UserActivity).filter(
                UserActivity.user_id == user_id
            ).order_by(UserActivity.timestamp.desc()).limit(50).all()
            
            # Get engagement data
            engagements = db.query(CourseEngagement).filter(
                CourseEngagement.user_id == user_id
            ).order_by(CourseEngagement.last_accessed.desc()).limit(20).all()
            
            return {
                "recent_activities": [
                    {
                        "action": activity.action,
                        "resource_type": activity.resource_type,
                        "timestamp": activity.timestamp.isoformat(),
                        "duration": activity.duration
                    } for activity in activities
                ],
                "course_engagements": [
                    {
                        "course_id": engagement.course_id,
                        "progress": engagement.progress,
                        "time_spent": engagement.time_spent,
                        "last_accessed": engagement.last_accessed.isoformat()
                    } for engagement in engagements
                ]
            }
        finally:
            db.close()
    
    async def _get_user_profile(self, user_id: str) -> Dict[str, Any]:
        """Get user profile data"""
        # This would typically come from your user database
        return {
            "user_id": user_id,
            "learning_goals": ["web development", "data science"],
            "skill_level": "intermediate",
            "preferred_learning_style": "visual",
            "available_time": "2-3 hours/week"
        }
    
    async def _get_learning_history(self, user_id: str) -> Dict[str, Any]:
        """Get user learning history"""
        db = SessionLocal()
        try:
            engagements = db.query(CourseEngagement).filter(
                CourseEngagement.user_id == user_id
            ).all()
            
            return {
                "completed_courses": len([e for e in engagements if e.progress >= 100]),
                "in_progress_courses": len([e for e in engagements if 0 < e.progress < 100]),
                "total_time_spent": sum(e.time_spent for e in engagements),
                "average_progress": sum(e.progress for e in engagements) / len(engagements) if engagements else 0
            }
        finally:
            db.close()
    
    def _parse_insights_response(self, response_text: str) -> Dict[str, Any]:
        """Parse AI insights response"""
        try:
            # Try to parse as JSON first
            return json.loads(response_text)
        except json.JSONDecodeError:
            # If not JSON, structure the text response
            return {
                "raw_insights": response_text,
                "structured": False
            }
    
    def _parse_recommendations_response(self, response_text: str) -> List[Dict[str, Any]]:
        """Parse AI recommendations response"""
        try:
            return json.loads(response_text)
        except json.JSONDecodeError:
            # Parse text response into structured format
            return [{"title": "AI Recommendation", "description": response_text, "relevance_score": 7}]
    
    def _parse_pattern_analysis(self, response_text: str) -> Dict[str, Any]:
        """Parse pattern analysis response"""
        try:
            return json.loads(response_text)
        except json.JSONDecodeError:
            return {"analysis": response_text, "structured": False}
    
    def _parse_success_prediction(self, response_text: str) -> Dict[str, Any]:
        """Parse success prediction response"""
        try:
            return json.loads(response_text)
        except json.JSONDecodeError:
            return {"prediction": response_text, "structured": False}
    
    def _calculate_confidence(self, insights: Dict[str, Any]) -> float:
        """Calculate confidence score for insights"""
        # Simple confidence calculation based on data completeness
        return 0.85  # Placeholder
    
    async def _enhance_recommendations(self, recommendations: List[Dict[str, Any]], user_id: str) -> List[Dict[str, Any]]:
        """Enhance recommendations with additional metadata"""
        # Add metadata like availability, prerequisites, etc.
        for rec in recommendations:
            rec["enhanced_at"] = datetime.utcnow().isoformat()
            rec["user_id"] = user_id
        return recommendations
    
    async def _get_user_activity_data(self, user_id: str) -> Dict[str, Any]:
        """Get comprehensive user activity data"""
        return await self._get_user_analytics_context(user_id)
    
    async def _get_user_engagement_data(self, user_id: str) -> Dict[str, Any]:
        """Get user engagement data"""
        return await self._get_learning_history(user_id)
    
    async def _get_comprehensive_student_data(self, user_id: str) -> Dict[str, Any]:
        """Get comprehensive student data for predictions"""
        profile = await self._get_user_profile(user_id)
        history = await self._get_learning_history(user_id)
        analytics = await self._get_user_analytics_context(user_id)
        
        return {
            "profile": profile,
            "history": history,
            "analytics": analytics
        }