# Functional Specification

## Authentication

- User registration, login, logout
- Access token for API authorization
- Refresh token rotation with session replacement
- Forgot/reset password flow

## Notes and Processing

- Create, update, list, delete notes
- Upload and attach audio to notes
- Transcription using Whisper integration
- On-demand summarize and translate operations
- Processing pipeline states: uploaded, processing, ready, failed

## Projects and Tags

- CRUD projects with required color value
- CRUD personalized tags
- Assign or replace note tags
- Filter notes by project and tags

## Share and Distribution

- Share note content by email
- Share note content by WhatsApp
- Send note content to Notion
- Generate public share links with expirations
- Access public notes via secure token links

## Admin and Blog

- Admin dashboards for operational and user oversight
- User status controls and filtering
- Blog categories and posts management
- Public blog listing and detail pages

## Profile and Settings

- Update first/last name and profile preferences
- Change password
- Configure language, theme and notifications
- Manage profile media URLs

## Internationalization and Security

- Frontend language support: English and French
- Rate-limiting and guarded endpoints
- Role-based administration
