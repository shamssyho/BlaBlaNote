# Architecture Diagrams

## System Context

```mermaid
flowchart LR
  U[User] --> W[React Web App]
  W --> API[NestJS API]
  API --> DB[(PostgreSQL via Prisma)]
  API --> S3[S3 Audio Storage]
  API --> OPENAI[OpenAI Whisper]
  API --> BREVO[Brevo Email]
  API --> TWILIO[Twilio WhatsApp]
  API --> NOTION[Notion API]
  API --> DISCORD[Discord Webhook]
  A[Admin User] --> W
```

## Backend Module Dependencies

```mermaid
flowchart TD
  AppModule --> AuthModule
  AppModule --> UserModule
  AppModule --> NoteModule
  AppModule --> ProjectModule
  AppModule --> TagModule
  AppModule --> ProfileModule
  AppModule --> AdminModule
  AppModule --> BlogModule
  AppModule --> WhisperModule
  AppModule --> DiscordModule
  AppModule --> PrismaModule

  AuthModule --> PrismaModule
  UserModule --> PrismaModule
  NoteModule --> PrismaModule
  ProjectModule --> PrismaModule
  TagModule --> PrismaModule
  ProfileModule --> PrismaModule
  AdminModule --> PrismaModule
  BlogModule --> PrismaModule

  NoteModule --> WhisperModule
  NoteModule --> AuthModule
  NoteModule --> ProjectModule
  NoteModule --> TagModule
  AdminModule --> AuthModule
  BlogModule --> AuthModule
```

## Sequence: Create Audio Note

```mermaid
sequenceDiagram
  autonumber
  participant User
  participant Web as Frontend
  participant API as Nest API
  participant S3 as S3 Storage
  participant Whisper as OpenAI Whisper
  participant Share as Notification Integrations

  User->>Web: Upload audio and metadata
  Web->>API: POST /notes
  API->>S3: Store audio file
  S3-->>API: audioUrl
  API->>API: Create note status=UPLOADED
  API->>Whisper: Transcribe audio
  Whisper-->>API: transcriptText
  API->>API: Generate summary and optional translation
  API->>API: status=READY
  API-->>Web: Note with summary/translation state
  opt User shares note
    Web->>API: POST /notes/:id/share
    API->>Share: Email / WhatsApp / Notion dispatch
    Share-->>API: Delivery result
    API-->>Web: Share history persisted
  end
```

## Sequence: Refresh Token Rotation

```mermaid
sequenceDiagram
  autonumber
  participant User
  participant Web as Frontend
  participant API as Nest API
  participant DB as PostgreSQL

  User->>Web: Action requiring auth
  Web->>API: Request with expired access token
  API-->>Web: 401 Unauthorized
  Web->>API: POST /auth/refresh
  API->>DB: Validate active refresh token session
  API->>DB: Revoke old token and store replacement
  API-->>Web: New access token + rotated refresh token cookie
  Web->>API: Retry original request
  API-->>Web: 200 OK
```

## Entity Relationship Diagram

```mermaid
erDiagram
  USER ||--o{ NOTE : owns
  USER ||--o{ PROJECT : owns
  USER ||--o{ TAG : owns
  USER ||--o{ SHARELINK : creates
  USER ||--o{ BLOGPOST : authors
  NOTE ||--o{ NOTETAG : maps
  TAG ||--o{ NOTETAG : maps
  NOTE ||--o{ SHARELINK : exposes
  BLOGCATEGORY ||--o{ BLOGPOST : classifies
  PROJECT ||--o{ NOTE : organizes

  USER {
    string id PK
    string email
    string role
    string language
    string theme
  }
  NOTE {
    string id PK
    string userId FK
    string projectId FK
    string status
    string transcriptText
    string summary
    string translation
  }
  PROJECT {
    string id PK
    string userId FK
    string name
    string color
  }
  TAG {
    string id PK
    string userId FK
    string name
    string slug
  }
  NOTETAG {
    string noteId FK
    string tagId FK
  }
  SHARELINK {
    string id PK
    string noteId FK
    string createdByUserId FK
    datetime expiresAt
  }
  BLOGCATEGORY {
    string id PK
    string slug
    string name
  }
  BLOGPOST {
    string id PK
    string authorId FK
    string categoryId FK
    string slug
    boolean published
  }
```

## Note Processing State

```mermaid
stateDiagram-v2
  [*] --> UPLOADED
  UPLOADED --> PROCESSING_SUMMARY
  UPLOADED --> PROCESSING_TRANSLATION
  PROCESSING_SUMMARY --> READY
  PROCESSING_TRANSLATION --> READY
  PROCESSING_SUMMARY --> FAILED
  PROCESSING_TRANSLATION --> FAILED
  FAILED --> PROCESSING_SUMMARY
  FAILED --> PROCESSING_TRANSLATION
```
