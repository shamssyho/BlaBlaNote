# Functional Specification

## User Stories
- As a user, I can create projects with a custom color and attach notes to one project.
- As a user, I can create personal tags and assign multiple tags to notes.
- As a user, I can filter notes by selected tags.
- As a user, I can trigger summarization and translation after upload.
- As a user, I can share note content through Email, WhatsApp, or Notion.

## Acceptance Criteria
- Project color must be valid hex (`#RRGGBB`).
- `projectId` is nullable and ownership enforced.
- Tags are user-scoped and attachable many-to-many.
- Notes expose statuses: `UPLOADED`, `PROCESSING_SUMMARY`, `PROCESSING_TRANSLATION`, `READY`, `FAILED`.
- Share endpoint supports channel + destination + content type + optional target language.

## Feature Breakdown
- Project management UI and API
- Tag management UI and API
- Note post-processing controls and state display
- Multi-channel share modal

## Non-Functional Requirements
- Swagger coverage for all new endpoints
- Validation on all write DTOs
- Clean architecture boundaries between controllers/services/integrations
