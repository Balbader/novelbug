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

		const dbUser = await usersService.getByKindeId(user.id);
		if (!dbUser) {
			return NextResponse.json(
				{ error: 'User not found in database' },
				{ status: 404 },
			);
		}

		const { username: paramUsername } = await params;
		if (paramUsername !== dbUser.username) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
		}

		const body = await request.json();
		const { country } = body;

		if (country === undefined) {
			return NextResponse.json(
				{ error: 'Country is required' },
				{ status: 400 },
			);
		}

		if (typeof country !== 'string' || country.trim().length === 0) {
			return NextResponse.json(
				{ error: 'Country must be a non-empty string' },
				{ status: 400 },
			);
		}

		const updatedUser = await usersService.update(dbUser.id, {
			country: country.trim(),
		});

		return NextResponse.json(
			{
				success: true,
				user: {
					id: updatedUser.id,
					country: updatedUser.country,
				},
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error('Error updating user profile:', error);
		return NextResponse.json(
			{
				error: 'Failed to update profile. Please try again later.',
				details:
					error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
