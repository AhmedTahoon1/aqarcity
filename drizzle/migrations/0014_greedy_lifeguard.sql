CREATE TABLE IF NOT EXISTS "social_media_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"facebook" text,
	"instagram" text,
	"x" text,
	"snapchat" text,
	"linkedin" text,
	"tiktok" text,
	"youtube" text,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
