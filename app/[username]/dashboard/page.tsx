import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { AppSidebar } from '@/components/app-sidebar';
import { redirect } from 'next/navigation';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar';
import { message, log, error } from '@/lib/print-helpers';
import { usersService } from '@/backend/services/user.service';

export default async function Page({
	params,
}: {
	params: Promise<{ username: string }>;
}) {
	const { username } = await params;
	const { getUser, isAuthenticated } = await getKindeServerSession();
	const user = await getUser();
	log('User', user);

	const isUserAuthenticated = await isAuthenticated();

	log('Is user authenticated', isUserAuthenticated);

	if (!isUserAuthenticated || !user) {
		error('User is not authenticated', isUserAuthenticated ?? false);
		redirect('/');
	}
	message('User is authenticated');

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
		log('Login count incremented', serviceUser.login_count);
	} catch (err: any) {
		// User doesn't exist in database, create it from Kinde session
		log('User not found in database, creating from Kinde session', {
			kindeId: user.id,
			error: err?.message,
		});

		// Generate username with validation
		let generatedUsername: string;
		if (user.username && user.username.trim()) {
			generatedUsername = user.username.trim().toLowerCase();
		} else if (user.email) {
			const emailPrefix = user.email.split('@')[0];
			generatedUsername = emailPrefix?.trim().toLowerCase() || '';
		} else if (user.id) {
			generatedUsername = `user_${user.id.substring(0, 8)}`;
		} else {
			error('Unable to generate username: missing email and username', {
				user,
			});
			redirect('/');
			return;
		}

		if (!generatedUsername) {
			error('Generated username is empty', { user });
			redirect('/');
			return;
		}

		if (!user.email) {
			error('User email is required but missing', { user });
			redirect('/');
			return;
		}

		const newUserData = {
			kinde_id: user.id,
			username: generatedUsername,
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
			log('User created from Kinde session', {
				userId: serviceUser.id,
				username: serviceUser.username,
			});
		} catch (createErr: any) {
			error('Failed to create user from Kinde session', {
				error: createErr?.message,
				errorCode: createErr?.code,
				userData: newUserData,
			});
			// If creation fails, redirect to home
			redirect('/');
			return;
		}
	}
	log('Service User', serviceUser);

	// Ensure serviceUser is defined
	if (!serviceUser || !serviceUser.username) {
		error('Service user is missing or invalid after processing', {
			serviceUser,
		});
		redirect('/');
		return;
	}

	// Verify the username in the URL matches the logged-in user
	// If not, redirect to the correct username path
	if (username !== serviceUser.username) {
		log('Username mismatch, redirecting to correct path', {
			urlUsername: username,
			dbUsername: serviceUser.username,
		});
		redirect(`/${serviceUser.username}/dashboard`);
		return;
	}

	// Use the database username for display (more reliable than Kinde username)
	const displayUsername = serviceUser.username;

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem className="hidden md:block">
									<BreadcrumbLink
										href={`/${displayUsername}/dashboard`}
									>
										{displayUsername}
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator className="hidden md:block" />
								<BreadcrumbItem>
									<BreadcrumbPage>
										{displayUsername}'s Dashboard
									</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
					<div className="grid auto-rows-min gap-4 md:grid-cols-3">
						<div className="bg-muted/50 aspect-video rounded-xl" />
						<div className="bg-muted/50 aspect-video rounded-xl" />
						<div className="bg-muted/50 aspect-video rounded-xl" />
					</div>
					<div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
