import { db } from '@/drizzle';
import { deletedAccountsTable } from '@/drizzle/schemas/deleted-accounts';

export const deletedAccountModel = {
	create: async (
		deletedAccount: typeof deletedAccountsTable.$inferInsert,
	) => {
		const result = await db
			.insert(deletedAccountsTable)
			.values(deletedAccount)
			.returning();
		return result[0];
	},
};
