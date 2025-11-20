import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { usersTable } from './users';

export const storiesDataTable = sqliteTable('stories_data', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => {
			return crypto.randomUUID();
		}),
	user_id: text('user_id')
		.notNull()
		.references(() => usersTable.id),
	title: text('title', { length: 255 }).notNull(),
	age_group: text('age_group', { length: 255 }).notNull(),
	language: text('language', { length: 255 }).notNull(),
	topic: text('topic', { length: 255 }).notNull(),
	subtopic: text('subtopic', { length: 255 }).notNull(),
	style: text('style', { length: 255 }).notNull(),
	created_at: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => {
			return new Date();
		}),
});
