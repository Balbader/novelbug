import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { redirect } from 'next/navigation';
import { usersService } from '@/backend/services/user.service';
import { log, error } from '@/lib/print-helpers';

export default async function AuthCallbackPage() {
	const { getUser, isAuthenticated } = await getKindeServerSession();

	const user = await getUser();
	const isUserAuthenticated = await isAuthenticated();

	if (!isUserAuthenticated || !user) {
		error(
			'User is not authenticated in callback',
			isUserAuthenticated ?? false,
		);
		redirect('/');
	}

	// Try to get user from database, create if doesn't exist
	let serviceUser;
	try {
		// First try by Kinde ID (most reliable identifier)
		if (!user.id) {
			throw new Error('Kinde user ID not available');
		}
		serviceUser = await usersService.getByKindeId(user.id);
		// Increment login count and update last login timestamp
		serviceUser = await usersService.incrementLoginCount(user.id);
		log('Login count incremented in callback', serviceUser.login_count);
	} catch (err) {
		// User doesn't exist in database, create it from Kinde session
		log('User not found in database, creating from Kinde session', user.id);
		const newUserData = {
			kinde_id: user.id || '',
			username: user.username || user.email?.split('@')[0] || '',
			email: user.email || '',
			first_name: user.given_name || '',
			last_name: user.family_name || '',
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
			log('User created from Kinde session in callback', serviceUser.id);
		} catch (createErr) {
			error(
				'Failed to create user from Kinde session in callback',
				createErr,
			);
			// If creation fails, redirect to home
			redirect('/');
		}
	}

	// Redirect to the user's dashboard with their username
	log('Redirecting to dashboard', { username: serviceUser.username });
	redirect(`/${serviceUser.username}/dashboard`);
}
