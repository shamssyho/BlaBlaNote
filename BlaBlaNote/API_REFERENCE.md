# API Reference

## Projects
- `GET /projects`
- `POST /projects`
  - Body: `{ "name": "Client", "color": "#2563EB" }`
- `PATCH /projects/:id`
  - Body: `{ "name": "Client v2", "color": "#1D4ED8" }`
- `DELETE /projects/:id`

## Tags
- `GET /tags`
- `POST /tags`
  - Body: `{ "name": "Urgent", "color": "#F59E0B" }`
- `PATCH /tags/:id`
- `DELETE /tags/:id`

## Notes
- `PATCH /notes/:id/project`
  - Body: `{ "projectId": "..." }`
- `PUT /notes/:id/tags`
  - Body: `{ "tagIds": ["..."] }`
- `GET /notes?tagIds=id1,id2`
- `POST /notes/:id/summarize`
- `POST /notes/:id/translate`
- `POST /notes/:id/share`
  - Body:
```json
{
  "channel": "NOTION",
  "destination": "notion_page_id",
  "contentType": "BOTH",
  "targetLanguage": "fr"
}
```
  - Response:
```json
{
  "success": true
}
```
