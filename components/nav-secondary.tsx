'use client';

import * as React from 'react';
import Link from 'next/link';
import { type LucideIcon } from 'lucide-react';

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';

export function NavSecondary({
	items,
	...props
}: {
	items: {
		title: string;
		url: string;
		icon: LucideIcon;
	}[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
	return (
		<SidebarGroup {...props}>
			<SidebarGroupLabel className="text-xs font-sans font-light text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-3 px-2">
				Help & Support
			</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu className="space-y-1.5">
					{items.map((item, index) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton
								asChild
								size="sm"
								className="group rounded-xl transition-all duration-300 hover:bg-white/50 dark:hover:bg-slate-800/30 hover:shadow-sm"
							>
								<Link
									href={item.url}
									className="flex items-center gap-3 px-3 py-2"
								>
									<div
										className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 group-hover:scale-110 shrink-0"
										style={{
											backgroundColor: '#F4E9D7',
										}}
									>
										<item.icon
											className="size-4 transition-colors duration-300"
											style={{
												color: '#D97D55',
											}}
										/>
									</div>
									<span className="font-sans font-light text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-50 transition-colors duration-300">
										{item.title}
									</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
