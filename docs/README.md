# 📚 EduPath Analytics - Complete Documentation

Welcome to the comprehensive documentation for EduPath Analytics, a real-time Learning Management System with advanced analytics and AI-powered features.

## 📖 Table of Contents

1. [Getting Started](#getting-started)
2. [Architecture Overview](#architecture-overview)
3. [API Reference](#api-reference)
4. [Frontend Components](#frontend-components)
5. [Backend Services](#backend-services)
6. [Database Schema](#database-schema)
7. [Integration Guides](#integration-guides)
8. [Deployment Guide](#deployment-guide)
9. [Troubleshooting](#troubleshooting)
10. [Best Practices](#best-practices)

## 🚀 Getting Started

### System Requirements

| Component | Minimum Version | Recommended |
|-----------|----------------|-------------|
| Node.js | 18.0+ | 20.0+ |
| Python | 3.9+ | 3.11+ |
| PostgreSQL | 13+ | 15+ |
| Redis | 6+ | 7+ |
| RAM | 4GB | 8GB+ |
| Storage | 10GB | 50GB+ |

### Quick Installation

```bash
# 1. Clone repository
git clone <repository-url>
cd LMS

# 2. Install dependencies
npm install
cd python-backend && pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Edit .env with your settings

# 4. Initialize database
python -c "from app.core.database import engine; from app.models.analytics import Base; Base.metadata.create_all(bind=engine)"

# 5. Start services
redis-server &
python main.py &
npm run dev
```

## 🏗️ Architecture Overview

### System Architecture

```mermaid
graph TB
    A[Frontend React App] --> B[FastAPI Backend]
    B --> C[PostgreSQL Database]
    B --> D[Redis Cache]
    B --> E[Google Gemini AI]
    B --> F[Google Classroom API]
    A --> G[WebSocket Connection]
    G --> B
    B --> H[Background Tasks]
    H --> I[Analytics Processing]
```

### Technology Stack

#### Frontend
- **React 18.3+**: Modern UI library with hooks
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Data visualization library
- **Socket.io Client**: Real-time communication

#### Backend
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: SQL toolkit and ORM
- **Redis**: In-memory data structure store
- **Celery**: Distributed task queue
- **Pydantic**: Data validation using Python type hints
- **WebSockets**: Real-time bidirectional communication

#### AI & ML
- **Google Gemini**: Large language model for recommendations
- **Scikit-learn**: Machine learning library
- **Pandas**: Data manipulation and analysis
- **NumPy**: Numerical computing

#### External Integrations
- **Google Classroom API**: Course and assignment sync
- **OAuth 2.0**: Secure authentication
- **JWT**: JSON Web Tokens for session management

## 🔌 API Reference

### Authentication

All API endpoints require authentication unless specified otherwise.

```http
Authorization: Bearer <jwt_token>
```

### Core Endpoints

#### Real-Time Analytics

##### Track User Event
```http
POST /api/v1/realtime-analytics/track-event
Content-Type: application/json

{
  "user_id": "string",
  "action": "page_view|course_start|course_complete|quiz_attempt",
  "resource_type": "course|module|quiz|assignment",
  "resource_id": "string",
  "metadata": {
    "duration": 300,
    "score": 85,
    "attempts": 1
  }
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Event tracked successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

##### Get Live Dashboard Data
```http
GET /api/v1/realtime-analytics/dashboard/{user_id}?role=student|instructor|admin
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "active_users": 150,
    "total_courses": 25,
    "completion_rate": 78.5,
    "engagement_score": 8.4,
    "recent_activities": [...],
    "performance_metrics": {...}
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

##### Get Engagement Metrics
```http
GET /api/v1/realtime-analytics/engagement-metrics?timeframe=1h|6h|1d|7d|30d
```

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
    "course_engagement": [
      {
        "course_id": "course_123",
        "avg_progress": 65.2,
        "active_students": 23
      }
    ]
  },
  "timeframe": "1h",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

##### Get Progress Tracking
```http
GET /api/v1/realtime-analytics/progress-tracking?user_id=optional_user_id
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "total_learning_paths": 15,
    "completed_paths": 8,
    "in_progress_paths": 5,
    "completion_rate": 53.3,
    "average_progress": 67.8,
    "recent_completions": [
      {
        "user_id": "user_123",
        "learning_path_id": "path_456",
        "progress": 100,
        "completed_at": "2024-01-15T09:45:00Z"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

##### Get Predictive Alerts
```http
GET /api/v1/realtime-analytics/predictive-alerts?user_id=optional_user_id
```

**Response:**
```json
{
  "status": "success",
  "alerts": [
    {
      "type": "at_risk_student",
      "user_id": "user_789",
      "risk_level": "high",
      "risk_score": 0.85,
      "recommendation": "Schedule one-on-one session to discuss learning challenges",
      "last_activity": "2024-01-10T14:20:00Z",
      "activity_count": 3
    }
  ],
  "count": 1,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### Recommendations

##### Get User Recommendations
```http
GET /api/v1/recommendations/{user_id}?limit=10&category=course|resource|skill
```

**Response:**
```json
{
  "status": "success",
  "recommendations": [
    {
      "id": "rec_123",
      "title": "Advanced React Patterns",
      "description": "Learn advanced React patterns and best practices",
      "type": "course",
      "relevance_score": 9.2,
      "reasoning": "Based on your progress in React fundamentals and interest in frontend development",
      "prerequisites": ["React Basics", "JavaScript ES6+"],
      "expected_outcomes": ["Master advanced React patterns", "Improve code organization"],
      "difficulty": "intermediate",
      "estimated_time": "4-6 weeks",
      "category": "Frontend Development",
      "tags": ["React", "JavaScript", "Frontend"],
      "confidence": 0.92
    }
  ],
  "total": 1,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

##### Submit Recommendation Feedback
```http
POST /api/v1/recommendations/feedback
Content-Type: application/json

{
  "recommendation_id": "rec_123",
  "user_id": "user_456",
  "feedback": "helpful|not_helpful|irrelevant",
  "rating": 4,
  "comments": "Great recommendation, exactly what I was looking for!"
}
```

#### Google Classroom Integration

##### Sync Courses
```http
POST /api/v1/realtime-analytics/integrations/google-classroom/sync-courses?user_id=user_123
```

**Response:**
```json
{
  "status": "success",
  "courses_synced": 5,
  "courses": [
    {
      "id": "course_123",
      "title": "Introduction to Computer Science",
      "description": "Fundamentals of programming and computer science",
      "instructor_id": "instructor_456",
      "enrollment_code": "abc123",
      "classroom_link": "https://classroom.google.com/c/course_123"
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

##### Sync Assignments
```http
POST /api/v1/realtime-analytics/integrations/google-classroom/sync-assignments/{course_id}?user_id=user_123
```

**Response:**
```json
{
  "status": "success",
  "assignments_synced": 8,
  "assignments": [
    {
      "id": "assignment_789",
      "title": "Programming Assignment 1",
      "description": "Implement a basic calculator",
      "course_id": "course_123",
      "due_date": "2024-01-20T23:59:00Z",
      "max_points": 100,
      "work_type": "assignment"
    }
  ],
  "timestamp": "2024-01-15T10:30:00Z"
}
```

##### Get Classroom Analytics
```http
GET /api/v1/realtime-analytics/integrations/google-classroom/analytics/{course_id}?timeframe=7d|30d|90d
```

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
    "submissions_received": 78
  },
  "engagement": {
    "active_students": 28,
    "total_students": 35,
    "engagement_rate": 80.0,
    "avg_posts_per_student": 1.14,
    "avg_assignment_completion_time": 2.5
  },
  "assignment_completion": {
    "total_assignments": 8,
    "avg_completion_rate": 87.5,
    "on_time_submissions": 75.0,
    "late_submissions": 12.5,
    "missing_submissions": 12.5
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### WebSocket Events

#### Connection
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/analytics/user_123');
```

#### Subscribe to Channels
```javascript
ws.send(JSON.stringify({
  type: 'subscribe',
  channels: ['engagement', 'progress', 'alerts']
}));
```

#### Event Types

##### Live Update
```json
{
  "type": "live_update",
  "engagement": {
    "active_users": 95,
    "page_views": 1350,
    "interactions": 520
  },
  "progress": {
    "completion_rate": 78.2,
    "average_progress": 65.8
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

##### User Event
```json
{
  "type": "user_event",
  "user_id": "user_123",
  "action": "course_completion",
  "resource_id": "course_456",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

##### Alert
```json
{
  "type": "alert",
  "alert": {
    "type": "at_risk_student",
    "user_id": "user_789",
    "risk_level": "high",
    "recommendation": "Immediate intervention required"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🎨 Frontend Components

### Component Architecture

```
src/
├── components/
│   ├── analytics/
│   │   ├── RealTimeAnalyticsDashboard.tsx
│   │   └── AnalyticsReporting.tsx
│   ├── recommendations/
│   │   └── SmartRecommendations.tsx
│   ├── progress/
│   │   └── ProgressTracking.tsx
│   └── integrations/
│       └── GoogleClassroomIntegration.tsx
├── hooks/
│   ├── useWebSocket.ts
│   ├── useAnalytics.ts
│   └── useRecommendations.ts
├── services/
│   ├── api.ts
│   ├── websocket.ts
│   └── analytics.ts
└── utils/
    ├── formatters.ts
    └── validators.ts
```

### Key Components

#### RealTimeAnalyticsDashboard

**Purpose**: Display live analytics data with real-time updates

**Props**:
```typescript
interface RealTimeAnalyticsDashboardProps {
  userId?: string;
  role?: 'student' | 'instructor' | 'admin';
  refreshInterval?: number;
}
```

**Features**:
- Live metrics display
- WebSocket integration
- Interactive charts
- Predictive alerts
- Responsive design

**Usage**:
```tsx
import RealTimeAnalyticsDashboard from './components/analytics/RealTimeAnalyticsDashboard';

<RealTimeAnalyticsDashboard 
  userId="user_123" 
  role="instructor"
  refreshInterval={5000}
/>
```

#### SmartRecommendations

**Purpose**: Display AI-powered personalized recommendations

**Props**:
```typescript
interface SmartRecommendationsProps {
  userId: string;
  category?: 'all' | 'course' | 'resource' | 'activity' | 'skill';
  limit?: number;
}
```

**Features**:
- AI-powered suggestions
- Skill gap analysis
- Learning goals tracking
- Feedback collection
- Category filtering

**Usage**:
```tsx
import SmartRecommendations from './components/recommendations/SmartRecommendations';

<SmartRecommendations 
  userId="user_123"
  category="course"
  limit={10}
/>
```

#### ProgressTracking

**Purpose**: Monitor and display learning progress

**Props**:
```typescript
interface ProgressTrackingProps {
  userId?: string;
  timeframe?: '7d' | '30d' | '90d' | '1y';
  showGoals?: boolean;
}
```

**Features**:
- Real-time progress updates
- Milestone tracking
- Goal management
- Study session analytics
- Visual progress indicators

**Usage**:
```tsx
import ProgressTracking from './components/progress/ProgressTracking';

<ProgressTracking 
  userId="user_123"
  timeframe="30d"
  showGoals={true}
/>
```

### Custom Hooks

#### useWebSocket

**Purpose**: Manage WebSocket connections for real-time updates

```typescript
const useWebSocket = (userId: string, channels: string[]) => {
  const [isConnected, setIsConnected] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // WebSocket connection logic
  
  return { isConnected, data, error, sendMessage };
};
```

**Usage**:
```tsx
const { isConnected, data, sendMessage } = useWebSocket('user_123', ['engagement', 'progress']);
```

#### useAnalytics

**Purpose**: Fetch and manage analytics data

```typescript
const useAnalytics = (userId: string, timeframe: string) => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Analytics data fetching logic
  
  return { metrics, loading, error, refetch };
};
```

**Usage**:
```tsx
const { metrics, loading, error, refetch } = useAnalytics('user_123', '30d');
```

## ⚙️ Backend Services

### Service Architecture

```
app/
├── services/
│   ├── realtime_analytics.py
│   ├── google_classroom_service.py
│   ├── gemini_service.py
│   ├── analytics_service.py
│   └── websocket_manager.py
├── api/routes/
│   ├── realtime_analytics.py
│   ├── recommendations.py
│   └── integrations.py
├── models/
│   └── analytics.py
└── core/
    ├── database.py
    ├── redis_client.py
    └── config.py
```

### Core Services

#### RealTimeAnalyticsService

**Purpose**: Handle real-time analytics processing and data aggregation

```python
class RealTimeAnalyticsService:
    async def track_live_event(self, user_id: str, event_data: Dict[str, Any]) -> Dict[str, Any]
    async def get_live_dashboard_data(self, user_id: str, role: str) -> Dict[str, Any]
    async def get_realtime_engagement_metrics(self, timeframe: str) -> Dict[str, Any]
    async def get_live_progress_tracking(self, user_id: Optional[str] = None) -> Dict[str, Any]
    async def get_predictive_alerts(self, user_id: Optional[str] = None) -> List[Dict[str, Any]]
```

**Key Features**:
- Real-time event processing
- Live metrics calculation
- Predictive analytics
- Performance optimization with Redis caching

#### GeminiService

**Purpose**: AI-powered recommendations and insights using Google Gemini

```python
class GeminiService:
    async def generate_recommendations(self, user_profile: Dict[str, Any], context: Dict[str, Any]) -> List[Dict[str, Any]]
    async def analyze_learning_patterns(self, user_data: Dict[str, Any]) -> Dict[str, Any]
    async def predict_success_probability(self, student_data: Dict[str, Any]) -> float
    async def generate_intervention_recommendations(self, risk_factors: Dict[str, Any]) -> List[str]
```

**Key Features**:
- Personalized recommendations
- Learning pattern analysis
- Success prediction
- Intervention suggestions

#### GoogleClassroomService

**Purpose**: Integration with Google Classroom API

```python
class GoogleClassroomService:
    async def sync_courses(self, user_id: str) -> Dict[str, Any]
    async def sync_assignments(self, course_id: str, user_id: str) -> Dict[str, Any]
    async def sync_student_submissions(self, course_id: str, assignment_id: str) -> Dict[str, Any]
    async def get_classroom_analytics(self, course_id: str, timeframe: str) -> Dict[str, Any]
    async def export_analytics_to_classroom(self, course_id: str, analytics_data: Dict[str, Any]) -> Dict[str, Any]
```

**Key Features**:
- Course synchronization
- Assignment management
- Analytics export
- OAuth 2.0 authentication

#### WebSocketManager

**Purpose**: Manage real-time WebSocket connections

```python
class WebSocketManager:
    async def connect(self, websocket: WebSocket, user_id: str, role: str = "student")
    async def disconnect(self, user_id: str)
    async def send_personal_message(self, message: Dict[str, Any], user_id: str)
    async def broadcast_to_role(self, message: Dict[str, Any], role: str)
    async def subscribe_to_channels(self, user_id: str, channels: List[str])
```

**Key Features**:
- Connection management
- Message broadcasting
- Channel subscriptions
- Role-based messaging

## 🗄️ Database Schema

### Core Tables

#### analytics_events
```sql
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    session_id VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duration INTEGER,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX idx_analytics_events_action ON analytics_events(action);
```

#### user_progress
```sql
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    learning_path_id VARCHAR(255) NOT NULL,
    progress DECIMAL(5,2) DEFAULT 0.00,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_accessed TIMESTAMP WITH TIME ZONE,
    time_spent INTEGER DEFAULT 0,
    current_module VARCHAR(255),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_user_progress_unique ON user_progress(user_id, learning_path_id);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
```

#### recommendations
```sql
CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    relevance_score DECIMAL(3,2),
    reasoning TEXT,
    prerequisites JSONB,
    expected_outcomes JSONB,
    difficulty VARCHAR(20),
    estimated_time VARCHAR(50),
    category VARCHAR(100),
    tags JSONB,
    confidence DECIMAL(3,2),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_recommendations_user_id ON recommendations(user_id);
CREATE INDEX idx_recommendations_type ON recommendations(type);
CREATE INDEX idx_recommendations_relevance_score ON recommendations(relevance_score DESC);
```

#### classroom_courses
```sql
CREATE TABLE classroom_courses (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    instructor_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    enrollment_code VARCHAR(50),
    status VARCHAR(20),
    classroom_link TEXT,
    source VARCHAR(50) DEFAULT 'google_classroom',
    synced_by VARCHAR(255),
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_classroom_courses_instructor_id ON classroom_courses(instructor_id);
CREATE INDEX idx_classroom_courses_status ON classroom_courses(status);
```

#### system_metrics
```sql
CREATE TABLE system_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,2) NOT NULL,
    metric_unit VARCHAR(20),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

CREATE INDEX idx_system_metrics_name_timestamp ON system_metrics(metric_name, timestamp);
```

### Relationships

```mermaid
erDiagram
    analytics_events ||--o{ user_progress : tracks
    user_progress ||--o{ recommendations : generates
    classroom_courses ||--o{ classroom_assignments : contains
    classroom_assignments ||--o{ student_submissions : receives
    analytics_events ||--o{ analytics_snapshots : aggregates
```

## 🔗 Integration Guides

### Google Classroom Integration

#### Setup Process

1. **Google Cloud Console Setup**
   ```bash
   # 1. Create project in Google Cloud Console
   # 2. Enable Google Classroom API
   # 3. Create OAuth 2.0 credentials
   # 4. Configure authorized redirect URIs
   ```

2. **Environment Configuration**
   ```env
   GOOGLE_CLASSROOM_CLIENT_ID=your_client_id
   GOOGLE_CLASSROOM_CLIENT_SECRET=your_client_secret
   GOOGLE_CLASSROOM_REDIRECT_URI=http://localhost:8000/auth/google/callback
   ```

3. **OAuth Flow Implementation**
   ```python
   from google.auth.transport.requests import Request
   from google.oauth2.credentials import Credentials
   from google_auth_oauthlib.flow import Flow
   
   # Initialize OAuth flow
   flow = Flow.from_client_config(
       client_config,
       scopes=['https://www.googleapis.com/auth/classroom.courses.readonly']
   )
   flow.redirect_uri = redirect_uri
   
   # Get authorization URL
   auth_url, _ = flow.authorization_url(prompt='consent')
   ```

#### API Usage Examples

```python
# Sync courses from Google Classroom
async def sync_courses_example():
    service = GoogleClassroomService()
    result = await service.sync_courses("user_123")
    print(f"Synced {result['courses_synced']} courses")

# Get classroom analytics
async def get_analytics_example():
    service = GoogleClassroomService()
    analytics = await service.get_classroom_analytics("course_123", "30d")
    print(f"Engagement rate: {analytics['engagement']['engagement_rate']}%")
```

### Moodle Integration (Future)

#### Setup Process
```python
# Moodle Web Services API integration
class MoodleService:
    def __init__(self, moodle_url: str, token: str):
        self.base_url = f"{moodle_url}/webservice/rest/server.php"
        self.token = token
    
    async def get_courses(self, user_id: str):
        # Implementation for Moodle course sync
        pass
```

### Canvas Integration (Future)

#### Setup Process
```python
# Canvas API integration
class CanvasService:
    def __init__(self, canvas_url: str, access_token: str):
        self.base_url = f"{canvas_url}/api/v1"
        self.headers = {"Authorization": f"Bearer {access_token}"}
    
    async def get_courses(self):
        # Implementation for Canvas course sync
        pass
```

## 🚀 Deployment Guide

### Development Environment

#### Local Development Setup
```bash
# 1. Install dependencies
npm install
cd python-backend && pip install -r requirements.txt

# 2. Start services
docker-compose -f docker-compose.dev.yml up -d  # PostgreSQL, Redis
python python-backend/main.py  # Backend
npm run dev  # Frontend

# 3. Access applications
# Frontend: http://localhost:5173
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

#### Docker Development
```yaml
# docker-compose.dev.yml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: edupath_analytics
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### Production Deployment

#### Using Docker

1. **Create Production Dockerfile**
   ```dockerfile
   # Backend Dockerfile
   FROM python:3.11-slim
   
   WORKDIR /app
   
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt
   
   COPY . .
   
   EXPOSE 8000
   
   CMD ["gunicorn", "main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]
   ```

   ```dockerfile
   # Frontend Dockerfile
   FROM node:18-alpine AS builder
   
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY . .
   RUN npm run build
   
   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/nginx.conf
   
   EXPOSE 80
   ```

2. **Production Docker Compose**
   ```yaml
   # docker-compose.prod.yml
   version: '3.8'
   services:
     frontend:
       build:
         context: .
         dockerfile: Dockerfile.frontend
       ports:
         - "80:80"
       depends_on:
         - backend
   
     backend:
       build:
         context: ./python-backend
         dockerfile: Dockerfile
       ports:
         - "8000:8000"
       environment:
         - DATABASE_URL=postgresql://postgres:password@postgres:5432/edupath_analytics
         - REDIS_URL=redis://redis:6379/0
       depends_on:
         - postgres
         - redis
   
     postgres:
       image: postgres:15
       environment:
         POSTGRES_DB: edupath_analytics
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
       volumes:
         - postgres_data:/var/lib/postgresql/data
   
     redis:
       image: redis:7-alpine
       volumes:
         - redis_data:/data
   
   volumes:
     postgres_data:
     redis_data:
   ```

#### Using Kubernetes

1. **Deployment Configuration**
   ```yaml
   # k8s/backend-deployment.yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: edupath-backend
   spec:
     replicas: 3
     selector:
       matchLabels:
         app: edupath-backend
     template:
       metadata:
         labels:
           app: edupath-backend
       spec:
         containers:
         - name: backend
           image: edupath/backend:latest
           ports:
           - containerPort: 8000
           env:
           - name: DATABASE_URL
             valueFrom:
               secretKeyRef:
                 name: edupath-secrets
                 key: database-url
   ```

2. **Service Configuration**
   ```yaml
   # k8s/backend-service.yaml
   apiVersion: v1
   kind: Service
   metadata:
     name: edupath-backend-service
   spec:
     selector:
       app: edupath-backend
     ports:
     - protocol: TCP
       port: 80
       targetPort: 8000
     type: LoadBalancer
   ```

#### Cloud Deployment Options

##### AWS Deployment
```bash
# Using AWS ECS with Fargate
aws ecs create-cluster --cluster-name edupath-cluster
aws ecs create-service --cluster edupath-cluster --service-name edupath-backend
```

##### Google Cloud Deployment
```bash
# Using Google Cloud Run
gcloud run deploy edupath-backend --image gcr.io/project-id/edupath-backend
gcloud run deploy edupath-frontend --image gcr.io/project-id/edupath-frontend
```

##### Azure Deployment
```bash
# Using Azure Container Instances
az container create --resource-group edupath-rg --name edupath-backend
```

### Environment Configuration

#### Production Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/edupath_analytics
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=30

# Redis
REDIS_URL=redis://host:6379/0
REDIS_POOL_SIZE=10

# Security
SECRET_KEY=your-super-secret-key-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AI Services
GEMINI_API_KEY=your-production-gemini-key
OPENAI_API_KEY=your-production-openai-key

# Google Classroom
GOOGLE_CLASSROOM_CLIENT_ID=your-production-client-id
GOOGLE_CLASSROOM_CLIENT_SECRET=your-production-client-secret

# Application
DEBUG=false
LOG_LEVEL=INFO
CORS_ORIGINS=["https://yourdomain.com"]

# Monitoring
SENTRY_DSN=your-sentry-dsn
PROMETHEUS_ENABLED=true
```

### Performance Optimization

#### Backend Optimizations
```python
# Database connection pooling
engine = create_engine(
    DATABASE_URL,
    pool_size=20,
    max_overflow=30,
    pool_pre_ping=True,
    pool_recycle=3600
)

# Redis connection pooling
redis_pool = redis.ConnectionPool.from_url(
    REDIS_URL,
    max_connections=10,
    retry_on_timeout=True
)

# Async background tasks
@app.on_event("startup")
async def startup_event():
    asyncio.create_task(background_analytics_processor())
```

#### Frontend Optimizations
```typescript
// Code splitting
const RealTimeAnalyticsDashboard = lazy(() => import('./components/analytics/RealTimeAnalyticsDashboard'));

// Memoization
const MemoizedChart = React.memo(Chart);

// Virtual scrolling for large datasets
import { FixedSizeList as List } from 'react-window';
```

### Monitoring and Logging

#### Application Monitoring
```python
# Structured logging
import structlog

logger = structlog.get_logger()

@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    logger.info(
        "request_processed",
        method=request.method,
        url=str(request.url),
        status_code=response.status_code,
        process_time=process_time
    )
    
    return response
```

#### Health Checks
```python
@app.get("/health")
async def health_check():
    # Check database connection
    try:
        db = SessionLocal()
        db.execute("SELECT 1")
        db_status = "healthy"
    except Exception:
        db_status = "unhealthy"
    finally:
        db.close()
    
    # Check Redis connection
    try:
        await redis_client.ping()
        redis_status = "healthy"
    except Exception:
        redis_status = "unhealthy"
    
    return {
        "status": "healthy" if db_status == "healthy" and redis_status == "healthy" else "unhealthy",
        "database": db_status,
        "redis": redis_status,
        "timestamp": datetime.utcnow().isoformat()
    }
```

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Database Connection Issues

**Problem**: `sqlalchemy.exc.OperationalError: could not connect to server`

**Solutions**:
1. Check PostgreSQL service status
   ```bash
   # Linux/macOS
   sudo systemctl status postgresql
   # Windows
   net start postgresql-x64-13
   ```

2. Verify connection parameters
   ```python
   # Test connection
   from sqlalchemy import create_engine
   engine = create_engine("postgresql://user:pass@localhost:5432/db")
   connection = engine.connect()
   ```

3. Check firewall settings
   ```bash
   # Allow PostgreSQL port
   sudo ufw allow 5432
   ```

#### Redis Connection Issues

**Problem**: `redis.exceptions.ConnectionError: Error connecting to Redis`

**Solutions**:
1. Start Redis server
   ```bash
   redis-server
   # Or as service
   sudo systemctl start redis
   ```

2. Check Redis configuration
   ```bash
   redis-cli ping
   # Should return PONG
   ```

3. Verify Redis URL format
   ```env
   REDIS_URL=redis://localhost:6379/0
   # For password-protected Redis
   REDIS_URL=redis://:password@localhost:6379/0
   ```

#### WebSocket Connection Issues

**Problem**: WebSocket connection fails or disconnects frequently

**Solutions**:
1. Check CORS configuration
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:5173"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

2. Verify WebSocket URL
   ```javascript
   // Correct format
   const ws = new WebSocket('ws://localhost:8000/ws/analytics/user_123');
   
   // For HTTPS sites, use WSS
   const ws = new WebSocket('wss://yourdomain.com/ws/analytics/user_123');
   ```

3. Handle connection errors
   ```javascript
   ws.onerror = (error) => {
     console.error('WebSocket error:', error);
     // Implement reconnection logic
   };
   ```

#### AI Service Issues

**Problem**: Google Gemini API returns authentication errors

**Solutions**:
1. Verify API key
   ```bash
   curl -H "Authorization: Bearer YOUR_API_KEY" \
        "https://generativelanguage.googleapis.com/v1/models"
   ```

2. Check API quotas and limits
   - Visit Google AI Studio console
   - Monitor usage and billing

3. Handle rate limiting
   ```python
   import asyncio
   from tenacity import retry, stop_after_attempt, wait_exponential
   
   @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
   async def call_gemini_api(prompt):
       # API call implementation
       pass
   ```

#### Performance Issues

**Problem**: Slow API responses or high memory usage

**Solutions**:
1. Enable database query logging
   ```python
   engine = create_engine(DATABASE_URL, echo=True)
   ```

2. Add database indexes
   ```sql
   CREATE INDEX CONCURRENTLY idx_analytics_events_user_timestamp 
   ON analytics_events(user_id, timestamp);
   ```

3. Implement caching
   ```python
   from functools import lru_cache
   
   @lru_cache(maxsize=128)
   async def get_user_analytics(user_id: str, timeframe: str):
       # Expensive computation
       pass
   ```

4. Use connection pooling
   ```python
   # SQLAlchemy
   engine = create_engine(
       DATABASE_URL,
       pool_size=20,
       max_overflow=30,
       pool_pre_ping=True
   )
   ```

### Debugging Tools

#### Backend Debugging
```python
# Enable debug mode
import logging
logging.basicConfig(level=logging.DEBUG)

# Add request/response logging
@app.middleware("http")
async def debug_middleware(request: Request, call_next):
    print(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    print(f"Response: {response.status_code}")
    return response
```

#### Frontend Debugging
```javascript
// Enable React DevTools
// Install React Developer Tools browser extension

// Add console logging for WebSocket events
ws.onmessage = (event) => {
  console.log('WebSocket message:', JSON.parse(event.data));
};

// Debug API calls
const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 10000,
});

api.interceptors.request.use(request => {
  console.log('API Request:', request);
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('API Response:', response);
    return response;
  },
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
```

### Log Analysis

#### Backend Logs
```bash
# View application logs
tail -f logs/app.log

# Filter by log level
grep "ERROR" logs/app.log

# Search for specific user
grep "user_123" logs/app.log
```

#### Database Logs
```bash
# PostgreSQL logs (Ubuntu/Debian)
tail -f /var/log/postgresql/postgresql-13-main.log

# Find slow queries
grep "duration:" /var/log/postgresql/postgresql-13-main.log | grep -v "duration: 0"
```

#### System Monitoring
```bash
# Monitor system resources
htop

# Check disk usage
df -h

# Monitor network connections
netstat -tulpn | grep :8000
```

## 📋 Best Practices

### Code Quality

#### Python Backend
```python
# Use type hints
from typing import List, Dict, Optional, Union

async def get_user_analytics(
    user_id: str, 
    timeframe: str,
    metrics: Optional[List[str]] = None
) -> Dict[str, Union[int, float, List]]:
    """
    Get analytics data for a specific user.
    
    Args:
        user_id: Unique identifier for the user
        timeframe: Time period for analytics (e.g., '7d', '30d')
        metrics: Optional list of specific metrics to include
        
    Returns:
        Dictionary containing analytics data
        
    Raises:
        ValueError: If timeframe is invalid
        UserNotFoundError: If user doesn't exist
    """
    pass

# Use Pydantic models for validation
from pydantic import BaseModel, validator

class AnalyticsRequest(BaseModel):
    user_id: str
    timeframe: str
    metrics: Optional[List[str]] = None
    
    @validator('timeframe')
    def validate_timeframe(cls, v):
        valid_timeframes = ['1h', '6h', '1d', '7d', '30d', '90d']
        if v not in valid_timeframes:
            raise ValueError(f'Invalid timeframe. Must be one of: {valid_timeframes}')
        return v

# Use dependency injection
from fastapi import Depends

def get_analytics_service() -> AnalyticsService:
    return AnalyticsService()

@app.get("/analytics/{user_id}")
async def get_analytics(
    user_id: str,
    request: AnalyticsRequest,
    service: AnalyticsService = Depends(get_analytics_service)
):
    return await service.get_user_analytics(user_id, request.timeframe, request.metrics)
```

#### React Frontend
```typescript
// Use TypeScript interfaces
interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
}

interface AnalyticsData {
  metrics: {
    activeUsers: number;
    completionRate: number;
    engagementScore: number;
  };
  timestamp: string;
}

// Use custom hooks for data fetching
const useAnalytics = (userId: string, timeframe: string) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/analytics/${userId}?timeframe=${timeframe}`);
        setData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [userId, timeframe]);

  return { data, loading, error };
};

// Use React.memo for performance
const AnalyticsChart = React.memo<{
  data: AnalyticsData;
  height?: number;
}>(({ data, height = 300 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data.metrics}>
        {/* Chart implementation */}
      </LineChart>
    </ResponsiveContainer>
  );
});
```

### Security Best Practices

#### Authentication & Authorization
```python
# JWT token validation
from jose import JWTError, jwt
from fastapi import HTTPException, status

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    return user_id

# Role-based access control
def require_role(required_role: str):
    def decorator(func):
        async def wrapper(*args, **kwargs):
            current_user = kwargs.get('current_user')
            if not current_user or current_user.role != required_role:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Insufficient permissions"
                )
            return await func(*args, **kwargs)
        return wrapper
    return decorator

@app.get("/admin/analytics")
@require_role("admin")
async def get_admin_analytics(current_user: User = Depends(get_current_user)):
    pass
```

#### Input Validation
```python
# Sanitize user input
from pydantic import BaseModel, validator
import re

class UserEventRequest(BaseModel):
    action: str
    resource_id: str
    metadata: Optional[Dict[str, Any]] = None
    
    @validator('action')
    def validate_action(cls, v):
        # Only allow alphanumeric characters and underscores
        if not re.match(r'^[a-zA-Z0-9_]+$', v):
            raise ValueError('Action must contain only alphanumeric characters and underscores')
        return v
    
    @validator('resource_id')
    def validate_resource_id(cls, v):
        # Validate resource ID format
        if not re.match(r'^[a-zA-Z0-9_-]+$', v):
            raise ValueError('Invalid resource ID format')
        return v

# SQL injection prevention (using SQLAlchemy ORM)
# Good - parameterized query
users = session.query(User).filter(User.id == user_id).all()

# Bad - string concatenation (vulnerable to SQL injection)
# query = f"SELECT * FROM users WHERE id = '{user_id}'"
```

#### Data Privacy
```python
# Encrypt sensitive data
from cryptography.fernet import Fernet

class DataEncryption:
    def __init__(self, key: bytes):
        self.cipher = Fernet(key)
    
    def encrypt(self, data: str) -> str:
        return self.cipher.encrypt(data.encode()).decode()
    
    def decrypt(self, encrypted_data: str) -> str:
        return self.cipher.decrypt(encrypted_data.encode()).decode()

# Hash passwords
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
```

### Performance Optimization

#### Database Optimization
```python
# Use database indexes
class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(255), nullable=False, index=True)
    timestamp = Column(DateTime(timezone=True), default=func.now(), index=True)
    action = Column(String(100), nullable=False, index=True)
    
    # Composite index for common queries
    __table_args__ = (
        Index('idx_user_timestamp', 'user_id', 'timestamp'),
        Index('idx_action_timestamp', 'action', 'timestamp'),
    )

# Use connection pooling
engine = create_engine(
    DATABASE_URL,
    pool_size=20,
    max_overflow=30,
    pool_pre_ping=True,
    pool_recycle=3600,
    echo=False  # Disable in production
)

# Optimize queries
async def get_user_analytics_optimized(user_id: str, timeframe: str):
    # Use specific columns instead of SELECT *
    query = select(
        AnalyticsEvent.action,
        AnalyticsEvent.timestamp,
        AnalyticsEvent.duration
    ).where(
        and_(
            AnalyticsEvent.user_id == user_id,
            AnalyticsEvent.timestamp >= get_timeframe_start(timeframe)
        )
    ).order_by(AnalyticsEvent.timestamp.desc())
    
    result = await session.execute(query)
    return result.fetchall()
```

#### Caching Strategies
```python
# Redis caching
import json
from typing import Optional

class CacheService:
    def __init__(self, redis_client):
        self.redis = redis_client
    
    async def get(self, key: str) -> Optional[Dict]:
        cached_data = await self.redis.get(key)
        if cached_data:
            return json.loads(cached_data)
        return None
    
    async def set(self, key: str, data: Dict, expire: int = 3600):
        await self.redis.setex(key, expire, json.dumps(data))
    
    async def delete(self, key: str):
        await self.redis.delete(key)

# Use caching decorator
from functools import wraps

def cache_result(expire: int = 3600):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Generate cache key from function name and arguments
            cache_key = f"{func.__name__}:{hash(str(args) + str(kwargs))}"
            
            # Try to get from cache
            cached_result = await cache_service.get(cache_key)
            if cached_result:
                return cached_result
            
            # Execute function and cache result
            result = await func(*args, **kwargs)
            await cache_service.set(cache_key, result, expire)
            
            return result
        return wrapper
    return decorator

@cache_result(expire=1800)  # Cache for 30 minutes
async def get_engagement_metrics(timeframe: str):
    # Expensive computation
    pass
```

#### Frontend Performance
```typescript
// Use React.memo for expensive components
const ExpensiveChart = React.memo<ChartProps>(({ data, options }) => {
  return <Chart data={data} options={options} />;
}, (prevProps, nextProps) => {
  // Custom comparison function
  return JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data);
});

// Debounce API calls
import { debounce } from 'lodash';

const debouncedSearch = useCallback(
  debounce(async (query: string) => {
    const results = await api.get(`/search?q=${query}`);
    setSearchResults(results.data);
  }, 300),
  []
);

// Virtual scrolling for large lists
import { FixedSizeList as List } from 'react-window';

const VirtualizedList: React.FC<{ items: any[] }> = ({ items }) => (
  <List
    height={400}
    itemCount={items.length}
    itemSize={50}
    itemData={items}
  >
    {({ index, style, data }) => (
      <div style={style}>
        {data[index].name}
      </div>
    )}
  </List>
);

// Lazy loading
const LazyAnalyticsDashboard = lazy(() => import('./AnalyticsDashboard'));

const App = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <LazyAnalyticsDashboard />
  </Suspense>
);
```

### Testing Best Practices

#### Backend Testing
```python
# Unit tests
import pytest
from unittest.mock import Mock, patch
from app.services.analytics_service import AnalyticsService

@pytest.fixture
def analytics_service():
    return AnalyticsService()

@pytest.fixture
def mock_db_session():
    return Mock()

class TestAnalyticsService:
    async def test_get_user_analytics_success(self, analytics_service, mock_db_session):
        # Arrange
        user_id = "user_123"
        timeframe = "7d"
        expected_result = {"active_users": 10, "completion_rate": 75.5}
        
        with patch.object(analytics_service, '_fetch_from_db', return_value=expected_result):
            # Act
            result = await analytics_service.get_user_analytics(user_id, timeframe)
            
            # Assert
            assert result == expected_result
    
    async def test_get_user_analytics_invalid_timeframe(self, analytics_service):
        # Arrange
        user_id = "user_123"
        invalid_timeframe = "invalid"
        
        # Act & Assert
        with pytest.raises(ValueError, match="Invalid timeframe"):
            await analytics_service.get_user_analytics(user_id, invalid_timeframe)

# Integration tests
@pytest.mark.asyncio
async def test_analytics_endpoint_integration(client):
    # Test full API endpoint
    response = await client.get("/api/v1/analytics/user_123?timeframe=7d")
    
    assert response.status_code == 200
    data = response.json()
    assert "metrics" in data
    assert "timestamp" in data
```

#### Frontend Testing
```typescript
// Component testing with React Testing Library
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AnalyticsDashboard } from './AnalyticsDashboard';

// Mock API calls
jest.mock('../services/api', () => ({
  getAnalytics: jest.fn(),
}));

describe('AnalyticsDashboard', () => {
  beforeEach(() => {
    (api.getAnalytics as jest.Mock).mockResolvedValue({
      data: {
        metrics: { activeUsers: 100, completionRate: 85 },
        timestamp: '2024-01-15T10:30:00Z'
      }
    });
  });

  test('displays analytics data correctly', async () => {
    render(<AnalyticsDashboard userId="user_123" />);
    
    await waitFor(() => {
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('85%')).toBeInTheDocument();
    });
  });

  test('handles loading state', () => {
    render(<AnalyticsDashboard userId="user_123" />);
    
    expect(screen.getByText('Loading analytics...')).toBeInTheDocument();
  });

  test('handles error state', async () => {
    (api.getAnalytics as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    render(<AnalyticsDashboard userId="user_123" />);
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});

// E2E testing with Playwright
import { test, expect } from '@playwright/test';

test('analytics dashboard workflow', async ({ page }) => {
  await page.goto('/analytics');
  
  // Wait for data to load
  await expect(page.locator('[data-testid="analytics-metrics"]')).toBeVisible();
  
  // Test filter functionality
  await page.selectOption('[data-testid="timeframe-select"]', '30d');
  await expect(page.locator('[data-testid="active-users"]')).toContainText(/\d+/);
  
  // Test export functionality
  await page.click('[data-testid="export-button"]');
  await expect(page.locator('[data-testid="export-modal"]')).toBeVisible();
});
```

This comprehensive documentation provides everything needed to understand, implement, maintain, and extend the EduPath Analytics system. Each section includes practical examples, best practices, and troubleshooting guidance to ensure successful deployment and operation.