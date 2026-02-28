# FUNCTIONAL_SPECIFICATION.md

## 1. Product Scope

BlaBlaNote enables users to capture voice notes, process them with AI, organize knowledge, and share selected outputs securely. The system supports standard users and administrators.

---

## 2. Functional Modules

### 2.1 Authentication
- User registration and login.
- Access token + refresh token session lifecycle.
- Password reset (forgot/reset flow).
- Session refresh rotation.

### 2.2 Notes and AI processing
- Create and retrieve notes.
- Automatic transcription and summarization.
- Status lifecycle tracking.
- Retry processing on failures.
- Search and paginated results.

### 2.3 Projects and tags
- Create/update/delete projects.
- Create/update/delete tags.
- Attach notes to projects.
- Replace note tags.

### 2.4 Profile and settings
- View and update profile data.
- Upload avatar.
- Change password.
- Manage language, theme, and notification settings.
- Delete account.
- Export own account data.

### 2.5 Sharing
- Generate public share links with expiration.
- Control share visibility fields (summary/transcript).
- Revoke active shares.
- Access shared notes using tokenized URL.

### 2.6 Admin
- View dashboard statistics.
- View jobs and identify failed processing tasks.
- Manage users (listing, block/unblock).

### 2.7 Blog
- Public listing and reading of published posts.
- Admin create/update/delete posts and categories.

---

## 3. User Stories

### 3.1 End-user stories
- As a user, I can upload/create a note and receive AI-generated transcript and summary.
- As a user, I can organize notes with projects and tags.
- As a user, I can search my notes quickly.
- As a user, I can manage profile, avatar, password, language, and theme in one place.
- As a user, I can generate a secure public link that expires.
- As a user, I can export my data and delete my account.

### 3.2 Admin stories
- As an admin, I can monitor job health and failure trends.
- As an admin, I can view user metrics and operational statistics.
- As an admin, I can block abusive accounts.
- As an admin, I can manage blog content.

---

## 4. Acceptance Criteria

### 4.1 Authentication
- Successful login returns access token and sets refresh cookie.
- Refresh endpoint rotates refresh token and invalidates prior token.
- Invalid/expired refresh token returns unauthorized response.

### 4.2 Notes pipeline
- New audio-backed notes start in `UPLOADED`.
- Status transitions follow pipeline order.
- Any processing error sets `FAILED` and stores `errorMessage`.
- Retry endpoint can restart failed processing.

### 4.3 Profile/settings
- `GET /me` returns current profile.
- `PATCH /me` updates personal and settings fields.
- `PATCH /me/password` validates current password before update.
- `POST /me/avatar` accepts valid image file and stores avatar URL.
- `DELETE /me` removes account data according to data model rules.

### 4.4 Sharing
- Created share links include expiration timestamp.
- Public access requires valid token.
- Expired/revoked links cannot be used.
- Share visibility obeys permission flags.

### 4.5 Admin
- Admin-only endpoints are inaccessible to non-admin users.
- `/admin/jobs` includes failed/in-progress job visibility.
- User block action updates user access state.

---

## 5. Security Requirements

- Passwords must be stored hashed (bcrypt).
- JWT secret must be environment specific and not hardcoded.
- Refresh token must be HttpOnly and stored hashed in DB.
- Public share tokens must never be stored in plaintext.
- Sensitive endpoints must be rate-limited.
- Role-based guards must protect admin operations.

---

## 6. Error Handling Behavior

- API returns standardized HTTP errors for validation/auth/resource issues.
- Pipeline failures are represented as business-state (`FAILED`) not silent failures.
- User-facing errors should be actionable (invalid token, expired link, unsupported file, etc.).
- Frontend should preserve state consistency on failed requests and show clear feedback.

---

## 7. Non-Functional Requirements

### 7.1 Performance
- Paginated endpoints must support scalable query patterns.
- Search should return results within acceptable interactive latency under normal load.
- Admin dashboard endpoints should remain responsive under moderate concurrency.

### 7.2 Reliability
- Refresh rotation must maintain session continuity without re-login for valid users.
- Failed transcription jobs must remain inspectable and retryable.
- Health endpoint must be available for uptime monitoring.

### 7.3 Maintainability
- Domain modules must remain isolated by responsibility.
- DTO validation must enforce contract consistency.
- Prisma migrations must be source-controlled.

### 7.4 Internationalization
- UI text is sourced from modular translation files.
- User language preference is persisted.

---

## 8. Testing Coverage Requirements

Minimum coverage expectations by layer:
- Backend: unit tests for core services + e2e tests for critical API flows.
- Frontend: unit tests for pages/components/hooks + e2e tests for major journeys.
- CI pipelines must run lint and test targets before release.

Critical flows that must be covered:
1. Login + token refresh rotation.
2. Note creation and status progression.
3. Share link creation/access/revocation.
4. Profile update/password change/account delete.
5. Admin user block and job monitoring views.

---

## 9. Compliance and Governance Requirements

- User data export endpoint must be available and authenticated.
- Account deletion capability must be provided.
- Access to admin features must be auditable by role policy.
- Share link expiration and revocation must be enforceable.
