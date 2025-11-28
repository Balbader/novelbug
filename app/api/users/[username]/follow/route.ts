import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { usersService } from '@/backend/services/user.service';
import { followsService } from '@/backend/services/follow.service';

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ username: string }> },
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

		const { username: paramUsername } = await params;
		const profileUser = await usersService.getByUsername(paramUsername);
		if (!profileUser) {
			return NextResponse.json(
				{ error: 'Profile user not found' },
				{ status: 404 },
			);
		}

		// Prevent self-follow
		if (dbUser.id === profileUser.id) {
			return NextResponse.json(
				{ error: 'Cannot follow yourself' },
				{ status: 400 },
			);
		}

		await followsService.followUser(dbUser.id, profileUser.id);

		return NextResponse.json(
			{
				success: true,
				message: 'Successfully followed user',
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error('Error following user:', error);
		return NextResponse.json(
			{
				error: 'Failed to follow user. Please try again later.',
				details:
					error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ username: string }> },
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

		const { username: paramUsername } = await params;
		const profileUser = await usersService.getByUsername(paramUsername);
		if (!profileUser) {
			return NextResponse.json(
				{ error: 'Profile user not found' },
				{ status: 404 },
			);
		}

		await followsService.unfollowUser(dbUser.id, profileUser.id);

		return NextResponse.json(
			{
				success: true,
				message: 'Successfully unfollowed user',
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error('Error unfollowing user:', error);
		return NextResponse.json(
			{
				error: 'Failed to unfollow user. Please try again later.',
				details:
					error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ username: string }> },
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

		const { username: paramUsername } = await params;
		const profileUser = await usersService.getByUsername(paramUsername);
		if (!profileUser) {
			return NextResponse.json(
				{ error: 'Profile user not found' },
				{ status: 404 },
			);
		}

		const isFollowing = await followsService.isFollowing(
			dbUser.id,
			profileUser.id,
		);
		const followersCount = await followsService.getFollowersCount(
			profileUser.id,
		);
		const followingCount = await followsService.getFollowingCount(
			profileUser.id,
		);

		return NextResponse.json(
			{
				success: true,
				isFollowing,
				followersCount,
				followingCount,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error('Error checking follow status:', error);
		return NextResponse.json(
			{
				error: 'Failed to check follow status. Please try again later.',
				details:
					error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
