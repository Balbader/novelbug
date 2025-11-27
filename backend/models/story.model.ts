import { db } from '@/drizzle';
import { storiesTable } from '@/drizzle/schemas/stories';
import { storiesDataTable } from '@/drizzle/schemas/stories-data';
import { storiesOutputTable } from '@/drizzle/schemas/stories-output';
import { eq } from 'drizzle-orm';

export const storyModel = {
	create: async (story: typeof storiesTable.$inferInsert) => {
		const newStory = await db
			.insert(storiesTable)
			.values(story)
			.returning();
		return newStory;
	},
	createData: async (data: typeof storiesDataTable.$inferInsert) => {
		const newData = await db
			.insert(storiesDataTable)
			.values(data)
			.returning();
		return newData;
	},
	createOutput: async (output: typeof storiesOutputTable.$inferInsert) => {
		const newOutput = await db
			.insert(storiesOutputTable)
			.values(output)
			.returning();
		return newOutput;
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
