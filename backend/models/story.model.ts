import { db } from '@/drizzle';
import { storiesTable } from '@/drizzle/schemas/stories';
import { eq } from 'drizzle-orm';

export const storyModel = {
	create: async (story: typeof storiesTable.$inferInsert) => {
		const newStory = await db.insert(storiesTable).values(story).returning();
		return newStory;
	},
	get: async (id: string) => {
		const foundStory = await db
			.select()
			.from(storiesTable)
			.where(eq(storiesTable.id, id));
		return foundStory;
	},
	getByUserId: async (userId: string) => {
		const foundStories = await db
			.select()
			.from(storiesTable)
			.where(eq(storiesTable.user_id, userId));
		return foundStories;
	},
};
