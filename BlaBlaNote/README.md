# BlaBlaNote

BlaBlaNote is a full-stack SaaS platform that converts voice notes into searchable, structured knowledge with AI-powered transcription, summarization, organization, and sharing.

## Feature List

- Email/password authentication with JWT access tokens and refresh token rotation
- User registration, login, logout, forgot password, reset password
- Voice note creation with optional audio upload
- Note lifecycle tracking: uploaded, transcribing, summarizing, ready, failed
- AI transcription pipeline
- AI summarization and translation fields per note
- Notes listing with pagination, filtering, and search
- Project management for note grouping
- Tag management and many-to-many note tagging
- Public share links with scoped permissions and expiration
- Share by email and WhatsApp
- Profile and account settings management
- Avatar upload through S3-compatible storage gateway
- Admin dashboard stats and background job visibility
- Admin user management and block/unblock workflow
- Blog and blog categories with admin publishing workflows
- Discord webhook notifications
- Internationalization support for English and French in frontend
- API documentation through Swagger
- Backend unit and e2e tests, frontend unit and e2e tests

## Tech Stack

- Monorepo: Nx
- Package manager: Yarn 1
- Backend: NestJS, Prisma, PostgreSQL
- Frontend: React, TypeScript, Vite, Ant Design
- Authentication: JWT + refresh token rotation with secure HTTP-only cookie
- Validation: class-validator, class-transformer
- API docs: Swagger (`@nestjs/swagger`)
- Testing: Jest, Vitest, Playwright
- Integrations: OpenAI Whisper API, Brevo, Twilio WhatsApp, Discord webhook, S3-compatible storage

## Monorepo Structure

```text
apps/
  api/          NestJS API + Prisma schema + seed
  api-e2e/      Backend end-to-end tests
  front/        React frontend (Vite)
  front-e2e/    Frontend Playwright tests
```

## Setup

### Prerequisites

- Node.js 20+
- Yarn 1.22+
- PostgreSQL 14+

### Install

```bash
yarn install
```

## Environment Variables

| Variable                       | Required    | Scope            | Description                                   | Example                                                 |
| ------------------------------ | ----------- | ---------------- | --------------------------------------------- | ------------------------------------------------------- |
| `DATABASE_URL`                 | Yes         | API/Prisma       | Primary PostgreSQL connection string          | `postgresql://user:pass@localhost:5432/blablanote`      |
| `DATABASE_URL_TEST`            | Recommended | API E2E          | Dedicated test database URL                   | `postgresql://user:pass@localhost:5432/blablanote_test` |
| `PORT`                         | No          | API              | API port                                      | `3000`                                                  |
| `HOST`                         | No          | API E2E          | Host used by API e2e setup                    | `127.0.0.1`                                             |
| `FRONTEND_URL`                 | Yes         | API/Auth/CORS    | Frontend origin for CORS and links            | `http://localhost:4300`                                 |
| `APP_URL`                      | Yes         | API/Share        | Public app URL used in share links            | `http://localhost:4300`                                 |
| `JWT_SECRET`                   | Yes         | API/Auth/Whisper | JWT signature secret                          | `change_me`                                             |
| `JWT_ACCESS_EXPIRES_IN`        | No          | API/Auth         | Access token TTL                              | `15m`                                                   |
| `JWT_REFRESH_REMEMBER_ME_DAYS` | No          | API/Auth         | Refresh token TTL when remember-me is enabled | `30`                                                    |
| `JWT_REFRESH_SESSION_HOURS`    | No          | API/Auth         | Refresh token TTL for session mode            | `24`                                                    |
| `RESET_PASSWORD_TOKEN_MINUTES` | No          | API/Auth         | Password reset token validity window          | `20`                                                    |
| `OPENAI_API_KEY`               | Yes         | API/Whisper      | OpenAI API key for transcription              | `sk-...`                                                |
| `BREVO_API_KEY`                | Optional    | API/Share        | Brevo transactional email API key             | `xkeysib-...`                                           |
| `TWILIO_ACCOUNT_SID`           | Optional    | API/Share        | Twilio account SID                            | `AC...`                                                 |
| `TWILIO_AUTH_TOKEN`            | Optional    | API/Share        | Twilio auth token                             | `...`                                                   |
| `TWILIO_WHATSAPP_NUMBER`       | Optional    | API/Share        | Twilio sender number for WhatsApp             | `whatsapp:+14155238886`                                 |
| `DISCORD_WEBHOOK_URL`          | Optional    | API/Discord      | Discord webhook endpoint                      | `https://discord.com/api/webhooks/...`                  |
| `S3_UPLOAD_BASE_URL`           | Optional    | API/Profile      | Upload endpoint for S3-compatible gateway     | `https://storage.example.com/upload`                    |
| `S3_PUBLIC_BASE_URL`           | Optional    | API/Profile      | Public base URL for uploaded files            | `https://cdn.example.com`                               |
| `S3_UPLOAD_TOKEN`              | Optional    | API/Profile      | Bearer token used for upload gateway auth     | `token_value`                                           |
| `SEED_ADMIN_EMAIL`             | Optional    | Prisma seed      | Admin bootstrap email                         | `admin@blablanote.com`                                  |
| `SEED_ADMIN_PASSWORD`          | Optional    | Prisma seed      | Admin bootstrap password                      | `ChangeThisPassword!123`                                |
| `VITE_API_BASE_URL`            | Yes         | Frontend         | API base URL used by frontend HTTP client     | `http://localhost:3000`                                 |
| `BASE_URL`                     | No          | Frontend E2E     | Frontend URL for Playwright tests             | `http://localhost:4300`                                 |
| `CI`                           | No          | Frontend E2E     | Playwright CI mode toggle                     | `true`                                                  |
| `NODE_ENV`                     | No          | API              | Runtime environment mode                      | `development`                                           |

## Run Locally

### API

```bash
yarn nx serve api
```

### Frontend

```bash
yarn nx serve front
```

## Prisma Commands

```bash
yarn prisma:generate
yarn prisma:migrate
yarn prisma:migrate:test
yarn prisma db seed
```

## Swagger

When API is running locally, open:

```text
http://localhost:3000/api
```

## Auth Flow

1. `POST /auth/login` returns an access token and sets an HTTP-only refresh cookie.
2. Access token is sent as `Authorization: Bearer <token>` for protected endpoints.
3. On expiry, client calls `POST /auth/refresh` with refresh cookie.
4. Server validates refresh token hash, session state, and expiration.
5. Server rotates refresh token, revokes old token, sets new cookie, returns new access token.
6. Client retries original request with new access token.

## Storage (S3-Compatible)

- Audio and avatar binary payloads are stored via an S3-compatible upload gateway.
- API uses `S3_UPLOAD_BASE_URL` + `S3_UPLOAD_TOKEN` for uploads.
- Public URLs are resolved using `S3_PUBLIC_BASE_URL`.

## Testing Commands

```bash
yarn test:api
yarn test:api:e2e
yarn test:web
yarn test:web:e2e
yarn test:all
```

## Troubleshooting

- `PrismaClientInitializationError`: verify `DATABASE_URL`, DB availability, and migration state.
- `401 Unauthorized` after refresh: clear browser cookies and re-authenticate to reset token chain.
- CORS issues in local development: align `FRONTEND_URL`, `VITE_API_BASE_URL`, and API `PORT`.
- Transcription failures: validate `OPENAI_API_KEY`, request limits, and network egress.
- WhatsApp/email share not delivered: verify Brevo/Twilio credentials and sender configuration.
- Avatar upload failures: verify storage gateway URL, token, and returned public URL mapping.
