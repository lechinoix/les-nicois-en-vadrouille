import {
  pgTable,
  text,
  integer,
  jsonb,
  timestamp,
  primaryKey,
} from 'drizzle-orm/pg-core';
import type { Article, Picture } from '../lib/model';
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
