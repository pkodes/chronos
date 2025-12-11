  Chronos Documentation @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'); \* { margin: 0; padding: 0; box-sizing: border-box; } body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; max-width: 210mm; margin: 0 auto; padding: 20mm; background: #fff; } .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; } .title { font-size: 36px; font-weight: 700; color: #1f2937; margin-bottom: 10px; } .subtitle { font-size: 18px; color: #6b7280; margin-bottom: 20px; } .badges { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; margin-bottom: 20px; } .badge { padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; } .section { margin-bottom: 30px; page-break-inside: avoid; } .section-title { font-size: 24px; font-weight: 600; color: #111827; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb; } .subsection { margin-bottom: 20px; } .subsection-title { font-size: 18px; font-weight: 600; color: #374151; margin-bottom: 10px; } .feature-list, .step-list { margin-left: 20px; margin-bottom: 15px; } .feature-list li, .step-list li { margin-bottom: 8px; } .code-block { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin: 15px 0; font-family: 'Courier New', monospace; font-size: 14px; overflow-x: auto; page-break-inside: avoid; } .architecture { text-align: center; margin: 20px 0; } .architecture pre { background: #f8fafc; padding: 20px; border-radius: 8px; font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.4; } table { width: 100%; border-collapse: collapse; margin: 20px 0; page-break-inside: avoid; } th { background: #f3f4f6; font-weight: 600; text-align: left; } th, td { border: 1px solid #d1d5db; padding: 10px; font-size: 14px; } .footer { text-align: center; margin-top: 50px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; } @media print { body { padding: 15mm; } .section { page-break-inside: avoid; page-break-after: avoid; } .no-print { display: none; } }

# 🕐 Chronos - Distributed Job Scheduler

Production-ready distributed job scheduling system

Architecture: Distributed Node.js 18 PostgreSQL 15 Redis 7 React 18

## ✨ Features

### 🎯 Core Functionality

*   **Schedule Jobs**: One-time or recurring jobs with cron-like syntax
*   **Multiple Job Types**: Webhooks
*   **Real-time Dashboard**: Monitor job execution live
*   **Manual Execution**: Run jobs on-demand with one click
*   **Execution History**: Track success/failure rates

### 🏗️ Architecture

*   **Distributed System**: Separate scheduler, worker, and API services
*   **Message Queue**: Redis-based job queue for reliability
*   **Scalable Workers**: Horizontally scalable worker nodes
*   **Relational Database**: PostgreSQL for job persistence

## 📋 Prerequisites

*   Node.js 18 or higher
*   PostgreSQL 15+
*   Redis 7+
*   npm or yarn package manager

## 🚀 Quick Start Guide

### 1\. Clone and Setup

\# Clone the repository git clone https://github.com/pkodes/chronos.git cd chronos # Install backend dependencies npm install # Install frontend dependencies cd frontend npm install cd ..

### 2\. Database Setup

\# Create PostgreSQL database createdb chronos # Setup environment variables cp .env.example .env # Edit .env with your database credentials # Initialize database schema npx prisma generate npx prisma db push

### 3\. Start Services

\# Terminal 1 - Backend API: npm run dev # Terminal 2 - Scheduler Service: npm run scheduler # Terminal 3 - Worker Service: npm run worker # Terminal 4 - Frontend Dashboard: cd frontend npm start

### 4\. Access the Application

*   **API Server**: http://localhost:3000
*   **Dashboard**: http://localhost:3001
*   **Health Check**: http://localhost:3000/health

## 🏗️ Architecture Overview

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
            

## 📚 API Documentation

### Jobs Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/jobs` | Get all jobs with execution history |
| `GET` | `/api/jobs/:id` | Get specific job details |
| `POST` | `/api/jobs` | Create a new job |
| `PUT` | `/api/jobs/:id` | Update an existing job |
| `DELETE` | `/api/jobs/:id` | Delete a job |
| `POST` | `/api/jobs/:id/run` | Execute job immediately |

### Create a Job Example

curl -X POST http://localhost:3000/api/jobs \\ -H "Content-Type: application/json" \\ -d '{ "name": "Daily Weather Report", "schedule": "0 8 \* \* \*", "type": "WEBHOOK", "payload": { "url": "https://api.openweathermap.org/data/2.5/weather", "method": "GET", "params": { "q": "London", "appid": "your-api-key" } } }'

## 🔧 Job Types

### 1\. Webhook Jobs

{ "type": "WEBHOOK", "payload": { "url": "https://api.example.com/endpoint", "method": "POST", "headers": { "Authorization": "Bearer token" }, "body": { "action": "process" } } }

### 2\. Email Jobs (Coming Soon)

{ "type": "EMAIL", "payload": { "to": "user@example.com", "subject": "Daily Report", "body": "Your daily summary..." } }

## 🚨 Troubleshooting

### Common Issues

#### 1\. "Port already in use"

\# Find and kill the process lsof -ti:3000 | xargs kill -9 lsof -ti:3001 | xargs kill -9

#### 2\. Redis connection failed

\# Start Redis redis-server # Or using Docker docker run -d -p 6379:6379 redis:7-alpine

### Health Checks

\# API Health curl http://localhost:3000/health # Database Connection curl http://localhost:3000/api/jobs # Redis Connection redis-cli ping

**Chronos** - Distributed Job Scheduler

© 2024 Chronos Project | MIT License

// Add page numbers for print if (window.print) { window.addEventListener('beforeprint', function() { document.querySelectorAll('.section').forEach((section, index) => { if (!section.querySelector('.page-number')) { const pageNum = document.createElement('div'); pageNum.className = 'page-number'; pageNum.style.position = 'absolute'; pageNum.style.bottom = '10mm'; pageNum.style.right = '20mm'; pageNum.style.fontSize = '12px'; pageNum.style.color = '#6b7280'; pageNum.textContent = \`Page ${index + 1}\`; section.style.position = 'relative'; section.appendChild(pageNum); } }); }); }