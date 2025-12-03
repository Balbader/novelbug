import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const deletedAccountsTable = sqliteTable('deleted_accounts', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => {
			return crypto.randomUUID();
		}),
	username: text('username').notNull(),
	email: text('email').notNull(),
	reason: text('reason').notNull(),
	feedback: text('feedback'),
	deleted_at: integer('deleted_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => {
			return new Date();
		}),
});
