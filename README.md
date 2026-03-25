# Morning Plan — Backend API

A production-ready REST API for a habit-tracking mobile app, built with NestJS and TypeScript. Handles task management, streaks, push notifications, subscription billing, file storage, and analytics.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS 11, TypeScript |
| Database | PostgreSQL 16 + TypeORM |
| Cache / Queue | Redis 7 + BullMQ |
| Auth | Supabase JWT |
| Push Notifications | Firebase Cloud Messaging (FCM) |
| Subscriptions | RevenueCat webhooks |
| File Storage | AWS S3-compatible (MinIO) |
| Containerization | Docker + Docker Compose |
| CI/CD | GitLab CI/CD + Nginx reverse proxy |
| API Docs | Swagger / OpenAPI (auto-generated) |
| Admin Panel | React + Vite (in `/admin-panel`) |

## Features

- **Task management** — create, complete, and organize daily habits with free/premium tier limits
- **Streak tracking** — calculates and maintains user streaks across daily completions
- **Push notifications** — cron-scheduled reminders via Firebase Cloud Messaging with per-device token management
- **Subscription management** — handles RevenueCat webhook events (7 types) for free/premium feature gating
- **File storage** — avatar and media uploads to S3-compatible storage (MinIO in dev, any S3 bucket in prod)
- **Analytics** — DAU/WAU/MAU metrics, cohort analysis, and completion rate tracking
- **Famous persons** — curated content module for daily inspiration
- **Admin panel** — React-based internal dashboard for content management

## Project Structure

```
src/
├── auth/           # Supabase JWT strategy + guards
├── tasks/          # Core habit/task CRUD
├── streaks/        # Streak calculation logic
├── reminders/      # BullMQ-based push notification scheduler
├── fcm/            # Firebase Cloud Messaging service
├── webhooks/       # RevenueCat subscription webhooks
├── storage/        # S3-compatible file upload service
├── analytics/      # DAU/WAU/MAU + cohort analytics
├── users/          # User profile management
├── device-tokens/  # FCM device token registry
├── completions/    # Daily completion tracking
├── day-starts/     # Day-start event tracking
├── famous-persons/ # Curated content
├── events/         # App event logging
├── admin/          # Admin-only endpoints
├── common/         # Shared guards, decorators, interceptors
└── entities/       # TypeORM entity definitions
```

## Getting Started

### Prerequisites

- Node.js 18+
- Docker + Docker Compose

### 1. Clone and install dependencies

```bash
git clone https://github.com/Nibir00795/morning-plan-backend.git
cd morning-plan-backend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your credentials
```

Key variables to set:

```env
# Supabase (required for auth)
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_JWT_SECRET=

# Firebase (required for push notifications)
FCM_PROJECT_ID=
FCM_PRIVATE_KEY=
FCM_CLIENT_EMAIL=

# RevenueCat (required for subscription webhooks)
REVENUECAT_WEBHOOK_SECRET=
```

### 3. Start infrastructure (Postgres, Redis, MinIO)

```bash
docker-compose up -d
```

### 4. Run the API

```bash
# Development (with hot reload)
npm run start:dev

# Production
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`.
Swagger docs: `http://localhost:3000/api`

## API Documentation

Auto-generated Swagger UI is available at `/api` when the server is running. All endpoints are documented with request/response schemas.

## Running Tests

```bash
# Unit tests
npm run test

# Test coverage
npm run test:cov

# End-to-end tests
npm run test:e2e
```

## Production Deployment

The project includes a Docker-based deployment setup:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

CI/CD is configured via `.gitlab-ci.yml` and deploys automatically on pushes to `main` via SSH to the production server, behind an Nginx reverse proxy.

## Admin Panel

A React + Vite admin dashboard lives in `/admin-panel`. To run it locally:

```bash
cd admin-panel
npm install
npm run dev
```

## Seeding

```bash
npm run seed
```

Populates the database with initial content (famous persons, default task categories, etc.).

## Environment Variables

See [`.env.example`](.env.example) for the full list of required and optional variables with descriptions.

## License

Private — all rights reserved.
