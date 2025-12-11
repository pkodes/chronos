🕐 Chronos - Distributed Job Scheduler
Production-ready distributed job scheduling system

Architecture: Distributed
Node.js 18
PostgreSQL 15
Redis 7
React 18
📄 Print to PDF
✨ Features
🎯 Core Functionality
Schedule Jobs: One-time or recurring jobs with cron-like syntax
Multiple Job Types: Webhooks, Email, Database commands
Real-time Dashboard: Monitor job execution live
Manual Execution: Run jobs on-demand with one click
Execution History: Track success/failure rates
🏗️ Architecture
Distributed System: Separate scheduler, worker, and API services
Message Queue: Redis-based job queue for reliability
Scalable Workers: Horizontally scalable worker nodes
Relational Database: PostgreSQL for job persistence
📋 Prerequisites
Node.js 18 or higher
PostgreSQL 15+
Redis 7+
npm or yarn package manager
🚀 Quick Start Guide
1. Clone and Setup
# Clone the repository git clone https://github.com/yourusername/chronos-scheduler.git cd chronos-scheduler # Install backend dependencies npm install # Install frontend dependencies cd frontend npm install cd ..
2. Database Setup
# Create PostgreSQL database createdb chronos # Setup environment variables cp .env.example .env # Edit .env with your database credentials # Initialize database schema npx prisma generate npx prisma db push
3. Start Services
# Terminal 1 - Backend API: npm run dev # Terminal 2 - Scheduler Service: npm run scheduler # Terminal 3 - Worker Service: npm run worker # Terminal 4 - Frontend Dashboard: cd frontend npm start
4. Access the Application
API Server: http://localhost:3000
Dashboard: http://localhost:3001
Health Check: http://localhost:3000/health
🏗️ Architecture Overview
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React         │    │   Express       │    │   PostgreSQL    │
│   Dashboard     │───▶│   API Server    │───▶│   Database      │
│   (localhost:3001)│  │   (localhost:3000)│  │   (Jobs + History)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                 │                        │
                                 ▼                        ▼
                        ┌─────────────────┐    ┌─────────────────┐
                        │   Redis Queue   │◄───┤   Scheduler     │
                        │   (BullMQ)      │    │   Service       │
                        └─────────────────┘    └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │   Worker        │
                        │   Service       │
                        │   (Job Executor)│
                        └─────────────────┘
            
📚 API Documentation
Jobs Endpoints
Method	Endpoint	Description
GET	/api/jobs	Get all jobs with execution history
GET	/api/jobs/:id	Get specific job details
POST	/api/jobs	Create a new job
PUT	/api/jobs/:id	Update an existing job
DELETE	/api/jobs/:id	Delete a job
POST	/api/jobs/:id/run	Execute job immediately
Create a Job Example
curl -X POST http://localhost:3000/api/jobs \ -H "Content-Type: application/json" \ -d '{ "name": "Daily Weather Report", "schedule": "0 8 * * *", "type": "WEBHOOK", "payload": { "url": "https://api.openweathermap.org/data/2.5/weather", "method": "GET", "params": { "q": "London", "appid": "your-api-key" } } }'
🔧 Job Types
1. Webhook Jobs
{ "type": "WEBHOOK", "payload": { "url": "https://api.example.com/endpoint", "method": "POST", "headers": { "Authorization": "Bearer token" }, "body": { "action": "process" } } }
2. Email Jobs (Coming Soon)
{ "type": "EMAIL", "payload": { "to": "user@example.com", "subject": "Daily Report", "body": "Your daily summary..." } }
🚨 Troubleshooting
Common Issues
1. "Port already in use"
# Find and kill the process lsof -ti:3000 | xargs kill -9 lsof -ti:3001 | xargs kill -9
2. Redis connection failed
# Start Redis redis-server # Or using Docker docker run -d -p 6379:6379 redis:7-alpine
Health Checks
# API Health curl http://localhost:3000/health # Database Connection curl http://localhost:3000/api/jobs # Redis Connection redis-cli ping
Chronos - Distributed Job Scheduler

Documentation generated on December 12, 2024

© 2024 Chronos Project | MIT License