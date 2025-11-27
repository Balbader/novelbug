'use client';

import * as React from 'react';
import Image from 'next/image';
import { BookOpen, Sparkles, LifeBuoy, Send, User } from 'lucide-react';
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
		<Sidebar
			variant="inset"
			{...props}
			className="[&_[data-sidebar='sidebar']]:!bg-gradient-to-b [&_[data-sidebar='sidebar']]:!from-[#F9F7F4] [&_[data-sidebar='sidebar']]:!via-[#FBF9F6] [&_[data-sidebar='sidebar']]:!to-[#F9F7F4] [&_[data-sidebar='sidebar']]:dark:!from-[#F9F7F4] [&_[data-sidebar='sidebar']]:dark:!via-[#FBF9F6] [&_[data-sidebar='sidebar']]:dark:!to-[#F9F7F4] [&_[data-sidebar='sidebar']]:border-r [&_[data-sidebar='sidebar']]:border-slate-200/40 [&_[data-sidebar='sidebar']]:dark:border-slate-800/40"
			style={
				{
					'--sidebar': '#F9F7F4',
				} as React.CSSProperties
			}
		>
			<SidebarHeader className="px-4 sm:px-6 pt-6 pb-4 border-b border-slate-200/30 dark:border-slate-800/30">
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							size="lg"
							asChild
							className="hover:bg-transparent"
						>
							<Link
								href={
									user?.username
										? `/${user.username}/dashboard`
										: '#'
								}
								className="flex items-center gap-3 sm:gap-4 group p-2 -m-2 rounded-xl transition-all duration-300 hover:bg-white/50 dark:hover:bg-slate-800/20"
							>
								<div
									className="relative flex aspect-square size-12 sm:size-14 items-center justify-center rounded-2xl overflow-hidden shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
									style={{
										background:
											'linear-gradient(135deg, #F4E9D7 0%, #FFF5E8 100%)',
										boxShadow:
											'0 4px 12px rgba(217, 125, 85, 0.15)',
									}}
								>
									<Image
										src="/novelbug_bounce.gif"
										alt="NovelBug Logo"
										width={48}
										height={48}
										className="w-full h-full object-contain drop-shadow-md transition-transform duration-300"
										style={{
											mixBlendMode: 'multiply',
										}}
										unoptimized
									/>
									{/* Decorative sparkle effect */}
									<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
										<div className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
										<div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-amber-300 rounded-full animate-pulse delay-150" />
									</div>
								</div>
								<div className="grid flex-1 text-left leading-tight min-w-0">
									<span className="text-xl sm:text-2xl md:text-3xl font-serif font-light text-slate-900 dark:text-slate-50 tracking-tight truncate bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-50 dark:via-slate-100 dark:to-slate-50 bg-clip-text text-transparent group-hover:from-[#D97D55] group-hover:via-[#C86A45] group-hover:to-[#D97D55] transition-all duration-300">
										NovelBug
									</span>
									<span className="text-xs sm:text-sm text-slate-500 dark:text-slate-500 font-sans font-light mt-0.5">
										Story Creator
									</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent className="px-3 sm:px-4 pt-6">
				<NavMain items={navMain} />
				<NavSecondary
					items={navSecondary}
					className="mt-auto pt-6 border-t border-slate-200/30 dark:border-slate-800/30"
				/>
			</SidebarContent>
			<SidebarFooter className="px-3 sm:px-4 pb-4 border-t border-slate-200/30 dark:border-slate-800/30">
				{user && <NavUser user={user} />}
			</SidebarFooter>
		</Sidebar>
	);
}
