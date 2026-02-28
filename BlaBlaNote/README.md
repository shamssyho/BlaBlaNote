# BlaBlaNote

## Features
- Projects with custom color (`#RRGGBB`) and note-project linking
- Personal tags with many-to-many note assignment and tag filters
- Post-processing actions for summarization and translation with processing states
- Sharing via Email (Brevo), WhatsApp (Twilio), and Notion
- JWT auth with refresh token rotation
- Swagger API documentation
- i18n support (en/fr)

## API Endpoints
- `GET/POST/PATCH/DELETE /projects`
- `PATCH /notes/:id/project`
- `GET/POST/PATCH/DELETE /tags`
- `PUT /notes/:id/tags`
- `GET /notes?tagIds=...`
- `POST /notes/:id/summarize`
- `POST /notes/:id/translate`
- `POST /notes/:id/share`

## Environment Variables
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `BREVO_API_KEY`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_NUMBER`
- `NOTION_TOKEN`
- `OPENAI_API_KEY`
- `S3_ENDPOINT`
- `S3_ACCESS_KEY`
- `S3_SECRET_KEY`

## Architecture
- Nx monorepo
- Backend: NestJS + Prisma + PostgreSQL
- Frontend: React + TypeScript
- Integrations: Brevo, Twilio, Notion API
