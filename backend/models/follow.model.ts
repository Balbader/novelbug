import { db } from '@/drizzle';
import { followsTable } from '@/drizzle/schemas/follows';
import { and, eq } from 'drizzle-orm';

export const followModel = {
	create: async (follow: typeof followsTable.$inferInsert) => {
		const newFollow = await db
			.insert(followsTable)
			.values(follow)
			.returning();
		return newFollow;
	},
	delete: async (followerId: string, followingId: string) => {
		const deletedFollow = await db
			.delete(followsTable)
			.where(
				and(
					eq(followsTable.follower_id, followerId),
					eq(followsTable.following_id, followingId),
				),
			)
			.returning();
		return deletedFollow;
	},
	getByFollowerAndFollowing: async (
		followerId: string,
		followingId: string,
	) => {
		const follow = await db
			.select()
			.from(followsTable)
			.where(
				and(
					eq(followsTable.follower_id, followerId),
					eq(followsTable.following_id, followingId),
				),
			);
		return follow;
	},
	getFollowersCount: async (userId: string) => {
		const followers = await db
			.select()
			.from(followsTable)
			.where(eq(followsTable.following_id, userId));
		return followers.length;
	},
	getFollowingCount: async (userId: string) => {
		const following = await db
			.select()
			.from(followsTable)
			.where(eq(followsTable.follower_id, userId));
		return following.length;
	},
	getFollowers: async (userId: string) => {
		const followers = await db
			.select()
			.from(followsTable)
			.where(eq(followsTable.following_id, userId));
		return followers;
	},
	getFollowing: async (userId: string) => {
		const following = await db
			.select()
			.from(followsTable)
			.where(eq(followsTable.follower_id, userId));
		return following;
	},
};
