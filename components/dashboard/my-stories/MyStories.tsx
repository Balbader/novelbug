'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	BookOpen,
	Search,
	Filter,
	Calendar,
	Globe,
	Users,
	Palette,
	Clock,
	ArrowRight,
	Sparkles,
	BookMarked,
	Star,
	MoreVertical,
	Eye,
	Share2,
	Trash2,
} from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

interface Story {
	id: string;
	title: string;
	age_group: string;
	language: string;
	topic: string;
	subtopic: string;
	style: string;
	story_content: string;
	created_at: Date | string;
	updated_at: Date | string;
	shared: boolean;
	published: boolean;
}

type SortOption = 'newest' | 'oldest' | 'title';

export default function MyStories() {
	const [stories, setStories] = useState<Story[]>([]);
	const [filteredStories, setFilteredStories] = useState<Story[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [sortBy, setSortBy] = useState<SortOption>('newest');
	const [filterTopic, setFilterTopic] = useState<string>('all');
	const pathname = usePathname();
	const username = pathname?.split('/')[1] || '';
	const router = useRouter();
	const storiesRef = useRef<HTMLDivElement>(null);
	const headerRef = useRef<HTMLDivElement>(null);
	const searchRef = useRef<HTMLDivElement>(null);
	const hasAnimatedRef = useRef(false);

	// Fetch stories
	useEffect(() => {
		const fetchStories = async () => {
			try {
				const response = await fetch('/api/stories');
				if (!response.ok) {
					throw new Error('Failed to fetch stories');
				}
				const data = await response.json();
				if (data.success && data.stories) {
					setStories(data.stories);
					setFilteredStories(data.stories);
				}
			} catch (error) {
				console.error('Failed to fetch stories:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchStories();
	}, []);

	// Filter and sort stories
	useEffect(() => {
		let filtered = [...stories];

		// Apply search filter
		if (searchQuery.trim()) {
			filtered = filtered.filter(
				(story) =>
					story.title
						.toLowerCase()
						.includes(searchQuery.toLowerCase()) ||
					story.topic
						.toLowerCase()
						.includes(searchQuery.toLowerCase()) ||
					story.subtopic
						.toLowerCase()
						.includes(searchQuery.toLowerCase()) ||
					story.story_content
						.toLowerCase()
						.includes(searchQuery.toLowerCase()),
			);
		}

		// Apply topic filter
		if (filterTopic !== 'all') {
			filtered = filtered.filter(
				(story) =>
					story.topic.toLowerCase() === filterTopic.toLowerCase(),
			);
		}

		// Apply sorting
		filtered.sort((a, b) => {
			switch (sortBy) {
				case 'newest':
					return (
						new Date(b.created_at).getTime() -
						new Date(a.created_at).getTime()
					);
				case 'oldest':
					return (
						new Date(a.created_at).getTime() -
						new Date(b.created_at).getTime()
					);
				case 'title':
					return a.title.localeCompare(b.title);
				default:
					return 0;
			}
		});

		setFilteredStories(filtered);
	}, [stories, searchQuery, sortBy, filterTopic]);

	// GSAP Animations - Header and Search (run once)
	useEffect(() => {
		const ctx = gsap.context(() => {
			// Header animation
			if (headerRef.current) {
				gsap.from(headerRef.current.children, {
					opacity: 0,
					y: 20,
					duration: 0.8,
					stagger: 0.15,
					ease: 'power2.out',
					delay: 0.2,
				});
			}

			// Search bar animation
			if (searchRef.current) {
				gsap.from(searchRef.current, {
					opacity: 0,
					y: 10,
					duration: 0.6,
					ease: 'power2.out',
					delay: 0.4,
				});
			}
		});

		return () => ctx.revert();
	}, []);

	// Stories grid animation (runs when stories are first loaded or filtered)
	useEffect(() => {
		if (!storiesRef.current || filteredStories.length === 0 || isLoading) {
			return;
		}

		// Use requestAnimationFrame to ensure DOM is ready
		requestAnimationFrame(() => {
			const container = storiesRef.current;
			if (!container) return;

			const items = Array.from(container.children) as HTMLElement[];

			if (items.length === 0) return;

			// Only animate from 0 if this is the first time
			if (!hasAnimatedRef.current) {
				// Remove the opacity-0 class from container
				container.classList.remove('opacity-0');

				// Set initial state for items
				gsap.set(items, { opacity: 0, y: 30 });

				// Animate in
				gsap.to(items, {
					opacity: 1,
					y: 0,
					duration: 0.6,
					stagger: 0.08,
					ease: 'power2.out',
					delay: 0.1,
					onComplete: () => {
						hasAnimatedRef.current = true;
					},
				});
			} else {
				// For subsequent updates (filtering), ensure everything is visible
				container.classList.remove('opacity-0');
				gsap.set(items, { opacity: 1, y: 0 });
			}
		});
	}, [filteredStories, isLoading]);

	const formatDate = (date: Date | string) => {
		const d = typeof date === 'string' ? new Date(date) : date;
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		}).format(d);
	};

	const getUniqueTopics = () => {
		const topics = stories.map((story) => story.topic.toLowerCase());
		return Array.from(new Set(topics));
	};

	const getReadingTime = (content: string) => {
		const wordsPerMinute = 200;
		const wordCount = content.split(/\s+/).length;
		const minutes = Math.ceil(wordCount / wordsPerMinute);
		return minutes;
	};

	const getPreview = (content: string, maxLength: number = 150) => {
		if (content.length <= maxLength) return content;
		return content.substring(0, maxLength).trim() + '...';
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
			<div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
				{/* Header */}
				<div ref={headerRef} className="space-y-3 sm:space-y-4">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
						<div className="flex-1 min-w-0">
							<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-slate-900 dark:text-slate-50 mb-1 sm:mb-2 tracking-tight leading-tight">
								My Stories 📚
							</h1>
							<p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 font-sans font-light tracking-wide">
								{stories.length === 0
									? 'Start creating your first magical story!'
									: `You have ${stories.length} ${stories.length === 1 ? 'story' : 'stories'} saved`}
							</p>
						</div>
						<Link
							href={`/${username}/dashboard/generate`}
							className="sm:shrink-0 w-full sm:w-auto"
						>
							<Button
								size="lg"
								className="w-full sm:w-auto font-sans font-light tracking-wide rounded-xl border-0 shadow-md hover:shadow-lg transition-all duration-300 text-white text-sm sm:text-base px-6 sm:px-8"
								style={{
									backgroundColor: '#D97D55',
								}}
								onMouseEnter={(e) => {
									gsap.to(e.currentTarget, {
										scale: 1.02,
										duration: 0.3,
										ease: 'power2.out',
									});
								}}
								onMouseLeave={(e) => {
									gsap.to(e.currentTarget, {
										scale: 1,
										duration: 0.3,
										ease: 'power2.out',
									});
								}}
							>
								<Sparkles className="size-3 sm:size-4 mr-2" />
								<span className="whitespace-nowrap">
									Create New Story
								</span>
							</Button>
						</Link>
					</div>
				</div>

				{/* Search and Filters */}
				{stories.length > 0 && (
					<div ref={searchRef} className="space-y-3 sm:space-y-4">
						<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
							<div className="relative flex-1">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 sm:size-5 text-slate-400" />
								<Input
									type="text"
									placeholder="Search stories by title, topic, or content..."
									value={searchQuery}
									onChange={(e) =>
										setSearchQuery(e.target.value)
									}
									className="pl-9 sm:pl-10 h-10 sm:h-11 rounded-xl border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 font-sans font-light text-sm sm:text-base"
								/>
							</div>
							<div className="flex gap-2 sm:gap-3">
								<select
									value={sortBy}
									onChange={(e) =>
										setSortBy(e.target.value as SortOption)
									}
									className="h-10 sm:h-11 px-3 sm:px-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 text-sm sm:text-base font-sans font-light text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-[#D97D55] focus:ring-offset-2"
								>
									<option value="newest">Newest First</option>
									<option value="oldest">Oldest First</option>
									<option value="title">Title A-Z</option>
								</select>
								<select
									value={filterTopic}
									onChange={(e) =>
										setFilterTopic(e.target.value)
									}
									className="h-10 sm:h-11 px-3 sm:px-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 text-sm sm:text-base font-sans font-light text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-[#D97D55] focus:ring-offset-2"
								>
									<option value="all">All Topics</option>
									{getUniqueTopics().map((topic) => (
										<option key={topic} value={topic}>
											{topic.charAt(0).toUpperCase() +
												topic.slice(1)}
										</option>
									))}
								</select>
							</div>
						</div>
						{searchQuery || filterTopic !== 'all' ? (
							<p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-sans font-light">
								Showing {filteredStories.length} of{' '}
								{stories.length}{' '}
								{stories.length === 1 ? 'story' : 'stories'}
							</p>
						) : null}
					</div>
				)}

				{/* Stories Grid */}
				{isLoading ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
						{[1, 2, 3, 4, 5, 6].map((i) => (
							<Card
								key={i}
								className="border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950 animate-pulse h-full"
							>
								<CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
									<div className="h-5 sm:h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
									<div className="h-3 sm:h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mt-2" />
								</CardHeader>
								<CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
									<div className="h-16 sm:h-20 bg-slate-200 dark:bg-slate-800 rounded" />
								</CardContent>
							</Card>
						))}
					</div>
				) : filteredStories.length > 0 ? (
					<div
						ref={storiesRef}
						className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 opacity-0"
					>
						{filteredStories.map((story) => (
							<Card
								key={story.id}
								className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950 h-full flex flex-col"
								onClick={() => {
									router.push(
										`/${username}/dashboard/my-stories/${story.id}`,
									);
								}}
								onMouseEnter={(e) => {
									gsap.to(e.currentTarget, {
										y: -4,
										duration: 0.3,
										ease: 'power2.out',
									});
								}}
								onMouseLeave={(e) => {
									gsap.to(e.currentTarget, {
										y: 0,
										duration: 0.3,
										ease: 'power2.out',
									});
								}}
							>
								<CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3">
									<div className="flex items-start justify-between gap-2">
										<CardTitle className="font-serif font-normal text-slate-900 dark:text-slate-50 text-base sm:text-lg line-clamp-2 group-hover:text-[#D97D55] transition-colors flex-1 min-w-0">
											{story.title}
										</CardTitle>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="sm"
													className="h-8 w-8 p-0 shrink-0"
													onClick={(e) =>
														e.stopPropagation()
													}
												>
													<MoreVertical className="size-4 text-slate-400" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem>
													<Eye className="size-4 mr-2" />
													View
												</DropdownMenuItem>
												<DropdownMenuItem>
													<Share2 className="size-4 mr-2" />
													Share
												</DropdownMenuItem>
												<DropdownMenuItem className="text-red-600">
													<Trash2 className="size-4 mr-2" />
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
									<div className="flex items-center gap-2 mt-2">
										<CardDescription className="font-sans font-light text-xs sm:text-sm flex items-center gap-1">
											<Calendar className="size-3 sm:size-4" />
											{formatDate(story.created_at)}
										</CardDescription>
										<CardDescription className="font-sans font-light text-xs sm:text-sm flex items-center gap-1">
											<Clock className="size-3 sm:size-4 ml-2" />
											{getReadingTime(
												story.story_content,
											)}{' '}
											min read
										</CardDescription>
									</div>
								</CardHeader>
								<CardContent className="px-4 sm:px-6 pb-3 flex-1">
									<p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-sans font-light line-clamp-3 mb-3">
										{getPreview(story.story_content)}
									</p>
									<div className="flex flex-wrap gap-1.5 sm:gap-2">
										<span
											className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-sans font-light flex items-center gap-1"
											style={{
												backgroundColor: '#F4E9D7',
												color: '#D97D55',
											}}
										>
											<BookOpen className="size-3" />
											{story.topic}
										</span>
										<span
											className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-sans font-light flex items-center gap-1"
											style={{
												backgroundColor: '#F4E9D7',
												color: '#D97D55',
											}}
										>
											<Palette className="size-3" />
											{story.style}
										</span>
										<span
											className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-sans font-light flex items-center gap-1"
											style={{
												backgroundColor: '#F4E9D7',
												color: '#D97D55',
											}}
										>
											<Users className="size-3" />
											{story.age_group}
										</span>
										{story.language && (
											<span
												className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-sans font-light flex items-center gap-1"
												style={{
													backgroundColor: '#F4E9D7',
													color: '#D97D55',
												}}
											>
												<Globe className="size-3" />
												{story.language}
											</span>
										)}
									</div>
								</CardContent>
								<CardFooter className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
									<div className="w-full flex items-center text-xs sm:text-sm text-slate-600 dark:text-slate-400 group-hover:text-[#D97D55] font-sans font-light transition-colors">
										Read story
										<ArrowRight className="size-3 sm:size-4 ml-1 sm:ml-2" />
									</div>
								</CardFooter>
							</Card>
						))}
					</div>
				) : (
					<Card className="border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950">
						<CardContent className="p-6 sm:p-8 md:p-12 text-center">
							<div
								className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4"
								style={{
									backgroundColor: '#F4E9D7',
								}}
							>
								{searchQuery || filterTopic !== 'all' ? (
									<Search
										className="size-6 sm:size-7 md:size-8"
										style={{ color: '#D97D55' }}
									/>
								) : (
									<BookOpen
										className="size-6 sm:size-7 md:size-8"
										style={{ color: '#D97D55' }}
									/>
								)}
							</div>
							<h3 className="text-lg sm:text-xl md:text-2xl font-serif font-normal text-slate-900 dark:text-slate-50 mb-1 sm:mb-2 px-2">
								{searchQuery || filterTopic !== 'all'
									? 'No stories found'
									: 'No stories yet'}
							</h3>
							<p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-sans font-light mb-4 sm:mb-6 max-w-md mx-auto px-2">
								{searchQuery || filterTopic !== 'all'
									? "Try adjusting your search or filters to find what you're looking for."
									: 'Start your storytelling journey by creating your first magical bedtime story!'}
							</p>
							{!searchQuery && filterTopic === 'all' && (
								<Link
									href={`/${username}/dashboard/generate`}
									className="inline-block"
								>
									<Button
										size="lg"
										className="font-sans font-light tracking-wide rounded-xl border-0 shadow-md hover:shadow-lg transition-all duration-300 text-white text-sm sm:text-base px-6 sm:px-8 w-full sm:w-auto"
										style={{
											backgroundColor: '#D97D55',
										}}
									>
										<Sparkles className="size-3 sm:size-4 mr-2" />
										Create Your First Story
									</Button>
								</Link>
							)}
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
