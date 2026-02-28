# Technical Specification

## Architecture Overview

BlaBlaNote is an Nx monorepo with a NestJS backend (`apps/api`) and a React frontend (`apps/front`).

### Backend Modules and Responsibilities

- `AuthModule`: registration, login, refresh rotation, logout, forgot/reset password
- `UserModule`: user CRUD, role management, terms acceptance, data export
- `ProfileModule`: self-service profile updates, password update, avatar upload
- `NoteModule`: note CRUD, search/filter, project assignment, tagging, sharing, public read
- `WhisperModule`: transcription integration and note processing state updates
- `ProjectModule`: project CRUD and ownership constraints
- `TagModule`: tag CRUD with user-level uniqueness by slug
- `ShareModule` (within note domain): share link lifecycle and revocation
- `AdminModule`: platform stats, jobs overview, user moderation
- `BlogModule`: public blog retrieval, admin publishing and category management
- `DiscordModule`: outbound webhook notifications for domain events
- `PrismaModule`: shared data access layer and connection lifecycle

### Frontend Responsibilities

- Auth and session state management
- Note creation, listing, filtering, and detail pages
- Project and tag management interfaces
- Profile/settings interface with language/theme preferences
- Public shared note page
- Admin dashboard and blog management views
- i18n content rendering (`en`, `fr`)

## Database Schema Overview

### Core Models

- `User`: identity, role, account status, preferences, billing metadata
- `Note`: owned content item with AI pipeline status and optional audio URL
- `Project`: user-owned grouping entity linked one-to-many with notes
- `Tag`: user-owned label, unique by `(userId, slug)`
- `NoteTag`: many-to-many join between notes and tags
- `ShareLink`: token-hashed public link with scoped permissions and expiration
- `RefreshToken`: hashed refresh token chain for rotation and session controls
- `PasswordResetToken`: one-time token hashes with expiration and used timestamp
- `BlogPost`: authored content with optional category link
- `BlogCategory`: taxonomy for blog posts

### Key Relations

- `User 1:N Note`, `User 1:N Project`, `User 1:N Tag`
- `Note N:M Tag` through `NoteTag`
- `Note 1:N ShareLink`
- `User 1:N RefreshToken`
- `User 1:N PasswordResetToken`
- `User 1:N BlogPost`
- `BlogCategory 1:N BlogPost`

## API Design

### Public Endpoints

- Health check
- Blog listing/category/detail
- Public note access by share token
- Auth register/login/refresh/logout/forgot/reset

### Protected Endpoints

- Notes, Projects, Tags
- Profile (`/me` routes)
- Share creation/list/revoke
- User self actions (accept terms, export)

### Admin Endpoints

- `/admin/stats`, `/admin/jobs`
- `/admin/users` listing and moderation
- `/admin/blog` post/category create/update/delete

### API Conventions

- JSON request/response payloads
- Bearer access token for protected routes
- HTTP-only cookie for refresh token
- DTO-based validation with class-validator
- Paginated list responses on collection endpoints

## Transcription Pipeline States and Lifecycle

`Note.status` transitions:

1. `UPLOADED`: note created and persisted
2. `TRANSCRIBING`: audio/transcript generation in progress
3. `SUMMARIZING`: summarization and optional translation in progress
4. `READY`: transcript/summary persisted and visible to user
5. `FAILED`: terminal state with `errorMessage`

Retry endpoint re-queues failed notes and re-enters pipeline from `TRANSCRIBING`.

## Share Link Security

- Share links are generated as opaque random tokens.
- Only hashed token values (`tokenHash`) are stored in database.
- Link lookup is performed by hash comparison, never by raw token persistence.
- Every link has explicit `expiresAt`.
- Optional scoped content flags: `allowSummary`, `allowTranscript`.
- Share links are revocable via authenticated endpoint.

## External Integrations

- Brevo: transactional email sharing
- Twilio: WhatsApp share delivery
- Discord webhook: event notifications
- OpenAI Whisper: transcription generation
- S3-compatible storage gateway: avatar/audio object storage

## Error Handling Strategy

- NestJS HTTP exceptions with canonical status codes
- Validation errors returned as `400 Bad Request`
- AuthN failures as `401`, AuthZ failures as `403`
- Missing resources as `404`
- Rate-limit breaches as `429`
- Pipeline/integration failures captured on note with `FAILED` + `errorMessage`
- Consistent JSON error envelope at controller boundaries

## Security Measures

- Access token + rotating refresh token model
- Refresh token hashing in persistence
- Role-based access control for admin operations
- Input validation via DTO decorators
- Password hashing with bcrypt
- HTTP-only refresh cookie handling
- Token expiration checks for refresh/share/reset flows
- Request rate limiting for sensitive routes

## Observability

- Structured application logs for request lifecycle and errors
- Request correlation using request identifier strategy
- `/health` endpoint for liveness checks
- Admin jobs endpoint for operational visibility
- Error context persisted for failed note pipeline states

## Scaling Strategy

- Keep API layer stateless; persist session artifacts in DB
- Horizontal scale API replicas behind load balancer
- Offload long-running transcription/summarization to queue workers
- Isolate worker pool from request/response path
- Use managed PostgreSQL with read replica strategy as query load grows
- Use object storage and CDN for media delivery
- Add per-feature caches for high-read public/blog endpoints

## CI Strategy for Tests and Migrations

- Run install + lint + unit tests for API and frontend on pull requests
- Run API and frontend e2e suites on merge to main
- Apply Prisma migration checks in CI before deploy
- Use dedicated CI test database for `test:api:e2e:ci`
- Block deployment on failed migrations/tests
- Deploy backend and frontend artifacts after green pipeline
