import { NextRequest, NextResponse } from 'next/server';
import { storiesService } from '@/backend/services/story.service';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;

		console.log('Fetching public story with ID:', id);

		// Fetch story with details
		const story = await storiesService.getStoryWithDetails(id);

		console.log('Story fetched:', story ? 'Found' : 'Not found');

		if (!story) {
			return NextResponse.json(
				{ error: 'Story not found', storyId: id },
				{ status: 404 },
			);
		}

		// Only allow access to shared stories for public endpoint
		if (story.shared !== 1) {
			return NextResponse.json(
				{ error: 'Story is not publicly shared' },
				{ status: 403 },
			);
		}

		// Transform the data to a more client-friendly format
		const formattedStory = {
			id: story.id,
			title: story.storyData?.title || 'Untitled',
			age_group: story.storyData?.age_group || '',
			language: story.storyData?.language || '',
			topic: story.storyData?.topic || '',
			subtopic: story.storyData?.subtopic || '',
			style: story.storyData?.style || '',
			first_name: story.storyData?.first_name || '',
			gender: story.storyData?.gender || '',
			story_content: story.storyOutput?.story_content || '',
			created_at: story.created_at,
			updated_at: story.updated_at,
			shared: story.shared === 1,
			published: story.published === 1,
			author: story.user
				? {
						username: story.user.username || 'Unknown',
						first_name: story.user.first_name || '',
						last_name: story.user.last_name || '',
					}
				: undefined,
		};

		return NextResponse.json(
			{
				success: true,
				story: formattedStory,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error('Error fetching public story:', error);
		return NextResponse.json(
			{
				error: 'Failed to fetch story. Please try again later.',
				details:
					error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
