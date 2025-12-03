import { db } from '@/drizzle';
import { storiesTable } from '@/drizzle/schemas/stories';
import { storiesDataTable } from '@/drizzle/schemas/stories-data';
import { storiesOutputTable } from '@/drizzle/schemas/stories-output';
import { usersTable } from '@/drizzle/schemas/users';
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
	getByUserIdWithDetails: async (userId: string) => {
		const stories = await db
			.select()
			.from(storiesTable)
			.where(eq(storiesTable.user_id, userId));

		// Fetch related data for each story
		const storiesWithDetails = await Promise.all(
			stories.map(async (story) => {
				const [storyData] = await db
					.select()
					.from(storiesDataTable)
					.where(eq(storiesDataTable.id, story.story_data_id));

				const [storyOutput] = await db
					.select()
					.from(storiesOutputTable)
					.where(eq(storiesOutputTable.id, story.story_output_id));

				return {
					...story,
					storyData,
					storyOutput,
				};
			}),
		);

		return storiesWithDetails;
	},
	getByIdWithDetails: async (id: string) => {
		const stories = await db
			.select()
			.from(storiesTable)
			.where(eq(storiesTable.id, id));

		if (!stories || stories.length === 0) {
			return null;
		}

		const story = stories[0];

		const storyDataResults = await db
			.select()
			.from(storiesDataTable)
			.where(eq(storiesDataTable.id, story.story_data_id));

		const storyOutputResults = await db
			.select()
			.from(storiesOutputTable)
			.where(eq(storiesOutputTable.id, story.story_output_id));

		const userResults = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.id, story.user_id));

		return {
			...story,
			storyData: storyDataResults[0] || null,
			storyOutput: storyOutputResults[0] || null,
			user: userResults[0] || null,
		};
	},
	getSharedStoriesWithDetails: async () => {
		// Get all shared stories (shared = 1)
		const stories = await db
			.select()
			.from(storiesTable)
			.where(eq(storiesTable.shared, 1));

		// Fetch related data for each story including user info
		const storiesWithDetails = await Promise.all(
			stories.map(async (story) => {
				const [storyData] = await db
					.select()
					.from(storiesDataTable)
					.where(eq(storiesDataTable.id, story.story_data_id));

				const [storyOutput] = await db
					.select()
					.from(storiesOutputTable)
					.where(eq(storiesOutputTable.id, story.story_output_id));

				const [user] = await db
					.select()
					.from(usersTable)
					.where(eq(usersTable.id, story.user_id));

				return {
					...story,
					storyData,
					storyOutput,
					user,
				};
			}),
		);

		return storiesWithDetails;
	},
	update: async (
		id: string,
		storyData: Partial<typeof storiesTable.$inferInsert>,
	) => {
		const result = await db
			.update(storiesTable)
			.set({
				...storyData,
				updated_at: new Date(),
			})
			.where(eq(storiesTable.id, id))
			.returning();
		return result;
	},
	updateData: async (
		id: string,
		data: Partial<typeof storiesDataTable.$inferInsert>,
	) => {
		const result = await db
			.update(storiesDataTable)
			.set(data)
			.where(eq(storiesDataTable.id, id))
			.returning();
		return result;
	},
	updateOutput: async (
		id: string,
		output: Partial<typeof storiesOutputTable.$inferInsert>,
	) => {
		const result = await db
			.update(storiesOutputTable)
			.set(output)
			.where(eq(storiesOutputTable.id, id))
			.returning();
		return result;
	},
	delete: async (id: string) => {
		// First get the story to find related data IDs
		const stories = await db
			.select()
			.from(storiesTable)
			.where(eq(storiesTable.id, id));

		if (!stories || stories.length === 0) {
			return null;
		}

		const story = stories[0];

		// Delete story output
		await db
			.delete(storiesOutputTable)
			.where(eq(storiesOutputTable.id, story.story_output_id));

		// Delete story data
		await db
			.delete(storiesDataTable)
			.where(eq(storiesDataTable.id, story.story_data_id));

		// Delete main story record
		const result = await db
			.delete(storiesTable)
			.where(eq(storiesTable.id, id))
			.returning();

		return result[0] || null;
	},
	deleteByUserId: async (userId: string) => {
		// Get all stories for this user
		const stories = await db
			.select()
			.from(storiesTable)
			.where(eq(storiesTable.user_id, userId));

		// Delete all related story outputs and data
		for (const story of stories) {
			// Delete story output
			await db
				.delete(storiesOutputTable)
				.where(eq(storiesOutputTable.id, story.story_output_id));

			// Delete story data
			await db
				.delete(storiesDataTable)
				.where(eq(storiesDataTable.id, story.story_data_id));
		}

		// Delete all main story records
		const result = await db
			.delete(storiesTable)
			.where(eq(storiesTable.user_id, userId))
			.returning();

		return result;
	},
};
