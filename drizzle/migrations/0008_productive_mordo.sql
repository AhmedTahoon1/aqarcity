DO $$ BEGIN
 CREATE TYPE "contact_type" AS ENUM('email', 'whatsapp');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "link_status" AS ENUM('unlinked', 'auto_linked', 'user_linked', 'user_declined');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "source_type" AS ENUM('user', 'guest_migrated', 'guest_linked');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "guest_searches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contact_type" "contact_type" NOT NULL,
	"contact_value" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"search_criteria" json NOT NULL,
	"alerts_enabled" boolean DEFAULT true,
	"alert_frequency" "alert_frequency" DEFAULT 'instant',
	"verification_token" varchar(255) NOT NULL,
	"is_verified" boolean DEFAULT false,
	"verification_expires_at" timestamp,
	"last_alert_sent" timestamp,
	"is_active" boolean DEFAULT true,
	"linked_user_id" uuid,
	"link_status" "link_status" DEFAULT 'unlinked',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "guest_searches_verification_token_unique" UNIQUE("verification_token")
);
--> statement-breakpoint
ALTER TABLE "saved_searches" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "saved_searches" ADD COLUMN "source_type" "source_type" DEFAULT 'user';--> statement-breakpoint
ALTER TABLE "saved_searches" ADD COLUMN "original_guest_id" uuid;--> statement-breakpoint
ALTER TABLE "saved_searches" ADD COLUMN "migration_date" timestamp;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "guest_searches_contact_idx" ON "guest_searches" ("contact_value");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "guest_searches_token_idx" ON "guest_searches" ("verification_token");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "guest_searches_user_idx" ON "guest_searches" ("linked_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "guest_searches_active_idx" ON "guest_searches" ("is_active");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "saved_searches_source_idx" ON "saved_searches" ("source_type");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "saved_searches" ADD CONSTRAINT "saved_searches_original_guest_id_guest_searches_id_fk" FOREIGN KEY ("original_guest_id") REFERENCES "guest_searches"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "guest_searches" ADD CONSTRAINT "guest_searches_linked_user_id_users_id_fk" FOREIGN KEY ("linked_user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
