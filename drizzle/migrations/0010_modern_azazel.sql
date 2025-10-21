CREATE TABLE IF NOT EXISTS "areas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name_en" varchar(255) NOT NULL,
	"name_ar" varchar(255) NOT NULL,
	"emirate_id" uuid NOT NULL,
	"is_active" boolean DEFAULT true,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "emirates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name_en" varchar(255) NOT NULL,
	"name_ar" varchar(255) NOT NULL,
	"is_active" boolean DEFAULT true,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "properties" RENAME COLUMN "city" TO "emirate_id";--> statement-breakpoint
DROP INDEX IF EXISTS "properties_city_idx";--> statement-breakpoint
ALTER TABLE "properties" ALTER COLUMN "emirate_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "area_id" uuid;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "areas_emirate_idx" ON "areas" ("emirate_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "areas_active_idx" ON "areas" ("is_active");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "emirates_active_idx" ON "emirates" ("is_active");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "properties_emirate_idx" ON "properties" ("emirate_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "properties_area_idx" ON "properties" ("area_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "properties" ADD CONSTRAINT "properties_emirate_id_emirates_id_fk" FOREIGN KEY ("emirate_id") REFERENCES "emirates"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "properties" ADD CONSTRAINT "properties_area_id_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "areas" ADD CONSTRAINT "areas_emirate_id_emirates_id_fk" FOREIGN KEY ("emirate_id") REFERENCES "emirates"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
