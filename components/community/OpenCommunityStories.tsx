'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
	Calendar,
	Globe,
	Users,
	Palette,
	Clock,
	ArrowRight,
	User,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
	author: {
		username: string;
		first_name: string;
		last_name: string;
	};
}

type SortOption = 'newest' | 'oldest' | 'title';

export default function OpenCommunityStories() {
	const [stories, setStories] = useState<Story[]>([]);
	const [filteredStories, setFilteredStories] = useState<Story[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [sortBy, setSortBy] = useState<SortOption>('newest');
	const [filterTopic, setFilterTopic] = useState<string>('all');
	const [filterLanguage, setFilterLanguage] = useState<string>('all');
	const router = useRouter();
	const storiesRef = useRef<HTMLDivElement>(null);
	const headerRef = useRef<HTMLDivElement>(null);
	const searchRef = useRef<HTMLDivElement>(null);
	const hasAnimatedRef = useRef(false);

	// Fetch shared stories
	useEffect(() => {
		const fetchStories = async () => {
			try {
				setError(null);
				const response = await fetch('/api/stories/community');
				if (!response.ok) {
					const errorData = await response.json().catch(() => ({}));
					throw new Error(
						errorData.error ||
							`Failed to fetch stories: ${response.status} ${response.statusText}`,
					);
				}
				const data = await response.json();
				if (data.success && data.stories) {
					setStories(data.stories);
					setFilteredStories(data.stories);
				} else {
					throw new Error(data.error || 'Failed to load stories');
				}
			} catch (error) {
				console.error('Failed to fetch stories:', error);
				setError(
					error instanceof Error
						? error.message
						: 'Failed to load stories. Please try again later.',
				);
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
						.includes(searchQuery.toLowerCase()) ||
					story.author.username
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

		// Apply language filter
		if (filterLanguage !== 'all') {
			filtered = filtered.filter(
				(story) =>
					story.language.toLowerCase() ===
					filterLanguage.toLowerCase(),
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
	}, [stories, searchQuery, sortBy, filterTopic, filterLanguage]);

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

	const getUniqueLanguages = () => {
		const languages = stories
			.map((story) => story.language.toLowerCase())
			.filter((lang) => lang && lang.trim() !== '');
		return Array.from(new Set(languages));
	};

	const getLanguageLabel = (code: string) => {
		const languageMap: Record<string, string> = {
			en: 'English',
			es: 'Spanish',
			fr: 'French',
			de: 'German',
			it: 'Italian',
			pt: 'Portuguese',
			ar: 'Arabic',
			ru: 'Russian',
			zh: 'Chinese',
			ja: 'Japanese',
			ko: 'Korean',
			hi: 'Hindi',
			bn: 'Bengali',
			pa: 'Punjabi',
			ta: 'Tamil',
		};
		return languageMap[code.toLowerCase()] || code.toUpperCase();
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

	const getAuthorName = (author: Story['author']) => {
		if (author.first_name || author.last_name) {
			return `${author.first_name} ${author.last_name}`.trim();
		}
		return author.username;
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
			<div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
				{/* Header */}
				<div ref={headerRef} className="space-y-3 sm:space-y-4">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
						<div className="flex-1 min-w-0">
							<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-slate-900 dark:text-slate-50 mb-1 sm:mb-2 tracking-tight leading-tight">
								Community Stories 🌟
							</h1>
							<p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 font-sans font-light tracking-wide">
								{stories.length === 0
									? 'No stories shared yet. Be the first to share!'
									: `Discover ${stories.length} ${stories.length === 1 ? 'story' : 'stories'} shared by our community`}
							</p>
						</div>
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
									placeholder="Search stories by title, topic, author, or content..."
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
								<select
									value={filterLanguage}
									onChange={(e) =>
										setFilterLanguage(e.target.value)
									}
									className="h-10 sm:h-11 px-3 sm:px-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 text-sm sm:text-base font-sans font-light text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-[#D97D55] focus:ring-offset-2"
								>
									<option value="all">All Languages</option>
									{getUniqueLanguages().map((lang) => (
										<option key={lang} value={lang}>
											{getLanguageLabel(lang)}
										</option>
									))}
								</select>
							</div>
						</div>
						{searchQuery ||
						filterTopic !== 'all' ||
						filterLanguage !== 'all' ? (
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
				) : error ? (
					<Card className="border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950">
						<CardContent className="p-6 sm:p-8 md:p-12 text-center">
							<div
								className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4"
								style={{
									backgroundColor: '#F4E9D7',
								}}
							>
								<BookOpen
									className="size-6 sm:size-7 md:size-8"
									style={{ color: '#D97D55' }}
								/>
							</div>
							<h3 className="text-lg sm:text-xl md:text-2xl font-serif font-normal text-slate-900 dark:text-slate-50 mb-1 sm:mb-2 px-2">
								Error Loading Stories
							</h3>
							<p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-sans font-light mb-4 sm:mb-6 max-w-md mx-auto px-2">
								{error}
							</p>
							<Button
								onClick={() => {
									setError(null);
									setIsLoading(true);
									window.location.reload();
								}}
								className="font-sans font-light text-sm sm:text-base"
								style={{
									backgroundColor: '#D97D55',
									color: 'white',
								}}
							>
								Try Again
							</Button>
						</CardContent>
					</Card>
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
									// Navigate to story page - adjust route as needed
									router.push(
										`/community-stories/${story.id}`,
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
									</div>
									<div className="flex flex-col gap-2 mt-2">
										<Link
											href={`/${story.author.username}/public-profile`}
											onClick={(e) => e.stopPropagation()}
											className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-sans font-light hover:text-[#D97D55] transition-colors group/author"
										>
											<User className="size-3 sm:size-4" />
											<span className="truncate group-hover/author:underline">
												{getAuthorName(story.author)}
											</span>
										</Link>
										<div className="flex items-center gap-2">
											<CardDescription className="font-sans font-light text-xs sm:text-sm flex items-center gap-1 m-0">
												<Calendar className="size-3 sm:size-4" />
												{formatDate(story.created_at)}
											</CardDescription>
											<CardDescription className="font-sans font-light text-xs sm:text-sm flex items-center gap-1 m-0">
												<Clock className="size-3 sm:size-4 ml-2" />
												{getReadingTime(
													story.story_content,
												)}{' '}
												min read
											</CardDescription>
										</div>
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
								{searchQuery ||
								filterTopic !== 'all' ||
								filterLanguage !== 'all' ? (
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
								{searchQuery ||
								filterTopic !== 'all' ||
								filterLanguage !== 'all'
									? 'No stories found'
									: 'No shared stories yet'}
							</h3>
							<p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-sans font-light mb-4 sm:mb-6 max-w-md mx-auto px-2">
								{searchQuery ||
								filterTopic !== 'all' ||
								filterLanguage !== 'all'
									? "Try adjusting your search or filters to find what you're looking for."
									: 'Be the first to share a story with the community!'}
							</p>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
