import { integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import { usersTable } from './users';

export const followsTable = sqliteTable(
	'follows',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => {
				return crypto.randomUUID();
			}),
		follower_id: text('follower_id')
			.notNull()
			.references(() => usersTable.id, { onDelete: 'cascade' }),
		following_id: text('following_id')
			.notNull()
			.references(() => usersTable.id, { onDelete: 'cascade' }),
		created_at: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => {
				return new Date();
			}),
	},
	(table) => ({
		followerFollowingUnique: unique('follows_follower_following_unique').on(
			table.follower_id,
			table.following_id,
		),
	}),
);
