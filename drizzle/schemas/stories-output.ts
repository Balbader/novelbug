import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { storiesDataTable } from './stories-data';
import { integer } from 'drizzle-orm/sqlite-core';

export const storiesOutputTable = sqliteTable('stories_output', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => {
			return crypto.randomUUID();
		}),
	story_data_id: text('story_data_id')
		.notNull()
		.references(() => storiesDataTable.id),
	story_content: text('story_content').notNull(),
	created_at: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => {
			return new Date();
		}),
});
