# API Reference

Base URL: `http://localhost:3000`

## Auth

| Method | Path                    | Auth           | Role           | Description                                      |
| ------ | ----------------------- | -------------- | -------------- | ------------------------------------------------ |
| POST   | `/auth/register`        | No             | Public         | Register a new account                           |
| POST   | `/auth/login`           | No             | Public         | Login and issue access + refresh tokens          |
| POST   | `/auth/refresh`         | Refresh cookie | Public session | Rotate refresh token and return new access token |
| POST   | `/auth/logout`          | Refresh cookie | Public session | Revoke current refresh session                   |
| POST   | `/auth/forgot-password` | No             | Public         | Request password reset token                     |
| POST   | `/auth/reset-password`  | No             | Public         | Reset password using token                       |

## Notes

| Method | Path                    | Auth   | Role   | Description                              |
| ------ | ----------------------- | ------ | ------ | ---------------------------------------- |
| GET    | `/notes`                | Bearer | User   | List notes with pagination/search/filter |
| GET    | `/notes/:id`            | Bearer | User   | Get a single owned note                  |
| POST   | `/notes`                | Bearer | User   | Create a note with text/audio metadata   |
| POST   | `/notes/:id/retry`      | Bearer | User   | Retry failed transcription pipeline      |
| PATCH  | `/notes/:id/project`    | Bearer | User   | Assign or clear project                  |
| PUT    | `/notes/:id/tags`       | Bearer | User   | Replace note tags                        |
| POST   | `/notes/:id/share`      | Bearer | User   | Share note by email/WhatsApp             |
| POST   | `/notes/:id/share-link` | Bearer | User   | Create public share link                 |
| GET    | `/notes/:id/shares`     | Bearer | User   | List share links for a note              |
| GET    | `/public/notes/:token`  | No     | Public | Access shared note using token           |

## Projects

| Method | Path            | Auth   | Role | Description         |
| ------ | --------------- | ------ | ---- | ------------------- |
| GET    | `/projects`     | Bearer | User | List projects       |
| POST   | `/projects`     | Bearer | User | Create project      |
| PATCH  | `/projects/:id` | Bearer | User | Update project name |
| DELETE | `/projects/:id` | Bearer | User | Delete project      |

## Tags

| Method | Path        | Auth   | Role | Description |
| ------ | ----------- | ------ | ---- | ----------- |
| GET    | `/tags`     | Bearer | User | List tags   |
| POST   | `/tags`     | Bearer | User | Create tag  |
| PATCH  | `/tags/:id` | Bearer | User | Update tag  |
| DELETE | `/tags/:id` | Bearer | User | Delete tag  |

## Profile

| Method | Path           | Auth   | Role | Description                 |
| ------ | -------------- | ------ | ---- | --------------------------- |
| GET    | `/me`          | Bearer | User | Get current profile         |
| PATCH  | `/me`          | Bearer | User | Update profile/preferences  |
| PATCH  | `/me/password` | Bearer | User | Change password             |
| POST   | `/me/avatar`   | Bearer | User | Upload avatar               |
| DELETE | `/me`          | Bearer | User | Soft-delete current account |
| GET    | `/me/export`   | Bearer | User | Export user data            |

## Share

| Method | Path          | Auth   | Role | Description         |
| ------ | ------------- | ------ | ---- | ------------------- |
| DELETE | `/shares/:id` | Bearer | User | Revoke a share link |

## Admin

| Method | Path                     | Auth   | Role  | Description              |
| ------ | ------------------------ | ------ | ----- | ------------------------ |
| GET    | `/admin/stats`           | Bearer | Admin | Get platform metrics     |
| GET    | `/admin/jobs`            | Bearer | Admin | Get jobs/status overview |
| GET    | `/admin/users`           | Bearer | Admin | List users with filters  |
| PATCH  | `/admin/users/:id/block` | Bearer | Admin | Block or unblock a user  |

## Blog

| Method | Path                         | Auth   | Role   | Description               |
| ------ | ---------------------------- | ------ | ------ | ------------------------- |
| GET    | `/blog`                      | No     | Public | List published posts      |
| GET    | `/blog/categories`           | No     | Public | List blog categories      |
| GET    | `/blog/:slug`                | No     | Public | Get a published blog post |
| POST   | `/admin/blog`                | Bearer | Admin  | Create blog post          |
| PATCH  | `/admin/blog/:id`            | Bearer | Admin  | Update blog post          |
| DELETE | `/admin/blog/:id`            | Bearer | Admin  | Delete blog post          |
| POST   | `/admin/blog/categories`     | Bearer | Admin  | Create category           |
| PATCH  | `/admin/blog/categories/:id` | Bearer | Admin  | Update category           |
| DELETE | `/admin/blog/categories/:id` | Bearer | Admin  | Delete category           |

## Representative Request/Response Examples

### Register

**Request**

```http
POST /auth/register
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@company.com",
  "password": "StrongPassword!123"
}
```

**Response**

```json
{
  "id": "clx123",
  "email": "jane@company.com",
  "role": "USER"
}
```

### Login

**Request**

```http
POST /auth/login
Content-Type: application/json

{
  "email": "jane@company.com",
  "password": "StrongPassword!123",
  "rememberMe": true
}
```

**Response**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clx123",
    "email": "jane@company.com",
    "role": "USER"
  }
}
```

### Create Note

**Request**

```http
POST /notes
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "text": "Call summary from today",
  "audioUrl": "https://cdn.example.com/audio/note-1.m4a",
  "projectId": "proj_123"
}
```

**Response**

```json
{
  "id": "note_123",
  "status": "UPLOADED",
  "text": "Call summary from today",
  "createdAt": "2026-01-10T10:00:00.000Z"
}
```

### Create Share Link

**Request**

```http
POST /notes/note_123/share-link
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "expiresAt": "2026-02-10T10:00:00.000Z",
  "allowSummary": true,
  "allowTranscript": false
}
```

**Response**

```json
{
  "id": "share_123",
  "url": "https://app.blablanote.com/public/notes/3V1Q...",
  "expiresAt": "2026-02-10T10:00:00.000Z"
}
```

### Admin Stats

**Request**

```http
GET /admin/stats
Authorization: Bearer <admin_access_token>
```

**Response**

```json
{
  "users": 1240,
  "notes": 38742,
  "activeShareLinks": 901,
  "failedPipelines": 17
}
```

## Error Codes

| HTTP Code | Meaning           | Typical Causes                                                 |
| --------- | ----------------- | -------------------------------------------------------------- |
| 400       | Bad Request       | Validation failure, malformed payload, business rule violation |
| 401       | Unauthorized      | Missing/invalid access token, expired or invalid refresh token |
| 403       | Forbidden         | Authenticated user lacks role/ownership permissions            |
| 404       | Not Found         | Resource not found or not visible to requester                 |
| 429       | Too Many Requests | Rate limit exceeded on protected/sensitive endpoints           |
