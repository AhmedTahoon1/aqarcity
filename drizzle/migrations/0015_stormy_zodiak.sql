CREATE TABLE IF NOT EXISTS "statistics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"number" varchar(50) NOT NULL,
	"title_en" varchar(255) NOT NULL,
	"title_ar" varchar(255) NOT NULL,
	"icon" varchar(100) NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "statistics_visible_idx" ON "statistics" ("is_visible");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "statistics_order_idx" ON "statistics" ("display_order");