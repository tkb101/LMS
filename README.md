# 🎓 EduPath Analytics - Real-Time Learning Management System

[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.3+-blue.svg)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A comprehensive Learning Management System with real-time analytics, AI-powered recommendations, and seamless integration capabilities. Built with modern technologies to provide educators and learners with powerful insights and personalized learning experiences.

## 🌟 Features

### 📊 Real-Time Analytics Dashboard
- **Live Metrics**: Track active users, page views, and interactions in real-time
- **WebSocket Integration**: Instant updates without page refresh
- **Interactive Visualizations**: Rich charts and graphs using Recharts
- **Predictive Alerts**: AI-powered early warning system for at-risk students

### 🧠 Smart AI-Powered Recommendations
- **Personalized Suggestions**: Google Gemini AI integration for intelligent course recommendations
- **Skill Gap Analysis**: Visual identification of learning gaps with targeted resources
- **Learning Path Optimization**: Dynamic adjustment of learning sequences
- **Goal-Based Recommendations**: Suggestions aligned with individual learning objectives

### 📈 Advanced Progress Tracking
- **Real-Time Monitoring**: Live progress updates across all learning activities
- **Milestone Management**: Track achievements and learning milestones
- **Goal Setting**: Set and monitor personalized learning goals
- **Performance Analytics**: Detailed insights into learning patterns and outcomes

### 🔗 System Integrations
- **Google Classroom**: Seamless sync of courses, assignments, and analytics
- **LMS Compatibility**: Ready for Moodle, Blackboard, and other platforms
- **API-First Design**: RESTful APIs for easy third-party integrations
- **Export Capabilities**: Multiple format support (PDF, Excel, CSV)

### 🔮 Predictive Analytics
- **Success Prediction**: ML models to predict student success probability
- **Risk Assessment**: Early identification of students needing support
- **Completion Forecasting**: Estimate course completion times
- **Intervention Recommendations**: Actionable insights for educators

### 📋 Comprehensive Reporting
- **Customizable Reports**: Build reports tailored to specific needs
- **Automated Scheduling**: Set up recurring reports with email delivery
- **Multi-Format Export**: PDF, Excel, CSV, and JSON formats
- **Interactive Dashboards**: Drill-down capabilities for detailed analysis

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.9+
- **PostgreSQL** 13+
- **Redis** 6+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd LMS
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Set up Python backend**
   ```bash
   cd python-backend
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   # Create .env file in python-backend/
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Initialize database**
   ```bash
   cd python-backend
   python -c "
   from app.core.database import engine
   from app.models.analytics import Base
   Base.metadata.create_all(bind=engine)
   "
   ```

6. **Start the services**
   ```bash
   # Terminal 1: Start Redis
   redis-server
   
   # Terminal 2: Start backend
   cd python-backend
   python main.py
   
   # Terminal 3: Start frontend
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 📁 Project Structure

```
LMS/
├── 📁 src/                          # Frontend React application
│   ├── 📁 components/
│   │   ├── 📁 analytics/           # Analytics components
│   │   ├── 📁 recommendations/     # AI recommendation components
│   │   ├── 📁 progress/           # Progress tracking components
│   │   └── 📁 integrations/       # External system integrations
│   ├── 📁 hooks/                  # Custom React hooks
│   ├── 📁 services/               # API service functions
│   └── 📁 utils/                  # Utility functions
├── 📁 python-backend/             # FastAPI backend
│   ├── 📁 app/
│   │   ├── 📁 api/routes/         # API route definitions
│   │   ├── 📁 core/               # Core configuration
│   │   ├── 📁 models/             # Database models
│   │   └── 📁 services/           # Business logic services
│   ├── 📄 main.py                 # Application entry point
│   └── 📄 requirements.txt        # Python dependencies
├── 📁 docs/                       # Documentation
├── 📄 package.json               # Node.js dependencies
├── 📄 README.md                  # This file
└── 📄 SETUP_INSTRUCTIONS.md      # Detailed setup guide
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `python-backend/` directory:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/edupath_analytics

# Redis Configuration
REDIS_URL=redis://localhost:6379/0

# AI Services
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Google Classroom Integration
GOOGLE_CLASSROOM_CLIENT_ID=your_google_client_id
GOOGLE_CLASSROOM_CLIENT_SECRET=your_google_client_secret

# Security
SECRET_KEY=your_secret_key_here_change_in_production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Application Settings
DEBUG=true
CORS_ORIGINS=["http://localhost:5173"]
```

### Frontend Configuration

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
VITE_APP_NAME=EduPath Analytics
```

## 📚 API Documentation

### Core Endpoints

#### Real-Time Analytics
```http
POST   /api/v1/realtime-analytics/track-event
GET    /api/v1/realtime-analytics/dashboard/{user_id}
GET    /api/v1/realtime-analytics/engagement-metrics
GET    /api/v1/realtime-analytics/progress-tracking
GET    /api/v1/realtime-analytics/predictive-alerts
```

#### Recommendations
```http
GET    /api/v1/recommendations/{user_id}
POST   /api/v1/recommendations/feedback
GET    /api/v1/recommendations/skill-gaps/{user_id}
```

#### Google Classroom Integration
```http
POST   /api/v1/realtime-analytics/integrations/google-classroom/sync-courses
POST   /api/v1/realtime-analytics/integrations/google-classroom/sync-assignments/{course_id}
GET    /api/v1/realtime-analytics/integrations/google-classroom/analytics/{course_id}
```

#### WebSocket Endpoints
```
ws://localhost:8000/ws/analytics/{user_id}
```

For complete API documentation, visit: http://localhost:8000/docs

## 🎯 Usage Examples

### Tracking User Events
```javascript
// Track a learning event
const trackEvent = async (userId, eventData) => {
  const response = await fetch(`/api/v1/realtime-analytics/track-event?user_id=${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'course_completion',
      resource_type: 'course',
      resource_id: 'course_123',
      metadata: { score: 95, time_spent: 3600 }
    })
  });
  return response.json();
};
```

### Real-Time WebSocket Connection
```javascript
const connectWebSocket = (userId) => {
  const ws = new WebSocket(`ws://localhost:8000/ws/analytics/${userId}`);
  
  ws.onopen = () => {
    console.log('Connected to real-time analytics');
    ws.send(JSON.stringify({
      type: 'subscribe',
      channels: ['engagement', 'progress', 'alerts']
    }));
  };
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('Real-time update:', data);
    // Update UI with real-time data
  };
};
```

### Generating Reports
```javascript
const generateReport = async (config) => {
  const response = await fetch('/api/v1/analytics/reports/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      format: 'pdf',
      metrics: ['engagement', 'completion', 'performance'],
      date_range: { start: '2024-01-01', end: '2024-01-31' },
      filters: { course_ids: ['course_1', 'course_2'] }
    })
  });
  
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'analytics-report.pdf';
  a.click();
};
```

## 🧪 Testing

### Backend Tests
```bash
cd python-backend
pytest tests/ -v
```

### Frontend Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

## 🚀 Deployment

### Production Build

1. **Frontend**
   ```bash
   npm run build
   # Deploy dist/ folder to your web server
   ```

2. **Backend**
   ```bash
   cd python-backend
   pip install gunicorn
   gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
   ```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Environment-Specific Configurations

- **Development**: Use `.env.development`
- **Staging**: Use `.env.staging`
- **Production**: Use `.env.production`

## 🔒 Security

- **Authentication**: JWT-based authentication system
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: Encrypted sensitive data storage
- **API Security**: Rate limiting and input validation
- **CORS**: Configurable cross-origin resource sharing

## 📊 Monitoring and Logging

- **Application Monitoring**: Structured logging with correlation IDs
- **Performance Metrics**: Response time and throughput monitoring
- **Error Tracking**: Comprehensive error logging and alerting
- **Health Checks**: Automated system health monitoring

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Full Documentation](docs/README.md)
- **API Reference**: http://localhost:8000/docs
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Real-time analytics dashboard
- ✅ AI-powered recommendations
- ✅ Google Classroom integration
- ✅ Progress tracking system

### Phase 2 (Next)
- 🔄 Mobile application
- 🔄 Advanced ML models
- 🔄 Multi-tenant support
- 🔄 Enhanced reporting

### Phase 3 (Future)
- 📋 Blockchain certificates
- 📋 VR/AR integration
- 📋 Advanced gamification
- 📋 Social learning features

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) for the excellent Python web framework
- [React](https://reactjs.org/) for the powerful frontend library
- [Google Gemini](https://ai.google.dev/) for AI capabilities
- [Recharts](https://recharts.org/) for beautiful data visualizations
- All contributors and the open-source community

---

<div align="center">
  <p>Made with ❤️ for educators and learners worldwide</p>
  <p>
    <a href="#-features">Features</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-api-documentation">API Docs</a> •
    <a href="#-contributing">Contributing</a>
  </p>
</div>