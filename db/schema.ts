import {
  pgTable,
  text,
  integer,
  jsonb,
  timestamp,
  primaryKey,
  pgEnum,
  uuid,
  boolean,
  uniqueIndex,
  index,
  check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import type { Article, Picture } from '../lib/model';
import { optionKinds } from '../lib/editor-option-model';
export const editorOptionKind = pgEnum('editor_option_kind', optionKinds);
export const editorOptions = pgTable(
  'editor_options',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    kind: editorOptionKind('kind').notNull(),
    label: text('label').notNull(),
    value: text('value'),
    archived: boolean('archived').default(false).notNull(),
    revision: integer('revision').default(1).notNull(),
  },
  (table) => [
    uniqueIndex('editor_options_kind_label_unique').on(table.kind, table.label),
    uniqueIndex('editor_options_kind_value_unique').on(table.kind, table.value),
    check(
      'editor_options_sport_value_required',
      sql`${table.kind} <> 'sports' OR ${table.value} IS NOT NULL`,
    ),
  ],
);
export const articles = pgTable('articles', {
  id: text('id').primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
export const drafts = pgTable('drafts', {
  id: text('id')
    .primaryKey()
    .references(() => articles.id),
  revision: integer('revision').notNull(),
  data: jsonb('data').$type<Article>().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
export const publications = pgTable('publications', {
  id: text('id')
    .primaryKey()
    .references(() => articles.id),
  revision: integer('revision').notNull(),
  data: jsonb('data').$type<Article>().notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
export const snapshots = pgTable(
  'published_snapshots',
  {
    id: text('id')
      .notNull()
      .references(() => articles.id),
    revision: integer('revision').notNull(),
    data: jsonb('data').$type<Article>().notNull(),
    publishedAt: timestamp('published_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.id, t.revision] })],
);
// Historical ledger retained to avoid dropping the completed import's audit data.
export const migrations = pgTable('s3_migrations', {
  checksum: text('checksum').primaryKey(),
  manifest: jsonb('manifest').notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
export const assets = pgTable('photo_assets', {
  key: text('key').primaryKey(),
  data: jsonb('data').$type<Picture>().notNull(),
});
export const loginAttempts = pgTable('login_attempts', {
  key: text('key').primaryKey(),
  count: integer('count').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});

// Tokens are encrypted server-side and never included in API responses.
export const photoImports = pgTable(
  'photo_imports',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    articleId: text('article_id')
      .notNull()
      .references(() => articles.id),
    owner: text('owner').notNull(),
    token: text('token'),
    state: jsonb('state')
      .$type<import('../lib/photo-import-model').PhotoImportState>()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('photo_imports_article_owner_idx').on(table.articleId, table.owner),
  ],
);
