DO $$ BEGIN
 CREATE TYPE "notification_priority" AS ENUM('low', 'medium', 'high', 'urgent');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "notification_type" AS ENUM('new_property', 'price_drop', 'new_feature', 'system', 'marketing');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"type" "notification_type" NOT NULL,
	"priority" "notification_priority" DEFAULT 'medium',
	"title_en" varchar(255) NOT NULL,
	"title_ar" varchar(255) NOT NULL,
	"content_en" text NOT NULL,
	"content_ar" text NOT NULL,
	"image" text,
	"video_url" text,
	"action_url" text,
	"action_text_en" varchar(100),
	"action_text_ar" varchar(100),
	"metadata" json,
	"is_read" boolean DEFAULT false,
	"is_global" boolean DEFAULT false,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
