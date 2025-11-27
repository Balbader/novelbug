import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import { usersService } from '@/backend/services/user.service';
import { log, error } from '@/lib/print-helpers';

// Helper function to generate a valid username
function generateUsername(user: any): string {
	// Try Kinde username first
	if (user.username && user.username.trim()) {
		return user.username.trim().toLowerCase();
	}

	// Try email prefix
	if (user.email) {
		const emailPrefix = user.email.split('@')[0];
		if (emailPrefix && emailPrefix.trim()) {
			return emailPrefix.trim().toLowerCase();
		}
	}

	// Fallback: use Kinde ID (first 8 chars) if nothing else works
	if (user.id) {
		return `user_${user.id.substring(0, 8)}`;
	}

	// Last resort: throw error
	throw new Error('Unable to generate username: missing email and username');
}

export default async function AuthCallbackPage() {
	try {
		const { getUser, isAuthenticated } = await getKindeServerSession();

		const user = await getUser();
		const isUserAuthenticated = await isAuthenticated();

		log('Auth callback - checking authentication', {
			hasUser: !!user,
			isAuthenticated: isUserAuthenticated,
			userId: user?.id,
		});

		if (!isUserAuthenticated || !user) {
			error('User is not authenticated in callback', {
				isAuthenticated: isUserAuthenticated,
				hasUser: !!user,
			});
			redirect('/');
			return;
		}

		if (!user.id) {
			error('Kinde user ID not available in callback', { user });
			redirect('/');
			return;
		}

		// Try to get user from database, create if doesn't exist
		let serviceUser;
		try {
			// First try by Kinde ID (most reliable identifier)
			serviceUser = await usersService.getByKindeId(user.id);
			// Increment login count and update last login timestamp
			serviceUser = await usersService.incrementLoginCount(user.id);
			log('Login count incremented in callback', {
				username: serviceUser.username,
				loginCount: serviceUser.login_count,
			});
		} catch (err: any) {
			// User doesn't exist in database, create it from Kinde session
			log('User not found in database, creating from Kinde session', {
				kindeId: user.id,
				error: err?.message,
			});

			// Generate username with validation
			let username: string;
			try {
				username = generateUsername(user);
			} catch (usernameErr: any) {
				error('Failed to generate username in callback', {
					user,
					error: usernameErr?.message,
				});
				redirect('/');
				return;
			}

			// Validate required fields
			if (!user.email) {
				error('User email is required but missing', { user });
				redirect('/');
				return;
			}

			const newUserData = {
				kinde_id: user.id,
				username,
				email: user.email,
				first_name: user.given_name || 'Unknown',
				last_name: user.family_name || 'Unknown',
				date_of_birth: new Date(),
				country: 'Unknown',
				is_password_reset_requested: false,
				is_suspended: false,
				user_since: new Date(),
				last_login: new Date(),
				login_count: 1, // First login
			};

			try {
				serviceUser = await usersService.createUser(newUserData);
				log('User created from Kinde session in callback', {
					userId: serviceUser.id,
					username: serviceUser.username,
				});
			} catch (createErr: any) {
				error('Failed to create user from Kinde session in callback', {
					error: createErr?.message,
					errorCode: createErr?.code,
					userData: newUserData,
					stack: createErr?.stack,
				});
				// If creation fails, redirect to home
				redirect('/');
				return;
			}
		}

		// Ensure serviceUser is defined before redirecting
		if (!serviceUser || !serviceUser.username) {
			error('Service user is missing or invalid after processing', {
				serviceUser,
			});
			redirect('/');
			return;
		}

		// Redirect to the user's dashboard with their username
		log('Redirecting to dashboard', { username: serviceUser.username });
		redirect(`/${serviceUser.username}/dashboard`);
	} catch (err: any) {
		// Catch-all error handler
		error('Unexpected error in auth callback', {
			error: err?.message,
			stack: err?.stack,
		});
		redirect('/');
	}
}
