'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Sparkles,
	BookOpen,
	Users,
	Globe,
	BookMarked,
	Tag,
	Palette,
	Loader2,
	CheckCircle2,
	Wand2,
	Book,
	PenTool,
	User,
	Heart,
} from 'lucide-react';

const storyFormSchema = z.object({
	title: z
		.string()
		.max(255, 'Title must be less than 255 characters')
		.optional(),
	first_name: z
		.string()
		.max(100, 'First name must be less than 100 characters')
		.optional(),
	gender: z.string().optional(),
	age_group: z.string().min(1, 'Age group is required'),
	language: z.string().min(1, 'Language is required'),
	topic: z.string().min(1, 'Topic is required'),
	subtopic: z.string().min(1, 'Subtopic is required'),
	style: z.string().min(1, 'Style is required'),
});

type StoryFormValues = z.infer<typeof storyFormSchema>;

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
	{ value: 'friendship', label: 'Friendship & Kindness' },
	{ value: 'bedtime', label: 'Calm Bedtime' },
];

// Progress steps with messages
const progressSteps = [
	{
		progress: 10,
		message: 'Creating magical characters...',
		icon: Users,
	},
	{
		progress: 30,
		message: 'Designing exciting scenes...',
		icon: BookOpen,
	},
	{
		progress: 60,
		message: 'Weaving the story together...',
		icon: PenTool,
	},
	{
		progress: 85,
		message: 'Adding the finishing touches...',
		icon: Wand2,
	},
	{ progress: 100, message: 'Your story is ready!', icon: Book },
];

interface GeneratedStory {
	story: string;
	characters: string;
	scenes: string;
	metadata: {
		title: string;
		age_group: string;
		language: string;
		topic: string;
		subtopic: string;
		style: string;
	};
}

export default function Generate() {
	const [isGenerating, setIsGenerating] = useState(false);
	const [generatedStory, setGeneratedStory] = useState<GeneratedStory | null>(
		null,
	);
	const [error, setError] = useState<string | null>(null);
	const [progress, setProgress] = useState(0);
	const [elapsedTime, setElapsedTime] = useState(0);
	const [currentStep, setCurrentStep] = useState('');
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	const form = useForm<StoryFormValues>({
		resolver: zodResolver(storyFormSchema),
		defaultValues: {
			title: '',
			age_group: '',
			language: '',
			topic: '',
			subtopic: '',
			style: '',
		},
	});

	const selectedTopic = form.watch('topic');
	const availableSubtopics = selectedTopic
		? subtopics[selectedTopic] || []
		: [];

	// Reset subtopic when topic changes
	const handleTopicChange = (value: string) => {
		form.setValue('topic', value);
		form.setValue('subtopic', '');
	};

	useEffect(() => {
		if (isGenerating) {
			// Reset progress and timer
			setProgress(0);
			setElapsedTime(0);
			setCurrentStep(progressSteps[0].message);

			// Timer: update every second
			timerRef.current = setInterval(() => {
				setElapsedTime((prev) => prev + 1);
			}, 1000);

			// Progress simulation: update every 500ms (slower)
			let currentStepIndex = 0;
			intervalRef.current = setInterval(() => {
				setProgress((prev) => {
					// Gradually increase progress (slower increment)
					const nextProgress = Math.min(prev + 0.8, 100);

					// Update step message based on progress
					const step = progressSteps.find(
						(s) => nextProgress >= s.progress,
					);
					if (
						step &&
						step.progress > progressSteps[currentStepIndex].progress
					) {
						currentStepIndex = progressSteps.findIndex(
							(s) => s.progress === step.progress,
						);
						setCurrentStep(step.message);
					}

					return nextProgress;
				});
			}, 500);
		} else {
			// Clean up intervals
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
			if (timerRef.current) {
				clearInterval(timerRef.current);
				timerRef.current = null;
			}
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, [isGenerating]);

	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	const onSubmit = async (data: StoryFormValues) => {
		setIsGenerating(true);
		setError(null);
		setGeneratedStory(null);
		setProgress(0);
		setElapsedTime(0);

		try {
			// Filter out empty optional fields
			const payload = {
				...data,
				title: data.title?.trim() || undefined,
				first_name: data.first_name || undefined,
				gender: data.gender?.trim() || undefined,
			};

			const response = await fetch('/api/generate/story', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to generate story');
			}

			const result = await response.json();
			// Complete the progress bar
			setProgress(100);
			setCurrentStep(progressSteps[progressSteps.length - 1].message);

			// Small delay to show completion
			await new Promise((resolve) => setTimeout(resolve, 500));

			setGeneratedStory(result);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Failed to generate story',
			);
		} finally {
			setIsGenerating(false);
		}
	};

	const handleGenerateNew = () => {
		setGeneratedStory(null);
		setError(null);
		form.reset();
	};

	// Format story text to look like a real book
	const formatStoryText = (text: string, title?: string): React.ReactNode => {
		if (!text) return null;

		// Split by double newlines or single newlines to get paragraphs
		// Also handle cases where text might have markdown-like formatting
		let paragraphs = text
			.split(/\n\s*\n|\n(?=\S)/)
			.map((p) => p.trim())
			.filter((p) => p.length > 0);

		// Remove the title if it appears as the first paragraph
		if (title && paragraphs.length > 0) {
			const firstParagraph = paragraphs[0];
			// Check if the first paragraph matches the title (case-insensitive, ignoring extra whitespace)
			if (
				firstParagraph.toLowerCase().trim() ===
					title.toLowerCase().trim() ||
				firstParagraph.toLowerCase().includes(title.toLowerCase())
			) {
				paragraphs = paragraphs.slice(1);
			}
		}

		return (
			<div className="story-content">
				{paragraphs.map((paragraph, index) => {
					// Check if it's a heading (usually short and in caps or has special formatting)
					const isHeading =
						paragraph.length < 100 &&
						(paragraph === paragraph.toUpperCase() ||
							paragraph.startsWith('Chapter') ||
							paragraph.startsWith('CHAPTER') ||
							paragraph.match(/^[A-Z\s]+$/));

					// Check if it's dialogue (starts with quote or contains dialogue markers)
					const isDialogue =
						paragraph.startsWith('"') ||
						paragraph.startsWith("'") ||
						/^["'].*["']/.test(paragraph) ||
						paragraph.includes(' said ') ||
						paragraph.includes(' asked ') ||
						paragraph.includes(' replied ') ||
						paragraph.includes(' exclaimed ');

					if (isHeading) {
						return (
							<h3
								key={index}
								className="text-2xl font-serif text-slate-800 mt-12 mb-6 text-center first:mt-0 tracking-wide"
							>
								{paragraph}
							</h3>
						);
					}

					// First paragraph gets a drop cap
					if (index === 0) {
						const firstChar = paragraph.charAt(0);
						const restOfText = paragraph.slice(1);

						return (
							<p
								key={index}
								className="mb-5 text-slate-700 leading-8 text-lg relative"
							>
								<span
									className="float-left font-serif text-slate-800 leading-none mr-2 mt-1"
									style={{
										fontSize: '4.5rem',
										lineHeight: '0.8',
									}}
								>
									{firstChar}
								</span>
								<span className="block">{restOfText}</span>
							</p>
						);
					}

					// Dialogue gets special formatting
					if (isDialogue) {
						return (
							<p
								key={index}
								className="mb-5 text-slate-700 leading-8 text-lg italic pl-10 border-l-3 border-slate-300/40"
								style={{ borderLeftWidth: '3px' }}
							>
								{paragraph}
							</p>
						);
					}

					// Regular paragraphs with proper indentation (book style)
					return (
						<p
							key={index}
							className="mb-5 text-slate-700 leading-8 text-lg"
							style={{ textIndent: '2em' }}
						>
							{paragraph}
						</p>
					);
				})}
			</div>
		);
	};

	return (
		<div
			className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative"
			style={{
				backgroundColor: '#F5F1E8',
			}}
		>
			<div className="max-w-4xl mx-auto relative z-10">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-4xl sm:text-5xl font-serif font-light text-slate-800 mb-4">
						{isGenerating
							? 'Crafting Your Story'
							: generatedStory
								? 'Your Story'
								: 'Create Your Story'}
					</h1>
					<p className="text-lg text-slate-600">
						{isGenerating
							? 'Our magical storytellers are working their magic...'
							: generatedStory
								? 'Here is your magical story!'
								: "Tell us what you'd like to learn, and we'll turn it into a magical bedtime story"}
					</p>
				</div>

				{/* Error Message */}
				{error && (
					<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
						<p>{error}</p>
					</div>
				)}

				{/* Progress Bar and Timer */}
				{isGenerating && (
					<div
						className="mb-8 rounded-lg shadow-2xl p-8 sm:p-10 md:p-12"
						style={{
							backgroundColor: '#FFFFFF',
							backgroundImage: `
								linear-gradient(rgba(139, 111, 71, 0.08) 1px, transparent 1px),
								linear-gradient(90deg, rgba(139, 111, 71, 0.08) 1px, transparent 1px)
							`,
							backgroundSize: '20px 20px',
							boxShadow:
								'0 10px 40px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(139, 111, 71, 0.2)',
						}}
					>
						<div className="relative z-10">
							<div className="space-y-6">
								{/* Header */}
								<div className="text-center">
									<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D97D55]/10 mb-4">
										<Loader2 className="h-8 w-8 text-[#D97D55] animate-spin" />
									</div>
									<h2 className="text-2xl font-serif text-slate-800 mb-2">
										Crafting Your Story
									</h2>
									<p className="text-slate-600">
										Our magical storytellers are hard at
										work!
									</p>
								</div>

								{/* Progress Bar */}
								<div className="space-y-3">
									<div className="flex items-center justify-between mb-2">
										<div className="flex items-center gap-2 text-slate-700">
											{(() => {
												const step = progressSteps.find(
													(s) =>
														progress >= s.progress,
												);
												const Icon =
													step?.icon || Wand2;
												return (
													<Icon className="h-5 w-5 text-[#D97D55]" />
												);
											})()}
											<span className="text-sm font-medium">
												{currentStep}
											</span>
										</div>
										<div className="text-sm font-semibold text-slate-700">
											{Math.round(progress)}%
										</div>
									</div>
									<div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-200/50">
										<div
											className="h-full rounded-full transition-all duration-300 ease-out"
											style={{
												width: `${progress}%`,
												background:
													'linear-gradient(90deg, #D97D55 0%, #C86A45 100%)',
											}}
										/>
									</div>
								</div>

								{/* Timer */}
								<div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-300/30">
									<Loader2 className="h-4 w-4 text-slate-500 animate-spin" />
									<span className="text-sm text-slate-600">
										Time elapsed:{' '}
										<span className="font-mono font-semibold text-slate-800">
											{formatTime(elapsedTime)}
										</span>
									</span>
								</div>

								{/* Fun messages */}
								<div className="text-center pt-2">
									<p className="text-xs text-slate-500 italic">
										{progress < 30
											? '✨ Creating characters that will come to life...'
											: progress < 60
												? '🎨 Painting scenes full of wonder...'
												: progress < 85
													? '📖 Weaving words into magic...'
													: '🌟 Almost there! Adding the final sparkles...'}
									</p>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Generated Story Display */}
				{generatedStory && (
					<div className="mb-8">
						{/* Book Cover/Title Page */}
						<div
							className="mb-6 rounded-lg shadow-2xl p-8 sm:p-12 md:p-16 text-center"
							style={{
								backgroundColor: '#FFFFFF',
								backgroundImage: `
									linear-gradient(rgba(139, 111, 71, 0.08) 1px, transparent 1px),
									linear-gradient(90deg, rgba(139, 111, 71, 0.08) 1px, transparent 1px)
								`,
								backgroundSize: '20px 20px',
								boxShadow:
									'0 10px 40px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(139, 111, 71, 0.2)',
							}}
						>
							<div className="relative z-10">
								<h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-slate-800 mb-4 leading-tight">
									{generatedStory.metadata.title}
								</h1>
								<div className="mt-8 pt-6 border-t border-slate-300/30">
									<div className="flex flex-wrap justify-center gap-3 text-sm text-slate-600">
										<span className="px-3 py-1.5 bg-slate-200/50 rounded-full">
											Age:{' '}
											{generatedStory.metadata.age_group}
										</span>
										<span className="px-3 py-1.5 bg-slate-200/50 rounded-full">
											{generatedStory.metadata.topic} -{' '}
											{generatedStory.metadata.subtopic}
										</span>
										<span className="px-3 py-1.5 bg-slate-200/50 rounded-full">
											{generatedStory.metadata.style}
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Story Content - Book Pages */}
						<div
							className="rounded-lg shadow-2xl p-8 sm:p-10 md:p-12 lg:p-16"
							style={{
								backgroundColor: '#FFFFFF',
								backgroundImage: `
									linear-gradient(rgba(139, 111, 71, 0.08) 1px, transparent 1px),
									linear-gradient(90deg, rgba(139, 111, 71, 0.08) 1px, transparent 1px)
								`,
								backgroundSize: '20px 20px',
								boxShadow:
									'0 10px 40px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(139, 111, 71, 0.2)',
							}}
						>
							<div className="relative z-10">
								{/* Story Text with Book Formatting */}
								<div className="max-w-3xl mx-auto font-serif">
									{formatStoryText(
										generatedStory.story,
										generatedStory.metadata.title,
									)}
								</div>

								{/* End of Story Decoration */}
								<div className="mt-12 pt-8 border-t border-slate-300/30 text-center">
									<div className="text-slate-400 text-2xl mb-4">
										❦
									</div>
									<p className="text-slate-500 text-sm italic">
										The End
									</p>
								</div>
							</div>
						</div>

						{/* Action Button */}
						<div className="mt-8 flex justify-center">
							<Button
								onClick={handleGenerateNew}
								variant="outline"
								size="lg"
								className="bg-white/90 border-slate-300/50 hover:bg-white text-slate-700 shadow-lg"
							>
								<Sparkles className="mr-2 h-4 w-4" />
								Generate Another Story
							</Button>
						</div>
					</div>
				)}

				{/* Form Card - Book Page */}
				{!generatedStory && !isGenerating && (
					<div
						className="relative rounded-lg shadow-2xl p-6 sm:p-8 md:p-10"
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
						{/* Left margin line (like a notebook) */}
						<div
							className="absolute left-0 top-0 bottom-0 w-4 sm:w-12 md:w-16"
							style={{
								borderRight:
									'2px solid rgba(139, 111, 71, 0.15)',
							}}
						/>

						{/* Subtle paper texture */}
						<div
							className="absolute inset-0 rounded-lg opacity-30 pointer-events-none"
							style={{
								backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%238B6F47' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")`,
							}}
						/>

						<div className="relative z-10 pl-4 sm:pl-12 md:pl-16 text-slate-800">
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-8"
								>
									{/* Title Field */}
									<FormField
										control={form.control}
										name="title"
										render={({ field }) => (
											<FormItem className="space-y-3">
												<FormLabel className="text-base font-medium text-slate-700 flex items-center gap-2">
													<BookOpen className="h-4 w-4 text-[#8B6F47]" />
													Story Title
												</FormLabel>
												<FormControl>
													<Input
														placeholder="e.g., The Adventure of the Curious Cat"
														className="bg-white/80 border-slate-300/50 focus:border-[#8B6F47] focus:ring-[#8B6F47]/20 h-11 text-base"
														{...field}
														value={
															field.value || ''
														}
													/>
												</FormControl>
												<FormDescription className="text-sm text-slate-500">
													Give your story a title
													(optional - we can generate
													one for you)
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Two Column Layout for First Name and Gender */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
										{/* First Name Field */}
										<FormField
											control={form.control}
											name="first_name"
											render={({ field }) => (
												<FormItem className="space-y-3">
													<FormLabel className="text-base font-medium text-slate-700 flex items-center gap-2">
														<User className="h-4 w-4 text-[#8B6F47]" />
														First Name
													</FormLabel>
													<FormControl>
														<Input
															placeholder="e.g., Emma"
															className="bg-white/80 border-slate-300/50 focus:border-[#8B6F47] focus:ring-[#8B6F47]/20 h-11 text-base"
															{...field}
															value={
																field.value ||
																''
															}
														/>
													</FormControl>
													<FormDescription className="text-sm text-slate-500">
														The child's first name
														(optional - for
														personalization)
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										{/* Gender Field */}
										<FormField
											control={form.control}
											name="gender"
											render={({ field }) => (
												<FormItem className="space-y-3">
													<FormLabel className="text-base font-medium text-slate-700 flex items-center gap-2">
														<Heart className="h-4 w-4 text-[#8B6F47]" />
														Gender
													</FormLabel>
													<Select
														onValueChange={
															field.onChange
														}
														value={
															field.value ||
															undefined
														}
													>
														<FormControl>
															<SelectTrigger className="w-full bg-white/80 border-slate-300/50 focus:border-[#8B6F47] focus:ring-[#8B6F47]/20 h-11">
																<SelectValue placeholder="Select gender" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{genders.map(
																(gender) => (
																	<SelectItem
																		key={
																			gender.value
																		}
																		value={
																			gender.value
																		}
																	>
																		{
																			gender.label
																		}
																	</SelectItem>
																),
															)}
														</SelectContent>
													</Select>
													<FormDescription className="text-sm text-slate-500">
														Select the child's
														gender (optional - for
														personalization)
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									{/* Two Column Layout for Age and Language */}
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
										{/* Age Group Field */}
										<FormField
											control={form.control}
											name="age_group"
											render={({ field }) => (
												<FormItem className="space-y-3">
													<FormLabel className="text-base font-medium text-slate-700 flex items-center gap-2">
														<Users className="h-4 w-4 text-[#8B6F47]" />
														Age Group
													</FormLabel>
													<Select
														onValueChange={
															field.onChange
														}
														value={field.value}
													>
														<FormControl>
															<SelectTrigger className="w-full bg-white/80 border-slate-300/50 focus:border-[#8B6F47] focus:ring-[#8B6F47]/20 h-11">
																<SelectValue placeholder="Select age group" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{ageGroups.map(
																(age) => (
																	<SelectItem
																		key={
																			age.value
																		}
																		value={
																			age.value
																		}
																	>
																		{
																			age.label
																		}
																	</SelectItem>
																),
															)}
														</SelectContent>
													</Select>
													<FormDescription className="text-sm text-slate-500">
														Choose the age range
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										{/* Language Field */}
										<FormField
											control={form.control}
											name="language"
											render={({ field }) => (
												<FormItem className="space-y-3">
													<FormLabel className="text-base font-medium text-slate-700 flex items-center gap-2">
														<Globe className="h-4 w-4 text-[#8B6F47]" />
														Language
													</FormLabel>
													<Select
														onValueChange={
															field.onChange
														}
														value={field.value}
													>
														<FormControl>
															<SelectTrigger className="w-full bg-white/80 border-slate-300/50 focus:border-[#8B6F47] focus:ring-[#8B6F47]/20 h-11">
																<SelectValue placeholder="Select language" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{languages.map(
																(lang) => (
																	<SelectItem
																		key={
																			lang.value
																		}
																		value={
																			lang.value
																		}
																	>
																		{
																			lang.label
																		}
																	</SelectItem>
																),
															)}
														</SelectContent>
													</Select>
													<FormDescription className="text-sm text-slate-500">
														Choose the language
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									{/* Topic Field */}
									<FormField
										control={form.control}
										name="topic"
										render={({ field }) => (
											<FormItem className="space-y-3">
												<FormLabel className="text-base font-medium text-slate-700 flex items-center gap-2">
													<BookMarked className="h-4 w-4 text-[#8B6F47]" />
													Topic
												</FormLabel>
												<Select
													onValueChange={
														handleTopicChange
													}
													value={field.value}
												>
													<FormControl>
														<SelectTrigger className="w-full bg-white/80 border-slate-300/50 focus:border-[#8B6F47] focus:ring-[#8B6F47]/20 h-11">
															<SelectValue placeholder="Select a topic" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{topics.map((topic) => (
															<SelectItem
																key={
																	topic.value
																}
																value={
																	topic.value
																}
															>
																{topic.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormDescription className="text-sm text-slate-500">
													What subject would you like
													the story to be about?
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Subtopic Field */}
									<FormField
										control={form.control}
										name="subtopic"
										render={({ field }) => (
											<FormItem className="space-y-3">
												<FormLabel className="text-base font-medium text-slate-700 flex items-center gap-2">
													<Tag className="h-4 w-4 text-[#8B6F47]" />
													Subtopic
												</FormLabel>
												<Select
													onValueChange={
														field.onChange
													}
													value={field.value}
													disabled={
														!selectedTopic ||
														availableSubtopics.length ===
															0
													}
												>
													<FormControl>
														<SelectTrigger className="w-full bg-white/80 border-slate-300/50 focus:border-[#8B6F47] focus:ring-[#8B6F47]/20 h-11 disabled:opacity-50">
															<SelectValue
																placeholder={
																	!selectedTopic
																		? 'Select a topic first'
																		: 'Select a subtopic'
																}
															/>
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{availableSubtopics.map(
															(subtopic) => (
																<SelectItem
																	key={
																		subtopic.value
																	}
																	value={
																		subtopic.value
																	}
																>
																	{
																		subtopic.label
																	}
																</SelectItem>
															),
														)}
													</SelectContent>
												</Select>
												<FormDescription className="text-sm text-slate-500">
													Choose a specific area
													within your selected topic
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Style Field */}
									<FormField
										control={form.control}
										name="style"
										render={({ field }) => (
											<FormItem className="space-y-3">
												<FormLabel className="text-base font-medium text-slate-700 flex items-center gap-2">
													<Palette className="h-4 w-4 text-[#8B6F47]" />
													Story Style
												</FormLabel>
												<Select
													onValueChange={
														field.onChange
													}
													value={field.value}
												>
													<FormControl>
														<SelectTrigger className="w-full bg-white/80 border-slate-300/50 focus:border-[#8B6F47] focus:ring-[#8B6F47]/20 h-11">
															<SelectValue placeholder="Select story style" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{styles.map((style) => (
															<SelectItem
																key={
																	style.value
																}
																value={
																	style.value
																}
															>
																{style.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormDescription className="text-sm text-slate-500">
													What kind of story would you
													like?
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									{/* Submit Button */}
									<div className="pt-4 flex justify-center sm:justify-start">
										<Button
											type="submit"
											size="lg"
											disabled={isGenerating}
											className="w-full sm:w-auto min-w-[240px] bg-[#D97D55] hover:bg-[#C86A45] text-white text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300 h-12 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
										>
											{isGenerating ? (
												<>
													<Loader2 className="mr-2 h-5 w-5 animate-spin" />
													Generating Story...
												</>
											) : (
												<>
													<Sparkles className="mr-2 h-5 w-5" />
													Generate Story
												</>
											)}
										</Button>
									</div>
								</form>
							</Form>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
