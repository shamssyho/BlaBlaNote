# Technical Specification

## Stack

- Monorepo: Nx
- Backend: NestJS, TypeScript, Prisma, PostgreSQL
- Frontend: React, TypeScript
- Auth: JWT access token + refresh token rotation
- Storage: S3-compatible audio storage
- Integrations: Brevo, Twilio WhatsApp, Notion API, Discord webhook

## Backend Architecture

- Modules: Auth, User, Notes, Projects, Tags, Profile, Share, Admin, Blog, Whisper, Prisma
- Validation: global ValidationPipe with transform/whitelist/forbidNonWhitelisted
- API docs: Swagger at `/api/docs`
- OpenAPI artifacts: `docs/api/openapi.json` and `docs/api/openapi.yaml`

## Data Model

Primary entities include User, Note, Project, Tag, NoteTag, ShareLink, ShareHistory, BlogPost, BlogCategory, RefreshToken, PasswordResetToken.

## Feature Capabilities

- Notes with transcription, summarization, translation and processing status
- Projects with color and note-project linking
- Personalized tags with many-to-many note assignment
- Share channels: Email, WhatsApp, Notion, public links
- Blog CMS with categories and publication state
- Admin dashboard for users and jobs
- Profile and settings with language/theme/notifications

## Environment Variables

| Variable                       | Purpose                        |
| ------------------------------ | ------------------------------ |
| `DATABASE_URL`                 | PostgreSQL connection string   |
| `PORT`                         | API port                       |
| `FRONTEND_URL`                 | CORS origin and auth links     |
| `APP_URL`                      | Base URL used in shared links  |
| `JWT_SECRET`                   | Access token secret            |
| `JWT_ACCESS_EXPIRES_IN`        | Access token duration          |
| `JWT_REFRESH_SESSION_HOURS`    | Session refresh token duration |
| `JWT_REFRESH_REMEMBER_ME_DAYS` | Remember-me refresh duration   |
| `RESET_PASSWORD_TOKEN_MINUTES` | Password reset token validity  |
| `BREVO_API_KEY`                | Brevo API key                  |
| `TWILIO_ACCOUNT_SID`           | Twilio account SID             |
| `TWILIO_AUTH_TOKEN`            | Twilio auth token              |
| `TWILIO_WHATSAPP_NUMBER`       | Twilio WhatsApp sender         |
| `NOTION_TOKEN`                 | Notion integration token       |
| `OPENAI_API_KEY`               | Whisper and LLM processing     |
| `S3_UPLOAD_BASE_URL`           | Upload endpoint base URL       |
| `S3_PUBLIC_BASE_URL`           | Public asset base URL          |
| `S3_UPLOAD_TOKEN`              | Upload authorization token     |
| `NODE_ENV`                     | Runtime environment            |

## Documentation Automation

- Diagrams: `docs/architecture/ARCHITECTURE_DIAGRAMS.md`
- OpenAPI export: `tools/openapi/export-openapi.ts`
- Marketing docs generator: `tools/docs/generate-marketing-docs.ts`
