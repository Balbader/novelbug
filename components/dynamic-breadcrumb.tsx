'use client';

import { usePathname } from 'next/navigation';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface DynamicBreadcrumbProps {
	username: string;
}

export function DynamicBreadcrumb({ username }: DynamicBreadcrumbProps) {
	const pathname = usePathname();

	// Parse the pathname to determine breadcrumb items
	const pathSegments = pathname.split('/').filter(Boolean);

	// Remove the username segment (first one) to get route segments
	const segments = pathSegments.slice(1);

	// Map path segments to display names
	const getBreadcrumbLabel = (segment: string): string => {
		const labelMap: Record<string, string> = {
			dashboard: 'Dashboard',
			generate: 'Generate Story',
		};
		return (
			labelMap[segment] ||
			segment.charAt(0).toUpperCase() + segment.slice(1)
		);
	};

	// Build breadcrumb items
	const breadcrumbItems: Array<{
		label: string;
		href: string;
		isActive: boolean;
	}> = [];

	// Always add username as first breadcrumb
	// Username is only active if we're at the root (no segments after username)
	breadcrumbItems.push({
		label: username,
		href: `/${username}/dashboard`,
		isActive: segments.length === 0,
	});

	// Add route segments
	if (segments.length > 0) {
		let currentPath = `/${username}`;
		segments.forEach((segment, index) => {
			currentPath += `/${segment}`;
			const isLast = index === segments.length - 1;
			breadcrumbItems.push({
				label: getBreadcrumbLabel(segment),
				href: currentPath,
				isActive: isLast,
			});
		});
	}

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{breadcrumbItems
					.flatMap((item, index) => [
						<BreadcrumbItem
							key={`item-${index}`}
							className={index === 0 ? 'hidden md:block' : ''}
						>
							{item.isActive ? (
								<BreadcrumbPage>{item.label}</BreadcrumbPage>
							) : (
								<BreadcrumbLink href={item.href}>
									{item.label}
								</BreadcrumbLink>
							)}
						</BreadcrumbItem>,
						index < breadcrumbItems.length - 1 ? (
							<BreadcrumbSeparator
								key={`separator-${index}`}
								className={index === 0 ? 'hidden md:block' : ''}
							/>
						) : null,
					])
					.filter(Boolean)}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
