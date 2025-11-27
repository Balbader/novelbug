import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { storiesService } from '@/backend/services/story.service';
import { usersService } from '@/backend/services/user.service';

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { getUser, isAuthenticated } = await getKindeServerSession();
		const user = await getUser();
		const isUserAuthenticated = await isAuthenticated();

		if (!isUserAuthenticated || !user) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 },
			);
		}

		// Get user from database
		const dbUser = await usersService.getByKindeId(user.id);
		if (!dbUser) {
			return NextResponse.json(
				{ error: 'User not found in database' },
				{ status: 404 },
			);
		}

		const { id } = await params;

		// Fetch the story to copy
		const originalStory = await storiesService.getStoryWithDetails(id);
		if (!originalStory) {
			return NextResponse.json(
				{ error: 'Story not found' },
				{ status: 404 },
			);
		}

		// Check if story is shared (can only save shared stories)
		if (originalStory.shared !== 1) {
			return NextResponse.json(
				{ error: 'Story is not shared and cannot be saved' },
				{ status: 403 },
			);
		}

		// Check if user already has this story saved
		const userStories = await storiesService.getStoriesByUserIdWithDetails(
			dbUser.id,
		);
		const alreadySaved = userStories.some(
			(story) =>
				story.storyData?.title === originalStory.storyData?.title &&
				story.storyOutput?.story_content ===
					originalStory.storyOutput?.story_content,
		);

		if (alreadySaved) {
			return NextResponse.json(
				{ error: 'Story already saved to your collection' },
				{ status: 409 },
			);
		}

		// Create a copy of the story for the current user
		const savedStory = await storiesService.createCompleteStory({
			userId: dbUser.id,
			title: originalStory.storyData?.title || 'Untitled',
			age_group: originalStory.storyData?.age_group || '',
			language: originalStory.storyData?.language || '',
			topic: originalStory.storyData?.topic || '',
			subtopic: originalStory.storyData?.subtopic || '',
			style: originalStory.storyData?.style || '',
			storyContent: originalStory.storyOutput?.story_content || '',
		});

		return NextResponse.json(
			{
				success: true,
				story: savedStory,
				message: 'Story saved to your collection',
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error('Error saving story:', error);
		return NextResponse.json(
			{
				error: 'Failed to save story. Please try again later.',
				details:
					error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
