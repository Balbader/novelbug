import * as model from '../models/story.model';
import { type storiesTable } from '@/drizzle/schemas/stories';
import { type storiesDataTable } from '@/drizzle/schemas/stories-data';
import { type storiesOutputTable } from '@/drizzle/schemas/stories-output';
import { randomUUID } from 'crypto';

interface CreateStoryParams {
	userId: string;
	title: string;
	age_group: string;
	language: string;
	topic: string;
	subtopic: string;
	style: string;
	storyContent: string;
	first_name?: string;
	gender?: string;
}

export const storiesService = {
	async createStory(story: typeof storiesTable.$inferInsert) {
		const newStory = await model.storyModel.create(story);
		if (!newStory) {
			throw new Error('Story not returned by model');
		}
		return newStory;
	},
	async createCompleteStory(params: CreateStoryParams) {
		// Create story data record
		const storyData: typeof storiesDataTable.$inferInsert = {
			id: randomUUID(),
			user_id: params.userId,
			title: params.title,
			age_group: params.age_group,
			language: params.language,
			topic: params.topic,
			subtopic: params.subtopic,
			style: params.style,
			first_name: params.first_name,
			gender: params.gender,
		};

		const [newData] = await model.storyModel.createData(storyData);
		if (!newData) {
			throw new Error('Story data not returned by model');
		}

		// Create story output record
		const storyOutput: typeof storiesOutputTable.$inferInsert = {
			id: randomUUID(),
			story_data_id: newData.id,
			story_content: params.storyContent,
		};

		const [newOutput] = await model.storyModel.createOutput(storyOutput);
		if (!newOutput) {
			throw new Error('Story output not returned by model');
		}

		// Create main story record
		const story: typeof storiesTable.$inferInsert = {
			id: randomUUID(),
			user_id: params.userId,
			story_data_id: newData.id,
			story_output_id: newOutput.id,
			shared: 0,
			published: 0,
			published_at: new Date(),
			created_at: new Date(),
			updated_at: new Date(),
		};

		const [newStory] = await model.storyModel.create(story);
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
	getStoriesByUserIdWithDetails(userId: string) {
		return model.storyModel.getByUserIdWithDetails(userId);
	},
	getStoryWithDetails(id: string) {
		return model.storyModel.getByIdWithDetails(id);
	},
	getSharedStoriesWithDetails() {
		return model.storyModel.getSharedStoriesWithDetails();
	},
	async updateStory(
		id: string,
		storyData: Partial<typeof storiesTable.$inferInsert>,
	) {
		const result = await model.storyModel.update(id, storyData);
		if (!result || result.length === 0) {
			throw new Error('Story not found or update failed');
		}
		return result[0];
	},
	async updateStoryData(
		dataId: string,
		data: Partial<typeof storiesDataTable.$inferInsert>,
	) {
		const result = await model.storyModel.updateData(dataId, data);
		if (!result || result.length === 0) {
			throw new Error('Story data not found or update failed');
		}
		return result[0];
	},
	async updateStoryOutput(
		outputId: string,
		output: Partial<typeof storiesOutputTable.$inferInsert>,
	) {
		const result = await model.storyModel.updateOutput(outputId, output);
		if (!result || result.length === 0) {
			throw new Error('Story output not found or update failed');
		}
		return result[0];
	},
	async deleteStory(id: string) {
		const deletedStory = await model.storyModel.delete(id);
		if (!deletedStory) {
			throw new Error('Story not found or delete failed');
		}
		return deletedStory;
	},
};
