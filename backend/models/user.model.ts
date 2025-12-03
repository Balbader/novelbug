import { eq, sql } from 'drizzle-orm';
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
	async updateLoginCount(kindeId: string) {
		// Get current user to get current login_count
		const users = await this.getByKindeId(kindeId);
		if (users.length === 0) {
			throw new Error('User not found');
		}
		const currentUser = users[0];

		// Increment login count and update last login
		const result = await database
			.update(usersTable)
			.set({
				login_count: (currentUser.login_count || 0) + 1,
				last_login: new Date(),
			})
			.where(eq(usersTable.kinde_id, kindeId))
			.returning();
		return result;
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
	async delete(userId: string) {
		const result = await database
			.delete(usersTable)
			.where(eq(usersTable.id, userId))
			.returning();
		return result;
	},
};
