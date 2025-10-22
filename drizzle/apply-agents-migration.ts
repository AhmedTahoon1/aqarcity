import { db } from '../db.js';
import { sql } from 'drizzle-orm';

async function applyAgentsMigration() {
  console.log('🔄 Applying agents migration directly...');

  try {
    // Apply migration SQL directly
    await db.execute(sql`
      DO $$ BEGIN
        CREATE TYPE "agent_level" AS ENUM('junior', 'senior', 'team_leader', 'manager', 'director');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
      
      DO $$ BEGIN
        CREATE TYPE "agent_status" AS ENUM('active', 'inactive', 'suspended', 'pending_verification');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
      
      DO $$ BEGIN
        CREATE TYPE "company_type" AS ENUM('individual', 'small_team', 'medium_company', 'large_company', 'franchise');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await db.execute(sql`
      ALTER TABLE "agents" ADD COLUMN IF NOT EXISTS "license_expires_at" timestamp;
      ALTER TABLE "agents" ADD COLUMN IF NOT EXISTS "verified_at" timestamp;
      ALTER TABLE "agents" ADD COLUMN IF NOT EXISTS "status" "agent_status" DEFAULT 'pending_verification';
      ALTER TABLE "agents" ADD COLUMN IF NOT EXISTS "reviews_count" integer DEFAULT 0;
      ALTER TABLE "agents" ADD COLUMN IF NOT EXISTS "active_listings" integer DEFAULT 0;
      ALTER TABLE "agents" ADD COLUMN IF NOT EXISTS "total_sales_value" numeric(15, 2) DEFAULT '0.00';
      ALTER TABLE "agents" ADD COLUMN IF NOT EXISTS "average_deal_value" numeric(15, 2) DEFAULT '0.00';
      ALTER TABLE "agents" ADD COLUMN IF NOT EXISTS "avg_response_time_hours" integer DEFAULT 24;
      ALTER TABLE "agents" ADD COLUMN IF NOT EXISTS "website" text;
      ALTER TABLE "agents" ADD COLUMN IF NOT EXISTS "social_media" json DEFAULT '{}'::json;
      ALTER TABLE "agents" ADD COLUMN IF NOT EXISTS "specializations" json DEFAULT '[]'::json;
      ALTER TABLE "agents" ADD COLUMN IF NOT EXISTS "preferred_areas" json DEFAULT '[]'::json;
      ALTER TABLE "agents" ADD COLUMN IF NOT EXISTS "experience_years" integer DEFAULT 0;
      ALTER TABLE "agents" ADD COLUMN IF NOT EXISTS "agent_level" "agent_level" DEFAULT 'junior';
      ALTER TABLE "agents" ADD COLUMN IF NOT EXISTS "company_name" varchar(255);
      ALTER TABLE "agents" ADD COLUMN IF NOT EXISTS "company_logo" text;
      ALTER TABLE "agents" ADD COLUMN IF NOT EXISTS "company_type" "company_type" DEFAULT 'individual';
      ALTER TABLE "agents" ADD COLUMN IF NOT EXISTS "team_size" integer DEFAULT 1;
      ALTER TABLE "agents" ADD COLUMN IF NOT EXISTS "office_address" text;
      ALTER TABLE "agents" ADD COLUMN IF NOT EXISTS "working_hours" json DEFAULT '{}'::json;
      ALTER TABLE "agents" ADD COLUMN IF NOT EXISTS "is_available" boolean DEFAULT true;
      ALTER TABLE "agents" ADD COLUMN IF NOT EXISTS "profile_image" text;
      ALTER TABLE "agents" ADD COLUMN IF NOT EXISTS "cover_image" text;
      ALTER TABLE "agents" ADD COLUMN IF NOT EXISTS "achievements" json DEFAULT '[]'::json;
      ALTER TABLE "agents" ADD COLUMN IF NOT EXISTS "certifications" json DEFAULT '[]'::json;
      ALTER TABLE "agents" ADD COLUMN IF NOT EXISTS "last_active_at" timestamp;
      ALTER TABLE "agents" ADD COLUMN IF NOT EXISTS "joined_at" timestamp DEFAULT now();
      ALTER TABLE "agents" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now();
    `);

    await db.execute(sql`
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
    `);

    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "agent_team_members" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "team_id" uuid NOT NULL,
        "agent_id" uuid NOT NULL,
        "role" varchar(100) DEFAULT 'member',
        "joined_at" timestamp DEFAULT now() NOT NULL,
        "is_active" boolean DEFAULT true
      );
    `);

    await db.execute(sql`
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
    `);

    console.log('✅ Agents migration applied successfully!');

  } catch (error) {
    console.error('❌ Error applying migration:', error);
    throw error;
  }
}

applyAgentsMigration()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });