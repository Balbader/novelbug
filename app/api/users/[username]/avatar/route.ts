import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { usersService } from '@/backend/services/user.service';

export async function PATCH(
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

		// Get user from database
		const dbUser = await usersService.getByKindeId(user.id);
		if (!dbUser) {
			return NextResponse.json(
				{ error: 'User not found in database' },
				{ status: 404 },
			);
		}

		const { username } = await params;
		const body = await request.json();

		// Get the profile user
		const profileUser = await usersService.getByUsername(username);
		if (!profileUser) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 },
			);
		}

		// Verify the user can only update their own avatar
		if (profileUser.id !== dbUser.id) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
		}

		// Validate avatar style
		const validStyles = [
			'adventurer',
			'avataaars',
			'big-smile',
			'lorelei',
			'notionists',
			'bottts',
			'micah',
			'open-peeps',
			'personas',
			'identicon',
			'initials',
			'shapes',
			'pixel-art',
			'rings',
			'thumbs',
		];
		if (body.avatar_style && !validStyles.includes(body.avatar_style)) {
			return NextResponse.json(
				{ error: 'Invalid avatar style' },
				{ status: 400 },
			);
		}

		// Update avatar style
		await usersService.update(profileUser.id, {
			avatar_style: body.avatar_style || null,
		});

		return NextResponse.json(
			{
				success: true,
				message: 'Avatar style updated successfully',
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error('Error updating avatar style:', error);
		return NextResponse.json(
			{
				error: 'Failed to update avatar style. Please try again later.',
				details:
					error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
