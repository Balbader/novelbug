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
	params: { username: string };
}) {
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
			log('User created from Kinde session', serviceUser.id);
		} catch (createErr) {
			error('Failed to create user from Kinde session', createErr);
			// If creation fails, redirect to home
			redirect('/');
		}
	}
	log('Service User', serviceUser);

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
										href={`/${user?.username}/dashboard`}
									>
										{user?.username}
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator className="hidden md:block" />
								<BreadcrumbItem>
									<BreadcrumbPage>
										{user?.username}'s Dashboard
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
