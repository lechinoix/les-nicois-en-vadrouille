-- Drizzle runs pending migrations in one transaction. Recreate the enum so
-- the new value can be used by the check and seed in this same transaction.
ALTER TYPE "public"."editor_option_kind" RENAME TO "editor_option_kind_old";
--> statement-breakpoint
CREATE TYPE "public"."editor_option_kind" AS ENUM ('participants', 'places', 'periods', 'sports');
--> statement-breakpoint
ALTER TABLE "editor_options" ALTER COLUMN "kind" TYPE "public"."editor_option_kind"
USING "kind"::text::"public"."editor_option_kind";
--> statement-breakpoint
DROP TYPE "public"."editor_option_kind_old";--> statement-breakpoint
ALTER TABLE "editor_options" ADD COLUMN "value" text;--> statement-breakpoint
CREATE UNIQUE INDEX "editor_options_kind_value_unique" ON "editor_options" USING btree ("kind","value");--> statement-breakpoint
ALTER TABLE "editor_options" ADD CONSTRAINT "editor_options_sport_value_required" CHECK ("editor_options"."kind" <> 'sports' OR "editor_options"."value" IS NOT NULL);
--> statement-breakpoint
-- Preserve the existing sport codes and their French labels.
INSERT INTO "editor_options" ("kind", "value", "label") VALUES
  ('sports', 'ESCALADE_GRANDE_VOIE', 'Escalade en grande voie'),
  ('sports', 'ESCALADE_COUENNE', 'Escalade en couenne'),
  ('sports', 'SKI_ALPIN', 'Ski alpin'),
  ('sports', 'SKI_DE_RANDO', 'Ski de randonnée'),
  ('sports', 'ALPINISM', 'Alpinisme'),
  ('sports', 'HIKING', 'Randonnée'),
  ('sports', 'SPELEO', 'Spéléo'),
  ('sports', 'TREK', 'Trek'),
  ('sports', 'VANLIFE', 'Vanlife')
ON CONFLICT (kind, value) DO NOTHING;
--> statement-breakpoint
-- Include any additional saved codes without rewriting drafts/publications.
INSERT INTO "editor_options" ("kind", "value", "label")
SELECT DISTINCT 'sports'::editor_option_kind, value.code,
  CASE WHEN EXISTS (SELECT 1 FROM editor_options WHERE kind = 'sports' AND label = value.code)
       THEN value.code || ' (code existant)' ELSE value.code END
FROM (SELECT data FROM drafts UNION ALL SELECT data FROM publications) AS article
CROSS JOIN LATERAL jsonb_array_elements_text(
  CASE WHEN jsonb_typeof(article.data -> 'sports') = 'array'
       THEN article.data -> 'sports' ELSE '[]'::jsonb END
) AS value(code)
WHERE btrim(value.code) <> ''
  AND NOT EXISTS (SELECT 1 FROM editor_options WHERE kind = 'sports' AND "value" = value.code)
ON CONFLICT (kind, value) DO NOTHING;
