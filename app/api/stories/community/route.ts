import { NextRequest, NextResponse } from 'next/server';
import { storiesService } from '@/backend/services/story.service';

export async function GET(request: NextRequest) {
	try {
		// Allow unauthenticated access for public community stories
		// Shared stories are meant to be publicly accessible

		// Fetch all shared stories with details
		const stories = await storiesService.getSharedStoriesWithDetails();

		// Transform the data to a more client-friendly format
		const formattedStories = stories.map((story) => ({
			id: story.id,
			title: story.storyData?.title || 'Untitled',
			age_group: story.storyData?.age_group || '',
			language: story.storyData?.language || '',
			topic: story.storyData?.topic || '',
			subtopic: story.storyData?.subtopic || '',
			style: story.storyData?.style || '',
			story_content: story.storyOutput?.story_content || '',
			created_at: story.created_at,
			updated_at: story.updated_at,
			shared: story.shared === 1,
			published: story.published === 1,
			author: {
				username: story.user?.username || 'Unknown',
				first_name: story.user?.first_name || '',
				last_name: story.user?.last_name || '',
			},
		}));

		return NextResponse.json(
			{
				success: true,
				stories: formattedStories,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error('Error fetching shared stories:', error);
		return NextResponse.json(
			{
				error: 'Failed to fetch shared stories. Please try again later.',
				details:
					error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
