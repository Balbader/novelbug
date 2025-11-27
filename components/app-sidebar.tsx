'use client';

import * as React from 'react';
import {
	BookOpen,
	Sparkles,
	Command,
	LifeBuoy,
	Send,
	User,
} from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { log } from '@/lib/print-helpers';

const navSecondary = [
	{
		title: 'Support',
		url: '#',
		icon: LifeBuoy,
	},
	{
		title: 'Feedback',
		url: '#',
		icon: Send,
	},
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	user?: {
		name: string;
		email: string;
		avatar?: string;
		username: string;
	};
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
	log('User data in sidebar', user);

	// Generate navigation items with username
	const navMain = [
		{
			title: 'Generate Story',
			url: user?.username ? `/${user.username}/dashboard/generate` : '#',
			icon: Sparkles,
		},
		{
			title: 'My Stories',
			icon: BookOpen,
			url: '#',
		},
		{
			title: 'My Profile',
			icon: User,
			url: '#',
		},
	];

	return (
		<Sidebar variant="inset" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<Link
								href={
									user?.username
										? `/${user.username}/dashboard`
										: '#'
								}
								className="flex items-center gap-2"
							>
								<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
									<Command className="size-4" />
								</div>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">
										NovelBug
									</span>
									<span className="truncate text-xs">
										Dashboard
									</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navMain} />
				<NavSecondary items={navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
		</Sidebar>
	);
}
