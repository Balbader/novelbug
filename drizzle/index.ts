import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';
import { Env } from '../env';

// Only load dotenv and initialize on the server side
const isServer = typeof window === 'undefined';

if (isServer) {
	config({ path: '.env' });
	Env.initialize();
}

// Only create database connection on the server side
let dbInstance: ReturnType<typeof drizzle> | null = null;

function getDb() {
	if (!isServer) {
		throw new Error(
			'Database access is only available on the server side. Use API routes instead.',
		);
	}

	if (!dbInstance) {
		// Double-check env is initialized (should already be done above)
		if (!process.env.TURSO_DATABASE_URL) {
			Env.initialize();
		}
		const url = Env.get('TURSO_DATABASE_URL');
		const authToken = Env.get('TURSO_AUTH_TOKEN');

		if (!url || !authToken) {
			throw new Error(
				'TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set',
			);
		}

		dbInstance = drizzle({
			connection: {
				url,
				authToken,
			},
		});
	}

	return dbInstance;
}

// Use a Proxy to lazily initialize the database only when accessed
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
	get(_target, prop) {
		return getDb()[prop as keyof ReturnType<typeof drizzle>];
	},
});
