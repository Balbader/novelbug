'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
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
	Sparkles,
	Edit,
	Save,
	X,
	User,
	Heart,
	BookMarked,
	Tag,
} from 'lucide-react';
import { gsap } from 'gsap';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
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
	first_name?: string;
	gender?: string;
	created_at: Date | string;
	updated_at: Date | string;
	shared: boolean;
	published: boolean;
}

export default function StoryPage({ storyId }: { storyId: string }) {
	const [story, setStory] = useState<Story | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [editForm, setEditForm] = useState<Partial<Story>>({});
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

	// Form options matching the generate form
	const genders = [
		{ value: 'boy', label: 'Boy' },
		{ value: 'girl', label: 'Girl' },
		{ value: 'non-binary', label: 'Non-binary' },
		{ value: 'prefer-not-to-say', label: 'Prefer not to say' },
	];

	const ageGroups = [
		{ value: '3-5', label: '3-5 years (Preschool)' },
		{ value: '6-8', label: '6-8 years (Early Elementary)' },
		{ value: '9-12', label: '9-12 years (Elementary)' },
	];

	const languages = [
		{ value: 'en', label: 'English' },
		{ value: 'es', label: 'Spanish' },
		{ value: 'fr', label: 'French' },
		{ value: 'de', label: 'German' },
		{ value: 'it', label: 'Italian' },
		{ value: 'pt', label: 'Portuguese' },
		{ value: 'ar', label: 'Arabic' },
		{ value: 'ru', label: 'Russian' },
		{ value: 'zh', label: 'Chinese' },
		{ value: 'ja', label: 'Japanese' },
		{ value: 'ko', label: 'Korean' },
		{ value: 'hi', label: 'Hindi' },
		{ value: 'bn', label: 'Bengali' },
		{ value: 'pa', label: 'Punjabi' },
		{ value: 'ta', label: 'Tamil' },
	];

	const topics = [
		{ value: 'science', label: 'Science' },
		{ value: 'history', label: 'History' },
		{ value: 'math', label: 'Mathematics' },
		{ value: 'geography', label: 'Geography' },
		{ value: 'nature', label: 'Nature & Animals' },
		{ value: 'space', label: 'Space & Astronomy' },
		{ value: 'art', label: 'Art & Creativity' },
		{ value: 'music', label: 'Music' },
		{ value: 'sports', label: 'Sports' },
		{ value: 'culture', label: 'Culture & Traditions' },
	];

	const subtopics: Record<string, { value: string; label: string }[]> = {
		science: [
			{ value: 'dinosaurs', label: 'Dinosaurs' },
			{ value: 'ocean', label: 'Ocean Life' },
			{ value: 'weather', label: 'Weather & Climate' },
			{ value: 'plants', label: 'Plants & Trees' },
			{ value: 'human-body', label: 'Human Body' },
			{ value: 'chemistry', label: 'Chemistry' },
			{ value: 'physics', label: 'Physics' },
			{ value: 'biology', label: 'Biology' },
			{ value: 'earth-science', label: 'Earth Science' },
			{ value: 'energy', label: 'Energy & Sustainability' },
			{ value: 'technology', label: 'Technology & Innovation' },
			{ value: 'engineering', label: 'Engineering & Design' },
			{ value: 'mathematics', label: 'Mathematics' },
			{ value: 'computer-science', label: 'Computer Science' },
			{ value: 'programming', label: 'Programming & Coding' },
			{ value: 'robotics', label: 'Robotics & Automation' },
		],
		history: [
			{ value: 'ancient-civilizations', label: 'Ancient Civilizations' },
			{ value: 'medieval', label: 'Medieval Times' },
			{ value: 'explorers', label: 'Explorers' },
			{ value: 'inventions', label: 'Great Inventions' },
			{ value: 'leaders', label: 'Historical Leaders' },
			{ value: 'wars', label: 'Wars & Conflicts' },
			{ value: 'peace', label: 'Peace & Diplomacy' },
			{ value: 'culture', label: 'Culture & Traditions' },
			{ value: 'art', label: 'Art & Creativity' },
			{ value: 'music', label: 'Music' },
			{ value: 'sports', label: 'Sports' },
		],
		math: [
			{ value: 'counting', label: 'Counting & Numbers' },
			{ value: 'shapes', label: 'Shapes & Geometry' },
			{ value: 'patterns', label: 'Patterns' },
			{ value: 'measurement', label: 'Measurement' },
			{ value: 'time', label: 'Time & Clocks' },
			{ value: 'algebra', label: 'Algebra' },
			{ value: 'geometry', label: 'Geometry' },
			{ value: 'calculus', label: 'Calculus' },
			{ value: 'statistics', label: 'Statistics' },
			{ value: 'probability', label: 'Probability' },
			{ value: 'logic', label: 'Logic & Reasoning' },
			{ value: 'number-theory', label: 'Number Theory' },
			{ value: 'discrete-math', label: 'Discrete Mathematics' },
		],
		geography: [
			{ value: 'continents', label: 'Continents' },
			{ value: 'countries', label: 'Countries' },
			{ value: 'landmarks', label: 'Famous Landmarks' },
			{ value: 'oceans', label: 'Oceans & Seas' },
			{ value: 'mountains', label: 'Mountains & Rivers' },
			{ value: 'rivers', label: 'Rivers & Lakes' },
			{ value: 'climate', label: 'Climate & Weather' },
			{ value: 'environment', label: 'Environment & Conservation' },
			{ value: 'geology', label: 'Geology & Earth Science' },
			{ value: 'meteorology', label: 'Meteorology & Weather' },
			{ value: 'oceanography', label: 'Oceanography & Marine Science' },
		],
		nature: [
			{ value: 'forest', label: 'Forest Animals' },
			{ value: 'savanna', label: 'Savanna Animals' },
			{ value: 'ocean-creatures', label: 'Ocean Creatures' },
			{ value: 'birds', label: 'Birds' },
			{ value: 'insects', label: 'Insects' },
			{ value: 'trees', label: 'Trees & Forests' },
			{ value: 'plants', label: 'Plants' },
			{ value: 'weather', label: 'Weather' },
			{ value: 'climate', label: 'Climate' },
			{ value: 'environment', label: 'Environment' },
			{ value: 'geology', label: 'Geology' },
			{ value: 'meteorology', label: 'Meteorology' },
			{ value: 'oceanography', label: 'Oceanography' },
		],
		space: [
			{ value: 'planets', label: 'Planets' },
			{ value: 'stars', label: 'Stars & Constellations' },
			{ value: 'moon', label: 'The Moon' },
			{ value: 'astronauts', label: 'Astronauts & Space Travel' },
			{ value: 'solar-system', label: 'Solar System' },
		],
		art: [
			{ value: 'painting', label: 'Painting' },
			{ value: 'sculpture', label: 'Sculpture' },
			{ value: 'colors', label: 'Colors' },
			{ value: 'famous-artists', label: 'Famous Artists' },
		],
		music: [
			{ value: 'instruments', label: 'Musical Instruments' },
			{ value: 'genres', label: 'Music Genres' },
			{ value: 'composers', label: 'Famous Composers' },
		],
		sports: [
			{ value: 'soccer', label: 'Soccer' },
			{ value: 'basketball', label: 'Basketball' },
			{ value: 'swimming', label: 'Swimming' },
			{ value: 'olympics', label: 'Olympics' },
		],
		culture: [
			{ value: 'festivals', label: 'Festivals & Celebrations' },
			{ value: 'traditions', label: 'Traditions' },
			{ value: 'food', label: 'Food & Cuisine' },
			{ value: 'clothing', label: 'Traditional Clothing' },
		],
	};

	const styles = [
		{ value: 'adventure', label: 'Adventure' },
		{ value: 'magical', label: 'Magical & Fantasy' },
		{ value: 'educational', label: 'Educational' },
		{ value: 'humorous', label: 'Humorous & Funny' },
		{ value: 'mystery', label: 'Mystery' },
		{ value: 'friendship', label: 'Friendship' },
		{ value: 'courage', label: 'Courage & Bravery' },
		{ value: 'kindness', label: 'Kindness & Empathy' },
		{ value: 'nature', label: 'Nature & Environment' },
		{ value: 'science-fiction', label: 'Science Fiction' },
	];

	const selectedTopic = editForm.topic || '';
	const availableSubtopics = selectedTopic
		? subtopics[selectedTopic] || []
		: [];

	const handleTopicChange = (value: string) => {
		setEditForm({
			...editForm,
			topic: value,
			subtopic: '', // Reset subtopic when topic changes
		});
	};

	const handleEdit = () => {
		if (story) {
			setEditForm({
				title: story.title,
				topic: story.topic,
				subtopic: story.subtopic,
				style: story.style,
				age_group: story.age_group,
				language: story.language,
				story_content: story.story_content,
				first_name: story.first_name || '',
				gender: story.gender || '',
			});
			setIsEditing(true);
		}
	};

	const handleCancel = () => {
		setIsEditing(false);
		setEditForm({});
	};

	const handleSave = async () => {
		if (!story) return;

		setIsSaving(true);
		try {
			const response = await fetch(`/api/stories/${storyId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(editForm),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to update story');
			}

			if (data.success && data.story) {
				setStory(data.story);
				setIsEditing(false);
				setEditForm({});
				toast.success('Story updated successfully!', {
					description: 'Your changes have been saved.',
				});
			}
		} catch (err) {
			console.error('Error updating story:', err);
			toast.error('Failed to update story', {
				description:
					err instanceof Error
						? err.message
						: 'Please try again later.',
			});
		} finally {
			setIsSaving(false);
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
				<div className="max-w-4xl mx-auto">
					<div
						className="rounded-lg shadow-2xl p-8 sm:p-10 md:p-12 lg:p-16 animate-pulse"
						style={{
							backgroundColor: '#F5F1E8',
							backgroundImage: `
								linear-gradient(rgba(139, 111, 71, 0.06) 1px, transparent 1px),
								linear-gradient(90deg, rgba(139, 111, 71, 0.06) 1px, transparent 1px)
							`,
							backgroundSize: '20px 20px',
							boxShadow:
								'0 10px 40px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(139, 111, 71, 0.2)',
						}}
					>
						<div className="h-8 bg-slate-200/50 dark:bg-slate-800/50 rounded w-3/4 mb-4" />
						<div className="h-4 bg-slate-200/50 dark:bg-slate-800/50 rounded w-1/2 mb-6" />
						<div className="space-y-3">
							<div className="h-4 bg-slate-200/50 dark:bg-slate-800/50 rounded" />
							<div className="h-4 bg-slate-200/50 dark:bg-slate-800/50 rounded" />
							<div className="h-4 bg-slate-200/50 dark:bg-slate-800/50 rounded w-5/6" />
						</div>
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
							{isEditing ? (
								<Input
									value={editForm.title || ''}
									onChange={(e) =>
										setEditForm({
											...editForm,
											title: e.target.value,
										})
									}
									className="text-2xl sm:text-3xl md:text-4xl font-serif font-light mb-2"
									placeholder="Story title"
								/>
							) : (
								<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-light text-slate-900 dark:text-slate-50 mb-1 sm:mb-2 tracking-tight leading-tight">
									{story.title}
								</h1>
							)}
							{!isEditing && (
								<div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 font-sans font-light">
									<CardDescription className="flex items-center gap-1.5 m-0">
										<Calendar className="size-4" />
										{formatDate(story.created_at)}
									</CardDescription>
									<CardDescription className="flex items-center gap-1.5 m-0">
										<Clock className="size-4" />
										{getReadingTime(
											story.story_content,
										)}{' '}
										min read
									</CardDescription>
								</div>
							)}
						</div>
						{!isEditing ? (
							<Button
								onClick={handleEdit}
								variant="outline"
								className="font-sans font-light"
								style={{
									borderColor: '#D97D55',
									color: '#D97D55',
								}}
							>
								<Edit className="size-4 mr-2" />
								Edit Story
							</Button>
						) : (
							<div className="flex gap-2">
								<Button
									onClick={handleSave}
									disabled={isSaving}
									className="font-sans font-light text-white"
									style={{
										backgroundColor: '#D97D55',
									}}
								>
									<Save className="size-4 mr-2" />
									{isSaving ? 'Saving...' : 'Save'}
								</Button>
								<Button
									onClick={handleCancel}
									variant="outline"
									disabled={isSaving}
									className="font-sans font-light"
								>
									<X className="size-4 mr-2" />
									Cancel
								</Button>
							</div>
						)}
					</div>
				</div>

				{/* Story Content */}
				<div
					ref={contentRef}
					className="rounded-lg shadow-2xl p-8 sm:p-10 md:p-12 lg:p-16"
					style={{
						backgroundColor: '#F5F1E8',
						backgroundImage: `
							linear-gradient(rgba(139, 111, 71, 0.06) 1px, transparent 1px),
							linear-gradient(90deg, rgba(139, 111, 71, 0.06) 1px, transparent 1px)
						`,
						backgroundSize: '20px 20px',
						boxShadow:
							'0 10px 40px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(139, 111, 71, 0.2)',
					}}
				>
					<div className="relative z-10">
						{isEditing ? (
							<div className="space-y-6">
								{/* Title Field */}
								<div>
									<Label className="text-base font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-3">
										<BookOpen className="h-4 w-4 text-[#8B6F47]" />
										Story Title
									</Label>
									<Input
										value={editForm.title || ''}
										onChange={(e) =>
											setEditForm({
												...editForm,
												title: e.target.value,
											})
										}
										placeholder="e.g., The Adventure of the Curious Cat"
										className="bg-white/80 dark:bg-slate-800/80 border-slate-300/50 dark:border-slate-700/50 focus:border-[#8B6F47] focus:ring-[#8B6F47]/20 h-11 text-base"
									/>
									<p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
										Give your story a title (optional)
									</p>
								</div>

								{/* First Name and Gender */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
									<div>
										<Label className="text-base font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-3">
											<User className="h-4 w-4 text-[#8B6F47]" />
											First Name
										</Label>
										<Input
											value={editForm.first_name || ''}
											onChange={(e) =>
												setEditForm({
													...editForm,
													first_name: e.target.value,
												})
											}
											placeholder="e.g., Emma"
											className="bg-white/80 dark:bg-slate-800/80 border-slate-300/50 dark:border-slate-700/50 focus:border-[#8B6F47] focus:ring-[#8B6F47]/20 h-11 text-base"
										/>
										<p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
											The child's first name (optional -
											for personalization)
										</p>
									</div>
									<div>
										<Label className="text-base font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-3">
											<Heart className="h-4 w-4 text-[#8B6F47]" />
											Gender
										</Label>
										<Select
											value={editForm.gender || undefined}
											onValueChange={(value) =>
												setEditForm({
													...editForm,
													gender: value,
												})
											}
										>
											<SelectTrigger className="w-full bg-white/80 dark:bg-slate-800/80 border-slate-300/50 dark:border-slate-700/50 focus:border-[#8B6F47] focus:ring-[#8B6F47]/20 h-11">
												<SelectValue placeholder="Select gender" />
											</SelectTrigger>
											<SelectContent>
												{genders.map((gender) => (
													<SelectItem
														key={gender.value}
														value={gender.value}
													>
														{gender.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
											Select the child's gender (optional
											- for personalization)
										</p>
									</div>
								</div>

								{/* Age Group and Language */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
									<div>
										<Label className="text-base font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-3">
											<Users className="h-4 w-4 text-[#8B6F47]" />
											Age Group
										</Label>
										<Select
											value={editForm.age_group || ''}
											onValueChange={(value) =>
												setEditForm({
													...editForm,
													age_group: value,
												})
											}
										>
											<SelectTrigger className="w-full bg-white/80 dark:bg-slate-800/80 border-slate-300/50 dark:border-slate-700/50 focus:border-[#8B6F47] focus:ring-[#8B6F47]/20 h-11">
												<SelectValue placeholder="Select age group" />
											</SelectTrigger>
											<SelectContent>
												{ageGroups.map((age) => (
													<SelectItem
														key={age.value}
														value={age.value}
													>
														{age.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
											Choose the age range
										</p>
									</div>
									<div>
										<Label className="text-base font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-3">
											<Globe className="h-4 w-4 text-[#8B6F47]" />
											Language
										</Label>
										<Select
											value={editForm.language || ''}
											onValueChange={(value) =>
												setEditForm({
													...editForm,
													language: value,
												})
											}
										>
											<SelectTrigger className="w-full bg-white/80 dark:bg-slate-800/80 border-slate-300/50 dark:border-slate-700/50 focus:border-[#8B6F47] focus:ring-[#8B6F47]/20 h-11">
												<SelectValue placeholder="Select language" />
											</SelectTrigger>
											<SelectContent>
												{languages.map((lang) => (
													<SelectItem
														key={lang.value}
														value={lang.value}
													>
														{lang.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
											Choose the language
										</p>
									</div>
								</div>

								{/* Topic Field */}
								<div>
									<Label className="text-base font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-3">
										<BookMarked className="h-4 w-4 text-[#8B6F47]" />
										Topic
									</Label>
									<Select
										value={editForm.topic || ''}
										onValueChange={handleTopicChange}
									>
										<SelectTrigger className="w-full bg-white/80 dark:bg-slate-800/80 border-slate-300/50 dark:border-slate-700/50 focus:border-[#8B6F47] focus:ring-[#8B6F47]/20 h-11">
											<SelectValue placeholder="Select a topic" />
										</SelectTrigger>
										<SelectContent>
											{topics.map((topic) => (
												<SelectItem
													key={topic.value}
													value={topic.value}
												>
													{topic.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
										What subject would you like the story to
										be about?
									</p>
								</div>

								{/* Subtopic Field */}
								<div>
									<Label className="text-base font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-3">
										<Tag className="h-4 w-4 text-[#8B6F47]" />
										Subtopic
									</Label>
									<Select
										value={editForm.subtopic || ''}
										onValueChange={(value) =>
											setEditForm({
												...editForm,
												subtopic: value,
											})
										}
										disabled={
											!selectedTopic ||
											availableSubtopics.length === 0
										}
									>
										<SelectTrigger className="w-full bg-white/80 dark:bg-slate-800/80 border-slate-300/50 dark:border-slate-700/50 focus:border-[#8B6F47] focus:ring-[#8B6F47]/20 h-11 disabled:opacity-50">
											<SelectValue
												placeholder={
													!selectedTopic
														? 'Select a topic first'
														: 'Select a subtopic'
												}
											/>
										</SelectTrigger>
										<SelectContent>
											{availableSubtopics.map(
												(subtopic) => (
													<SelectItem
														key={subtopic.value}
														value={subtopic.value}
													>
														{subtopic.label}
													</SelectItem>
												),
											)}
										</SelectContent>
									</Select>
									<p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
										Choose a specific area within your
										selected topic
									</p>
								</div>

								{/* Style Field */}
								<div>
									<Label className="text-base font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-3">
										<Palette className="h-4 w-4 text-[#8B6F47]" />
										Story Style
									</Label>
									<Select
										value={editForm.style || ''}
										onValueChange={(value) =>
											setEditForm({
												...editForm,
												style: value,
											})
										}
									>
										<SelectTrigger className="w-full bg-white/80 dark:bg-slate-800/80 border-slate-300/50 dark:border-slate-700/50 focus:border-[#8B6F47] focus:ring-[#8B6F47]/20 h-11">
											<SelectValue placeholder="Select story style" />
										</SelectTrigger>
										<SelectContent>
											{styles.map((style) => (
												<SelectItem
													key={style.value}
													value={style.value}
												>
													{style.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
										Choose the narrative style for your
										story
									</p>
								</div>
								{/* Story Content Field */}
								<div>
									<Label className="text-base font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-3">
										<BookOpen className="h-4 w-4 text-[#8B6F47]" />
										Story Content
									</Label>
									<Textarea
										value={editForm.story_content || ''}
										onChange={(e) =>
											setEditForm({
												...editForm,
												story_content: e.target.value,
											})
										}
										className="bg-white/80 dark:bg-slate-800/80 border-slate-300/50 dark:border-slate-700/50 focus:border-[#8B6F47] focus:ring-[#8B6F47]/20 min-h-[400px] font-serif font-light text-base leading-relaxed"
										placeholder="Enter your story content here..."
									/>
									<p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
										Edit the story content
									</p>
								</div>
							</div>
						) : (
							<>
								{/* Tags */}
								<div className="mb-6 flex flex-wrap gap-2 sm:gap-3">
									<span
										className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-sans font-light flex items-center gap-1.5"
										style={{
											backgroundColor:
												'rgba(255, 255, 255, 0.6)',
											color: '#8B6F47',
										}}
									>
										<BookOpen className="size-3 sm:size-4" />
										{story.topic}
									</span>
									{story.subtopic && (
										<span
											className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-sans font-light"
											style={{
												backgroundColor:
													'rgba(255, 255, 255, 0.6)',
												color: '#8B6F47',
											}}
										>
											{story.subtopic}
										</span>
									)}
									<span
										className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-sans font-light flex items-center gap-1.5"
										style={{
											backgroundColor:
												'rgba(255, 255, 255, 0.6)',
											color: '#8B6F47',
										}}
									>
										<Palette className="size-3 sm:size-4" />
										{story.style}
									</span>
									<span
										className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-sans font-light flex items-center gap-1.5"
										style={{
											backgroundColor:
												'rgba(255, 255, 255, 0.6)',
											color: '#8B6F47',
										}}
									>
										<Users className="size-3 sm:size-4" />
										{story.age_group}
									</span>
									{story.language && (
										<span
											className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-sans font-light flex items-center gap-1.5"
											style={{
												backgroundColor:
													'rgba(255, 255, 255, 0.6)',
												color: '#8B6F47',
											}}
										>
											<Globe className="size-3 sm:size-4" />
											{story.language}
										</span>
									)}
								</div>

								{/* Story Content */}
								<div className="prose prose-slate max-w-none font-serif font-light text-slate-800 text-base sm:text-lg leading-relaxed">
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
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
