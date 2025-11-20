import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('users', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => {
			return crypto.randomUUID();
		}),
	username: text('username', { length: 255 }).notNull().unique(),
	first_name: text('first_name', { length: 255 }).notNull(),
	last_name: text('last_name', { length: 255 }).notNull(),
	date_of_birth: integer('date_of_birth', { mode: 'timestamp' }).notNull(),
	email: text('email', { length: 255 }).notNull().unique(),
	country: text('country', { length: 255 }).notNull(),
	login_count: integer('login_count').notNull().default(0),
	created_at: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => {
			return new Date();
		}),
});
