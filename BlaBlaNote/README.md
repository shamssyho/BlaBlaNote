# BlaBlaNote

## Product

BlaBlaNote is a SaaS platform to capture audio notes, organize knowledge, generate summaries and translations, and distribute content across collaboration channels.

## Core Features

- JWT auth with refresh token rotation
- Notes with search, pagination, summarize and translate actions
- Projects with color and note assignment
- Personalized tags and note-tag mapping
- Sharing by Email, WhatsApp and Notion
- Public share links
- Admin dashboard and user controls
- Blog and category management
- Profile and settings management
- S3-backed audio storage
- i18n support in English and French

## Tech Stack

- Monorepo: Nx
- Backend: NestJS, TypeScript, Prisma, PostgreSQL
- Frontend: React, TypeScript
- Integrations: Brevo, Twilio, Notion API, Discord webhook

## Documentation

- Architecture diagrams: `docs/architecture/ARCHITECTURE_DIAGRAMS.md`
- Technical specification: `docs/architecture/TECHNICAL_SPECIFICATION.md`
- Functional specification: `docs/architecture/FUNCTIONAL_SPECIFICATION.md`
- User guide: `docs/architecture/USER_GUIDE.md`
- Admin guide: `docs/architecture/ADMIN_GUIDE.md`
- API reference: `docs/api/API_REFERENCE.md`
- OpenAPI docs: `docs/api/openapi.json`, `docs/api/openapi.yaml`
- Marketing docs: `docs/marketing/MARKETING_SITE.md`

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL database |
| `PORT` | API server port |
| `FRONTEND_URL` | Frontend URL for CORS and links |
| `APP_URL` | API public base URL |
| `JWT_SECRET` | JWT signing secret |
| `JWT_ACCESS_EXPIRES_IN` | Access token expiration |
| `JWT_REFRESH_SESSION_HOURS` | Refresh expiration for sessions |
| `JWT_REFRESH_REMEMBER_ME_DAYS` | Refresh expiration for remember-me |
| `RESET_PASSWORD_TOKEN_MINUTES` | Reset token lifetime |
| `BREVO_API_KEY` | Brevo API key |
| `TWILIO_ACCOUNT_SID` | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_WHATSAPP_NUMBER` | Twilio WhatsApp sender |
| `NOTION_TOKEN` | Notion integration token |
| `OPENAI_API_KEY` | OpenAI transcription and AI actions |
| `S3_UPLOAD_BASE_URL` | S3 upload endpoint |
| `S3_PUBLIC_BASE_URL` | S3 public asset endpoint |
| `S3_UPLOAD_TOKEN` | S3 upload auth token |
| `NODE_ENV` | Runtime environment |

## Scripts

- `yarn dev`
- `yarn build`
- `yarn test:api`
- `yarn test:api:e2e`
- `yarn test:web`
- `yarn docs:openapi`
- `yarn docs:marketing`
- `yarn docs:build`

## Swagger

Swagger UI is available at `http://localhost:3001/api/docs`.
