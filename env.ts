import { z } from 'zod';

const envSchema = z.object({
	ANTHROPIC_API_KEY: z.string(),
	TURSO_DATABASE_URL: z.string(),
	TURSO_AUTH_TOKEN: z.string(),
	RESEND_API_KEY: z.string().optional(), // Optional for contact form emails
});

const publicEnv: Record<string, string> = {
	ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY!,
	TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL!,
	TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN!,
	RESEND_API_KEY: process.env.RESEND_API_KEY || '',
};

export type EnvType = z.infer<typeof envSchema>;

export const Env = {
	initialize() {
		const checkEnv = envSchema.safeParse(process.env);
		if (!checkEnv.success) {
			console.error('❌ Invalid environment variables:');
			for (const error of checkEnv.error.issues) {
				console.error(
					`Missing environment variable: ${String(error.path[0])}`,
				);
			}
			throw new Error(
				'Invalid environment variables. Check the logs above for details.',
			);
		}
	},

	get(key: keyof EnvType): string | undefined {
		if (key.startsWith('NEXT_PUBLIC_')) {
			return publicEnv[key];
		}
		const value = process.env[key];
		// RESEND_API_KEY, TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, and ANTHROPIC_API_KEY are optional, so return undefined if not set
		if (
			key === 'RESEND_API_KEY' ||
			key === 'TURSO_DATABASE_URL' ||
			key === 'TURSO_AUTH_TOKEN' ||
			key === 'ANTHROPIC_API_KEY'
		) {
			return value;
		}
		if (!value) {
			throw new Error(`Environment variable ${String(key)} is not set`);
		}
		return value;
	},
};
