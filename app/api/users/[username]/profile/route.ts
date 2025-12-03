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
		const { country, date_of_birth } = body;

		// Build update object with only provided fields
		const updateData: {
			country?: string;
			date_of_birth?: Date;
		} = {};

		if (country !== undefined) {
			if (typeof country !== 'string' || country.trim().length === 0) {
				return NextResponse.json(
					{ error: 'Country must be a non-empty string' },
					{ status: 400 },
				);
			}
			updateData.country = country.trim();
		}

		if (date_of_birth !== undefined) {
			if (typeof date_of_birth !== 'string') {
				return NextResponse.json(
					{ error: 'Date of birth must be a valid date string' },
					{ status: 400 },
				);
			}
			const date = new Date(date_of_birth);
			if (isNaN(date.getTime())) {
				return NextResponse.json(
					{ error: 'Invalid date of birth format' },
					{ status: 400 },
				);
			}
			// Validate that the date is not in the future
			if (date > new Date()) {
				return NextResponse.json(
					{ error: 'Date of birth cannot be in the future' },
					{ status: 400 },
				);
			}
			updateData.date_of_birth = date;
		}

		// Check if at least one field is provided
		if (Object.keys(updateData).length === 0) {
			return NextResponse.json(
				{
					error: 'At least one field (country or date_of_birth) must be provided',
				},
				{ status: 400 },
			);
		}

		const updatedUser = await usersService.update(dbUser.id, updateData);

		return NextResponse.json(
			{
				success: true,
				user: {
					id: updatedUser.id,
					country: updatedUser.country,
					date_of_birth: updatedUser.date_of_birth,
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
