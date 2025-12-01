'use client';
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs';

import {
	BadgeCheck,
	Bell,
	ChevronsUpDown,
	CreditCard,
	LogOut,
	Sparkles,
	User,
	Settings,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar';

export function NavUser({
	user,
}: {
	user: {
		name: string;
		email: string;
		avatar?: string;
	};
}) {
	const { isMobile } = useSidebar();
	const [postLogoutRedirectUrl, setPostLogoutRedirectUrl] = useState<string>('https://www.novelbug.com/home');

	useEffect(() => {
		if (typeof window !== 'undefined') {
			// Use production URL for logout redirect
			// This ensures consistent behavior across all environments
			setPostLogoutRedirectUrl('https://www.novelbug.com/home');
		}
	}, []);

	// Generate initials from name
	const getInitials = (name: string): string => {
		const parts = name.trim().split(/\s+/);
		if (parts.length >= 2) {
			return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
		}
		return name.substring(0, 2).toUpperCase();
	};

	const initials = getInitials(user.name);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="group relative rounded-xl transition-all duration-300 hover:bg-white/60 dark:hover:bg-slate-800/30 hover:shadow-md data-[state=open]:bg-white/80 dark:data-[state=open]:bg-slate-800/40 data-[state=open]:shadow-lg"
						>
							<div className="relative flex items-center gap-3 w-full">
								<div
									className="relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shrink-0 overflow-hidden"
									style={{
										background:
											'linear-gradient(135deg, #F4E9D7 0%, #FFF5E8 100%)',
										boxShadow:
											'0 2px 8px rgba(217, 125, 85, 0.2)',
									}}
								>
									<Avatar className="h-full w-full rounded-xl border-2 border-white/50">
										{user.avatar && (
											<AvatarImage
												src={user.avatar}
												alt={user.name}
												className="object-cover"
											/>
										)}
										<AvatarFallback
											className="rounded-xl text-sm font-semibold"
											style={{
												backgroundColor: '#D97D55',
												color: 'white',
											}}
										>
											{initials}
										</AvatarFallback>
									</Avatar>
									{/* Decorative sparkle */}
									<div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight min-w-0">
									<span className="truncate font-sans font-medium text-slate-900 dark:text-slate-50 group-hover:text-[#D97D55] transition-colors duration-300">
										{user.name}
									</span>
									<span className="truncate text-xs font-sans font-light text-slate-500 dark:text-slate-500">
										{user.email}
									</span>
								</div>
								<ChevronsUpDown className="ml-auto size-4 text-slate-400 group-hover:text-[#D97D55] transition-colors duration-300" />
							</div>
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-64 rounded-xl border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 shadow-xl p-2"
						side={isMobile ? 'bottom' : 'right'}
						align="end"
						sideOffset={8}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div
								className="flex items-center gap-3 px-3 py-3 rounded-lg mb-1"
								style={{
									background:
										'linear-gradient(135deg, #F4E9D7 0%, #FFF5E8 100%)',
								}}
							>
								<div
									className="relative flex items-center justify-center w-12 h-12 rounded-xl shrink-0 overflow-hidden"
									style={{
										boxShadow:
											'0 2px 8px rgba(217, 125, 85, 0.25)',
									}}
								>
									<Avatar className="h-full w-full rounded-xl border-2 border-white/60">
										{user.avatar && (
											<AvatarImage
												src={user.avatar}
												alt={user.name}
												className="object-cover"
											/>
										)}
										<AvatarFallback
											className="rounded-xl text-base font-semibold"
											style={{
												backgroundColor: '#D97D55',
												color: 'white',
											}}
										>
											{initials}
										</AvatarFallback>
									</Avatar>
								</div>
								<div className="grid flex-1 text-left leading-tight min-w-0">
									<span className="truncate font-sans font-medium text-base text-slate-900 dark:text-slate-50">
										{user.name}
									</span>
									<span className="truncate text-xs font-sans font-light text-slate-600 dark:text-slate-400 mt-0.5">
										{user.email}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator className="my-2" />
						<DropdownMenuGroup>
							<DropdownMenuItem className="group rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#F4E9D7]/50 dark:hover:bg-slate-800/50">
								<div
									className="flex items-center justify-center w-8 h-8 rounded-lg mr-2 transition-all duration-200 group-hover:scale-110"
									style={{
										backgroundColor: '#F4E9D7',
									}}
								>
									<Sparkles
										className="size-4"
										style={{ color: '#D97D55' }}
									/>
								</div>
								<span className="font-sans font-medium text-sm text-slate-700 dark:text-slate-300 group-hover:text-[#D97D55] transition-colors duration-200">
									Upgrade to Pro
								</span>
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator className="my-2" />
						<DropdownMenuGroup>
							<DropdownMenuItem className="group rounded-lg cursor-pointer transition-all duration-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50">
								<div
									className="flex items-center justify-center w-8 h-8 rounded-lg mr-2 transition-all duration-200 group-hover:scale-110"
									style={{
										backgroundColor: '#E8F4F8',
									}}
								>
									<User
										className="size-4"
										style={{ color: '#4A90E2' }}
									/>
								</div>
								<span className="font-sans font-light text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-50 transition-colors duration-200">
									Account
								</span>
							</DropdownMenuItem>
							<DropdownMenuItem className="group rounded-lg cursor-pointer transition-all duration-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50">
								<div
									className="flex items-center justify-center w-8 h-8 rounded-lg mr-2 transition-all duration-200 group-hover:scale-110"
									style={{
										backgroundColor: '#F0E8F4',
									}}
								>
									<CreditCard
										className="size-4"
										style={{ color: '#9B7EDE' }}
									/>
								</div>
								<span className="font-sans font-light text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-50 transition-colors duration-200">
									Billing
								</span>
							</DropdownMenuItem>
							<DropdownMenuItem className="group rounded-lg cursor-pointer transition-all duration-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50">
								<div
									className="flex items-center justify-center w-8 h-8 rounded-lg mr-2 transition-all duration-200 group-hover:scale-110"
									style={{
										backgroundColor: '#F4E9D7',
									}}
								>
									<Bell
										className="size-4"
										style={{ color: '#D97D55' }}
									/>
								</div>
								<span className="font-sans font-light text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-50 transition-colors duration-200">
									Notifications
								</span>
							</DropdownMenuItem>
							<DropdownMenuItem className="group rounded-lg cursor-pointer transition-all duration-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50">
								<div
									className="flex items-center justify-center w-8 h-8 rounded-lg mr-2 transition-all duration-200 group-hover:scale-110"
									style={{
										backgroundColor: '#E8F4F8',
									}}
								>
									<Settings
										className="size-4"
										style={{ color: '#4A90E2' }}
									/>
								</div>
								<span className="font-sans font-light text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-50 transition-colors duration-200">
									Settings
								</span>
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator className="my-2" />
						<DropdownMenuItem className="group rounded-lg cursor-pointer transition-all duration-200 hover:bg-red-50/50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400">
							<LogoutLink
								postLogoutRedirectURL={postLogoutRedirectUrl}
								className="flex items-center w-full"
							>
								<div
									className="flex items-center justify-center w-8 h-8 rounded-lg mr-2 transition-all duration-200 group-hover:scale-110"
									style={{
										backgroundColor: '#FEE2E2',
									}}
								>
									<LogOut
										className="size-4"
										style={{ color: '#DC2626' }}
									/>
								</div>
								<span className="font-sans font-medium text-sm transition-colors duration-200">
									Log out
								</span>
							</LogoutLink>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
