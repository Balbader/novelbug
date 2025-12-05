import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { usersService } from '@/backend/services/user.service';
import { likesService } from '@/backend/services/like.service';
import { getPostHogClient } from '@/lib/posthog-server';

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

		const dbUser = await usersService.getByKindeId(user.id);
		if (!dbUser) {
			return NextResponse.json(
				{ error: 'User not found in database' },
				{ status: 404 },
			);
		}

		const { id: storyId } = await params;

		await likesService.likeStory(dbUser.id, storyId);
		const likesCount = await likesService.getLikesCount(storyId);

		// Track story liked event
		const posthog = getPostHogClient();
		posthog.capture({
			distinctId: dbUser.id,
			event: 'story_liked',
			properties: {
				story_id: storyId,
				likes_count: likesCount,
			},
		});

		return NextResponse.json(
			{
				success: true,
				liked: true,
				likesCount,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error('Error liking story:', error);
		return NextResponse.json(
			{
				error: 'Failed to like story',
				details:
					error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}

export async function DELETE(
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

		const dbUser = await usersService.getByKindeId(user.id);
		if (!dbUser) {
			return NextResponse.json(
				{ error: 'User not found in database' },
				{ status: 404 },
			);
		}

		const { id: storyId } = await params;

		await likesService.unlikeStory(dbUser.id, storyId);
		const likesCount = await likesService.getLikesCount(storyId);

		// Track story unliked event
		const posthog = getPostHogClient();
		posthog.capture({
			distinctId: dbUser.id,
			event: 'story_unliked',
			properties: {
				story_id: storyId,
				likes_count: likesCount,
			},
		});

		return NextResponse.json(
			{
				success: true,
				liked: false,
				likesCount,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error('Error unliking story:', error);
		return NextResponse.json(
			{
				error: 'Failed to unlike story',
				details:
					error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}

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

		const dbUser = await usersService.getByKindeId(user.id);
		if (!dbUser) {
			return NextResponse.json(
				{ error: 'User not found in database' },
				{ status: 404 },
			);
		}

		const { id: storyId } = await params;

		const isLiked = await likesService.isLiked(dbUser.id, storyId);
		const likesCount = await likesService.getLikesCount(storyId);

		return NextResponse.json(
			{
				success: true,
				isLiked,
				likesCount,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error('Error fetching like status:', error);
		return NextResponse.json(
			{
				error: 'Failed to fetch like status',
				details:
					error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
