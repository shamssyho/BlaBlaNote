# BlaBlaNote

BlaBlaNote is a production-oriented AI voice-notes platform built in an Nx monorepo with NestJS + React. It enables users to upload voice notes, generate transcriptions and summaries with AI, organize notes by projects/tags, and share content through private/public channels.

---

## Features Overview

### Core Product Features
- Voice note upload (audio file intake and processing)
- AI transcription (OpenAI Whisper)
- AI summarization + translation support
- Notes CRUD and lifecycle tracking (`UPLOADED`, `TRANSCRIBING`, `SUMMARIZING`, `READY`, `FAILED`)
- Projects for note organization
- Tag system per user
- Search and filters (text, date range, tags, project)

### Sharing Features
- Share by email (Brevo)
- Share by WhatsApp (Twilio)
- Public secure share links with token + expiration + permission flags

### Platform Features
- JWT authentication (access token + rotating refresh token)
- User self-service endpoints (profile export, account deletion)
- Admin dashboard APIs (stats, users, jobs monitoring)
- Blog module (public posts + admin management)
- Discord webhook notifications for operational/user actions
- Swagger API documentation

---

## Tech Stack

| Layer | Technology |
|---|---|
| Monorepo | Nx |
| Backend | NestJS (TypeScript) |
| Frontend | React + Vite + TypeScript + Ant Design |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT (access) + Refresh token rotation |
| AI | OpenAI Whisper + Chat Completions |
| Messaging | Brevo (email), Twilio (WhatsApp) |
| Observability | Request logging middleware + Discord webhook |
| API Docs | Swagger (`/api/docs`) |
| Package Manager | Yarn 1.x |

---

## Architecture Overview

BlaBlaNote follows a modular, layered approach aligned with clean architecture principles:

- **Presentation layer**: NestJS controllers + DTO validation
- **Application layer**: services encapsulating business flows (auth, notes, admin, blog, tags, projects)
- **Infrastructure layer**: Prisma, external providers (OpenAI, Brevo, Twilio, Discord)
- **Frontend layer**: modular React app consuming typed API clients

The workspace contains two main applications:
- `apps/api`: backend REST API
- `apps/front`: frontend SPA

---

## Folder Structure

```text
BlaBlaNote/
├─ apps/
│  ├─ api/
│  │  ├─ prisma/
│  │  │  ├─ schema.prisma
│  │  │  └─ seed.ts
│  │  └─ src/app/
│  │     ├─ auth/
│  │     ├─ note/
│  │     ├─ whisper/
│  │     ├─ admin/
│  │     ├─ blog/
│  │     ├─ project/
│  │     ├─ tag/
│  │     ├─ user/
│  │     ├─ discord/
│  │     └─ prisma/
│  ├─ front/
│  │  └─ src/
│  │     ├─ api/
│  │     ├─ modules/
│  │     ├─ pages/
│  │     ├─ layouts/
│  │     ├─ router/
│  │     └─ types/
│  ├─ api-e2e/
│  └─ front-e2e/
├─ docs/
├─ docker-compose.yml
├─ package.json
└─ nx.json
```

---

## Environment Variables

Create a `.env` file at repository root.

| Variable | Required | Example | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | `postgresql://user:pass@localhost:5432/blablanote?schema=public` | Prisma connection string |
| `POSTGRES_USER` | Yes (docker) | `postgres` | PostgreSQL username for `docker-compose` |
| `POSTGRES_PASSWORD` | Yes (docker) | `postgres` | PostgreSQL password for `docker-compose` |
| `POSTGRES_DB` | Yes (docker) | `blablanote` | PostgreSQL database name |
| `PORT` | No | `3001` | Backend API port |
| `FRONTEND_URL` | No | `http://localhost:4200` | CORS allowed frontend origin |
| `APP_URL` | No | `http://localhost:3001` | Base URL used in generated public share links |
| `NODE_ENV` | No | `development` / `production` | Affects cookie security settings |
| `JWT_SECRET` | Yes (prod) | `super-secret` | JWT signing secret |
| `JWT_ACCESS_EXPIRES_IN` | No | `15m` | Access token expiration |
| `JWT_REFRESH_REMEMBER_ME_DAYS` | No | `30` | Refresh token TTL (remember me) |
| `JWT_REFRESH_SESSION_HOURS` | No | `24` | Refresh token TTL (session mode) |
| `RESET_PASSWORD_TOKEN_MINUTES` | No | `20` | Password reset token validity |
| `BCRYPT_ROUNDS` | No | `10` | Password hashing rounds |
| `ADMIN_EMAIL` | Optional | `admin@blablanote.com` | Seed admin email |
| `ADMIN_PASSWORD` | Optional | `StrongPass123!` | Seed admin password |
| `OPENAI_API_KEY` | Yes (AI features) | `sk-...` | Used for Whisper + summarization |
| `BREVO_API_KEY` | Optional | `xkeysib-...` | Email sharing provider key |
| `TWILIO_ACCOUNT_SID` | Optional | `AC...` | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Optional | `...` | Twilio auth token |
| `TWILIO_WHATSAPP_NUMBER` | Optional | `whatsapp:+14155238886` | Sender number for WhatsApp share |
| `DISCORD_WEBHOOK_URL` | Optional | `https://discord.com/api/webhooks/...` | Notifications for actions/events |
| `VITE_API_BASE_URL` | Yes (frontend) | `http://localhost:3001` | Frontend API base URL |

---

## Installation

### 1) Prerequisites
- Node.js 20+
- Yarn `1.22.x`
- PostgreSQL 14+
- (Optional) Docker & Docker Compose

### 2) Install dependencies

```bash
yarn install
```

### 3) Start PostgreSQL (optional via Docker)

```bash
docker compose up -d db
```

### 4) Generate Prisma client

```bash
yarn prisma:generate
```

### 5) Run database migrations

```bash
yarn prisma:migrate
```

### 6) (Optional) Seed admin user

```bash
npx prisma db seed
```

---

## Prisma Migration Commands

```bash
# Sync schema to root prisma folder + generate client
yarn prisma:generate

# Create/apply dev migration
yarn prisma:migrate

# Deploy migrations in production
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio
```

---

## Running Locally

### Backend (API)

```bash
yarn nx serve api
```

API default URL: `http://localhost:3001`

### Frontend (Web App)

```bash
yarn nx serve front
```

Frontend default URL (Nx/Vite): typically `http://localhost:4200`

### Run both (two terminals)
- Terminal A: `yarn nx serve api`
- Terminal B: `yarn nx serve front`

---

## Running in Production

### 1) Build all applications

```bash
yarn build
```

### 2) Apply migrations

```bash
npx prisma migrate deploy
```

### 3) Start API in production mode

```bash
yarn nx serve api --configuration=production
```

> For hardened production deployment, run built output with a process manager (PM2/systemd), configure HTTPS/TLS at reverse proxy level, and use managed PostgreSQL + secret manager.

---

## Swagger Documentation

When API is running:

- Swagger UI: `http://localhost:3001/api/docs`

Use Swagger Authorize button with:

```text
Bearer <access_token>
```

---

## API Authentication (Access + Refresh)

### Login
1. `POST /auth/login` with email/password (+ optional `rememberMe`)
2. API returns `access_token` in JSON
3. API sets refresh token as **HttpOnly cookie** (`/auth` scoped)

### Authenticated requests
- Frontend sends `Authorization: Bearer <access_token>`
- On `401`, frontend calls `POST /auth/refresh` automatically
- If refresh succeeds, original request is retried

### Logout
- `POST /auth/logout` revokes refresh token
- Refresh cookie is cleared

---

## Testing Instructions

```bash
# Unit/integration tests (if configured)
yarn nx test api
yarn nx test front

# E2E projects
yarn nx test api-e2e
yarn nx test front-e2e

# Lint
yarn nx lint api
yarn nx lint front
```

If some targets are not defined yet in your local Nx setup, run:

```bash
yarn nx show project <project-name>
```

---

## Common Errors & Troubleshooting

### 1) `P1001: Can't reach database server`
- Ensure PostgreSQL is running
- Verify `DATABASE_URL`
- If Dockerized DB: `docker compose ps`

### 2) `Missing Discord Webhook URL`
- Set `DISCORD_WEBHOOK_URL`
- Or disable webhook calls in flows where not required

### 3) `401 Unauthorized` loops
- Ensure frontend sends cookies (`withCredentials: true`)
- Verify `FRONTEND_URL` and CORS config
- Check `JWT_SECRET` consistency across environments

### 4) Whisper/OpenAI errors
- Validate `OPENAI_API_KEY`
- Ensure uploaded extension is supported (`.mp3`, `.wav`, `.m4a`, etc.)
- Check outbound network access to OpenAI API

### 5) Sharing failures (Email/WhatsApp)
- Validate Brevo/Twilio credentials
- Confirm sender identities are approved in providers

### 6) Public links open wrong host
- Set `APP_URL` to correct public backend URL

---

## Future Improvements

- Async queue (BullMQ/RabbitMQ/SQS) for transcription pipeline
- S3-compatible object storage adapter for uploaded audio + attachments
- Replace in-memory access token handling with secure persistence strategy
- Centralized observability stack (OpenTelemetry + Prometheus + Grafana)
- Rate limiting and abuse protection hardening by route category
- API versioning policy (`/v1`)
- Multi-language summarization options per user preferences
- CI quality gates (coverage thresholds, security scans, migration checks)
- Blue/green or canary deployment strategy

---

## License

MIT
