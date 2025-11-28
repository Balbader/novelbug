'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
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
	Sparkles,
	BookOpen,
	TrendingUp,
	Heart,
	Clock,
	Star,
	Plus,
	ArrowRight,
	BookMarked,
	Palette,
	Users,
	Globe,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

interface Story {
	id: string;
	title: string;
	topic: string;
	subtopic: string;
	style: string;
	age_group: string;
	language: string;
	story_content: string;
	created_at: Date | string;
	updated_at: Date | string;
	shared: boolean;
	published: boolean;
}

interface DashboardStats {
	totalStories: number;
	favoriteTopic: string;
	totalReadingTime: number;
	storiesThisWeek: number;
	recentStories: Story[];
}

export default function Dashboard() {
	const [stats, setStats] = useState<DashboardStats>({
		totalStories: 0,
		favoriteTopic: '',
		totalReadingTime: 0,
		storiesThisWeek: 0,
		recentStories: [],
	});
	const [isLoading, setIsLoading] = useState(true);
	const pathname = usePathname();
	const username = pathname?.split('/')[1] || '';

	const welcomeRef = useRef<HTMLDivElement>(null);
	const statsRef = useRef<HTMLDivElement>(null);
	const storiesRef = useRef<HTMLDivElement>(null);
	const quickActionsRef = useRef<HTMLDivElement>(null);

	// Calculate reading time for a story
	const getReadingTime = (content: string) => {
		const wordsPerMinute = 200;
		const wordCount = content.split(/\s+/).length;
		return Math.ceil(wordCount / wordsPerMinute);
	};

	// Get favorite topic (most common)
	const getFavoriteTopic = (stories: Story[]) => {
		if (stories.length === 0) return '';
		const topicCounts: Record<string, number> = {};
		stories.forEach((story) => {
			const topic = story.topic.toLowerCase();
			topicCounts[topic] = (topicCounts[topic] || 0) + 1;
		});
		const favorite = Object.entries(topicCounts).reduce((a, b) =>
			a[1] > b[1] ? a : b,
		);
		return favorite[0].charAt(0).toUpperCase() + favorite[0].slice(1);
	};

	// Get stories created this week
	const getStoriesThisWeek = (stories: Story[]) => {
		const now = new Date();
		const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
		return stories.filter((story) => {
			const createdDate = new Date(story.created_at);
			return createdDate >= weekAgo;
		}).length;
	};

	// Fetch user stories
	useEffect(() => {
		const fetchStories = async () => {
			try {
				const response = await fetch('/api/stories');
				if (!response.ok) {
					throw new Error('Failed to fetch stories');
				}
				const data = await response.json();
				if (data.success && data.stories) {
					const stories: Story[] = data.stories;

					// Calculate statistics
					const totalStories = stories.length;
					const favoriteTopic = getFavoriteTopic(stories);
					const totalReadingTime = stories.reduce(
						(sum, story) =>
							sum + getReadingTime(story.story_content || ''),
						0,
					);
					const storiesThisWeek = getStoriesThisWeek(stories);

					// Get recent stories (last 6, sorted by created_at)
					const recentStories = [...stories]
						.sort((a, b) => {
							const dateA = new Date(a.created_at).getTime();
							const dateB = new Date(b.created_at).getTime();
							return dateB - dateA;
						})
						.slice(0, 6);

					setStats({
						totalStories,
						favoriteTopic,
						totalReadingTime,
						storiesThisWeek,
						recentStories,
					});
				} else {
					setStats({
						totalStories: 0,
						favoriteTopic: '',
						totalReadingTime: 0,
						storiesThisWeek: 0,
						recentStories: [],
					});
				}
				setIsLoading(false);
			} catch (error) {
				console.error('Failed to fetch stories:', error);
				setStats({
					totalStories: 0,
					favoriteTopic: '',
					totalReadingTime: 0,
					storiesThisWeek: 0,
					recentStories: [],
				});
				setIsLoading(false);
			}
		};

		fetchStories();
	}, []);

	// GSAP Animations
	useEffect(() => {
		const ctx = gsap.context(() => {
			// Welcome section animation
			if (welcomeRef.current) {
				gsap.from(welcomeRef.current.children, {
					opacity: 0,
					y: 20,
					duration: 0.8,
					stagger: 0.15,
					ease: 'power2.out',
					delay: 0.2,
				});
			}

			// Quick actions animation
			if (quickActionsRef.current) {
				gsap.from(quickActionsRef.current.children, {
					opacity: 0,
					x: -20,
					duration: 0.6,
					stagger: 0.1,
					ease: 'power2.out',
					delay: 0.6,
				});
			}
		});

		return () => ctx.revert();
	}, [stats]);

	const formatDate = (date: Date | string) => {
		const d = typeof date === 'string' ? new Date(date) : date;
		return new Intl.DateTimeFormat('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		}).format(d);
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
			<div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
				{/* Welcome Section */}
				<div ref={welcomeRef} className="space-y-3 sm:space-y-4">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
						<div className="flex-1 min-w-0">
							<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-slate-900 dark:text-slate-50 mb-1 sm:mb-2 tracking-tight leading-tight">
								Welcome Back! ✨
							</h1>
							<p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 font-sans font-light tracking-wide">
								Ready to create more magical bedtime stories?
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

				{/* Quick Actions */}
				<div
					ref={quickActionsRef}
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
				>
					<Link href={`/${username}/dashboard/generate`}>
						<Card
							className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 h-full relative overflow-hidden"
							style={{
								borderColor: '#D97D55',
								backgroundColor: '#D97D55',
								boxShadow:
									'0 4px 20px rgba(217, 125, 85, 0.15)',
							}}
							onMouseEnter={(e) => {
								gsap.to(e.currentTarget, {
									scale: 1.02,
									duration: 0.3,
									ease: 'power2.out',
								});
								gsap.to(e.currentTarget, {
									boxShadow:
										'0 8px 30px rgba(217, 125, 85, 0.25)',
									duration: 0.3,
								});
							}}
							onMouseLeave={(e) => {
								gsap.to(e.currentTarget, {
									scale: 1,
									duration: 0.3,
									ease: 'power2.out',
								});
								gsap.to(e.currentTarget, {
									boxShadow:
										'0 4px 20px rgba(217, 125, 85, 0.15)',
									duration: 0.3,
								});
							}}
						>
							<div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
							<CardContent className="p-4 sm:p-5 md:p-6 relative z-10">
								<div className="flex items-center gap-3 sm:gap-4">
									<div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 shrink-0 shadow-md bg-white/20 backdrop-blur-sm">
										<Plus className="size-6 sm:size-7 text-white" />
									</div>
									<div className="flex-1 min-w-0">
										<h3 className="font-serif font-normal text-white text-lg sm:text-xl mb-0.5 sm:mb-1 truncate">
											New Story
										</h3>
										<p className="text-xs sm:text-sm text-white/90 font-sans font-medium truncate">
											Start creating
										</p>
									</div>
									<ArrowRight className="size-5 sm:size-6 transition-all duration-300 group-hover:translate-x-1 shrink-0 text-white" />
								</div>
							</CardContent>
						</Card>
					</Link>

					<Link href={`/${username}/dashboard/my-stories`}>
						<Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950 h-full">
							<CardContent className="p-4 sm:p-5 md:p-6">
								<div className="flex items-center gap-3 sm:gap-4">
									<div
										className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shrink-0"
										style={{
											backgroundColor: '#F4E9D7',
										}}
									>
										<BookOpen
											className="size-5 sm:size-6"
											style={{ color: '#D97D55' }}
										/>
									</div>
									<div className="flex-1 min-w-0">
										<h3 className="font-serif font-normal text-slate-900 dark:text-slate-50 text-base sm:text-lg mb-0.5 sm:mb-1 truncate">
											My Stories
										</h3>
										<p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-sans font-light truncate">
											View all stories
										</p>
									</div>
									<ArrowRight className="size-4 sm:size-5 text-slate-400 group-hover:text-[#D97D55] transition-colors shrink-0" />
								</div>
							</CardContent>
						</Card>
					</Link>

					<Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950 h-full">
						<CardContent className="p-4 sm:p-5 md:p-6">
							<div className="flex items-center gap-3 sm:gap-4">
								<div
									className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shrink-0"
									style={{
										backgroundColor: '#F4E9D7',
									}}
								>
									<Star
										className="size-5 sm:size-6"
										style={{ color: '#D97D55' }}
									/>
								</div>
								<div className="flex-1 min-w-0">
									<h3 className="font-serif font-normal text-slate-900 dark:text-slate-50 text-base sm:text-lg mb-0.5 sm:mb-1 truncate">
										Favorites
									</h3>
									<p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-sans font-light truncate">
										Saved stories
									</p>
								</div>
								<ArrowRight className="size-4 sm:size-5 text-slate-400 group-hover:text-[#D97D55] transition-colors shrink-0" />
							</div>
						</CardContent>
					</Card>

					<Link href={`/${username}/dashboard/community`}>
						<Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950 h-full">
							<CardContent className="p-4 sm:p-5 md:p-6">
								<div className="flex items-center gap-3 sm:gap-4">
									<div
										className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shrink-0"
										style={{
											backgroundColor: '#F4E9D7',
										}}
									>
										<Users
											className="size-5 sm:size-6"
											style={{ color: '#D97D55' }}
										/>
									</div>
									<div className="flex-1 min-w-0">
										<h3 className="font-serif font-normal text-slate-900 dark:text-slate-50 text-base sm:text-lg mb-0.5 sm:mb-1 truncate">
											Community
										</h3>
										<p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-sans font-light truncate">
											Explore stories
										</p>
									</div>
									<ArrowRight className="size-4 sm:size-5 text-slate-400 group-hover:text-[#D97D55] transition-colors shrink-0" />
								</div>
							</CardContent>
						</Card>
					</Link>
				</div>

				{/* Statistics Cards */}
				<div
					ref={statsRef}
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
				>
					<Card className="border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950 h-full">
						<CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
							<CardDescription className="font-sans font-light text-xs sm:text-sm tracking-wide">
								Total Stories
							</CardDescription>
						</CardHeader>
						<CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
							<div className="flex items-center gap-2 sm:gap-3">
								<div
									className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0"
									style={{
										backgroundColor: '#F4E9D7',
									}}
								>
									<BookOpen
										className="size-4 sm:size-5"
										style={{ color: '#D97D55' }}
									/>
								</div>
								<div className="min-w-0 flex-1">
									<CardTitle className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 dark:text-slate-50 truncate">
										{stats.totalStories}
									</CardTitle>
									<p className="text-xs text-slate-500 dark:text-slate-500 font-sans font-light mt-0.5 sm:mt-1">
										Stories created
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950 h-full">
						<CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
							<CardDescription className="font-sans font-light text-xs sm:text-sm tracking-wide">
								Favorite Topic
							</CardDescription>
						</CardHeader>
						<CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
							<div className="flex items-center gap-2 sm:gap-3">
								<div
									className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0"
									style={{
										backgroundColor: '#F4E9D7',
									}}
								>
									<Heart
										className="size-4 sm:size-5"
										style={{ color: '#D97D55' }}
									/>
								</div>
								<div className="min-w-0 flex-1">
									<CardTitle className="text-lg sm:text-xl font-serif font-normal text-slate-900 dark:text-slate-50 capitalize truncate">
										{stats.favoriteTopic || 'None yet'}
									</CardTitle>
									<p className="text-xs text-slate-500 dark:text-slate-500 font-sans font-light mt-0.5 sm:mt-1">
										Most created
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950 h-full">
						<CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
							<CardDescription className="font-sans font-light text-xs sm:text-sm tracking-wide">
								Reading Time
							</CardDescription>
						</CardHeader>
						<CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
							<div className="flex items-center gap-2 sm:gap-3">
								<div
									className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0"
									style={{
										backgroundColor: '#F4E9D7',
									}}
								>
									<Clock
										className="size-4 sm:size-5"
										style={{ color: '#D97D55' }}
									/>
								</div>
								<div className="min-w-0 flex-1">
									<CardTitle className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 dark:text-slate-50 truncate">
										{stats.totalReadingTime}
									</CardTitle>
									<p className="text-xs text-slate-500 dark:text-slate-500 font-sans font-light mt-0.5 sm:mt-1">
										Minutes read
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950 h-full">
						<CardHeader className="pb-2 sm:pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
							<CardDescription className="font-sans font-light text-xs sm:text-sm tracking-wide">
								This Week
							</CardDescription>
						</CardHeader>
						<CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
							<div className="flex items-center gap-2 sm:gap-3">
								<div
									className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0"
									style={{
										backgroundColor: '#F4E9D7',
									}}
								>
									<TrendingUp
										className="size-4 sm:size-5"
										style={{ color: '#D97D55' }}
									/>
								</div>
								<div className="min-w-0 flex-1">
									<CardTitle className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 dark:text-slate-50 truncate">
										{stats.storiesThisWeek}
									</CardTitle>
									<p className="text-xs text-slate-500 dark:text-slate-500 font-sans font-light mt-0.5 sm:mt-1">
										New stories
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Recent Stories */}
				<div className="space-y-3 sm:space-y-4">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
						<h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-normal text-slate-900 dark:text-slate-50">
							Recent Stories
						</h2>
						{stats.recentStories.length > 0 && (
							<Link
								href={`/${username}/dashboard/my-stories`}
								className="text-xs sm:text-sm text-[#D97D55] hover:text-[#C86A45] transition-colors font-sans font-light flex items-center gap-1 self-start sm:self-auto"
							>
								View all
								<ArrowRight className="size-3 sm:size-4" />
							</Link>
						)}
					</div>

					{isLoading ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
							{[1, 2, 3].map((i) => (
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
					) : stats.recentStories.length > 0 ? (
						<div
							ref={storiesRef}
							className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6"
						>
							{stats.recentStories.map((story) => (
								<Card
									key={story.id}
									className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950 h-full flex flex-col"
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
											<BookOpen className="size-4 sm:size-5 text-slate-400 group-hover:text-[#D97D55] transition-colors shrink-0 mt-0.5 sm:mt-1" />
										</div>
										<CardDescription className="font-sans font-light text-xs sm:text-sm mt-1">
											{formatDate(story.created_at)}
										</CardDescription>
									</CardHeader>
									<CardContent className="px-4 sm:px-6 pb-3 flex-1">
										<div className="flex flex-wrap gap-1.5 sm:gap-2">
											<span
												className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-sans font-light"
												style={{
													backgroundColor: '#F4E9D7',
													color: '#D97D55',
												}}
											>
												{story.topic}
											</span>
											<span
												className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-sans font-light"
												style={{
													backgroundColor: '#F4E9D7',
													color: '#D97D55',
												}}
											>
												{story.style}
											</span>
											<span
												className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-sans font-light"
												style={{
													backgroundColor: '#F4E9D7',
													color: '#D97D55',
												}}
											>
												{story.age_group}
											</span>
										</div>
									</CardContent>
									<CardFooter className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
										<Link
											href={`/${username}/dashboard/my-stories/${story.id}`}
											className="w-full"
										>
											<Button
												variant="ghost"
												size="sm"
												className="w-full justify-start text-xs sm:text-sm text-slate-600 dark:text-slate-400 hover:text-[#D97D55] font-sans font-light h-8 sm:h-9"
											>
												Read story
												<ArrowRight className="size-3 sm:size-4 ml-1 sm:ml-2" />
											</Button>
										</Link>
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
									<BookOpen
										className="size-6 sm:size-7 md:size-8"
										style={{ color: '#D97D55' }}
									/>
								</div>
								<h3 className="text-lg sm:text-xl md:text-2xl font-serif font-normal text-slate-900 dark:text-slate-50 mb-1 sm:mb-2 px-2">
									No stories yet
								</h3>
								<p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-sans font-light mb-4 sm:mb-6 max-w-md mx-auto px-2">
									Start your storytelling journey by creating
									your first magical bedtime story!
								</p>
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
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
