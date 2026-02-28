# API Reference

## Documentation Sources

- Swagger UI: `/api/docs`
- OpenAPI JSON: `docs/api/openapi.json`
- OpenAPI YAML: `docs/api/openapi.yaml`

## Domain Groups

- Auth
- Notes
- Projects
- Tags
- Profile
- Share
- Admin
- Blog

## Core Endpoints

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

### Notes

- `GET /notes`
- `POST /notes`
- `GET /notes/:id`
- `PATCH /notes/:id`
- `DELETE /notes/:id`
- `POST /notes/:id/summarize`
- `POST /notes/:id/translate`

### Projects

- `GET /projects`
- `POST /projects`
- `PATCH /projects/:id`
- `DELETE /projects/:id`
- `PATCH /notes/:id/project`

### Tags

- `GET /tags`
- `POST /tags`
- `PATCH /tags/:id`
- `DELETE /tags/:id`
- `PUT /notes/:id/tags`

### Share

- `POST /notes/:id/share`
- `POST /notes/:id/share-link`
- `GET /share/public/:token`

### Profile

- `GET /profile/me`
- `PATCH /profile/me`
- `PATCH /profile/change-password`

### Admin

- `GET /admin/overview`
- `GET /admin/users`
- `PATCH /admin/users/:id/block`

### Blog

- `GET /blog/posts`
- `GET /blog/posts/:slug`
- `POST /blog/posts`
- `PATCH /blog/posts/:id`
- `GET /blog/categories`
- `POST /blog/categories`

## Regeneration

```bash
yarn docs:openapi
```
