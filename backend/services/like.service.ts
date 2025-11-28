import * as model from '../models/like.model';
import { type likesTable } from '@/drizzle/schemas/likes';

export const likesService = {
	async likeStory(userId: string, storyId: string) {
		// Check if already liked
		const existing = await model.likeModel.getByUserAndStory(
			userId,
			storyId,
		);
		if (existing.length > 0) {
			return existing[0]; // Already liked
		}

		const result = await model.likeModel.create({
			user_id: userId,
			story_id: storyId,
		});
		return result[0];
	},
	async unlikeStory(userId: string, storyId: string) {
		const result = await model.likeModel.delete(userId, storyId);
		if (result.length === 0) {
			throw new Error('Like not found');
		}
		return result[0];
	},
	async isLiked(userId: string, storyId: string) {
		const like = await model.likeModel.getByUserAndStory(userId, storyId);
		return like.length > 0;
	},
	async getLikesCount(storyId: string) {
		return await model.likeModel.getLikesCount(storyId);
	},
};
