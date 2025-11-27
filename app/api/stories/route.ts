import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { storiesService } from '@/backend/services/story.service';
import { usersService } from '@/backend/services/user.service';

export async function GET(request: NextRequest) {
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

		// Fetch all stories with details
		const stories = await storiesService.getStoriesByUserIdWithDetails(
			dbUser.id,
		);

		// Transform the data to a more client-friendly format
		const formattedStories = stories.map((story) => ({
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
		}));

		return NextResponse.json(
			{
				success: true,
				stories: formattedStories,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error('Error fetching stories:', error);
		return NextResponse.json(
			{
				error: 'Failed to fetch stories. Please try again later.',
				details:
					error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
