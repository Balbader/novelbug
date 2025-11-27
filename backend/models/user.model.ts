import { eq } from 'drizzle-orm';
import { db as database } from '@/drizzle';
import { usersTable } from '@/drizzle/schemas/users';

export const usersModel = {
	async create(user: typeof usersTable.$inferInsert) {
		const result = await database
			.insert(usersTable)
			.values(user)
			.returning();
		return result;
	},
	async update(
		userId: string,
		userData: Partial<typeof usersTable.$inferInsert>,
	) {
		const result = await database
			.update(usersTable)
			.set({
				...userData,
				created_at: new Date(),
			})
			.where(eq(usersTable.id, userId))
			.returning();
		return result;
	},
	async getAll() {
		const users = await database.select().from(usersTable);
		return users;
	},
	updateLoginCount(kindeId: string, login_count: number) {
		return database
			.update(usersTable)
			.set({ login_count: login_count + 1 })
			.where(eq(usersTable.kinde_id, kindeId));
	},
	async getByKindeId(kindeId: string) {
		const users = await database
			.select()
			.from(usersTable)
			.where(eq(usersTable.kinde_id, kindeId));
		return users;
	},
	async getByUsername(username: string) {
		const users = await database
			.select()
			.from(usersTable)
			.where(eq(usersTable.username, username));
		return users;
	},
	async getByEmail(email: string) {
		const users = await database
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, email));
		return users;
	},
	async getById(id: string) {
		const users = await database
			.select()
			.from(usersTable)
			.where(eq(usersTable.id, id));
		return users;
	},
};
