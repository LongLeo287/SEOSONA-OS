ALTER TABLE "an_sandboxes"
ADD COLUMN IF NOT EXISTS "provider" text DEFAULT 'e2b' NOT NULL;
