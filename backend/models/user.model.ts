import { eq } from 'drizzle-orm';
import { db as database } from '@/drizzle';
import { usersTable } from '@/drizzle/schemas/users';

export const usersModel = {
	create(user: typeof usersTable.$inferInsert) {
		return database.insert(usersTable).values(user);
	},
	update(userId: string, userData: Partial<typeof usersTable.$inferInsert>) {
		return database
			.update(usersTable)
			.set({
				...userData,
				created_at: new Date(),
			})
			.where(eq(usersTable.id, userId));
	},
	getAll() {
		return database.select().from(usersTable);
	},
	updateLoginCount(kindeId: string, login_count: number) {
		return database
			.update(usersTable)
			.set({ login_count: login_count + 1 })
			.where(eq(usersTable.kinde_id, kindeId));
	},
	getByKindeId(kindeId: string) {
		return database
			.select()
			.from(usersTable)
			.where(eq(usersTable.kinde_id, kindeId));
	},
	getByUsername(username: string) {
		return database
			.select()
			.from(usersTable)
			.where(eq(usersTable.username, username));
	},
	getByEmail(email: string) {
		return database
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, email));
	},
	getById(id: string) {
		return database.select().from(usersTable).where(eq(usersTable.id, id));
	},
};
