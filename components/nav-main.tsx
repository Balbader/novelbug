'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';
import Link from 'next/link';

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from '@/components/ui/sidebar';

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon: LucideIcon;
		isActive?: boolean;
		items?: {
			title: string;
			url: string;
		}[];
	}[];
}) {
	return (
		<SidebarGroup>
			<SidebarGroupLabel className="text-xs font-sans font-light text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-3 px-2">
				Menu
			</SidebarGroupLabel>
			<SidebarMenu className="space-y-1.5">
				{items.map((item, index) => (
					<Collapsible
						key={item.title}
						asChild
						defaultOpen={item.isActive}
					>
						<SidebarMenuItem>
							<SidebarMenuButton
								asChild
								tooltip={item.title}
								className="group relative rounded-xl transition-all duration-300 hover:bg-white/60 dark:hover:bg-slate-800/30 hover:shadow-md hover:scale-[1.02] data-[active=true]:bg-white/80 dark:data-[active=true]:bg-slate-800/40 data-[active=true]:shadow-lg data-[active=true]:scale-[1.02]"
							>
								<Link
									href={item.url}
									className="flex items-center gap-3 px-3 py-2.5"
								>
									<div
										className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shrink-0"
										style={{
											backgroundColor:
												index === 0
													? '#F4E9D7'
													: index === 1
														? '#E8F4F8'
														: index === 3
															? '#E8F0E5'
															: '#F0E8F4',
										}}
									>
										<item.icon
											className="size-5 transition-colors duration-300"
											style={{
												color:
													index === 0
														? '#D97D55'
														: index === 1
															? '#4A90E2'
															: index === 3
																? '#6B7280'
																: '#9B7EDE',
											}}
										/>
									</div>
									<span className="font-sans font-medium text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-50 transition-colors duration-300">
										{item.title}
									</span>
									{/* Decorative dot for active state */}
									{item.isActive && (
										<div className="absolute right-3 w-2 h-2 rounded-full bg-[#D97D55] animate-pulse" />
									)}
								</Link>
							</SidebarMenuButton>
							{item.items?.length ? (
								<>
									<CollapsibleTrigger asChild>
										<SidebarMenuAction className="data-[state=open]:rotate-90 transition-transform duration-300">
											<ChevronRight className="size-4" />
											<span className="sr-only">
												Toggle
											</span>
										</SidebarMenuAction>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub className="ml-4 mt-1 space-y-0.5">
											{item.items?.map((subItem) => (
												<SidebarMenuSubItem
													key={subItem.title}
												>
													<SidebarMenuSubButton
														asChild
													>
														<Link
															href={subItem.url}
															className="rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors duration-200"
														>
															<span className="text-sm font-sans font-light">
																{subItem.title}
															</span>
														</Link>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									</CollapsibleContent>
								</>
							) : null}
						</SidebarMenuItem>
					</Collapsible>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
