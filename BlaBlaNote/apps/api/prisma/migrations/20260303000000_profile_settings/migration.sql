ALTER TABLE "User"
  ALTER COLUMN "role" TYPE TEXT USING "role"::text,
  ALTER COLUMN "role" SET DEFAULT 'USER',
  ADD COLUMN "isBlocked" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "avatarUrl" TEXT,
  ADD COLUMN "language" TEXT NOT NULL DEFAULT 'en',
  ADD COLUMN "theme" TEXT NOT NULL DEFAULT 'light',
  ADD COLUMN "notificationsEnabled" BOOLEAN NOT NULL DEFAULT true;

DROP TYPE IF EXISTS "Role";

CREATE INDEX "User_role_idx" ON "User"("role");
CREATE INDEX "User_isBlocked_idx" ON "User"("isBlocked");
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");
