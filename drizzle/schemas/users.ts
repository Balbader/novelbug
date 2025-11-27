import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('users', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => {
			return crypto.randomUUID();
		}),
	kinde_id: text('kinde_id', { length: 255 }).notNull().unique(),
	username: text('username', { length: 255 }).notNull().unique(),
	first_name: text('first_name', { length: 255 }).notNull(),
	last_name: text('last_name', { length: 255 }).notNull(),
	date_of_birth: integer('date_of_birth', { mode: 'timestamp' }).notNull(),
	email: text('email', { length: 255 }).notNull().unique(),
	country: text('country', { length: 255 }).notNull(),
	is_password_reset_requested: integer('is_password_reset_requested', {
		mode: 'boolean',
	})
		.notNull()
		.default(false),
	is_suspended: integer('is_suspended', { mode: 'boolean' })
		.notNull()
		.default(false),
	user_since: integer('user_since', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => {
			return new Date();
		}),
	last_login: integer('last_login', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => {
			return new Date();
		}),
	login_count: integer('login_count').notNull().default(0),
	created_at: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => {
			return new Date();
		}),
});
