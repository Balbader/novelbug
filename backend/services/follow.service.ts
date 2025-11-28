import * as model from '../models/follow.model';
import { type followsTable } from '@/drizzle/schemas/follows';

export const followsService = {
	async followUser(followerId: string, followingId: string) {
		// Check if already following
		const existing = await model.followModel.getByFollowerAndFollowing(
			followerId,
			followingId,
		);
		if (existing.length > 0) {
			return existing[0]; // Already following
		}

		// Prevent self-follow
		if (followerId === followingId) {
			throw new Error('Cannot follow yourself');
		}

		const result = await model.followModel.create({
			follower_id: followerId,
			following_id: followingId,
		});
		return result[0];
	},
	async unfollowUser(followerId: string, followingId: string) {
		const result = await model.followModel.delete(followerId, followingId);
		if (result.length === 0) {
			throw new Error('Follow relationship not found');
		}
		return result[0];
	},
	async isFollowing(followerId: string, followingId: string) {
		const follow = await model.followModel.getByFollowerAndFollowing(
			followerId,
			followingId,
		);
		return follow.length > 0;
	},
	async getFollowersCount(userId: string) {
		return await model.followModel.getFollowersCount(userId);
	},
	async getFollowingCount(userId: string) {
		return await model.followModel.getFollowingCount(userId);
	},
};
