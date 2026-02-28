# Architecture Diagrams

## 1) System Context Diagram

```mermaid
graph LR
  U[User] --> W[Web App\nReact + TypeScript]
  W --> A[API\nNestJS]
  A --> DB[(PostgreSQL)]
  A --> WH[Whisper / Transcription Service]
  A --> SM[Summarization Service]
  A --> BR[Brevo Email]
  A --> TW[Twilio WhatsApp]
  A --> DC[Discord Webhook]
  A --> S3[S3-Compatible Storage]
```

## 2) Backend Module Diagram (NestJS)

```mermaid
graph TD
  APP[AppModule]
  APP --> AUTH[AuthModule]
  APP --> NOTES[NoteModule]
  APP --> PROJECTS[ProjectModule]
  APP --> TAGS[TagModule]
  APP --> PROFILE[ProfileModule]
  APP --> ADMIN[AdminModule]
  APP --> BLOG[BlogModule]
  APP --> PRISMA[PrismaModule]
  APP --> WHISPER[WhisperModule]
  APP --> DISCORD[DiscordModule]

  NOTES --> PRISMA
  NOTES --> WHISPER
  NOTES --> DISCORD
  NOTES --> TAGS
  NOTES --> PROJECTS

  AUTH --> PRISMA
  PROFILE --> PRISMA
  PROJECTS --> PRISMA
  TAGS --> PRISMA
  BLOG --> PRISMA
  ADMIN --> PRISMA
  WHISPER --> PRISMA
```

## 3) Sequence Diagram — Create Audio Note

```mermaid
sequenceDiagram
  participant User as User
  participant Web as Web App
  participant API as API
  participant Storage as S3 Storage
  participant DB as PostgreSQL
  participant Whisper as Whisper Service
  participant Summarizer as Summarization Service
  participant Discord as Discord Webhook

  User->>Web: Create note with audio
  Web->>API: POST /notes (metadata + audio ref)
  API->>Storage: Upload audio object
  Storage-->>API: audioUrl
  API->>DB: Insert note status=UPLOADED
  API->>DB: Update status=TRANSCRIBING
  API->>Whisper: Transcribe audio
  Whisper-->>API: transcriptText
  API->>DB: Save transcript, status=SUMMARIZING
  API->>Summarizer: Generate summary
  Summarizer-->>API: summary
  API->>DB: Save summary, status=READY
  API->>Discord: Send notification event
  API-->>Web: 201 Created + note payload
  Web-->>User: Render note as processing/ready
```

## 4) Sequence Diagram — Refresh Token Rotation

```mermaid
sequenceDiagram
  participant Web as Web App
  participant API as API
  participant DB as PostgreSQL

  Web->>API: POST /auth/refresh (refresh cookie)
  API->>DB: Lookup token hash + session
  DB-->>API: token record
  API->>API: Validate expiration/revocation/user state
  API->>DB: Revoke old token + create replacement token
  API-->>Web: Set-Cookie new refresh token + return accessToken
  Web->>API: Retry original request with new access token
  API-->>Web: 200 OK
```

## 5) ER Diagram (High-Level)

```mermaid
erDiagram
  USER ||--o{ NOTE : owns
  USER ||--o{ PROJECT : owns
  USER ||--o{ TAG : owns
  USER ||--o{ SHARE_LINK : creates
  USER ||--o{ BLOG_POST : writes

  PROJECT ||--o{ NOTE : contains
  NOTE ||--o{ SHARE_LINK : exposes

  NOTE ||--o{ NOTE_TAG : has
  TAG ||--o{ NOTE_TAG : labels

  BLOG_CATEGORY ||--o{ BLOG_POST : classifies

  USER {
    string id PK
    string email
    string role
    string status
  }

  NOTE {
    string id PK
    string userId FK
    string projectId FK
    string status
    string audioUrl
  }

  PROJECT {
    string id PK
    string userId FK
    string name
  }

  TAG {
    string id PK
    string userId FK
    string name
    string slug
  }

  NOTE_TAG {
    string noteId PK, FK
    string tagId PK, FK
  }

  SHARE_LINK {
    string id PK
    string noteId FK
    string createdByUserId FK
    string tokenHash
    datetime expiresAt
  }

  BLOG_POST {
    string id PK
    string authorId FK
    string categoryId FK
    string title
    boolean published
  }

  BLOG_CATEGORY {
    string id PK
    string slug
    string name
  }
```
