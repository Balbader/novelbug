import { db } from '@/drizzle';
import { likesTable } from '@/drizzle/schemas/likes';
import { and, eq } from 'drizzle-orm';

export const likeModel = {
	create: async (like: typeof likesTable.$inferInsert) => {
		const newLike = await db.insert(likesTable).values(like).returning();
		return newLike;
	},
	delete: async (userId: string, storyId: string) => {
		const deletedLike = await db
			.delete(likesTable)
			.where(
				and(
					eq(likesTable.user_id, userId),
					eq(likesTable.story_id, storyId),
				),
			)
			.returning();
		return deletedLike;
	},
	getByUserAndStory: async (userId: string, storyId: string) => {
		const like = await db
			.select()
			.from(likesTable)
			.where(
				and(
					eq(likesTable.user_id, userId),
					eq(likesTable.story_id, storyId),
				),
			);
		return like;
	},
	getLikesCount: async (storyId: string) => {
		const likes = await db
			.select()
			.from(likesTable)
			.where(eq(likesTable.story_id, storyId));
		return likes.length;
	},
};
