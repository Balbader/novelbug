import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { usersTable } from './users';
import { storiesDataTable } from './stories-data';
import { storiesOutputTable } from './stories-output';

export const storiesTable = sqliteTable('stories', {
	id: text('id').primaryKey(),
	user_id: text('user_id')
		.notNull()
		.references(() => usersTable.id),
	story_data_id: text('story_data_id')
		.notNull()
		.references(() => storiesDataTable.id),
	story_output_id: text('story_output_id')
		.notNull()
		.references(() => storiesOutputTable.id),
	shared: integer('shared').notNull().default(0),
	published: integer('published').notNull().default(0),
	published_at: integer('published_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => {
			return new Date();
		}),
	created_at: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => {
			return new Date();
		}),
	updated_at: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => {
			return new Date();
		}),
});
