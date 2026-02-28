ALTER TYPE "NoteStatus" RENAME VALUE 'TRANSCRIBING' TO 'PROCESSING_TRANSLATION';
ALTER TYPE "NoteStatus" RENAME VALUE 'SUMMARIZING' TO 'PROCESSING_SUMMARY';

ALTER TABLE "Project" ADD COLUMN "color" TEXT NOT NULL DEFAULT '#64748B';
ALTER TABLE "Tag" ADD COLUMN "color" TEXT;

CREATE TYPE "ShareChannel" AS ENUM ('EMAIL', 'WHATSAPP', 'NOTION');
CREATE TYPE "ShareContentType" AS ENUM ('SUMMARY', 'TRANSLATION', 'BOTH', 'FULL_TRANSCRIPTION');

CREATE TABLE "ShareHistory" (
  "id" TEXT NOT NULL,
  "noteId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "channel" "ShareChannel" NOT NULL,
  "destination" TEXT NOT NULL,
  "contentType" "ShareContentType" NOT NULL,
  "targetLanguage" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ShareHistory_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ShareHistory_noteId_idx" ON "ShareHistory"("noteId");
CREATE INDEX "ShareHistory_userId_idx" ON "ShareHistory"("userId");
CREATE INDEX "ShareHistory_createdAt_idx" ON "ShareHistory"("createdAt");

ALTER TABLE "ShareHistory" ADD CONSTRAINT "ShareHistory_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ShareHistory" ADD CONSTRAINT "ShareHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
