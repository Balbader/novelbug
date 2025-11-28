'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import {
	BookOpen,
	Calendar,
	Clock,
	Globe,
	Users,
	Palette,
	ArrowLeft,
	User,
	Bookmark,
	Check,
	Heart,
} from 'lucide-react';
import { gsap } from 'gsap';
import { toast } from 'sonner';

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
	author?: {
		username: string;
		first_name: string;
		last_name: string;
	};
	isLiked?: boolean;
	likesCount?: number;
}

export default function CommunityStoryPage({ storyId }: { storyId: string }) {
	const [story, setStory] = useState<Story | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);
	const [isSaved, setIsSaved] = useState(false);
	const [isLiked, setIsLiked] = useState(false);
	const [likesCount, setLikesCount] = useState(0);
	const [isLiking, setIsLiking] = useState(false);
	const pathname = usePathname();
	const username = pathname?.split('/')[1] || '';
	const router = useRouter();
	const contentRef = useRef<HTMLDivElement>(null);
	const headerRef = useRef<HTMLDivElement>(null);

	// Check if story is already saved
	useEffect(() => {
		const checkIfSaved = async (storyData: Story) => {
			try {
				// Fetch user's stories to check if this one is already saved
				const response = await fetch('/api/stories');
				if (response.ok) {
					const data = await response.json();
					if (data.success && data.stories) {
						const alreadySaved = data.stories.some(
							(savedStory: Story) =>
								savedStory.title === storyData.title &&
								savedStory.story_content ===
									storyData.story_content,
						);
						setIsSaved(alreadySaved);
					}
				}
			} catch (err) {
				console.error('Error checking if story is saved:', err);
				// Don't show error, just assume not saved
			}
		};

		if (story) {
			checkIfSaved(story);
		}
	}, [story]);

	// Fetch story
	useEffect(() => {
		const fetchStory = async () => {
			try {
				console.log('Fetching story with ID:', storyId);
				const response = await fetch(`/api/stories/${storyId}`);
				const data = await response.json();
				console.log('API Response:', { status: response.status, data });

				if (!response.ok) {
					throw new Error(data.error || 'Failed to fetch story');
				}

				if (data.success && data.story) {
					setStory(data.story);
					setIsLiked(data.story.isLiked || false);
					setLikesCount(data.story.likesCount || 0);
				} else {
					throw new Error('Story data not found');
				}
			} catch (err) {
				console.error('Error fetching story:', err);
				setError(
					err instanceof Error
						? err.message
						: 'Failed to fetch story',
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchStory();
	}, [storyId]);

	// GSAP Animations
	useEffect(() => {
		if (!story || isLoading) return;

		const ctx = gsap.context(() => {
			if (headerRef.current) {
				gsap.from(headerRef.current.children, {
					opacity: 0,
					y: 20,
					duration: 0.8,
					stagger: 0.15,
					ease: 'power2.out',
				});
			}

			if (contentRef.current) {
				gsap.from(contentRef.current, {
					opacity: 0,
					y: 30,
					duration: 0.8,
					ease: 'power2.out',
					delay: 0.2,
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

	const getAuthorName = () => {
		if (!story?.author) return 'Unknown Author';
		if (story.author.first_name || story.author.last_name) {
			return `${story.author.first_name} ${story.author.last_name}`.trim();
		}
		return story.author.username;
	};

	const handleSaveStory = async () => {
		if (!story || isSaving || isSaved) return;

		setIsSaving(true);
		try {
			const response = await fetch(`/api/stories/${storyId}/save`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			const data = await response.json();

			if (!response.ok) {
				if (response.status === 409) {
					// Already saved
					setIsSaved(true);
					toast.info('Story already saved', {
						description:
							'This story is already in your collection.',
					});
				} else {
					throw new Error(data.error || 'Failed to save story');
				}
			} else if (data.success) {
				setIsSaved(true);
				toast.success('Story saved!', {
					description: 'The story has been added to your collection.',
				});
			}
		} catch (err) {
			console.error('Error saving story:', err);
			toast.error('Failed to save story', {
				description:
					err instanceof Error
						? err.message
						: 'Please try again later.',
			});
		} finally {
			setIsSaving(false);
		}
	};

	const handleLike = async () => {
		if (!story || isLiking) return;

		setIsLiking(true);
		try {
			const method = isLiked ? 'DELETE' : 'POST';
			const response = await fetch(`/api/stories/${storyId}/like`, {
				method,
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to update like status');
			}

			if (data.success) {
				setIsLiked(data.liked);
				setLikesCount(data.likesCount);
				toast.success(data.liked ? 'Story liked!' : 'Story unliked', {
					description: data.liked
						? 'You liked this story'
						: 'You unliked this story',
				});
			}
		} catch (err) {
			console.error('Error updating like status:', err);
			toast.error('Failed to update like status', {
				description:
					err instanceof Error
						? err.message
						: 'Please try again later.',
			});
		} finally {
			setIsLiking(false);
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
				<div className="max-w-4xl mx-auto">
					<div className="animate-pulse space-y-4">
						<div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
						<div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
						<div className="h-64 bg-slate-200 dark:bg-slate-800 rounded" />
					</div>
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
							<Button
								onClick={() =>
									router.push(
										`/${username}/dashboard/community`,
									)
								}
								className="mt-4"
							>
								<ArrowLeft className="size-4 mr-2" />
								Back to Community Stories
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
			<div className="max-w-4xl mx-auto space-y-6">
				{/* Back Button and Action Buttons */}
				<div className="flex items-center justify-between mb-4 gap-3">
					<Button
						variant="ghost"
						onClick={() =>
							router.push(`/${username}/dashboard/community`)
						}
					>
						<ArrowLeft className="size-4 mr-2" />
						Back to Community Stories
					</Button>
					<div className="flex items-center gap-3">
						<Button
							onClick={handleLike}
							disabled={isLiking}
							variant="outline"
							className="font-sans font-light tracking-wide rounded-xl border-2 shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base px-4 sm:px-6"
							style={{
								borderColor: isLiked ? '#ef4444' : '#D97D55',
								color: isLiked ? '#ef4444' : '#D97D55',
								backgroundColor: isLiked
									? '#fef2f2'
									: 'transparent',
							}}
						>
							<Heart
								className={`size-4 mr-2 ${
									isLiked ? 'fill-current' : ''
								}`}
							/>
							{isLiking
								? '...'
								: `${likesCount > 0 ? likesCount : ''} ${
										isLiked ? 'Liked' : 'Like'
									}`}
						</Button>
						<Button
							onClick={handleSaveStory}
							disabled={isSaving || isSaved}
							className="font-sans font-light tracking-wide rounded-xl border-0 shadow-md hover:shadow-lg transition-all duration-300 text-white text-sm sm:text-base px-4 sm:px-6"
							style={{
								backgroundColor: isSaved
									? '#10b981'
									: '#D97D55',
							}}
						>
							{isSaved ? (
								<>
									<Check className="size-4 mr-2" />
									Saved
								</>
							) : (
								<>
									<Bookmark className="size-4 mr-2" />
									{isSaving ? 'Saving...' : 'Save Story'}
								</>
							)}
						</Button>
					</div>
				</div>

				{/* Header */}
				<div ref={headerRef} className="space-y-4">
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-slate-900 dark:text-slate-50 tracking-tight leading-tight">
						{story.title}
					</h1>
					<div className="flex flex-wrap items-center gap-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 font-sans font-light">
						{story.author ? (
							<Link
								href={`/${story.author.username}/public-profile`}
								className="flex items-center gap-2 hover:text-[#D97D55] transition-colors group/author"
							>
								<User className="size-4" />
								<span className="group-hover/author:underline">
									{getAuthorName()}
								</span>
							</Link>
						) : (
							<div className="flex items-center gap-2">
								<User className="size-4" />
								<span>{getAuthorName()}</span>
							</div>
						)}
						<div className="flex items-center gap-2">
							<Calendar className="size-4" />
							<span>{formatDate(story.created_at)}</span>
						</div>
						<div className="flex items-center gap-2">
							<Clock className="size-4" />
							<span>
								{getReadingTime(story.story_content)} min read
							</span>
						</div>
					</div>
					<div className="flex flex-wrap gap-2">
						<span
							className="px-3 py-1 rounded-full text-xs sm:text-sm font-sans font-light flex items-center gap-1"
							style={{
								backgroundColor: '#F4E9D7',
								color: '#D97D55',
							}}
						>
							<BookOpen className="size-3 sm:size-4" />
							{story.topic}
						</span>
						<span
							className="px-3 py-1 rounded-full text-xs sm:text-sm font-sans font-light flex items-center gap-1"
							style={{
								backgroundColor: '#F4E9D7',
								color: '#D97D55',
							}}
						>
							<Palette className="size-3 sm:size-4" />
							{story.style}
						</span>
						<span
							className="px-3 py-1 rounded-full text-xs sm:text-sm font-sans font-light flex items-center gap-1"
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
								className="px-3 py-1 rounded-full text-xs sm:text-sm font-sans font-light flex items-center gap-1"
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
				</div>

				{/* Story Content */}
				<Card
					ref={contentRef}
					className="border-slate-200/60 dark:border-slate-800/60 relative overflow-hidden"
					style={{
						backgroundColor: '#F5F1E8',
						backgroundImage: `
							linear-gradient(rgba(139, 111, 71, 0.03) 1px, transparent 1px),
							linear-gradient(90deg, rgba(139, 111, 71, 0.03) 1px, transparent 1px)
						`,
						backgroundSize: '20px 20px',
					}}
				>
					<CardContent className="p-6 sm:p-8 md:p-12">
						<div className="prose prose-slate dark:prose-invert max-w-none">
							<div className="whitespace-pre-wrap text-base sm:text-lg leading-relaxed font-sans font-light text-slate-700 dark:text-slate-300">
								{story.story_content}
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
