'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	BookOpen,
	Calendar,
	Clock,
	Globe,
	Users,
	Palette,
	ArrowLeft,
	Sparkles,
} from 'lucide-react';
import { gsap } from 'gsap';

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

export default function StoryPage({ storyId }: { storyId: string }) {
	const [story, setStory] = useState<Story | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const pathname = usePathname();
	const username = pathname?.split('/')[1] || '';
	const contentRef = useRef<HTMLDivElement>(null);
	const headerRef = useRef<HTMLDivElement>(null);

	// Fetch story
	useEffect(() => {
		const fetchStory = async () => {
			try {
				console.log('Fetching story with ID:', storyId);
				const response = await fetch(`/api/stories/${storyId}`);
				const data = await response.json();
				console.log('API Response:', { status: response.status, data });

				if (!response.ok) {
					if (response.status === 404) {
						setError(data.error || 'Story not found');
					} else if (response.status === 403) {
						setError(
							'You do not have permission to view this story',
						);
					} else {
						setError(data.error || 'Failed to fetch story');
					}
					return;
				}

				if (data.success && data.story) {
					setStory(data.story);
				} else {
					setError(data.error || 'Failed to load story');
				}
			} catch (error) {
				console.error('Failed to fetch story:', error);
				setError(
					error instanceof Error
						? error.message
						: 'Failed to load story. Please try again later.',
				);
			} finally {
				setIsLoading(false);
			}
		};

		if (storyId) {
			fetchStory();
		} else {
			setError('Story ID is missing');
			setIsLoading(false);
		}
	}, [storyId]);

	// GSAP Animations
	useEffect(() => {
		if (!story || isLoading) return;

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

			// Content animation
			if (contentRef.current) {
				gsap.from(contentRef.current, {
					opacity: 0,
					y: 30,
					duration: 0.8,
					ease: 'power2.out',
					delay: 0.4,
				});
			}
		});

		return () => ctx.revert();
	}, [story, isLoading]);

	const formatDate = (date: Date | string) => {
		const d = typeof date === 'string' ? new Date(date) : date;
		return new Intl.DateTimeFormat('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric',
		}).format(d);
	};

	const getReadingTime = (content: string) => {
		const wordsPerMinute = 200;
		const wordCount = content.split(/\s+/).length;
		const minutes = Math.ceil(wordCount / wordsPerMinute);
		return minutes;
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
				<div className="max-w-4xl mx-auto">
					<Card className="border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950 animate-pulse">
						<CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
							<div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-4" />
							<div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
						</CardHeader>
						<CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
							<div className="space-y-3">
								<div className="h-4 bg-slate-200 dark:bg-slate-800 rounded" />
								<div className="h-4 bg-slate-200 dark:bg-slate-800 rounded" />
								<div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	if (error || !story) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
				<div className="max-w-4xl mx-auto">
					<Card className="border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950">
						<CardContent className="p-6 sm:p-8 md:p-12 text-center">
							<h3 className="text-lg sm:text-xl md:text-2xl font-serif font-normal text-slate-900 dark:text-slate-50 mb-2">
								{error || 'Story not found'}
							</h3>
							<p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-sans font-light mb-6">
								{error
									? 'Please try again later or go back to your stories.'
									: 'The story you are looking for does not exist.'}
							</p>
							<Link href={`/${username}/dashboard/my-stories`}>
								<Button
									size="lg"
									className="font-sans font-light tracking-wide rounded-xl border-0 shadow-md hover:shadow-lg transition-all duration-300 text-white text-sm sm:text-base px-6 sm:px-8"
									style={{
										backgroundColor: '#D97D55',
									}}
								>
									<ArrowLeft className="size-4 mr-2" />
									Back to My Stories
								</Button>
							</Link>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
			<div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
				{/* Header */}
				<div ref={headerRef} className="space-y-3 sm:space-y-4">
					<Link href={`/${username}/dashboard/my-stories`}>
						<Button
							variant="ghost"
							size="sm"
							className="text-slate-600 dark:text-slate-400 hover:text-[#D97D55] font-sans font-light mb-2"
						>
							<ArrowLeft className="size-4 mr-2" />
							Back to My Stories
						</Button>
					</Link>
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
						<div className="flex-1 min-w-0">
							<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-slate-900 dark:text-slate-50 mb-1 sm:mb-2 tracking-tight leading-tight">
								{story.title}
							</h1>
							<div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 font-sans font-light">
								<CardDescription className="flex items-center gap-1.5 m-0">
									<Calendar className="size-4" />
									{formatDate(story.created_at)}
								</CardDescription>
								<CardDescription className="flex items-center gap-1.5 m-0">
									<Clock className="size-4" />
									{getReadingTime(story.story_content)} min
									read
								</CardDescription>
							</div>
						</div>
					</div>
				</div>

				{/* Story Content */}
				<Card
					ref={contentRef}
					className="border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950"
				>
					<CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3">
						<div className="flex flex-wrap gap-2 sm:gap-3">
							<span
								className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-sans font-light flex items-center gap-1.5"
								style={{
									backgroundColor: '#F4E9D7',
									color: '#D97D55',
								}}
							>
								<BookOpen className="size-3 sm:size-4" />
								{story.topic}
							</span>
							{story.subtopic && (
								<span
									className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-sans font-light"
									style={{
										backgroundColor: '#F4E9D7',
										color: '#D97D55',
									}}
								>
									{story.subtopic}
								</span>
							)}
							<span
								className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-sans font-light flex items-center gap-1.5"
								style={{
									backgroundColor: '#F4E9D7',
									color: '#D97D55',
								}}
							>
								<Palette className="size-3 sm:size-4" />
								{story.style}
							</span>
							<span
								className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-sans font-light flex items-center gap-1.5"
								style={{
									backgroundColor: '#F4E9D7',
									color: '#D97D55',
								}}
							>
								<Users className="size-3 sm:size-4" />
								{story.age_group}
							</span>
							{story.language && (
								<span
									className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-sans font-light flex items-center gap-1.5"
									style={{
										backgroundColor: '#F4E9D7',
										color: '#D97D55',
									}}
								>
									<Globe className="size-3 sm:size-4" />
									{story.language}
								</span>
							)}
						</div>
					</CardHeader>
					<CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
						<div className="prose prose-slate dark:prose-invert max-w-none font-serif font-light text-slate-900 dark:text-slate-50 text-base sm:text-lg leading-relaxed">
							{story.story_content
								.split('\n')
								.map((paragraph, index) => {
									if (paragraph.trim() === '') {
										return <br key={index} />;
									}
									return (
										<p
											key={index}
											className="mb-4 last:mb-0"
										>
											{paragraph}
										</p>
									);
								})}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
