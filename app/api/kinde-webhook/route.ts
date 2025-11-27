import { NextResponse } from 'next/server';
import jwksClient from 'jwks-rsa';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { log, error, message } from '@/lib/print-helpers';

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
		const event = await jwt.verify(token, signingKey);

		// Handle various events
		switch ((event as JwtPayload).type) {
			case 'user.updated':
				// handle user updated event
				// e.g update database with event.data
				log('User updated', (event as JwtPayload).data);
				break;
			case 'user.created':
				// handle user created event
				// e.g add user to database with event.data
				log('User created', (event as JwtPayload).data);
				break;
			default:
				// other events that we don't handle
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
