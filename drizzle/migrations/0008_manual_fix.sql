-- Manual migration to fix UUID conversion issues
DO $$ BEGIN
 CREATE TYPE "alert_frequency" AS ENUM('instant', 'daily', 'weekly');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Create saved_searches table
CREATE TABLE IF NOT EXISTS "saved_searches" (
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

-- Create indexes for saved_searches
CREATE INDEX IF NOT EXISTS "saved_searches_user_idx" ON "saved_searches" ("user_id");
CREATE INDEX IF NOT EXISTS "saved_searches_active_idx" ON "saved_searches" ("is_active");

-- Create indexes for existing tables
CREATE INDEX IF NOT EXISTS "favorites_user_idx" ON "favorites" ("user_id");
CREATE INDEX IF NOT EXISTS "favorites_property_idx" ON "favorites" ("property_id");
CREATE INDEX IF NOT EXISTS "inquiries_property_idx" ON "inquiries" ("property_id");
CREATE INDEX IF NOT EXISTS "inquiries_user_idx" ON "inquiries" ("user_id");
CREATE INDEX IF NOT EXISTS "inquiries_status_idx" ON "inquiries" ("status");
CREATE INDEX IF NOT EXISTS "properties_city_idx" ON "properties" ("city");
CREATE INDEX IF NOT EXISTS "properties_type_idx" ON "properties" ("property_type");
CREATE INDEX IF NOT EXISTS "properties_status_idx" ON "properties" ("status");
CREATE INDEX IF NOT EXISTS "properties_price_idx" ON "properties" ("price");
CREATE INDEX IF NOT EXISTS "properties_agent_idx" ON "properties" ("agent_id");
CREATE INDEX IF NOT EXISTS "properties_featured_idx" ON "properties" ("is_featured");
CREATE INDEX IF NOT EXISTS "properties_created_at_idx" ON "properties" ("created_at");
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users" ("email");
CREATE INDEX IF NOT EXISTS "users_role_idx" ON "users" ("role");

-- Add foreign key constraint
DO $$ BEGIN
 ALTER TABLE "saved_searches" ADD CONSTRAINT "saved_searches_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;