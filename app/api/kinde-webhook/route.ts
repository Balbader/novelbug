import { NextResponse } from 'next/server';
import jwksClient from 'jwks-rsa';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { log, error, message } from '@/lib/print-helpers';
import * as service from '@/backend/services/user.service';

// The Kinde issuer URL should already be in your `.env` file
// from when you initially set up Kinde. This will fetch your
// public JSON web keys file
const client = jwksClient({
	jwksUri: `${process.env.KINDE_ISSUER_URL}/.well-known/jwks.json`,
});

export async function POST(req: Request) {
	try {
		// Get the token from the request
		const token = await req.text();

		// Decode the token
		const decoded = jwt.decode(token, { complete: true });
		if (!decoded || !decoded.header) {
			return NextResponse.json(
				{ message: 'Invalid token' },
				{ status: 400 },
			);
		}
		const { header } = decoded;
		const { kid } = header;

		// Verify the token
		const key = await client.getSigningKey(kid);
		const signingKey = key.getPublicKey();
		const event = (await jwt.verify(token, signingKey)) as JwtPayload;

		// Log the full event to understand its structure
		log('Kinde webhook event received:', JSON.stringify(event, null, 2));

		// Extract event type and data
		// Kinde webhook payload structure: { type: string, data: { user: {...} } }
		const eventType = event.type;
		const eventData = (event as any).data || {};
		const userData = eventData.user || {}; // Extract user object from data

		log('Event type:', eventType);
		log('Event data:', JSON.stringify(eventData, null, 2));

		// Helper function to map Kinde user data to our user structure
		const mapUserData = (user: any) => {
			const kindeId = user.id;
			if (!kindeId) {
				throw new Error('Kinde ID not found in webhook payload');
			}

			return {
				kinde_id: kindeId,
				username: user.username || user.email?.split('@')[0] || '',
				email: user.email || '',
				first_name: user.first_name || '',
				last_name: user.last_name || '',
				date_of_birth: user.date_of_birth
					? new Date(user.date_of_birth)
					: new Date(),
				country: user.country || 'Unknown',
				is_password_reset_requested:
					user.is_password_reset_requested || false,
				is_suspended: user.is_suspended || false,
				user_since: user.user_since
					? new Date(user.user_since)
					: new Date(),
				last_login: user.last_login
					? new Date(user.last_login)
					: new Date(),
				login_count: user.login_count || 0,
			};
		};

		// Handle various events
		switch (eventType) {
			case 'user.updated': {
				// Handle user updated event
				const userUpdateData = mapUserData(userData);

				// Find user by kinde_id first, then update
				try {
					const existingUser =
						await service.usersService.getByKindeId(
							userUpdateData.kinde_id,
						);
					const updatedUser = await service.usersService.update(
						existingUser.id,
						userUpdateData,
					);
					log('User updated successfully', updatedUser);
				} catch (err) {
					// User doesn't exist, create it
					const createdUser =
						await service.usersService.createUser(userUpdateData);
					log('User created successfully', createdUser.id);
				}
				break;
			}
			case 'user.created': {
				// Handle user created event
				const newUserData = mapUserData(userData);

				// Check if user already exists
				try {
					const existingUser =
						await service.usersService.getByKindeId(
							newUserData.kinde_id,
						);
					log(
						'User already exists, skipping creation',
						existingUser.id,
					);
				} catch (err) {
					// User doesn't exist, create it
					const createdUser =
						await service.usersService.createUser(newUserData);
					log('User created successfully', createdUser.id);
				}
				break;
			}
			default:
				log('Unhandled webhook event type:', eventType);
				break;
		}
	} catch (err) {
		if (err instanceof Error) {
			error('Error processing Kinde webhook', err.message);
			return NextResponse.json({ message: err.message }, { status: 400 });
		}
	}
	return NextResponse.json({ status: 200, statusText: 'success' });
}
