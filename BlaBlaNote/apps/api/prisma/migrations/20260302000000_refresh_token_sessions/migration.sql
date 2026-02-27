ALTER TABLE "RefreshToken"
ADD COLUMN "sessionId" TEXT,
ADD COLUMN "userAgent" TEXT,
ADD COLUMN "ipAddress" TEXT;

UPDATE "RefreshToken"
SET "sessionId" = "id"
WHERE "sessionId" IS NULL;

ALTER TABLE "RefreshToken"
ALTER COLUMN "sessionId" SET NOT NULL;

CREATE INDEX "RefreshToken_sessionId_idx" ON "RefreshToken"("sessionId");
