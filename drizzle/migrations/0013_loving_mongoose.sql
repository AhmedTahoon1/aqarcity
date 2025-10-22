DO $$ BEGIN
 CREATE TYPE "agent_level" AS ENUM('junior', 'senior', 'team_leader', 'manager', 'director');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "agent_specialization" AS ENUM('residential_sale', 'residential_rent', 'commercial_sale', 'commercial_rent', 'luxury_properties', 'off_plan', 'investment');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "agent_status" AS ENUM('active', 'inactive', 'suspended', 'pending_verification');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "company_type" AS ENUM('individual', 'small_team', 'medium_company', 'large_company', 'franchise');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "agent_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"agent_id" uuid NOT NULL,
	"month" integer NOT NULL,
	"year" integer NOT NULL,
	"properties_listed" integer DEFAULT 0,
	"properties_sold" integer DEFAULT 0,
	"properties_rented" integer DEFAULT 0,
	"total_commission" numeric(15, 2) DEFAULT '0.00',
	"leads_generated" integer DEFAULT 0,
	"leads_converted" integer DEFAULT 0,
	"viewings_arranged" integer DEFAULT 0,
	"client_meetings" integer DEFAULT 0,
	"avg_response_time_minutes" integer DEFAULT 0,
	"customer_satisfaction" numeric(2, 1) DEFAULT '0.0',
	"repeat_client_rate" numeric(3, 2) DEFAULT '0.00',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "agent_team_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" uuid NOT NULL,
	"agent_id" uuid NOT NULL,
	"role" varchar(100) DEFAULT 'member',
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "agent_teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"lead_agent_id" uuid NOT NULL,
	"company_name" varchar(255),
	"logo" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(100) NOT NULL,
	"value" text,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "license_expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "verified_at" timestamp;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "status" "agent_status" DEFAULT 'pending_verification';--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "reviews_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "active_listings" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "total_sales_value" numeric(15, 2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "average_deal_value" numeric(15, 2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "avg_response_time_hours" integer DEFAULT 24;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "website" text;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "social_media" json DEFAULT '{}'::json;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "specializations" json DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "preferred_areas" json DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "experience_years" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "agent_level" "agent_level" DEFAULT 'junior';--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "company_name" varchar(255);--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "company_logo" text;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "company_type" "company_type" DEFAULT 'individual';--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "team_size" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "office_address" text;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "working_hours" json DEFAULT '{}'::json;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "is_available" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "profile_image" text;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "cover_image" text;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "achievements" json DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "certifications" json DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "last_active_at" timestamp;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "joined_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "agents" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agent_metrics_agent_idx" ON "agent_metrics" ("agent_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agent_metrics_period_idx" ON "agent_metrics" ("year","month");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agent_team_members_team_idx" ON "agent_team_members" ("team_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agent_team_members_agent_idx" ON "agent_team_members" ("agent_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agent_team_members_active_idx" ON "agent_team_members" ("is_active");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agent_teams_lead_idx" ON "agent_teams" ("lead_agent_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agent_teams_active_idx" ON "agent_teams" ("is_active");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "settings_key_idx" ON "settings" ("key");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agents_user_idx" ON "agents" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agents_status_idx" ON "agents" ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agents_verified_idx" ON "agents" ("verified");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agents_rating_idx" ON "agents" ("rating");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agents_level_idx" ON "agents" ("agent_level");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agents_available_idx" ON "agents" ("is_available");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "agents_license_idx" ON "agents" ("license_number");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "agent_metrics" ADD CONSTRAINT "agent_metrics_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "agent_team_members" ADD CONSTRAINT "agent_team_members_team_id_agent_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "agent_teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "agent_team_members" ADD CONSTRAINT "agent_team_members_agent_id_agents_id_fk" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "agent_teams" ADD CONSTRAINT "agent_teams_lead_agent_id_agents_id_fk" FOREIGN KEY ("lead_agent_id") REFERENCES "agents"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
