import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import { Env } from './env';

config({ path: '.env' });

export default defineConfig({
	schema: './drizzle/schemas/**/*.ts',
	out: './drizzle/migrations',
	dialect: 'turso',
	dbCredentials: {
		url: Env.get('TURSO_DATABASE_URL')!,
		authToken: Env.get('TURSO_AUTH_TOKEN')!,
	},
});
