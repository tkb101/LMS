# Real-Time Analytics LMS Setup Instructions

## Overview
This implementation provides a comprehensive real-time analytics system with Python backend integration for your Learning Management System (LMS). The system includes:

- **Real-time Analytics Dashboard** with live metrics and visualizations
- **Smart AI-powered Recommendations** using Google Gemini
- **Progress Tracking** with goals and milestones
- **Google Classroom Integration** for seamless data sync
- **Advanced Analytics & Reporting** with customizable exports
- **Predictive Analytics** for student success prediction

## Prerequisites

### System Requirements
- Node.js 18+ and npm
- Python 3.9+
- PostgreSQL 13+
- Redis 6+
- Git

### API Keys Required
- Google Gemini API Key (for AI features)
- Google Classroom API credentials (for integration)
- OpenAI API Key (optional, for additional AI features)

## Installation Steps

### 1. Clone and Setup Frontend

```bash
# Navigate to the LMS directory
cd "c:\Users\RAMESH T K B\OneDrive\Desktop\LMS"

# Install frontend dependencies
npm install

# Install additional dependencies for real-time features
npm install axios socket.io-client
```

### 2. Setup Python Backend

```bash
# Navigate to backend directory
cd python-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt
```

### 3. Database Setup

```bash
# Create PostgreSQL database
createdb edupath_analytics

# Set up environment variables (create .env file in python-backend/)
```

Create `.env` file in `python-backend/` directory:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/edupath_analytics

# Redis
REDIS_URL=redis://localhost:6379/0

# AI Services
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Google Classroom Integration
GOOGLE_CLASSROOM_CLIENT_ID=your_google_client_id
GOOGLE_CLASSROOM_CLIENT_SECRET=your_google_client_secret

# Security
SECRET_KEY=your_secret_key_here_change_in_production
```

### 4. Initialize Database

```bash
# Run database migrations
cd python-backend
python -c "
from app.core.database import engine
from app.models.analytics import Base
Base.metadata.create_all(bind=engine)
print('Database tables created successfully!')
"
```

### 5. Start Services

#### Start Redis (if not running as service)
```bash
redis-server
```

#### Start Python Backend
```bash
cd python-backend
python main.py
```
The backend will be available at `http://localhost:8000`

#### Start Frontend Development Server
```bash
# In a new terminal, from the LMS root directory
npm run dev
```
The frontend will be available at `http://localhost:5173`

## Configuration

### 1. Google Classroom Integration Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Classroom API
4. Create OAuth 2.0 credentials
5. Add the credentials to your `.env` file

### 2. Gemini AI Setup

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Generate an API key
3. Add the key to your `.env` file as `GEMINI_API_KEY`

### 3. Frontend Configuration

Update the API base URL in your frontend if needed. Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```

## Features Overview

### 1. Real-Time Analytics Dashboard
- **Location**: `/src/components/analytics/RealTimeAnalyticsDashboard.tsx`
- **Features**: Live user metrics, engagement tracking, WebSocket updates
- **API Endpoints**: `/api/v1/realtime-analytics/*`

### 2. Smart Recommendations
- **Location**: `/src/components/recommendations/SmartRecommendations.tsx`
- **Features**: AI-powered course suggestions, skill gap analysis, learning goals
- **API Endpoints**: `/api/v1/recommendations/*`

### 3. Progress Tracking
- **Location**: `/src/components/progress/ProgressTracking.tsx`
- **Features**: Course progress, milestones, learning goals, study sessions
- **API Endpoints**: `/api/v1/analytics/progress/*`

### 4. Google Classroom Integration
- **Location**: `/src/components/integrations/GoogleClassroomIntegration.tsx`
- **Features**: Course sync, assignment import, analytics export
- **API Endpoints**: `/api/v1/realtime-analytics/integrations/google-classroom/*`

### 5. Analytics & Reporting
- **Location**: `/src/components/analytics/AnalyticsReporting.tsx`
- **Features**: Customizable reports, PDF/Excel export, automated scheduling
- **API Endpoints**: `/api/v1/analytics/reports/*`

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation.

### Key Endpoints

#### Real-time Analytics
- `POST /api/v1/realtime-analytics/track-event` - Track live user events
- `GET /api/v1/realtime-analytics/dashboard/{user_id}` - Get live dashboard data
- `GET /api/v1/realtime-analytics/engagement-metrics` - Get engagement metrics
- `GET /api/v1/realtime-analytics/progress-tracking` - Get progress data
- `GET /api/v1/realtime-analytics/predictive-alerts` - Get AI alerts

#### Google Classroom Integration
- `POST /api/v1/realtime-analytics/integrations/google-classroom/sync-courses` - Sync courses
- `POST /api/v1/realtime-analytics/integrations/google-classroom/sync-assignments/{course_id}` - Sync assignments
- `GET /api/v1/realtime-analytics/integrations/google-classroom/analytics/{course_id}` - Get classroom analytics

#### WebSocket Endpoints
- `ws://localhost:8000/ws/analytics/{user_id}` - Real-time analytics updates

## Usage Examples

### 1. Tracking User Events
```javascript
// Track a page view event
fetch('/api/v1/realtime-analytics/track-event?user_id=user123', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'page_view',
    resource_type: 'course',
    resource_id: 'course_123',
    duration: 300
  })
});
```

### 2. WebSocket Connection
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/analytics/user123');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Real-time update:', data);
};
```

### 3. Generate Report
```javascript
// Generate PDF report
fetch('/api/v1/analytics/reports/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    format: 'pdf',
    metrics: ['engagement', 'completion', 'performance'],
    date_range: { start: '2024-01-01', end: '2024-01-31' }
  })
});
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure PostgreSQL is running
   - Check DATABASE_URL in .env file
   - Verify database exists and credentials are correct

2. **Redis Connection Error**
   - Ensure Redis server is running
   - Check REDIS_URL in .env file

3. **WebSocket Connection Failed**
   - Ensure backend is running on correct port
   - Check CORS settings in main.py
   - Verify WebSocket URL in frontend

4. **AI Features Not Working**
   - Verify GEMINI_API_KEY is set correctly
   - Check API key permissions and quotas
   - Review logs for specific error messages

5. **Google Classroom Integration Issues**
   - Verify OAuth credentials are correct
   - Check API is enabled in Google Cloud Console
   - Ensure proper scopes are configured

### Logs and Debugging

- Backend logs: Check console output when running `python main.py`
- Frontend logs: Check browser developer console
- Database logs: Check PostgreSQL logs
- Redis logs: Check Redis server logs

## Performance Optimization

### Backend Optimizations
- Use Redis for caching frequently accessed data
- Implement database connection pooling
- Use background tasks for heavy computations
- Optimize database queries with proper indexing

### Frontend Optimizations
- Implement virtual scrolling for large data sets
- Use React.memo for expensive components
- Debounce real-time updates to prevent excessive re-renders
- Lazy load components and data

## Security Considerations

1. **API Security**
   - Implement proper JWT authentication
   - Use HTTPS in production
   - Validate all input data
   - Implement rate limiting

2. **Database Security**
   - Use environment variables for credentials
   - Implement proper access controls
   - Regular security updates

3. **AI API Security**
   - Secure API key storage
   - Implement usage monitoring
   - Data privacy compliance

## Deployment

### Production Deployment

1. **Backend Deployment**
   ```bash
   # Use production WSGI server
   pip install gunicorn
   gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
   ```

2. **Frontend Deployment**
   ```bash
   npm run build
   # Deploy dist/ folder to your web server
   ```

3. **Environment Variables**
   - Set production database URLs
   - Use production Redis instance
   - Configure proper CORS origins
   - Set secure secret keys

### Docker Deployment (Optional)

Create `Dockerfile` for backend:
```dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Support and Maintenance

### Regular Maintenance Tasks
- Monitor system performance and logs
- Update dependencies regularly
- Backup database and Redis data
- Review and rotate API keys
- Monitor AI API usage and costs

### Monitoring
- Set up application monitoring (e.g., Sentry)
- Monitor database performance
- Track API response times
- Monitor WebSocket connection health

## Next Steps

1. **Enhanced Features**
   - Add more LMS integrations (Moodle, Blackboard)
   - Implement advanced ML models
   - Add mobile app support
   - Enhance real-time collaboration features

2. **Scalability**
   - Implement microservices architecture
   - Add load balancing
   - Use message queues for background processing
   - Implement caching strategies

3. **Analytics Enhancement**
   - Add more visualization types
   - Implement custom dashboard builder
   - Add advanced filtering and search
   - Enhance predictive models

For additional support or questions, please refer to the API documentation at `http://localhost:8000/docs` or check the application logs for detailed error information.