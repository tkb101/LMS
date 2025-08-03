# 🚀 EduPath Analytics - Deployment Guide

## Overview

This guide covers deploying EduPath Analytics in various environments, from development to production. The system consists of a React frontend, FastAPI backend, PostgreSQL database, and Redis cache.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Development Deployment](#development-deployment)
3. [Production Deployment](#production-deployment)
4. [Docker Deployment](#docker-deployment)
5. [Cloud Deployment](#cloud-deployment)
6. [Environment Configuration](#environment-configuration)
7. [Security Considerations](#security-considerations)
8. [Monitoring & Logging](#monitoring--logging)
9. [Backup & Recovery](#backup--recovery)
10. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements

#### Minimum Requirements
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 20GB SSD
- **Network**: 100 Mbps

#### Recommended Requirements
- **CPU**: 4+ cores
- **RAM**: 8GB+
- **Storage**: 50GB+ SSD
- **Network**: 1 Gbps

### Software Dependencies

#### Development Environment
```bash
# Node.js and npm
node --version  # v18.0.0+
npm --version   # v9.0.0+

# Python
python --version  # v3.9.0+
pip --version     # v21.0.0+

# Database
psql --version    # PostgreSQL 13+
redis-server --version  # Redis 6+

# Git
git --version    # v2.30.0+
```

#### Production Environment
```bash
# Additional tools
docker --version     # v20.10.0+
docker-compose --version  # v2.0.0+
nginx --version      # v1.20.0+
certbot --version    # v1.21.0+
```

## Development Deployment

### Local Development Setup

#### 1. Clone Repository
```bash
git clone <repository-url>
cd LMS
```

#### 2. Backend Setup
```bash
# Navigate to backend directory
cd python-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Edit .env with your configuration
```

#### 3. Database Setup
```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Install PostgreSQL (Windows)
# Download from https://www.postgresql.org/download/windows/

# Create database
sudo -u postgres createdb edupath_analytics

# Create user (optional)
sudo -u postgres psql
CREATE USER edupath_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE edupath_analytics TO edupath_user;
\q
```

#### 4. Redis Setup
```bash
# Install Redis (Ubuntu/Debian)
sudo apt install redis-server

# Install Redis (macOS)
brew install redis
brew services start redis

# Install Redis (Windows)
# Download from https://github.com/microsoftarchive/redis/releases

# Start Redis
redis-server
```

#### 5. Initialize Database
```bash
cd python-backend
python -c "
from app.core.database import engine
from app.models.analytics import Base
Base.metadata.create_all(bind=engine)
print('Database initialized successfully!')
"
```

#### 6. Frontend Setup
```bash
# Navigate to root directory
cd ..

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration
```

#### 7. Start Development Servers
```bash
# Terminal 1: Start Redis (if not running as service)
redis-server

# Terminal 2: Start Backend
cd python-backend
python main.py

# Terminal 3: Start Frontend
npm run dev
```

#### 8. Verify Installation
```bash
# Check backend
curl http://localhost:8000/health

# Check frontend
curl http://localhost:5173

# Check API documentation
open http://localhost:8000/docs
```

### Development Environment Variables

#### Backend (.env in python-backend/)
```env
# Development Configuration
DEBUG=true
LOG_LEVEL=DEBUG

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/edupath_analytics

# Redis
REDIS_URL=redis://localhost:6379/0

# Security (use secure keys in production)
SECRET_KEY=dev-secret-key-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AI Services (get from respective providers)
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Google Classroom Integration
GOOGLE_CLASSROOM_CLIENT_ID=your_google_client_id
GOOGLE_CLASSROOM_CLIENT_SECRET=your_google_client_secret

# CORS (allow frontend origin)
CORS_ORIGINS=["http://localhost:5173"]
```

#### Frontend (.env in root directory)
```env
# Development Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
VITE_APP_NAME=EduPath Analytics
VITE_APP_VERSION=1.0.0
VITE_DEBUG=true
```

## Production Deployment

### Server Setup

#### 1. Server Preparation (Ubuntu 20.04 LTS)
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git unzip software-properties-common

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Python 3.9+
sudo apt install -y python3 python3-pip python3-venv

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Redis
sudo apt install -y redis-server

# Install Nginx
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

#### 2. Create Application User
```bash
# Create dedicated user
sudo useradd -m -s /bin/bash edupath
sudo usermod -aG sudo edupath

# Switch to application user
sudo su - edupath
```

#### 3. Application Deployment
```bash
# Clone repository
git clone <repository-url> /home/edupath/edupath-analytics
cd /home/edupath/edupath-analytics

# Backend setup
cd python-backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend build
cd ..
npm install
npm run build
```

#### 4. Database Configuration
```bash
# Configure PostgreSQL
sudo -u postgres psql
CREATE DATABASE edupath_analytics;
CREATE USER edupath_user WITH PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE edupath_analytics TO edupath_user;
\q

# Initialize database
cd /home/edupath/edupath-analytics/python-backend
source venv/bin/activate
python -c "
from app.core.database import engine
from app.models.analytics import Base
Base.metadata.create_all(bind=engine)
"
```

#### 5. Production Environment Configuration

##### Backend Environment (.env)
```env
# Production Configuration
DEBUG=false
LOG_LEVEL=INFO

# Database
DATABASE_URL=postgresql://edupath_user:secure_password_here@localhost:5432/edupath_analytics

# Redis
REDIS_URL=redis://localhost:6379/0

# Security
SECRET_KEY=your-super-secure-secret-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AI Services
GEMINI_API_KEY=your_production_gemini_api_key
OPENAI_API_KEY=your_production_openai_api_key

# Google Classroom Integration
GOOGLE_CLASSROOM_CLIENT_ID=your_production_google_client_id
GOOGLE_CLASSROOM_CLIENT_SECRET=your_production_google_client_secret

# CORS
CORS_ORIGINS=["https://yourdomain.com"]

# Performance
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=30
REDIS_POOL_SIZE=10
```

##### Frontend Environment (.env.production)
```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com
VITE_APP_NAME=EduPath Analytics
VITE_APP_VERSION=1.0.0
VITE_DEBUG=false
```

#### 6. Process Management with Systemd

##### Backend Service (/etc/systemd/system/edupath-backend.service)
```ini
[Unit]
Description=EduPath Analytics Backend
After=network.target postgresql.service redis.service

[Service]
Type=exec
User=edupath
Group=edupath
WorkingDirectory=/home/edupath/edupath-analytics/python-backend
Environment=PATH=/home/edupath/edupath-analytics/python-backend/venv/bin
ExecStart=/home/edupath/edupath-analytics/python-backend/venv/bin/gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 127.0.0.1:8000
ExecReload=/bin/kill -s HUP $MAINPID
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

##### Enable and Start Services
```bash
# Enable and start backend service
sudo systemctl enable edupath-backend
sudo systemctl start edupath-backend
sudo systemctl status edupath-backend

# Enable and start PostgreSQL and Redis
sudo systemctl enable postgresql redis-server
sudo systemctl start postgresql redis-server
```

#### 7. Nginx Configuration

##### Main Configuration (/etc/nginx/sites-available/edupath-analytics)
```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=websocket:10m rate=100r/s;

# Upstream backend
upstream backend {
    server 127.0.0.1:8000;
    keepalive 32;
}

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# Main HTTPS server
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Frontend (React app)
    location / {
        root /home/edupath/edupath-analytics/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API endpoints
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # WebSocket endpoints
    location /ws/ {
        limit_req zone=websocket burst=200 nodelay;
        
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket specific timeouts
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://backend;
        access_log off;
    }
}
```

##### Enable Site
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/edupath-analytics /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### 8. SSL Certificate Setup
```bash
# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test automatic renewal
sudo certbot renew --dry-run

# Set up automatic renewal
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

## Docker Deployment

### Docker Configuration

#### 1. Backend Dockerfile
```dockerfile
# python-backend/Dockerfile
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
        build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Create non-root user
RUN adduser --disabled-password --gecos '' appuser
RUN chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run application
CMD ["gunicorn", "main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]
```

#### 2. Frontend Dockerfile
```dockerfile
# Dockerfile.frontend
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### 3. Nginx Configuration for Docker (nginx.conf)
```nginx
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;

    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Frontend routes
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Static assets caching
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # API proxy (for development)
        location /api/ {
            proxy_pass http://backend:8000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # WebSocket proxy (for development)
        location /ws/ {
            proxy_pass http://backend:8000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

#### 4. Docker Compose Configuration

##### Development (docker-compose.dev.yml)
```yaml
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
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  backend:
    build:
      context: ./python-backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/edupath_analytics
      - REDIS_URL=redis://redis:6379/0
      - DEBUG=true
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./python-backend:/app
    command: ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
    environment:
      - VITE_API_BASE_URL=http://localhost:8000
      - VITE_WS_URL=ws://localhost:8000

volumes:
  postgres_data:
  redis_data:
```

##### Production (docker-compose.prod.yml)
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5
    restart: unless-stopped

  backend:
    build:
      context: ./python-backend
      dockerfile: Dockerfile
    environment:
      - DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      - REDIS_URL=redis://redis:6379/0
      - SECRET_KEY=${SECRET_KEY}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - DEBUG=false
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    depends_on:
      - backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.prod.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
      - ./logs:/var/log/nginx
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

#### 5. Environment File (.env.prod)
```env
# Database
POSTGRES_DB=edupath_analytics
POSTGRES_USER=edupath_user
POSTGRES_PASSWORD=secure_password_here

# Application
SECRET_KEY=your-super-secure-secret-key
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key

# Google Classroom
GOOGLE_CLASSROOM_CLIENT_ID=your_google_client_id
GOOGLE_CLASSROOM_CLIENT_SECRET=your_google_client_secret
```

#### 6. Deploy with Docker Compose
```bash
# Development
docker-compose -f docker-compose.dev.yml up -d

# Production
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d

# View logs
docker-compose logs -f

# Scale services
docker-compose -f docker-compose.prod.yml up -d --scale backend=3

# Update services
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d
```

## Cloud Deployment

### AWS Deployment

#### 1. AWS ECS with Fargate

##### Task Definition (task-definition.json)
```json
{
  "family": "edupath-analytics",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::account:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "your-account.dkr.ecr.region.amazonaws.com/edupath-backend:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "DATABASE_URL",
          "value": "postgresql://user:pass@rds-endpoint:5432/edupath"
        },
        {
          "name": "REDIS_URL",
          "value": "redis://elasticache-endpoint:6379/0"
        }
      ],
      "secrets": [
        {
          "name": "SECRET_KEY",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:edupath/secret-key"
        },
        {
          "name": "GEMINI_API_KEY",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:edupath/gemini-key"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/edupath-analytics",
          "awslogs-region": "us-west-2",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:8000/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3
      }
    },
    {
      "name": "frontend",
      "image": "your-account.dkr.ecr.region.amazonaws.com/edupath-frontend:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/edupath-analytics",
          "awslogs-region": "us-west-2",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

##### Deploy to ECS
```bash
# Build and push images
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin your-account.dkr.ecr.us-west-2.amazonaws.com

# Backend
docker build -t edupath-backend ./python-backend
docker tag edupath-backend:latest your-account.dkr.ecr.us-west-2.amazonaws.com/edupath-backend:latest
docker push your-account.dkr.ecr.us-west-2.amazonaws.com/edupath-backend:latest

# Frontend
docker build -t edupath-frontend -f Dockerfile.frontend .
docker tag edupath-frontend:latest your-account.dkr.ecr.us-west-2.amazonaws.com/edupath-frontend:latest
docker push your-account.dkr.ecr.us-west-2.amazonaws.com/edupath-frontend:latest

# Register task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create or update service
aws ecs create-service \
  --cluster edupath-cluster \
  --service-name edupath-service \
  --task-definition edupath-analytics:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-12345,subnet-67890],securityGroups=[sg-12345],assignPublicIp=ENABLED}"
```

#### 2. AWS RDS and ElastiCache Setup
```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier edupath-postgres \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.3 \
  --allocated-storage 20 \
  --db-name edupath_analytics \
  --master-username edupath_user \
  --master-user-password secure_password \
  --vpc-security-group-ids sg-12345 \
  --backup-retention-period 7 \
  --storage-encrypted

# Create ElastiCache cluster
aws elasticache create-cache-cluster \
  --cache-cluster-id edupath-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1 \
  --security-group-ids sg-12345
```

### Google Cloud Platform Deployment

#### 1. Cloud Run Deployment
```bash
# Build and deploy backend
gcloud builds submit --tag gcr.io/PROJECT_ID/edupath-backend ./python-backend
gcloud run deploy edupath-backend \
  --image gcr.io/PROJECT_ID/edupath-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL=postgresql://user:pass@/edupath?host=/cloudsql/PROJECT_ID:REGION:INSTANCE \
  --set-env-vars REDIS_URL=redis://redis-ip:6379/0

# Build and deploy frontend
gcloud builds submit --tag gcr.io/PROJECT_ID/edupath-frontend -f Dockerfile.frontend .
gcloud run deploy edupath-frontend \
  --image gcr.io/PROJECT_ID/edupath-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### 2. Cloud SQL and Memorystore Setup
```bash
# Create Cloud SQL instance
gcloud sql instances create edupath-postgres \
  --database-version POSTGRES_15 \
  --tier db-f1-micro \
  --region us-central1

# Create database
gcloud sql databases create edupath_analytics --instance edupath-postgres

# Create user
gcloud sql users create edupath_user --instance edupath-postgres --password secure_password

# Create Memorystore Redis instance
gcloud redis instances create edupath-redis \
  --size 1 \
  --region us-central1 \
  --redis-version redis_6_x
```

### Azure Deployment

#### 1. Container Instances
```bash
# Create resource group
az group create --name edupath-rg --location eastus

# Create container group
az container create \
  --resource-group edupath-rg \
  --name edupath-analytics \
  --image your-registry.azurecr.io/edupath-backend:latest \
  --cpu 2 \
  --memory 4 \
  --ports 8000 \
  --environment-variables \
    DATABASE_URL=postgresql://user:pass@postgres-server:5432/edupath \
    REDIS_URL=redis://redis-cache:6379/0
```

#### 2. Azure Database and Cache
```bash
# Create PostgreSQL server
az postgres server create \
  --resource-group edupath-rg \
  --name edupath-postgres \
  --location eastus \
  --admin-user edupath_user \
  --admin-password secure_password \
  --sku-name B_Gen5_1

# Create Redis cache
az redis create \
  --resource-group edupath-rg \
  --name edupath-redis \
  --location eastus \
  --sku Basic \
  --vm-size c0
```

## Environment Configuration

### Configuration Management

#### 1. Environment-Specific Configs

##### Development
```python
# config/development.py
class DevelopmentConfig:
    DEBUG = True
    LOG_LEVEL = "DEBUG"
    DATABASE_URL = "postgresql://postgres:password@localhost:5432/edupath_dev"
    REDIS_URL = "redis://localhost:6379/0"
    CORS_ORIGINS = ["http://localhost:5173"]
    SECRET_KEY = "dev-secret-key"
```

##### Staging
```python
# config/staging.py
class StagingConfig:
    DEBUG = False
    LOG_LEVEL = "INFO"
    DATABASE_URL = os.getenv("DATABASE_URL")
    REDIS_URL = os.getenv("REDIS_URL")
    CORS_ORIGINS = ["https://staging.yourdomain.com"]
    SECRET_KEY = os.getenv("SECRET_KEY")
```

##### Production
```python
# config/production.py
class ProductionConfig:
    DEBUG = False
    LOG_LEVEL = "WARNING"
    DATABASE_URL = os.getenv("DATABASE_URL")
    REDIS_URL = os.getenv("REDIS_URL")
    CORS_ORIGINS = ["https://yourdomain.com"]
    SECRET_KEY = os.getenv("SECRET_KEY")
    
    # Performance settings
    DATABASE_POOL_SIZE = 20
    DATABASE_MAX_OVERFLOW = 30
    REDIS_POOL_SIZE = 10
```

#### 2. Secrets Management

##### Using AWS Secrets Manager
```python
import boto3
from botocore.exceptions import ClientError

def get_secret(secret_name, region_name="us-west-2"):
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )
    
    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
        return get_secret_value_response['SecretString']
    except ClientError as e:
        raise e

# Usage
SECRET_KEY = get_secret("edupath/secret-key")
GEMINI_API_KEY = get_secret("edupath/gemini-api-key")
```

##### Using HashiCorp Vault
```python
import hvac

def get_vault_secret(path, key):
    client = hvac.Client(url='https://vault.yourdomain.com')
    client.token = os.getenv('VAULT_TOKEN')
    
    response = client.secrets.kv.v2.read_secret_version(path=path)
    return response['data']['data'][key]

# Usage
SECRET_KEY = get_vault_secret('edupath/config', 'secret_key')
```

## Security Considerations

### Application Security

#### 1. Authentication & Authorization
```python
# JWT token validation
from jose import JWTError, jwt
from datetime import datetime, timedelta

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

#### 2. Input Validation
```python
from pydantic import BaseModel, validator
import re

class UserEventRequest(BaseModel):
    action: str
    resource_id: str
    metadata: Optional[Dict[str, Any]] = None
    
    @validator('action')
    def validate_action(cls, v):
        if not re.match(r'^[a-zA-Z0-9_]+$', v):
            raise ValueError('Invalid action format')
        return v
    
    @validator('resource_id')
    def validate_resource_id(cls, v):
        if not re.match(r'^[a-zA-Z0-9_-]+$', v):
            raise ValueError('Invalid resource ID format')
        return v
```

#### 3. Rate Limiting
```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.post("/api/v1/track-event")
@limiter.limit("100/minute")
async def track_event(request: Request, event_data: UserEventRequest):
    # Implementation
    pass
```

### Infrastructure Security

#### 1. Network Security
```bash
# Firewall rules (UFW)
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Database access (only from application servers)
sudo ufw allow from 10.0.1.0/24 to any port 5432
sudo ufw allow from 10.0.1.0/24 to any port 6379
```

#### 2. SSL/TLS Configuration
```nginx
# Strong SSL configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;

# HSTS
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

# OCSP Stapling
ssl_stapling on;
ssl_stapling_verify on;
ssl_trusted_certificate /etc/letsencrypt/live/yourdomain.com/chain.pem;
```

#### 3. Database Security
```sql
-- Create read-only user for analytics
CREATE USER analytics_readonly WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE edupath_analytics TO analytics_readonly;
GRANT USAGE ON SCHEMA public TO analytics_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO analytics_readonly;

-- Enable row-level security
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_data_policy ON user_data FOR ALL TO app_user USING (user_id = current_setting('app.current_user_id'));
```

## Monitoring & Logging

### Application Monitoring

#### 1. Structured Logging
```python
import structlog
import logging

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

# Usage
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
        process_time=process_time,
        user_agent=request.headers.get("user-agent"),
        remote_addr=request.client.host
    )
    
    return response
```

#### 2. Health Checks
```python
from sqlalchemy import text

@app.get("/health")
async def health_check():
    health_status = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0",
        "checks": {}
    }
    
    # Database check
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        health_status["checks"]["database"] = "healthy"
    except Exception as e:
        health_status["checks"]["database"] = f"unhealthy: {str(e)}"
        health_status["status"] = "unhealthy"
    finally:
        db.close()
    
    # Redis check
    try:
        await redis_client.ping()
        health_status["checks"]["redis"] = "healthy"
    except Exception as e:
        health_status["checks"]["redis"] = f"unhealthy: {str(e)}"
        health_status["status"] = "unhealthy"
    
    # AI service check
    try:
        # Simple API call to verify connectivity
        health_status["checks"]["ai_service"] = "healthy"
    except Exception as e:
        health_status["checks"]["ai_service"] = f"unhealthy: {str(e)}"
    
    status_code = 200 if health_status["status"] == "healthy" else 503
    return JSONResponse(content=health_status, status_code=status_code)
```

#### 3. Metrics Collection
```python
from prometheus_client import Counter, Histogram, Gauge, generate_latest

# Metrics
REQUEST_COUNT = Counter('http_requests_total', 'Total HTTP requests', ['method', 'endpoint', 'status'])
REQUEST_DURATION = Histogram('http_request_duration_seconds', 'HTTP request duration')
ACTIVE_USERS = Gauge('active_users_total', 'Number of active users')

@app.middleware("http")
async def metrics_middleware(request: Request, call_next):
    start_time = time.time()
    
    response = await call_next(request)
    
    # Record metrics
    REQUEST_COUNT.labels(
        method=request.method,
        endpoint=request.url.path,
        status=response.status_code
    ).inc()
    
    REQUEST_DURATION.observe(time.time() - start_time)
    
    return response

@app.get("/metrics")
async def metrics():
    return Response(generate_latest(), media_type="text/plain")
```

### Infrastructure Monitoring

#### 1. System Monitoring with Prometheus
```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'edupath-backend'
    static_configs:
      - targets: ['localhost:8000']
    metrics_path: '/metrics'
    scrape_interval: 5s

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['localhost:9100']

  - job_name: 'postgres-exporter'
    static_configs:
      - targets: ['localhost:9187']

  - job_name: 'redis-exporter'
    static_configs:
      - targets: ['localhost:9121']
```

#### 2. Grafana Dashboard Configuration
```json
{
  "dashboard": {
    "title": "EduPath Analytics Dashboard",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{endpoint}}"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      },
      {
        "title": "Active Users",
        "type": "singlestat",
        "targets": [
          {
            "expr": "active_users_total",
            "legendFormat": "Active Users"
          }
        ]
      }
    ]
  }
}
```

#### 3. Log Aggregation with ELK Stack
```yaml
# docker-compose.monitoring.yml
version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.5.0
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

  logstash:
    image: docker.elastic.co/logstash/logstash:8.5.0
    ports:
      - "5044:5044"
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:8.5.0
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    depends_on:
      - elasticsearch

volumes:
  elasticsearch_data:
```

## Backup & Recovery

### Database Backup

#### 1. Automated Backup Script
```bash
#!/bin/bash
# backup.sh

# Configuration
DB_NAME="edupath_analytics"
DB_USER="edupath_user"
DB_HOST="localhost"
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/edupath_backup_$DATE.sql"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

# Remove backups older than 30 days
find $BACKUP_DIR -name "edupath_backup_*.sql.gz" -mtime +30 -delete

# Upload to S3 (optional)
aws s3 cp $BACKUP_FILE.gz s3://your-backup-bucket/database/

echo "Backup completed: $BACKUP_FILE.gz"
```

#### 2. Cron Job Setup
```bash
# Add to crontab
crontab -e

# Daily backup at 2 AM
0 2 * * * /home/edupath/scripts/backup.sh >> /var/log/backup.log 2>&1

# Weekly full backup at 3 AM on Sundays
0 3 * * 0 /home/edupath/scripts/full_backup.sh >> /var/log/backup.log 2>&1
```

#### 3. Recovery Script
```bash
#!/bin/bash
# restore.sh

BACKUP_FILE=$1
DB_NAME="edupath_analytics"
DB_USER="edupath_user"
DB_HOST="localhost"

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file>"
    exit 1
fi

# Stop application
sudo systemctl stop edupath-backend

# Drop and recreate database
sudo -u postgres psql -c "DROP DATABASE IF EXISTS $DB_NAME;"
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"

# Restore from backup
if [[ $BACKUP_FILE == *.gz ]]; then
    gunzip -c $BACKUP_FILE | psql -h $DB_HOST -U $DB_USER -d $DB_NAME
else
    psql -h $DB_HOST -U $DB_USER -d $DB_NAME < $BACKUP_FILE
fi

# Start application
sudo systemctl start edupath-backend

echo "Database restored from $BACKUP_FILE"
```

### Application Data Backup

#### 1. Redis Backup
```bash
#!/bin/bash
# redis_backup.sh

REDIS_HOST="localhost"
REDIS_PORT="6379"
BACKUP_DIR="/backups/redis"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Create Redis backup
redis-cli -h $REDIS_HOST -p $REDIS_PORT --rdb $BACKUP_DIR/dump_$DATE.rdb

# Compress backup
gzip $BACKUP_DIR/dump_$DATE.rdb

# Remove old backups
find $BACKUP_DIR -name "dump_*.rdb.gz" -mtime +7 -delete
```

#### 2. File System Backup
```bash
#!/bin/bash
# files_backup.sh

SOURCE_DIR="/home/edupath/edupath-analytics"
BACKUP_DIR="/backups/files"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Create tar archive
tar -czf $BACKUP_DIR/files_$DATE.tar.gz \
    --exclude='node_modules' \
    --exclude='venv' \
    --exclude='__pycache__' \
    --exclude='.git' \
    $SOURCE_DIR

# Upload to cloud storage
aws s3 cp $BACKUP_DIR/files_$DATE.tar.gz s3://your-backup-bucket/files/

# Remove local backups older than 7 days
find $BACKUP_DIR -name "files_*.tar.gz" -mtime +7 -delete
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connections
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"

# Check logs
sudo tail -f /var/log/postgresql/postgresql-13-main.log

# Test connection
psql -h localhost -U edupath_user -d edupath_analytics -c "SELECT 1;"
```

#### 2. Redis Connection Issues
```bash
# Check Redis status
sudo systemctl status redis-server

# Test connection
redis-cli ping

# Check memory usage
redis-cli info memory

# Monitor commands
redis-cli monitor
```

#### 3. Application Performance Issues
```bash
# Check system resources
htop
iostat -x 1
free -h
df -h

# Check application logs
tail -f /var/log/edupath/app.log

# Check database performance
sudo -u postgres psql -d edupath_analytics -c "
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
ORDER BY total_time DESC 
LIMIT 10;
"

# Check slow queries
sudo -u postgres psql -d edupath_analytics -c "
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
WHERE mean_time > 1000 
ORDER BY mean_time DESC;
"
```

#### 4. SSL Certificate Issues
```bash
# Check certificate expiration
openssl x509 -in /etc/letsencrypt/live/yourdomain.com/cert.pem -text -noout | grep "Not After"

# Test SSL configuration
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# Renew certificate
sudo certbot renew --dry-run
sudo certbot renew

# Check Nginx configuration
sudo nginx -t
sudo systemctl reload nginx
```

### Debugging Tools

#### 1. Application Debugging
```python
# Enable debug mode
import logging
logging.basicConfig(level=logging.DEBUG)

# Add request tracing
import uuid

@app.middleware("http")
async def add_request_id(request: Request, call_next):
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id
    
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    
    return response
```

#### 2. Database Debugging
```sql
-- Enable query logging
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_duration = on;
SELECT pg_reload_conf();

-- Check active connections
SELECT pid, usename, application_name, client_addr, state, query 
FROM pg_stat_activity 
WHERE state = 'active';

-- Check locks
SELECT blocked_locks.pid AS blocked_pid,
       blocked_activity.usename AS blocked_user,
       blocking_locks.pid AS blocking_pid,
       blocking_activity.usename AS blocking_user,
       blocked_activity.query AS blocked_statement,
       blocking_activity.query AS current_statement_in_blocking_process
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks ON blocking_locks.locktype = blocked_locks.locktype
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;
```

#### 3. Network Debugging
```bash
# Check port availability
netstat -tulpn | grep :8000
ss -tulpn | grep :8000

# Test connectivity
curl -I http://localhost:8000/health
curl -I https://yourdomain.com/health

# Check DNS resolution
nslookup yourdomain.com
dig yourdomain.com

# Monitor network traffic
sudo tcpdump -i any port 8000
```

This comprehensive deployment guide covers all aspects of deploying EduPath Analytics from development to production environments, including cloud deployments, security considerations, monitoring, and troubleshooting procedures.