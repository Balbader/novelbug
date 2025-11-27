import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { storiesService } from '@/backend/services/story.service';
import { usersService } from '@/backend/services/user.service';

interface SaveStoryRequest {
	title: string;
	age_group: string;
	language: string;
	topic: string;
	subtopic: string;
	style: string;
	story: string;
}

export async function POST(request: NextRequest) {
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
		const dbUsers = await usersService.getByKindeId(user.id);
		if (!dbUsers) {
			return NextResponse.json(
				{ error: 'User not found in database' },
				{ status: 404 },
			);
		}

		const body: SaveStoryRequest = await request.json();
		const { title, age_group, language, topic, subtopic, style, story } =
			body;

		// Validate required fields
		if (
			!title ||
			!age_group ||
			!language ||
			!topic ||
			!subtopic ||
			!style ||
			!story
		) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 },
			);
		}

		// Create complete story record
		const newStory = await storiesService.createCompleteStory({
			userId: dbUsers.id,
			title,
			age_group,
			language,
			topic,
			subtopic,
			style,
			storyContent: story,
		});

		return NextResponse.json(
			{
				success: true,
				story: newStory,
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
