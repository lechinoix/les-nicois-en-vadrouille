CREATE TYPE "public"."editor_option_kind" AS ENUM('participants', 'places', 'periods');--> statement-breakpoint
CREATE TABLE "editor_options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" "editor_option_kind" NOT NULL,
	"label" text NOT NULL,
	"archived" boolean DEFAULT false NOT NULL,
	"revision" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "editor_options_kind_label_unique" ON "editor_options" USING btree ("kind","label");
--> statement-breakpoint
-- Preserve existing labels; only seed this catalog, never rewrite articles.
INSERT INTO "editor_options" ("kind", "label")
SELECT DISTINCT field.kind::editor_option_kind, value.label
FROM (
  SELECT data FROM drafts
  UNION ALL
  SELECT data FROM publications
) AS article
CROSS JOIN (VALUES ('participants'), ('places'), ('periods')) AS field(kind)
CROSS JOIN LATERAL jsonb_array_elements_text(
  CASE WHEN jsonb_typeof(article.data -> field.kind) = 'array'
       THEN article.data -> field.kind ELSE '[]'::jsonb END
) AS value(label)
WHERE btrim(value.label) <> ''
ON CONFLICT (kind, label) DO NOTHING;
