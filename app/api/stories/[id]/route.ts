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

		// Handle shared status update (backward compatibility)
		if (body.shared !== undefined) {
			const updatedStory = await storiesService.updateStory(id, {
				shared: body.shared ? 1 : 0,
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
		}

		// Handle full story update
		const {
			title,
			age_group,
			language,
			topic,
			subtopic,
			style,
			first_name,
			gender,
			story_content,
			shared,
		} = body;

		// Update story data if provided
		if (
			title ||
			age_group ||
			language ||
			topic ||
			subtopic ||
			style !== undefined ||
			first_name !== undefined ||
			gender !== undefined
		) {
			const updateData: any = {};
			if (title !== undefined) updateData.title = title;
			if (age_group !== undefined) updateData.age_group = age_group;
			if (language !== undefined) updateData.language = language;
			if (topic !== undefined) updateData.topic = topic;
			if (subtopic !== undefined) updateData.subtopic = subtopic;
			if (style !== undefined) updateData.style = style;
			if (first_name !== undefined) updateData.first_name = first_name;
			if (gender !== undefined) updateData.gender = gender;

			await storiesService.updateStoryData(
				story.story_data_id,
				updateData,
			);
		}

		// Update story output if provided
		if (story_content !== undefined) {
			await storiesService.updateStoryOutput(story.story_output_id, {
				story_content,
			});
		}

		// Update story shared status if provided
		if (shared !== undefined) {
			await storiesService.updateStory(id, {
				shared: shared ? 1 : 0,
			});
		}

		// Fetch updated story
		const updatedStory = await storiesService.getStoryWithDetails(id);

		// Transform the data to a more client-friendly format
		const formattedStory = {
			id: updatedStory!.id,
			title: updatedStory!.storyData?.title || 'Untitled',
			age_group: updatedStory!.storyData?.age_group || '',
			language: updatedStory!.storyData?.language || '',
			topic: updatedStory!.storyData?.topic || '',
			subtopic: updatedStory!.storyData?.subtopic || '',
			style: updatedStory!.storyData?.style || '',
			first_name: updatedStory!.storyData?.first_name || '',
			gender: updatedStory!.storyData?.gender || '',
			story_content: updatedStory!.storyOutput?.story_content || '',
			created_at: updatedStory!.created_at,
			updated_at: updatedStory!.updated_at,
			shared: updatedStory!.shared === 1,
			published: updatedStory!.published === 1,
		};

		return NextResponse.json(
			{
				success: true,
				story: formattedStory,
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
