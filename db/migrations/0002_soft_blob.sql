CREATE TABLE "photo_imports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" text NOT NULL,
	"owner" text NOT NULL,
	"token" text,
	"state" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "photo_imports" ADD CONSTRAINT "photo_imports_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "photo_imports_article_owner_idx" ON "photo_imports" USING btree ("article_id","owner");