# FUNCTIONAL_SPECIFICATION.md

## 1. Project Objectives

BlaBlaNote aims to provide a complete voice-note productivity platform where users can:
- Capture ideas by uploading audio notes
- Convert speech to text automatically
- Generate actionable summaries
- Organize knowledge into projects/tags
- Share notes privately or publicly
- Access insights and administration tools through an admin interface

Primary business goals:
- Reduce note-taking friction
- Improve information recall with AI summarization
- Enable frictionless collaboration through sharing channels
- Provide operational visibility for platform administrators

---

## 2. Target Users

1. **Individual professionals** (founders, consultants, researchers)
2. **Teams** needing quick voice-to-text workflows
3. **Content creators** managing ideas and drafts
4. **Administrators** maintaining platform integrity and growth

---

## 3. User Roles

## 3.1 User
- Register/login
- Upload audio and create notes
- Access transcripts/summaries
- Organize notes (projects/tags)
- Search/filter notes
- Share notes via email/WhatsApp/public links
- Manage own account and personal data

## 3.2 Admin
- Access dashboard KPIs
- Monitor job failures/transcription states
- Manage users and account states
- Manage blog content and categories
- Supervise system health indicators

---

## 4. Functional Requirements

## 4.1 Authentication & Account
- FR-01: User can create an account
- FR-02: User can log in and receive authenticated session
- FR-03: User can refresh session without re-login
- FR-04: User can log out and invalidate session
- FR-05: User can request password reset
- FR-06: User can reset password through tokenized link

## 4.2 Notes Lifecycle
- FR-10: User can upload audio note
- FR-11: System transcribes uploaded audio
- FR-12: System summarizes transcript
- FR-13: System stores processing status and errors
- FR-14: User can retry failed note processing
- FR-15: User can create a text-only note manually

## 4.3 Organization
- FR-20: User can create/update/delete projects
- FR-21: User can assign/unassign note to project
- FR-22: User can create/update/delete tags
- FR-23: User can assign tags to notes

## 4.4 Search & Discovery
- FR-30: User can search notes by text
- FR-31: User can filter by project
- FR-32: User can filter by date range
- FR-33: User can filter by tag combinations

## 4.5 Sharing
- FR-40: User can share note content by email
- FR-41: User can share note content by WhatsApp
- FR-42: User can generate public share links
- FR-43: User can set share link expiry and visible content permissions
- FR-44: User can revoke previously created public links

## 4.6 Content & Admin
- FR-50: Public users can browse published blog posts
- FR-51: Admin can create/update/delete blog posts
- FR-52: Admin can manage blog categories
- FR-53: Admin can view platform stats and jobs
- FR-54: Admin can manage user moderation actions

---

## 5. Non-Functional Requirements

- NFR-01: API response times should remain acceptable under normal load (target p95 < 500ms for non-AI CRUD endpoints)
- NFR-02: AI processing failures must be traceable via status and error message
- NFR-03: Authentication must enforce secure token handling (short-lived access + refresh rotation)
- NFR-04: Platform should support horizontal scaling of API and AI workers
- NFR-05: System should provide auditability of critical user/admin operations
- NFR-06: Public share links must be secure, expirable, and minimally permissive
- NFR-07: Compliance features must support data export and deletion requests

---

## 6. Detailed Feature Breakdown

## 6.1 Create Note
- User opens notes area
- User enters text note (optional)
- System stores note with initial metadata
- If no audio, note may become immediately usable (`READY` when content present)

## 6.2 Upload Audio
- User uploads supported audio format
- System stores file and creates note record
- Note enters processing pipeline

## 6.3 Transcription
- System sends audio to Whisper
- Transcript is persisted
- Status updates to indicate progress/failure

## 6.4 Summarization
- System generates concise summary from transcript
- Optional translation is generated
- Final status becomes `READY`

## 6.5 Organize by Project
- User creates project containers
- User assigns notes to selected project
- User can reassign or remove project linkage

## 6.6 Tag System
- User creates personal tags
- User applies tags to notes
- Tag set can be replaced per note

## 6.7 Search System
- User uses search by keyword (transcript/summary)
- User combines filters (project, tags, date range)
- System returns paginated results

## 6.8 Share via Email
- User chooses note + recipient email
- System sends formatted note content via Brevo
- Action is recorded in operational notifications

## 6.9 Share via WhatsApp
- User chooses note + destination number
- System sends message through Twilio WhatsApp
- Delivery relies on provider account configuration

## 6.10 Public Share Link
- User generates public tokenized URL
- User defines expiry and content scope
- Recipient can access only authorized note fields

## 6.11 Blog
- Public readers access published posts/categories
- Admin controls publication lifecycle

## 6.12 Admin Dashboard
- Admin monitors totals (notes/users/shares/failures)
- Admin monitors recent job states and failures
- Admin handles user moderation flows

---

## 7. User Stories

- US-01: As a new user, I want to register quickly so I can start capturing voice notes.
- US-02: As a user, I want to upload audio and receive a transcript automatically.
- US-03: As a user, I want a short summary so I can review key points faster.
- US-04: As a user, I want to classify notes by project and tags for better organization.
- US-05: As a user, I want to search old notes by keywords and filters.
- US-06: As a user, I want to share insights by email or WhatsApp.
- US-07: As a user, I want expirable public links to share selectively.
- US-08: As an admin, I want to see platform health and failures at a glance.
- US-09: As an admin, I want to manage users to keep the platform safe.
- US-10: As an admin, I want to publish and maintain blog content.

---

## 8. Acceptance Criteria

## 8.1 Authentication
- AC-AUTH-01: Valid credentials return access token + refresh session
- AC-AUTH-02: Invalid credentials are rejected with clear error
- AC-AUTH-03: Expired access token can be renewed via refresh endpoint

## 8.2 Notes Processing
- AC-NOTE-01: Uploading supported audio creates note with processing status
- AC-NOTE-02: Successful pipeline persists transcript + summary and marks note `READY`
- AC-NOTE-03: Failed pipeline marks note `FAILED` with non-empty error message
- AC-NOTE-04: Retry endpoint reprocesses failed notes

## 8.3 Organization
- AC-ORG-01: User can CRUD projects and tags without affecting other users
- AC-ORG-02: Assigning tags/projects updates note metadata correctly

## 8.4 Search
- AC-SEARCH-01: Search returns relevant notes based on transcript/summary text
- AC-SEARCH-02: Filters (project, tags, date range) narrow results correctly

## 8.5 Sharing
- AC-SHARE-01: Email share succeeds with valid provider credentials
- AC-SHARE-02: WhatsApp share succeeds with valid Twilio configuration
- AC-SHARE-03: Public share links expire as configured
- AC-SHARE-04: Revoked link is no longer accessible

## 8.6 Admin
- AC-ADMIN-01: Admin-only endpoints reject non-admin users
- AC-ADMIN-02: Dashboard returns counts and historical trend data
- AC-ADMIN-03: Job view shows transcribing/summarizing/failed notes

---

## 9. Constraints

- Dependence on external APIs (OpenAI, Twilio, Brevo, Discord)
- Synchronous AI processing in current architecture can impact API responsiveness
- Upload storage currently local filesystem unless storage adapter is introduced
- Messaging channels depend on third-party sender approval/policies

---

## 10. Risks

- R-01: AI provider latency/outage affects note processing SLAs
- R-02: Misconfigured environment secrets can break critical workflows
- R-03: Unbounded synchronous processing may degrade throughput
- R-04: Insufficient observability can delay incident detection
- R-05: Inadequate token/cookie security could increase auth risk
- R-06: Growing data volume may impact query performance without tuning

Mitigation examples:
- Queue-based processing
- Health checks and alerting
- Secret management policy
- Caching and indexing strategy

---

## 11. Success Metrics

Product metrics:
- % of uploaded notes successfully reaching `READY`
- Median time from upload to summary available
- Weekly active users and retention
- Share actions per active user (email/WhatsApp/public)

Operational metrics:
- API error rate by endpoint
- Failed note processing rate
- Mean time to detect (MTTD) and resolve (MTTR) incidents
- Admin intervention frequency on moderation/transcription failures

Quality metrics:
- User-reported transcript quality score
- User-reported summary usefulness score
- Search success rate (user finds target note without repeated queries)
