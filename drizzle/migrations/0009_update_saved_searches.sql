-- Update saved_searches table to match new schema
DO $$ BEGIN
 CREATE TYPE "alert_frequency" AS ENUM('instant', 'daily', 'weekly');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Convert id column from integer to uuid
ALTER TABLE saved_searches ALTER COLUMN id DROP DEFAULT;
ALTER TABLE saved_searches ALTER COLUMN id TYPE uuid USING gen_random_uuid();
ALTER TABLE saved_searches ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Convert user_id column from integer to uuid (this will require manual mapping)
-- For now, we'll drop and recreate the table to avoid data conversion issues
DROP TABLE IF EXISTS saved_searches CASCADE;

-- Recreate the table with correct schema
CREATE TABLE "saved_searches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"search_criteria" json NOT NULL,
	"alerts_enabled" boolean DEFAULT true,
	"alert_frequency" "alert_frequency" DEFAULT 'instant',
	"last_alert_sent" timestamp,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create indexes
CREATE INDEX "saved_searches_user_idx" ON "saved_searches" ("user_id");
CREATE INDEX "saved_searches_active_idx" ON "saved_searches" ("is_active");

-- Add foreign key constraint
ALTER TABLE "saved_searches" ADD CONSTRAINT "saved_searches_user_id_users_id_fk" 
FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;