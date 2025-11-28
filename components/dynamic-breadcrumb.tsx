'use client';

import { useEffect, useState } from 'react';
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

// Helper to check if a string looks like a UUID
function isUUID(str: string): boolean {
	const uuidRegex =
		/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
	return uuidRegex.test(str);
}

export function DynamicBreadcrumb({ username }: DynamicBreadcrumbProps) {
	const pathname = usePathname();
	const [storyTitle, setStoryTitle] = useState<string | null>(null);

	// Parse the pathname to determine breadcrumb items
	const pathSegments = pathname.split('/').filter(Boolean);

	// Remove the username segment (first one) to get route segments
	const segments = pathSegments.slice(1);

	// Check if we're on a story page and fetch the story title
	useEffect(() => {
		const fetchStoryTitle = async () => {
			// Check if we're on a story page: path should include 'my-stories' or 'community' and last segment is a UUID
			const isStoryPage =
				(pathname.includes('/my-stories/') ||
					pathname.includes('/community/')) &&
				segments.length > 0 &&
				isUUID(segments[segments.length - 1]);

			if (isStoryPage) {
				const storyId = segments[segments.length - 1];
				try {
					const response = await fetch(`/api/stories/${storyId}`);
					if (response.ok) {
						const data = await response.json();
						if (data.success && data.story?.title) {
							setStoryTitle(data.story.title);
						}
					}
				} catch (error) {
					console.error('Failed to fetch story title:', error);
				}
			} else {
				setStoryTitle(null);
			}
		};

		fetchStoryTitle();
	}, [pathname, segments]);

	// Map path segments to display names
	const getBreadcrumbLabel = (segment: string, index: number): string => {
		const labelMap: Record<string, string> = {
			dashboard: 'Dashboard',
			generate: 'Generate Story',
			'my-stories': 'My Stories',
			community: 'Community Stories',
		};

		// If this is the last segment and it's a UUID (story ID), use the story title
		if (index === segments.length - 1 && isUUID(segment) && storyTitle) {
			return storyTitle;
		}

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
				label: getBreadcrumbLabel(segment, index),
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
