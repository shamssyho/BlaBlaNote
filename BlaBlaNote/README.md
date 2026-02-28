# BlaBlaNote

BlaBlaNote is a SaaS platform for capturing voice notes, generating AI transcriptions/summaries, organizing work by projects and tags, and securely sharing selected content.

## Features

### Core product
- Audio note creation and processing pipeline.
- Automatic AI transcription and summarization.
- Pipeline status tracking per note: `UPLOADED` -> `TRANSCRIBING` -> `SUMMARIZING` -> `READY` (or `FAILED`).
- Search, filtering, and pagination for notes and blog content.
- Project-based organization.
- Tagging system with user-scoped tags.

### Profile & settings
- User profile management (`GET /me`, `PATCH /me`).
- Password change (`PATCH /me/password`).
- Avatar upload (`POST /me/avatar`, multipart form data).
- Account deletion (`DELETE /me`).
- User settings fields: language, theme, notifications.

### Sharing
- Public share links with secure token flow.
- Link expiration support.
- Granular visibility controls (summary/transcript permissions).
- Share history and revocation.

### Admin & content
- Admin dashboard for stats, users, and job monitoring.
- User block/unblock operations.
- Blog + category management (public + admin workflows).

### Platform quality
- Backend unit tests (Jest).
- Backend e2e tests (Supertest/Nest test app).
- Frontend unit tests (Vitest + React Testing Library).
- Frontend e2e tests (Playwright via Nx front-e2e app).

---

## Architecture

BlaBlaNote runs as an Nx monorepo with two main applications:

- `apps/api`: NestJS REST API (modular domains).
- `apps/front`: React + Vite single-page application.

Supporting apps:
- `apps/api-e2e`: backend end-to-end test suite.
- `apps/front-e2e`: frontend end-to-end test suite.

Backend modules include auth, notes, profile, projects, tags, admin, blog, and user export/compliance services. Data is persisted in PostgreSQL via Prisma.

---

## Folder Structure

```text
BlaBlaNote/
├─ apps/
│  ├─ api/
│  │  ├─ prisma/
│  │  │  ├─ schema.prisma
│  │  │  └─ migrations/
│  │  └─ src/app/
│  │     ├─ auth/
│  │     ├─ profile/
│  │     ├─ note/
│  │     ├─ whisper/
│  │     ├─ project/
│  │     ├─ tag/
│  │     ├─ admin/
│  │     ├─ blog/
│  │     ├─ user/
│  │     └─ observability/
│  ├─ front/
│  │  └─ src/
│  │     ├─ api/
│  │     ├─ modules/
│  │     ├─ pages/
│  │     ├─ components/
│  │     ├─ locales/
│  │     └─ router/
│  ├─ api-e2e/
│  └─ front-e2e/
├─ docs/
├─ TECHNICAL_SPECIFICATION.md
├─ FUNCTIONAL_SPECIFICATION.md
├─ USER_GUIDE.md
└─ ADMIN_GUIDE.md
```

---

## Environment Variables

Create a `.env` file in the project root.

| Variable | Required | Example | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | `postgresql://user:pass@localhost:5432/blablanote?schema=public` | Main PostgreSQL connection string |
| `DATABASE_URL_TEST` | Recommended (tests) | `postgresql://user:pass@localhost:5432/blablanote_test?schema=public` | Dedicated test database |
| `PORT` | No | `3001` | API port |
| `FRONTEND_URL` | Yes | `http://localhost:4200` | Allowed frontend origin for CORS |
| `APP_URL` | Yes | `https://api.blablanote.com` | Public base used for share link generation |
| `NODE_ENV` | No | `development` / `production` | Runtime mode |
| `JWT_SECRET` | Yes | `strong-secret` | JWT signing key |
| `JWT_ACCESS_EXPIRES_IN` | No | `15m` | Access token lifetime |
| `JWT_REFRESH_REMEMBER_ME_DAYS` | No | `30` | Refresh token TTL (remember-me mode) |
| `JWT_REFRESH_SESSION_HOURS` | No | `24` | Refresh token TTL (session mode) |
| `RESET_PASSWORD_TOKEN_MINUTES` | No | `20` | Password reset token validity |
| `OPENAI_API_KEY` | Yes (AI) | `sk-...` | OpenAI API key for transcription/summarization |
| `BREVO_API_KEY` | Optional | `xkeysib-...` | Email share provider |
| `TWILIO_ACCOUNT_SID` | Optional | `AC...` | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Optional | `...` | Twilio auth token |
| `TWILIO_WHATSAPP_NUMBER` | Optional | `whatsapp:+14155238886` | WhatsApp sender |
| `S3_UPLOAD_BASE_URL` | Yes (S3 mode) | `https://storage.example.com/upload` | S3-compatible upload endpoint |
| `S3_PUBLIC_BASE_URL` | Yes (S3 mode) | `https://cdn.example.com` | Public file base URL |
| `S3_UPLOAD_TOKEN` | Optional | `token` | Auth token for upload endpoint |
| `VITE_API_BASE_URL` | Yes (frontend) | `http://localhost:3001` | Frontend API base URL |

---

## Authentication & Security Overview

- Access token: short-lived JWT in `Authorization: Bearer <token>`.
- Refresh token: HttpOnly cookie, rotated on each refresh.
- Refresh tokens are stored hashed in DB and can be revoked.
- Role-based authorization for admin endpoints.
- Rate limiting is enabled for abuse-sensitive routes.
- Password hashing uses bcrypt.

---

## API Endpoints (Grouped)

### Auth
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | No | Register account |
| POST | `/auth/login` | No | Login and issue access + refresh |
| POST | `/auth/refresh` | Refresh cookie | Rotate refresh token and issue new access token |
| POST | `/auth/logout` | Refresh cookie | Revoke session and clear refresh cookie |
| POST | `/auth/forgot-password` | No | Request password reset |
| POST | `/auth/reset-password` | No | Reset password using token |

### Notes
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/notes` | User | List notes (search + pagination + filters) |
| GET | `/notes/:id` | User | Get one note |
| POST | `/notes` | User | Create note |
| POST | `/notes/:id/retry` | User | Retry failed processing |
| PATCH | `/notes/:id/project` | User | Attach/move note to project |
| PUT | `/notes/:id/tags` | User | Replace note tags |
| POST | `/notes/:id/share` | User | Share by channel (email/WhatsApp) |
| POST | `/notes/:id/share-link` | User | Create secure public share link |
| GET | `/notes/:id/shares` | User | List share history |

### Projects
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/projects` | User | List projects |
| POST | `/projects` | User | Create project |
| PATCH | `/projects/:id` | User | Update project |
| DELETE | `/projects/:id` | User | Delete project |

### Tags
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/tags` | User | List tags |
| POST | `/tags` | User | Create tag |
| PATCH | `/tags/:id` | User | Update tag |
| DELETE | `/tags/:id` | User | Delete tag |

### Profile
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/me` | User | Get own profile |
| PATCH | `/me` | User | Update profile + settings |
| PATCH | `/me/password` | User | Change password |
| POST | `/me/avatar` | User | Upload avatar |
| DELETE | `/me` | User | Delete own account |
| GET | `/me/export` | User | Export personal data (GDPR) |

### Share
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/public/notes/:token` | No | Read shared note by token |
| DELETE | `/shares/:id` | User | Revoke share link |

### Admin
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/admin/stats` | Admin | Platform statistics |
| GET | `/admin/jobs` | Admin | Transcription job monitoring |
| GET | `/admin/users` | Admin | Paginated user management |
| PATCH | `/admin/users/:id/block` | Admin | Block/unblock user |

### Blog
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/blog` | No | List published posts |
| GET | `/blog/categories` | No | List categories |
| GET | `/blog/:slug` | No | Get published post |
| POST | `/admin/blog` | Admin | Create post |
| PATCH | `/admin/blog/:id` | Admin | Update post |
| DELETE | `/admin/blog/:id` | Admin | Delete post |
| POST | `/admin/blog/categories` | Admin | Create category |
| PATCH | `/admin/blog/categories/:id` | Admin | Update category |
| DELETE | `/admin/blog/categories/:id` | Admin | Delete category |

---

## Database Schema Highlights

### User
Stores identity, role, lifecycle, and settings fields:
- `language`, `theme`, `notificationsEnabled`
- `avatarUrl`
- `status`, `isBlocked`, `deletedAt`

### Note
Stores source and AI outputs:
- `audioUrl`, `text`, `transcriptText`, `summary`, `translation`
- `status`, `errorMessage`
- links to `Project`, `Tag` (via `NoteTag`), and `ShareLink`

### ShareLink
- `tokenHash` (never stores raw token)
- `expiresAt`
- permission flags (`allowSummary`, `allowTranscript`)

### Security tables
- `RefreshToken`: hashed refresh sessions + rotation chain
- `PasswordResetToken`: hashed reset tokens + expiry + one-time usage

---

## Transcription Status Flow

1. `UPLOADED`: note exists with audio, awaiting processing.
2. `TRANSCRIBING`: audio sent to transcription engine.
3. `SUMMARIZING`: transcript exists, summary/translation is generated.
4. `READY`: processing completed successfully.
5. `FAILED`: pipeline failed; `errorMessage` is set and retry may be available.

---

## Share Link Behavior

- Creating a public link generates a random token shown once to the creator.
- Only the token hash is stored in database.
- Consumers access content via `/public/notes/:token`.
- Links can expire automatically and can be revoked manually.
- Visibility flags control whether transcript and/or summary are included.

---

## Profile & Settings Behavior

Users can:
- Update first/last name.
- Upload avatar image.
- Change password securely.
- Set language and theme.
- Enable or disable notifications.
- Delete account and export account data.

---

## Testing

### Backend unit tests (Jest)
```bash
yarn test:api
```

### Backend e2e tests (Supertest)
```bash
yarn test:api:e2e
```

### Frontend unit tests (Vitest + RTL)
```bash
yarn test:web
```

### Frontend e2e tests (Playwright)
```bash
yarn test:web:e2e
```

### Full suite
```bash
yarn test:all
```

---

## Deployment Notes (Production)

1. Build artifacts:
```bash
yarn build
```
2. Apply production migrations:
```bash
npx prisma migrate deploy --schema apps/api/prisma/schema.prisma
```
3. Configure secure secrets and CORS origins.
4. Enable HTTPS and secure cookie settings.
5. Set S3-compatible storage endpoints for media/avatar flows.
6. Run API behind a process manager or container orchestration.
7. Add health checks (`/health`) and monitor logs/metrics.

---

## License

MIT
