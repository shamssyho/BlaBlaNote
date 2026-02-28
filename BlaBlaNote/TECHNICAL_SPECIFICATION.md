# TECHNICAL_SPECIFICATION.md

## 1. Purpose

This document describes BlaBlaNote's technical architecture, security model, processing lifecycle, observability, and delivery strategy.

---

## 2. System Architecture

### 2.1 Monorepo layout
- **Nx workspace** with independent deployable apps.
- **Backend**: NestJS REST API (`apps/api`).
- **Frontend**: React + Vite SPA (`apps/front`).
- **Test apps**: `apps/api-e2e`, `apps/front-e2e`.

### 2.2 Backend modular domains
- `auth`: registration, login, refresh rotation, password reset.
- `profile`: profile read/update, avatar upload, password change, self-delete.
- `note`: notes CRUD, share links, retry flow, note metadata.
- `whisper`: transcription + summarization orchestration.
- `project` and `tag`: organization features.
- `admin`: dashboard stats, users, jobs.
- `blog`: public content + admin content management.
- `user`: broader account operations including data export.

### 2.3 Data and external components
- PostgreSQL + Prisma ORM.
- AI providers for transcription and summarization.
- S3-compatible object storage integration for media endpoints.
- Optional communication channels: email and WhatsApp.

---

## 3. Authentication and Authorization

### 3.1 Access + refresh model
- Access token: short-lived JWT for API authorization header.
- Refresh token: opaque token in HttpOnly cookie.
- Refresh token data stored hashed in `RefreshToken` table.

### 3.2 Rotation flow
1. Login issues access token + refresh cookie.
2. On refresh, old token is revoked/replaced and a new one is minted.
3. Rotation chain is stored (`replacedByTokenId`) for replay analysis.
4. Logout revokes active refresh token and clears cookie.

### 3.3 Authorization model
- `JwtAuthGuard` for authenticated routes.
- `RolesGuard` + `@Roles('ADMIN')` for admin-only routes.
- User-state validation (`isBlocked`, account existence) in domain services.

### 3.4 Rate limiting
- Abuse-sensitive endpoints are protected with throttling controls.
- Rate limits are part of the security perimeter with JWT/cookie protections.

---

## 4. Data Model and Persistence

### 4.1 Core entities
- `User`: identity, role, status, settings (`language`, `theme`, `notificationsEnabled`), avatar URL, lifecycle timestamps.
- `Note`: user note body + AI outputs + processing status.
- `Project`: user-scoped grouping.
- `Tag` + `NoteTag`: user-scoped taxonomy.
- `ShareLink`: token hash, expiration, field-level permissions.

### 4.2 Security entities
- `RefreshToken`: session, revocation, rotation metadata.
- `PasswordResetToken`: one-time reset flow.

### 4.3 Content entities
- `BlogPost`, `BlogCategory`: publishing domain with admin ownership.

### 4.4 Integrity rules
- Unique: user email, token hashes, blog slugs, `(userId, tag.slug)`.
- Cascades for user-owned data.
- Project removal detaches notes (`SetNull`).

---

## 5. Transcription Pipeline Lifecycle

`Note.status` values:
- `UPLOADED`
- `TRANSCRIBING`
- `SUMMARIZING`
- `READY`
- `FAILED`

### 5.1 Lifecycle behavior
1. Note with audio enters `UPLOADED`.
2. Transcription starts -> `TRANSCRIBING`.
3. Transcript saved, summarization starts -> `SUMMARIZING`.
4. Outputs persisted -> `READY`.
5. Any error -> `FAILED` + `errorMessage`.

### 5.2 Retry strategy
- Retry endpoint restarts from available state.
- If audio exists, full pipeline can rerun.
- If transcript already exists, summarization-only retry path is supported.

---

## 6. Share Link Security Model

- Public share URL contains a random token.
- Server stores only `tokenHash`, never plaintext token.
- Access validates token hash and `expiresAt`.
- Share metadata includes permission flags (`allowSummary`, `allowTranscript`).
- Revocation is supported through authenticated endpoint.

---

## 7. Storage Architecture (S3-Compatible)

### 7.1 Current integration model
- Upload services use configurable base endpoints:
  - `S3_UPLOAD_BASE_URL`
  - `S3_PUBLIC_BASE_URL`
  - optional `S3_UPLOAD_TOKEN`
- Profile avatar uploads are sent via HTTP PUT to S3-compatible endpoints.

### 7.2 Design principles
- Object keys are generated server-side.
- Public URL generation is deterministic.
- Storage provider is abstracted through environment-driven configuration.

---

## 8. Admin Monitoring System

Admin APIs provide:
- Platform statistics (`/admin/stats`).
- Job monitoring (`/admin/jobs`) to inspect pipeline health.
- User management (`/admin/users`, block/unblock).

This supports operational detection of spikes in failed jobs, abusive users, and growth trends.

---

## 9. Observability Strategy

- Request logging middleware captures API traffic metadata.
- Structured domain-level errors for troubleshooting.
- Optional Discord webhook notifications for operational events.
- Health endpoint (`/health`) for uptime probes.
- Recommended extension: centralized logs + metrics + alerting in production.

---

## 10. Testing Strategy

### 10.1 Backend
- Unit tests (Jest) for service-layer logic.
- E2E tests (Supertest) for API behavior and integration.

### 10.2 Frontend
- Unit tests (Vitest + React Testing Library) for components and hooks.
- E2E tests (Playwright) for user journeys.

### 10.3 CI-ready separation
- Distinct test targets (`test:api`, `test:api:e2e`, `test:web`, `test:web:e2e`).
- Enables parallel CI jobs and staged quality gates.

---

## 11. GDPR and Data Governance

- `GET /me/export` provides user data export.
- `DELETE /me` supports account deletion.
- Data model contains lifecycle fields (`deletedAt`, status enums) for governance workflows.
- Admin operations should follow least-privilege and audit-friendly process discipline.

---

## 12. Scalability Plan

- Horizontal API scaling behind a load balancer.
- Externalized PostgreSQL with managed backups/read-replica strategy.
- S3-compatible storage for file assets.
- Async job queue recommended for high-throughput transcription workloads.
- Cache layer (future) for high-read endpoints and session optimization.

---

## 13. CI/CD and Deployment Readiness

- Deterministic Nx project targets per app.
- Prisma migration workflow for schema consistency.
- Test segmentation supports fast PR checks + deeper nightly pipelines.
- Production pipeline recommendation:
  1. Lint + unit tests.
  2. Build.
  3. Integration/e2e tests.
  4. Migration deploy.
  5. Rolling application deployment.

---

## 14. Operational Risks and Controls

- **Token compromise risk** -> refresh hashing + rotation + revocation.
- **Provider outages** -> retryable pipeline + failure status visibility.
- **Abuse/spam** -> rate limiting + user blocking tools.
- **Data exposure risk** -> expiring share links + hashed token storage + role guards.
