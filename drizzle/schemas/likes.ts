import { integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import { usersTable } from './users';
import { storiesTable } from './stories';

export const likesTable = sqliteTable(
	'likes',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => {
				return crypto.randomUUID();
			}),
		user_id: text('user_id')
			.notNull()
			.references(() => usersTable.id, { onDelete: 'cascade' }),
		story_id: text('story_id')
			.notNull()
			.references(() => storiesTable.id, { onDelete: 'cascade' }),
		created_at: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => {
				return new Date();
			}),
	},
	(table) => ({
		userStoryUnique: unique('likes_user_story_unique').on(
			table.user_id,
			table.story_id,
		),
	}),
);
