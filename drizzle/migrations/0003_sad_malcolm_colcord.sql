DO $$ BEGIN
 CREATE TYPE "completion_status" AS ENUM('completed', 'under_construction');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "handover_status" AS ENUM('ready', 'future');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "reference_number" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "completion_status" "completion_status" DEFAULT 'completed';--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "handover_status" "handover_status" DEFAULT 'ready';--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "handover_date" varchar(100);--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "master_plan_image" text;--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "payment_plans" json DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "property_description" text;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_reference_number_unique" UNIQUE("reference_number");