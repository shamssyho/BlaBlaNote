# Technical Specification

## Database Schema
- `Project(id, name, color, userId, createdAt, updatedAt)`
- `Tag(id, name, slug, color?, userId, createdAt, updatedAt)`
- `Note(projectId?, summary?, translation?, status)`
- `NoteTag(noteId, tagId)`
- `ShareHistory(noteId, userId, channel, destination, contentType, targetLanguage?, createdAt)`

## API Structure
- Projects CRUD + note project linking
- Tags CRUD + note tags replacement
- Notes filtering with `tagIds`
- Post-processing triggers: summarize and translate
- Unified share endpoint for Email/WhatsApp/Notion

## Transcription Pipeline
1. Upload note/audio
2. Persist note with `UPLOADED`
3. Summarize (`PROCESSING_SUMMARY`)
4. Translate (`PROCESSING_TRANSLATION`)
5. Mark `READY` or `FAILED`

## Sharing Architecture
- Email: Brevo transactional API
- WhatsApp: Twilio API
- Notion: block append API
- Audit trail in `ShareHistory`

## Security
- JWT bearer protection on all feature endpoints
- Ownership checks for projects, tags, and notes
- Share action restricted to note owner

## Scaling
- Indexed relations (`projectId`, `userId`, join keys)
- Tag-filter query optimization through `NoteTag`
- Async-ready processing status model for workers/queues
