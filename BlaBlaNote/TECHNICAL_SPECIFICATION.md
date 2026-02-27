# TECHNICAL_SPECIFICATION.md

## 1. Document Purpose

This document defines the developer-focused technical design of BlaBlaNote, including architecture, data model, API segmentation, security model, AI processing lifecycle, and production operations.

---

## 2. System Architecture

## 2.1 High-Level Components

1. **Frontend (React + Vite)**
   - SPA for end users and admins
   - Access token bearer authentication
   - Automatic token refresh via HTTP-only cookie

2. **Backend API (NestJS)**
   - REST API with modular domain boundaries (auth, notes, projects, tags, admin, blog, user)
   - DTO validation and role-based route protection
   - Swagger auto-documentation

3. **Database (PostgreSQL + Prisma)**
   - Relational persistence for users, notes, projects, tags, blog, token/session metadata

4. **AI Services**
   - OpenAI Whisper for transcription
   - OpenAI Chat Completions for summarization and translation

5. **External Integrations**
   - Brevo transactional email
   - Twilio WhatsApp messaging
   - Discord webhook for activity notifications

6. **Storage Layer**
   - Current implementation: local disk uploads (`./uploads`)
   - Target architecture: pluggable S3-compatible object storage adapter

---

## 2.2 Runtime Topology

- `front` app runs separately from `api`
- `api` connects to PostgreSQL via `DATABASE_URL`
- `api` calls external APIs over HTTPS (OpenAI, Twilio, Brevo, Discord)
- CORS is configured to allow the frontend origin

---

## 3. Database Schema (Prisma)

## 3.1 Core Domain Entities

- **User**: identity, role, status, billing metadata, lifecycle timestamps
- **Note**: core note content + AI outputs + processing state
- **Project**: user-owned grouping of notes
- **Tag** and **NoteTag**: user-scoped tagging and note-tag many-to-many linkage
- **ShareLink**: hashed public token links with expiry and field-level access flags

## 3.2 Security/Auth Entities

- **RefreshToken**: token rotation graph (replacement chain), per-session metadata, revocation tracking
- **PasswordResetToken**: one-time reset token with expiry + usage timestamp

## 3.3 Content/Admin Entities

- **BlogPost** and **BlogCategory**: public content with admin-managed publishing workflow

## 3.4 Key Relational Rules

- User -> Notes/Projects/Tags/BlogPosts cascade on delete
- Note -> ShareLinks cascade on delete
- Note <-> Tag via NoteTag composite PK (`noteId`, `tagId`)
- Project deletion sets related Note.projectId to null
- Unique constraints:
  - `User.email`
  - `Tag(userId, slug)`
  - `RefreshToken.tokenHash`
  - `PasswordResetToken.tokenHash`
  - `BlogPost.slug`, `BlogCategory.slug`

---

## 4. API Structure

## 4.1 Public Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `GET /public/notes/:token`
- `GET /blog`
- `GET /blog/:slug`
- `GET /blog/categories`

## 4.2 Protected Endpoints (Authenticated User)

- Notes: list/get/create/retry/assign project/replace tags/share/create share-link/history
- Shares: revoke share-link
- Projects: CRUD
- Tags: CRUD
- Whisper: upload/transcribe audio
- Me: data export + account deletion
- User profile/self and own resource operations

## 4.3 Admin Endpoints (Role = ADMIN)

- `GET /admin/stats`
- `GET /admin/jobs`
- `GET /admin/users`
- `PATCH /admin/users/:id/block`
- Blog administration endpoints under `/admin/blog...`
- Admin-level user creation / role updates

## 4.4 API Documentation

- Swagger UI: `/api/docs`
- Bearer auth configured in Swagger definition

---

## 5. Authentication & Session Flow (Access + Refresh)

## 5.1 Token Model

- **Access token**: short-lived JWT used in Authorization header
- **Refresh token**: long-lived opaque token stored as HttpOnly cookie
- Refresh tokens are persisted hashed and rotated per refresh event

## 5.2 Login Sequence

1. User submits credentials
2. Credentials validated (bcrypt compare)
3. Access token issued
4. Refresh token issued + stored (hash, sessionId, metadata)
5. Refresh token returned as secure cookie

## 5.3 Refresh Sequence

1. Frontend receives `401` on API request
2. Calls `POST /auth/refresh` with refresh cookie automatically attached
3. Backend validates refresh token hash + expiration + revocation status
4. Backend rotates token (old revoked/replaced, new persisted)
5. Backend returns new access token + new refresh cookie

## 5.4 Logout Sequence

1. Frontend calls `POST /auth/logout`
2. Backend revokes current refresh token
3. Refresh cookie cleared
4. Frontend clears access token and local user snapshot

---

## 6. Transcription Pipeline States

`Note.status` lifecycle:

1. **UPLOADED**
   - Audio path known, processing pending
2. **TRANSCRIBING**
   - Whisper request in progress
3. **SUMMARIZING**
   - Transcript generated; summary/translation in progress
4. **READY**
   - Transcript + summary (and optional translation) persisted
5. **FAILED**
   - Any error captured in `errorMessage`

Retry logic:
- If audio is available, pipeline restarts from transcription
- If transcript exists without audio, summarization can be retried directly

---

## 7. Error Handling Strategy

- NestJS HTTP exceptions for expected domain errors (e.g., not found, validation)
- Prisma and external API errors transformed into controlled failure states where relevant
- Pipeline failures persist recoverable status and error message in `Note`
- API consumers receive structured HTTP error payloads
- Frontend normalizes Axios errors into typed `ApiError`

---

## 8. Security Considerations

- Passwords hashed with bcrypt (`BCRYPT_ROUNDS` configurable)
- JWT secret must be strong and environment-specific
- Refresh token is cookie-based and not exposed to JavaScript
- Token hashes stored instead of raw refresh token values
- Role guard enforces ADMIN-only routes
- DTO validation pipe with whitelist/forbidNonWhitelisted enabled
- Public share access uses random token + SHA-256 hash lookup
- Share links are time-bounded and permission-scoped (`allowSummary`, `allowTranscript`)
- CORS restricted to configured frontend origin

Recommended hardening:
- Add rate limits on auth/share endpoints
- Add CSRF strategy for cookie-based refresh endpoint
- Centralized secret manager and key rotation policy
- Endpoint-level audit trail persisted to DB/SIEM

---

## 9. Data Flow Diagrams (Textual)

## 9.1 Note Upload + AI Processing

`Frontend -> POST /whisper/transcribe -> API stores file locally -> Note(UPLOADED) -> Note(TRANSCRIBING) -> OpenAI Whisper -> Note(SUMMARIZING) -> OpenAI Chat -> Note(READY) -> Frontend polls/queries note`

## 9.2 Authenticated API Call with Auto-Refresh

`Frontend request (Bearer access) -> API validates JWT -> (if expired) 401 -> Frontend POST /auth/refresh (cookie) -> API rotates refresh token -> new access token -> retry original request`

## 9.3 Public Share Link Read

`Recipient opens /public/notes/:token -> API hashes token -> ShareLink lookup by hash + expiresAt -> if valid, return only permitted fields`

---

## 10. Scalability Considerations

- Current AI processing is synchronous in request path; move to job queue for scale
- Horizontal scaling requires stateless API nodes + shared DB + shared object storage
- Introduce worker pool for transcription/summarization tasks
- Use Redis for queue coordination, distributed locks, and short-term caching
- Consider read replicas for analytics-heavy admin views

---

## 11. Performance Optimization Strategy

- DB indexes already present on common query filters (status, createdAt, foreign keys)
- Pagination on list endpoints (`page`, `pageSize`) reduces payload size
- Use selective field projection in admin/jobs endpoints
- Suggested improvements:
  - Query performance observability + slow query logging
  - Cache blog public list/detail and static metadata
  - Offload heavy AI operations to async workers
  - Use CDN for frontend/static assets

---

## 12. Logging & Monitoring Strategy

Current:
- Request logging middleware in backend
- Discord webhook notifications for key user actions/events

Recommended production stack:
- Structured JSON logs (requestId, userId, route, latency)
- Centralized log sink (ELK/OpenSearch/Datadog)
- Metrics: request latency, error rates, queue depth, AI provider latency/cost
- Alerting: high failure rate, auth anomalies, webhook failures, DB connection pool pressure

---

## 13. Deployment Architecture

Minimal production architecture:
- Reverse proxy (Nginx/Traefik)
- Frontend static hosting (CDN/object storage)
- API service instances (containerized)
- Managed PostgreSQL
- Object storage (S3-compatible)
- Secret manager for credentials

CI/CD expectations:
- Lint/test/build/migrate checks
- Immutable image builds
- Environment-specific config injection
- Controlled migration deployment step before app rollout

---

## 14. Backup & Recovery Strategy

Database:
- Daily full backups + WAL/incremental backups
- Point-in-time recovery (PITR) for managed PostgreSQL
- Backup retention by compliance policy (e.g., 30/90 days)

Object storage:
- Versioning + lifecycle retention policies
- Cross-region replication for DR (if business-critical)

Recovery drills:
- Scheduled restore simulation in staging
- RPO/RTO targets documented and validated

---

## 15. GDPR Compliance Handling

Key controls:
- User data export endpoint (`/me/export`)
- User deletion endpoint (`DELETE /me`) for account erasure workflow
- Token/session revocation capabilities
- Purpose limitation by domain modules
- Public share links are explicit, scoped, and time-limited

Recommendations for full compliance posture:
- Add consent ledger and legal basis mapping
- Encrypt sensitive data at rest + in transit
- Data retention schedules and automated purging for old artifacts
- DPA with all subprocessors (OpenAI, Twilio, Brevo, hosting provider)
- Documented incident response and breach notification procedure

---

## 16. Open Technical Roadmap

- Queue-based AI orchestration
- Idempotent job processing + dead-letter handling
- True S3 upload flow (pre-signed URLs, lifecycle policies)
- Multi-tenant readiness (logical partitioning)
- Fine-grained admin RBAC permissions
- Dedicated audit log table and immutable activity records
