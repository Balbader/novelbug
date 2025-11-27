import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { storiesService } from '@/backend/services/story.service';
import { usersService } from '@/backend/services/user.service';

export async function GET(
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

		console.log('Fetching story with ID:', id);

		// Fetch story with details
		const story = await storiesService.getStoryWithDetails(id);

		console.log('Story fetched:', story ? 'Found' : 'Not found');

		if (!story) {
			return NextResponse.json(
				{ error: 'Story not found', storyId: id },
				{ status: 404 },
			);
		}

		// Allow viewing if:
		// 1. Story belongs to the user, OR
		// 2. Story is shared (shared = 1)
		const isOwner = story.user_id === dbUser.id;
		const isShared = story.shared === 1;

		if (!isOwner && !isShared) {
			return NextResponse.json(
				{ error: 'Forbidden - Story is not shared' },
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
		console.error('Error fetching story:', error);
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

export async function PATCH(
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
		const body = await request.json();
		const { shared } = body;

		// Verify the story belongs to the user
		const story = await storiesService.getStoryWithDetails(id);
		if (!story) {
			return NextResponse.json(
				{ error: 'Story not found' },
				{ status: 404 },
			);
		}

		if (story.user_id !== dbUser.id) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
		}

		// Update the story's shared status
		const updatedStory = await storiesService.updateStory(id, {
			shared: shared ? 1 : 0,
		});

		return NextResponse.json(
			{
				success: true,
				story: {
					id: updatedStory.id,
					shared: updatedStory.shared === 1,
				},
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error('Error updating story:', error);
		return NextResponse.json(
			{
				error: 'Failed to update story. Please try again later.',
				details:
					error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
