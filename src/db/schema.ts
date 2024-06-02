import { date, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const imageTable = pgTable('image', {
	id: text('id').primaryKey(),
	created_at: timestamp('created_at').notNull().defaultNow(),
	height: integer('height'),
	url: text('url').notNull(),
	width: integer('width')
});
export const image_formatTable = pgTable('image_format', {
	id: text('id').primaryKey(),
	format: text('format').notNull(),
	height: integer('height'),
	image_id: text('image_id')
		.notNull()
		.references(() => imageTable.id, { onDelete: 'cascade' }),
	url: text('url').notNull(),
	width: integer('width')
});
export const outingTable = pgTable('outing', {
	id: text('id').primaryKey(),
	created_at: timestamp('created_at').notNull().defaultNow(),
	content: text('content'),
	cotation: text('cotation'),
	date: date('date').notNull(),
	elevation: text('elevation'),
	orientation: text('orientation'),
	status: text('status'),
	title: text('title'),
	topos: text('topos').array(),
	cover_id: text('cover_id').references(() => imageTable.id, { onDelete: 'set null' })
});
export const participantTable = pgTable('participant', {
	id: text('id').primaryKey(),
	firstname: text('firstname'),
	lastname: text('lastname'),
	surname: text('surname')
});
export const periodTable = pgTable('period', {
	id: text('id').primaryKey(),
	key: text('key').notNull(),
	label: text('label')
});
export const placeTable = pgTable('place', {
	id: text('id').primaryKey(),
	key: text('key').notNull(),
	label: text('label')
});
export const sportTable = pgTable('sport', {
	id: text('id').primaryKey(),
	key: text('key').notNull(),
	label: text('label')
});
export const outingImageTable = pgTable('outing_image', {
	image_id: text('image_id')
		.primaryKey()
		.references(() => imageTable.id, { onDelete: 'cascade' }),
	outing_id: text('outing_id')
		.primaryKey()
		.references(() => outingTable.id, { onDelete: 'cascade' })
});
export const outingParticipantTable = pgTable('outing_participant', {
	outing_id: text('outing_id')
		.primaryKey()
		.references(() => outingTable.id, { onDelete: 'cascade' }),
	participant_id: text('participant_id')
		.primaryKey()
		.references(() => participantTable.id, { onDelete: 'cascade' })
});
export const outingPeriodTable = pgTable('outing_period', {
	outing_id: text('outing_id')
		.primaryKey()
		.references(() => outingTable.id, { onDelete: 'cascade' }),
	period_id: text('period_id')
		.primaryKey()
		.references(() => periodTable.id, { onDelete: 'cascade' })
});
export const outingPlaceTable = pgTable('outing_place', {
	outing_id: text('outing_id')
		.primaryKey()
		.references(() => outingTable.id, { onDelete: 'cascade' }),
	place_id: text('place_id')
		.primaryKey()
		.references(() => placeTable.id, { onDelete: 'cascade' })
});
export const outingSportTable = pgTable('outing_sport', {
	outing_id: text('outing_id')
		.primaryKey()
		.references(() => outingTable.id, { onDelete: 'cascade' }),
	sport_id: text('sport_id')
		.primaryKey()
		.references(() => sportTable.id, { onDelete: 'cascade' })
});
