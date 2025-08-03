# 🔌 EduPath Analytics - API Reference

## Overview

The EduPath Analytics API provides comprehensive endpoints for real-time learning analytics, AI-powered recommendations, progress tracking, and system integrations. All endpoints follow RESTful conventions and return JSON responses.

**Base URL**: `http://localhost:8000/api/v1`  
**Authentication**: Bearer Token (JWT)  
**Content-Type**: `application/json`

## Authentication

### JWT Token Format
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Get Access Token
```http
POST /auth/login
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 1800,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "role": "student"
  }
}
```

## Real-Time Analytics

### Track User Event

Track learning events for real-time analytics processing.

```http
POST /realtime-analytics/track-event
Authorization: Bearer {token}
Content-Type: application/json

{
  "user_id": "user_123",
  "action": "course_start",
  "resource_type": "course",
  "resource_id": "course_456",
  "metadata": {
    "duration": 300,
    "score": 85,
    "module": "introduction"
  }
}
```

**Parameters:**
- `user_id` (string, required): Unique user identifier
- `action` (string, required): Event action type
- `resource_type` (string, optional): Type of resource
- `resource_id` (string, optional): Resource identifier
- `metadata` (object, optional): Additional event data

**Action Types:**
- `page_view`: User viewed a page
- `course_start`: User started a course
- `course_complete`: User completed a course
- `module_start`: User started a module
- `module_complete`: User completed a module
- `quiz_attempt`: User attempted a quiz
- `quiz_complete`: User completed a quiz
- `assignment_submit`: User submitted an assignment
- `video_play`: User played a video
- `video_pause`: User paused a video
- `video_complete`: User completed watching a video
- `discussion_post`: User posted in discussion
- `file_download`: User downloaded a file

**Response:**
```json
{
  "status": "success",
  "message": "Event tracked successfully",
  "event_id": "event_789",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Error Response:**
```json
{
  "status": "error",
  "error": "Invalid action type",
  "code": "INVALID_ACTION",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Get Live Dashboard Data

Retrieve real-time dashboard metrics for a user.

```http
GET /realtime-analytics/dashboard/{user_id}?role=student&timeframe=1h
Authorization: Bearer {token}
```

**Path Parameters:**
- `user_id` (string, required): User identifier

**Query Parameters:**
- `role` (string, optional): User role (`student`, `instructor`, `admin`)
- `timeframe` (string, optional): Time period (`1h`, `6h`, `1d`, `7d`, `30d`)

**Response:**
```json
{
  "status": "success",
  "data": {
    "user_metrics": {
      "courses_enrolled": 5,
      "courses_completed": 2,
      "current_streak": 7,
      "total_study_time": 14400,
      "average_score": 87.5
    },
    "activity_summary": {
      "today": {
        "sessions": 3,
        "time_spent": 180,
        "activities_completed": 8
      },
      "this_week": {
        "sessions": 15,
        "time_spent": 900,
        "activities_completed": 45
      }
    },
    "progress_overview": [
      {
        "course_id": "course_123",
        "course_title": "React Development",
        "progress": 75,
        "last_accessed": "2024-01-15T09:30:00Z"
      }
    ],
    "recent_achievements": [
      {
        "type": "course_completion",
        "title": "JavaScript Fundamentals",
        "earned_at": "2024-01-14T16:45:00Z"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Get Engagement Metrics

Retrieve real-time engagement metrics across the platform.

```http
GET /realtime-analytics/engagement-metrics?timeframe=1h&granularity=5m
Authorization: Bearer {token}
```

**Query Parameters:**
- `timeframe` (string, optional): Time period (`1h`, `6h`, `1d`, `7d`, `30d`)
- `granularity` (string, optional): Data granularity (`1m`, `5m`, `15m`, `1h`)

**Response:**
```json
{
  "status": "success",
  "metrics": {
    "active_users": 89,
    "page_views": 1250,
    "interactions": 456,
    "interaction_rate": 36.5,
    "avg_session_time": 1800,
    "bounce_rate": 12.3,
    "course_engagement": [
      {
        "course_id": "course_123",
        "course_title": "React Development",
        "avg_progress": 65.2,
        "active_students": 23,
        "completion_rate": 78.5
      }
    ],
    "time_series": [
      {
        "timestamp": "2024-01-15T10:00:00Z",
        "active_users": 85,
        "page_views": 120,
        "interactions": 45
      },
      {
        "timestamp": "2024-01-15T10:05:00Z",
        "active_users": 89,
        "page_views": 135,
        "interactions": 52
      }
    ]
  },
  "timeframe": "1h",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Get Progress Tracking

Retrieve learning progress data for users.

```http
GET /realtime-analytics/progress-tracking?user_id=user_123&include_goals=true
Authorization: Bearer {token}
```

**Query Parameters:**
- `user_id` (string, optional): Specific user ID (admin only)
- `include_goals` (boolean, optional): Include learning goals
- `include_milestones` (boolean, optional): Include milestones

**Response:**
```json
{
  "status": "success",
  "data": {
    "total_learning_paths": 15,
    "completed_paths": 8,
    "in_progress_paths": 5,
    "not_started_paths": 2,
    "completion_rate": 53.3,
    "average_progress": 67.8,
    "total_time_spent": 28800,
    "recent_completions": [
      {
        "user_id": "user_123",
        "learning_path_id": "path_456",
        "learning_path_title": "Full Stack Development",
        "progress": 100,
        "completed_at": "2024-01-15T09:45:00Z",
        "time_spent": 7200,
        "final_score": 92
      }
    ],
    "learning_goals": [
      {
        "id": "goal_789",
        "title": "Master React Development",
        "target_date": "2024-06-30",
        "progress": 65,
        "status": "in_progress"
      }
    ],
    "milestones": [
      {
        "id": "milestone_101",
        "title": "Complete 5 React Projects",
        "current_value": 3,
        "target_value": 5,
        "completed": false
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Get Predictive Alerts

Retrieve AI-generated predictive alerts for student intervention.

```http
GET /realtime-analytics/predictive-alerts?user_id=user_123&risk_level=high
Authorization: Bearer {token}
```

**Query Parameters:**
- `user_id` (string, optional): Specific user ID
- `risk_level` (string, optional): Filter by risk level (`low`, `medium`, `high`)
- `alert_type` (string, optional): Filter by alert type

**Response:**
```json
{
  "status": "success",
  "alerts": [
    {
      "id": "alert_456",
      "type": "at_risk_student",
      "user_id": "user_789",
      "risk_level": "high",
      "risk_score": 0.85,
      "confidence": 0.92,
      "recommendation": "Schedule one-on-one session to discuss learning challenges",
      "factors": [
        "Low engagement in past 7 days",
        "Declining quiz scores",
        "Missed 3 assignment deadlines"
      ],
      "suggested_actions": [
        "Send personalized encouragement message",
        "Recommend additional practice materials",
        "Schedule instructor check-in"
      ],
      "last_activity": "2024-01-10T14:20:00Z",
      "activity_count": 3,
      "created_at": "2024-01-15T10:15:00Z"
    }
  ],
  "count": 1,
  "summary": {
    "high_risk": 1,
    "medium_risk": 3,
    "low_risk": 8
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Stream Real-Time Data

Get streaming data for real-time charts and dashboards.

```http
GET /realtime-analytics/stream/engagement?timeframe=5m
Authorization: Bearer {token}
```

**Query Parameters:**
- `timeframe` (string, optional): Streaming window (`1m`, `5m`, `15m`)

**Response:**
```json
{
  "status": "success",
  "data": {
    "timestamp": "2024-01-15T10:30:00Z",
    "active_users": 95,
    "page_views": 1350,
    "interactions": 520,
    "interaction_rate": 38.5,
    "avg_session_time": 1920,
    "new_sessions": 12,
    "returning_users": 83
  },
  "timeframe": "5m"
}
```

## Recommendations

### Get User Recommendations

Retrieve AI-powered personalized recommendations for a user.

```http
GET /recommendations/{user_id}?limit=10&category=course&difficulty=intermediate
Authorization: Bearer {token}
```

**Path Parameters:**
- `user_id` (string, required): User identifier

**Query Parameters:**
- `limit` (integer, optional): Number of recommendations (default: 10, max: 50)
- `category` (string, optional): Filter by category (`course`, `resource`, `skill`, `activity`)
- `difficulty` (string, optional): Filter by difficulty (`beginner`, `intermediate`, `advanced`)
- `type` (string, optional): Recommendation type (`personalized`, `trending`, `similar_users`)

**Response:**
```json
{
  "status": "success",
  "recommendations": [
    {
      "id": "rec_123",
      "title": "Advanced React Patterns",
      "description": "Learn advanced React patterns including render props, higher-order components, and hooks patterns",
      "type": "course",
      "relevance_score": 9.2,
      "reasoning": "Based on your progress in React fundamentals and interest in frontend development",
      "prerequisites": [
        "React Basics",
        "JavaScript ES6+",
        "Component Lifecycle"
      ],
      "expected_outcomes": [
        "Master advanced React patterns",
        "Improve code organization and reusability",
        "Build scalable React applications"
      ],
      "difficulty": "intermediate",
      "estimated_time": "4-6 weeks",
      "category": "Frontend Development",
      "tags": ["React", "JavaScript", "Frontend", "Patterns"],
      "confidence": 0.92,
      "provider": "EduPath",
      "rating": 4.8,
      "enrollment_count": 1250,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1,
  "user_profile": {
    "learning_style": "visual",
    "skill_level": "intermediate",
    "interests": ["frontend", "react", "javascript"],
    "goals": ["full-stack-development"]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Submit Recommendation Feedback

Provide feedback on recommendation quality to improve AI suggestions.

```http
POST /recommendations/feedback
Authorization: Bearer {token}
Content-Type: application/json

{
  "recommendation_id": "rec_123",
  "user_id": "user_456",
  "feedback": "helpful",
  "rating": 4,
  "action_taken": "enrolled",
  "comments": "Great recommendation, exactly what I was looking for!"
}
```

**Parameters:**
- `recommendation_id` (string, required): Recommendation identifier
- `user_id` (string, required): User identifier
- `feedback` (string, required): Feedback type (`helpful`, `not_helpful`, `irrelevant`, `already_known`)
- `rating` (integer, optional): Rating from 1-5
- `action_taken` (string, optional): Action taken (`enrolled`, `bookmarked`, `ignored`, `shared`)
- `comments` (string, optional): Additional feedback comments

**Response:**
```json
{
  "status": "success",
  "message": "Feedback recorded successfully",
  "feedback_id": "feedback_789",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Get Skill Gap Analysis

Retrieve skill gap analysis and targeted recommendations.

```http
GET /recommendations/skill-gaps/{user_id}?include_resources=true
Authorization: Bearer {token}
```

**Path Parameters:**
- `user_id` (string, required): User identifier

**Query Parameters:**
- `include_resources` (boolean, optional): Include recommended resources

**Response:**
```json
{
  "status": "success",
  "skill_gaps": [
    {
      "skill": "Machine Learning",
      "current_level": 2,
      "target_level": 4,
      "gap_score": 2,
      "importance": 9,
      "market_demand": 8.5,
      "learning_path": [
        "Statistics Fundamentals",
        "Python for Data Science",
        "Machine Learning Algorithms",
        "Deep Learning Basics"
      ],
      "recommended_resources": [
        {
          "id": "resource_123",
          "title": "Machine Learning Course",
          "type": "course",
          "duration": "8 weeks",
          "difficulty": "intermediate"
        }
      ],
      "estimated_time": "12-16 weeks",
      "priority": "high"
    }
  ],
  "overall_score": 7.2,
  "improvement_potential": 2.8,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Google Classroom Integration

### Sync Courses

Synchronize courses from Google Classroom.

```http
POST /realtime-analytics/integrations/google-classroom/sync-courses?user_id=user_123
Authorization: Bearer {token}
```

**Query Parameters:**
- `user_id` (string, required): User identifier for authentication

**Response:**
```json
{
  "status": "success",
  "courses_synced": 5,
  "courses": [
    {
      "id": "course_123",
      "title": "Introduction to Computer Science",
      "description": "Fundamentals of programming and computer science concepts",
      "instructor_id": "instructor_456",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "enrollment_code": "abc123",
      "status": "active",
      "classroom_link": "https://classroom.google.com/c/course_123",
      "source": "google_classroom",
      "synced_by": "user_123",
      "synced_at": "2024-01-15T10:30:00Z"
    }
  ],
  "errors": [],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Sync Assignments

Synchronize assignments from a Google Classroom course.

```http
POST /realtime-analytics/integrations/google-classroom/sync-assignments/{course_id}?user_id=user_123
Authorization: Bearer {token}
```

**Path Parameters:**
- `course_id` (string, required): Google Classroom course ID

**Query Parameters:**
- `user_id` (string, required): User identifier for authentication

**Response:**
```json
{
  "status": "success",
  "assignments_synced": 8,
  "assignments": [
    {
      "id": "assignment_789",
      "title": "Programming Assignment 1",
      "description": "Implement a basic calculator using Python",
      "course_id": "course_123",
      "created_at": "2024-01-05T10:00:00Z",
      "updated_at": "2024-01-15T10:30:00Z",
      "due_date": "2024-01-20T23:59:00Z",
      "max_points": 100,
      "work_type": "assignment",
      "status": "published",
      "source": "google_classroom",
      "synced_by": "user_123",
      "synced_at": "2024-01-15T10:30:00Z"
    }
  ],
  "errors": [],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Sync Student Submissions

Synchronize student submissions for an assignment.

```http
POST /realtime-analytics/integrations/google-classroom/sync-submissions/{course_id}/{assignment_id}
Authorization: Bearer {token}
```

**Path Parameters:**
- `course_id` (string, required): Google Classroom course ID
- `assignment_id` (string, required): Assignment ID

**Response:**
```json
{
  "status": "success",
  "submissions_synced": 25,
  "submissions": [
    {
      "id": "submission_456",
      "assignment_id": "assignment_789",
      "student_id": "student_123",
      "submitted_at": "2024-01-18T14:30:00Z",
      "status": "submitted",
      "grade": 85,
      "feedback": "Good work! Consider optimizing the algorithm.",
      "late": false,
      "source": "google_classroom"
    }
  ],
  "summary": {
    "total_students": 30,
    "submitted": 25,
    "not_submitted": 5,
    "late_submissions": 3,
    "average_grade": 82.5
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Get Classroom Analytics

Retrieve analytics data from Google Classroom.

```http
GET /realtime-analytics/integrations/google-classroom/analytics/{course_id}?timeframe=7d
Authorization: Bearer {token}
```

**Path Parameters:**
- `course_id` (string, required): Google Classroom course ID

**Query Parameters:**
- `timeframe` (string, optional): Time period (`7d`, `30d`, `90d`)

**Response:**
```json
{
  "course_id": "course_123",
  "timeframe": "7d",
  "activity": {
    "total_posts": 45,
    "student_posts": 32,
    "teacher_posts": 13,
    "announcements": 5,
    "assignments_created": 3,
    "submissions_received": 78,
    "comments": 156
  },
  "engagement": {
    "active_students": 28,
    "total_students": 35,
    "engagement_rate": 80.0,
    "avg_posts_per_student": 1.14,
    "avg_assignment_completion_time": 2.5,
    "participation_trend": "increasing"
  },
  "assignment_completion": {
    "total_assignments": 8,
    "avg_completion_rate": 87.5,
    "on_time_submissions": 75.0,
    "late_submissions": 12.5,
    "missing_submissions": 12.5,
    "grade_distribution": {
      "A": 35,
      "B": 40,
      "C": 20,
      "D": 5,
      "F": 0
    }
  },
  "performance_metrics": {
    "average_grade": 84.2,
    "median_grade": 86.0,
    "grade_trend": "stable",
    "top_performers": 8,
    "at_risk_students": 3
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Export Analytics to Classroom

Export analytics data back to Google Classroom.

```http
POST /realtime-analytics/integrations/google-classroom/export-analytics/{course_id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "analytics_data": {
    "engagement_report": {
      "active_students": 28,
      "participation_rate": 80.0,
      "avg_time_spent": 1800
    },
    "performance_summary": {
      "average_grade": 84.2,
      "completion_rate": 87.5,
      "improvement_areas": ["time_management", "quiz_performance"]
    }
  },
  "export_format": "announcement",
  "include_charts": true
}
```

**Parameters:**
- `analytics_data` (object, required): Analytics data to export
- `export_format` (string, optional): Export format (`announcement`, `private_comment`, `grade_comment`)
- `include_charts` (boolean, optional): Include visual charts

**Response:**
```json
{
  "status": "success",
  "export_id": "export_789",
  "classroom_post_id": "post_456",
  "message": "Analytics report posted to Google Classroom successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Analytics & Reporting

### Generate Report

Generate custom analytics reports in various formats.

```http
POST /analytics/reports/generate
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Monthly Learning Analytics Report",
  "description": "Comprehensive analysis of learning engagement and performance",
  "date_range": {
    "start": "2024-01-01",
    "end": "2024-01-31"
  },
  "metrics": ["engagement", "completion", "performance", "time"],
  "filters": {
    "course_ids": ["course_123", "course_456"],
    "user_roles": ["student"],
    "min_activity": 5
  },
  "format": "pdf",
  "include_charts": true,
  "include_raw_data": false
}
```

**Parameters:**
- `title` (string, required): Report title
- `description` (string, optional): Report description
- `date_range` (object, required): Start and end dates
- `metrics` (array, required): Metrics to include
- `filters` (object, optional): Data filters
- `format` (string, required): Output format (`pdf`, `excel`, `csv`, `json`)
- `include_charts` (boolean, optional): Include visualizations
- `include_raw_data` (boolean, optional): Include raw data

**Response:**
```json
{
  "status": "success",
  "report_id": "report_789",
  "download_url": "/api/v1/analytics/reports/download/report_789",
  "expires_at": "2024-01-16T10:30:00Z",
  "file_size": 2048576,
  "format": "pdf",
  "generated_at": "2024-01-15T10:30:00Z"
}
```

### Schedule Report

Schedule automated report generation and delivery.

```http
POST /analytics/reports/schedule
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Weekly Engagement Report",
  "report_config": {
    "metrics": ["engagement", "completion"],
    "format": "pdf",
    "include_charts": true
  },
  "schedule": {
    "frequency": "weekly",
    "day_of_week": "monday",
    "time": "09:00"
  },
  "recipients": [
    "instructor@example.com",
    "admin@example.com"
  ],
  "active": true
}
```

**Parameters:**
- `name` (string, required): Schedule name
- `report_config` (object, required): Report configuration
- `schedule` (object, required): Schedule settings
- `recipients` (array, required): Email recipients
- `active` (boolean, optional): Schedule status

**Response:**
```json
{
  "status": "success",
  "schedule_id": "schedule_456",
  "next_run": "2024-01-22T09:00:00Z",
  "message": "Report scheduled successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Download Report

Download a generated report file.

```http
GET /analytics/reports/download/{report_id}
Authorization: Bearer {token}
```

**Path Parameters:**
- `report_id` (string, required): Report identifier

**Response:**
- Binary file content with appropriate Content-Type header
- Content-Disposition header for filename

## WebSocket API

### Connection

Connect to real-time analytics WebSocket.

```javascript
const ws = new WebSocket('ws://localhost:8000/ws/analytics/user_123?role=student');
```

**URL Parameters:**
- `user_id` (string, required): User identifier
- `role` (string, optional): User role

### Subscribe to Channels

Subscribe to specific data channels.

```javascript
ws.send(JSON.stringify({
  type: 'subscribe',
  channels: ['engagement', 'progress', 'alerts', 'notifications']
}));
```

**Message Types:**
- `subscribe`: Subscribe to channels
- `unsubscribe`: Unsubscribe from channels
- `track_event`: Track user event
- `ping`: Keep connection alive

### Event Messages

#### Live Update
```json
{
  "type": "live_update",
  "channel": "engagement",
  "data": {
    "active_users": 95,
    "page_views": 1350,
    "interactions": 520
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### User Event
```json
{
  "type": "user_event",
  "user_id": "user_123",
  "action": "course_completion",
  "resource_id": "course_456",
  "metadata": {
    "score": 92,
    "time_spent": 3600
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### Alert
```json
{
  "type": "alert",
  "alert": {
    "id": "alert_456",
    "type": "at_risk_student",
    "user_id": "user_789",
    "risk_level": "high",
    "message": "Student showing signs of disengagement"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### Notification
```json
{
  "type": "notification",
  "notification": {
    "id": "notif_123",
    "title": "New Course Available",
    "message": "Advanced React Patterns course is now available",
    "action_url": "/courses/advanced-react",
    "priority": "medium"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Error Handling

### Error Response Format

All API errors follow a consistent format:

```json
{
  "status": "error",
  "error": "Detailed error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional error details"
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "request_id": "req_123456"
}
```

### HTTP Status Codes

| Code | Description | Usage |
|------|-------------|-------|
| 200 | OK | Successful request |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 422 | Unprocessable Entity | Validation errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Service temporarily unavailable |

### Common Error Codes

| Code | Description |
|------|-------------|
| `INVALID_TOKEN` | JWT token is invalid or expired |
| `INSUFFICIENT_PERMISSIONS` | User lacks required permissions |
| `VALIDATION_ERROR` | Request validation failed |
| `RESOURCE_NOT_FOUND` | Requested resource doesn't exist |
| `RATE_LIMIT_EXCEEDED` | API rate limit exceeded |
| `EXTERNAL_SERVICE_ERROR` | External service (Google Classroom, AI) error |
| `DATABASE_ERROR` | Database operation failed |
| `CACHE_ERROR` | Redis cache operation failed |

## Rate Limiting

### Limits

| Endpoint Category | Requests per Minute | Burst Limit |
|-------------------|-------------------|-------------|
| Authentication | 10 | 20 |
| Real-time Analytics | 100 | 200 |
| Recommendations | 30 | 60 |
| Reports | 5 | 10 |
| WebSocket | 1000 messages | 2000 |

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248000
X-RateLimit-Retry-After: 60
```

## Pagination

### Query Parameters

```http
GET /api/v1/analytics/events?page=1&limit=50&sort=timestamp&order=desc
```

**Parameters:**
- `page` (integer, optional): Page number (default: 1)
- `limit` (integer, optional): Items per page (default: 20, max: 100)
- `sort` (string, optional): Sort field
- `order` (string, optional): Sort order (`asc`, `desc`)

### Response Format

```json
{
  "status": "success",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1250,
    "pages": 25,
    "has_next": true,
    "has_prev": false,
    "next_page": 2,
    "prev_page": null
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## SDK Examples

### Python SDK

```python
import requests
from typing import Dict, List, Optional

class EduPathAnalytics:
    def __init__(self, base_url: str, api_key: str):
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
    
    def track_event(self, user_id: str, action: str, **kwargs) -> Dict:
        """Track a user event"""
        data = {
            'user_id': user_id,
            'action': action,
            **kwargs
        }
        response = requests.post(
            f'{self.base_url}/realtime-analytics/track-event',
            json=data,
            headers=self.headers
        )
        return response.json()
    
    def get_recommendations(self, user_id: str, limit: int = 10) -> List[Dict]:
        """Get user recommendations"""
        response = requests.get(
            f'{self.base_url}/recommendations/{user_id}?limit={limit}',
            headers=self.headers
        )
        return response.json()['recommendations']

# Usage
analytics = EduPathAnalytics('http://localhost:8000/api/v1', 'your-api-key')
analytics.track_event('user_123', 'course_start', resource_id='course_456')
recommendations = analytics.get_recommendations('user_123', limit=5)
```

### JavaScript SDK

```javascript
class EduPathAnalytics {
  constructor(baseUrl, apiKey) {
    this.baseUrl = baseUrl;
    this.headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };
  }

  async trackEvent(userId, action, metadata = {}) {
    const response = await fetch(`${this.baseUrl}/realtime-analytics/track-event`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        user_id: userId,
        action: action,
        ...metadata
      })
    });
    return response.json();
  }

  async getRecommendations(userId, options = {}) {
    const params = new URLSearchParams(options);
    const response = await fetch(
      `${this.baseUrl}/recommendations/${userId}?${params}`,
      { headers: this.headers }
    );
    const data = await response.json();
    return data.recommendations;
  }

  connectWebSocket(userId, role = 'student') {
    const ws = new WebSocket(`ws://localhost:8000/ws/analytics/${userId}?role=${role}`);
    
    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: 'subscribe',
        channels: ['engagement', 'progress', 'alerts']
      }));
    };

    return ws;
  }
}

// Usage
const analytics = new EduPathAnalytics('http://localhost:8000/api/v1', 'your-api-key');
await analytics.trackEvent('user_123', 'course_start', { resource_id: 'course_456' });
const recommendations = await analytics.getRecommendations('user_123', { limit: 5 });
const ws = analytics.connectWebSocket('user_123', 'student');
```

This comprehensive API reference provides all the information needed to integrate with the EduPath Analytics system, including detailed endpoint documentation, request/response examples, error handling, and SDK examples for common programming languages.