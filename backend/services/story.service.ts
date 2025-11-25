import * as model from '../models/story.model';
import { type storiesTable } from '@/drizzle/schemas/stories';

export const storiesService = {
	async createStory(story: typeof storiesTable.$inferInsert) {
		const newStory = await model.storyModel.create(story);
		if (!newStory) {
			throw new Error('Story not returned by model');
		}
		return newStory;
	},
	getStory(id: string) {
		return model.storyModel.get(id);
	},
	getStoriesByUserId(userId: string) {
		return model.storyModel.getByUserId(userId);
	},
};
