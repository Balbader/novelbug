'use client';

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
import { Sparkles } from 'lucide-react';

const storyFormSchema = z.object({
	title: z
		.string()
		.min(1, 'Title is required')
		.max(255, 'Title must be less than 255 characters'),
	age_group: z.string().min(1, 'Age group is required'),
	language: z.string().min(1, 'Language is required'),
	topic: z.string().min(1, 'Topic is required'),
	subtopic: z.string().min(1, 'Subtopic is required'),
	style: z.string().min(1, 'Style is required'),
});

type StoryFormValues = z.infer<typeof storyFormSchema>;

const ageGroups = [
	{ value: '3-5', label: '3-5 years (Preschool)' },
	{ value: '6-8', label: '6-8 years (Early Elementary)' },
	{ value: '9-12', label: '9-12 years (Elementary)' },
	{ value: '13+', label: '13+ years (Teen)' },
];

const languages = [
	{ value: 'en', label: 'English' },
	{ value: 'es', label: 'Spanish' },
	{ value: 'fr', label: 'French' },
	{ value: 'de', label: 'German' },
	{ value: 'it', label: 'Italian' },
	{ value: 'pt', label: 'Portuguese' },
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
	],
	history: [
		{ value: 'ancient-civilizations', label: 'Ancient Civilizations' },
		{ value: 'medieval', label: 'Medieval Times' },
		{ value: 'explorers', label: 'Explorers' },
		{ value: 'inventions', label: 'Great Inventions' },
		{ value: 'leaders', label: 'Historical Leaders' },
	],
	math: [
		{ value: 'counting', label: 'Counting & Numbers' },
		{ value: 'shapes', label: 'Shapes & Geometry' },
		{ value: 'patterns', label: 'Patterns' },
		{ value: 'measurement', label: 'Measurement' },
		{ value: 'time', label: 'Time & Clocks' },
	],
	geography: [
		{ value: 'continents', label: 'Continents' },
		{ value: 'countries', label: 'Countries' },
		{ value: 'landmarks', label: 'Famous Landmarks' },
		{ value: 'oceans', label: 'Oceans & Seas' },
		{ value: 'mountains', label: 'Mountains & Rivers' },
	],
	nature: [
		{ value: 'forest', label: 'Forest Animals' },
		{ value: 'savanna', label: 'Savanna Animals' },
		{ value: 'ocean-creatures', label: 'Ocean Creatures' },
		{ value: 'birds', label: 'Birds' },
		{ value: 'insects', label: 'Insects' },
		{ value: 'trees', label: 'Trees & Forests' },
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

export function Generate() {
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

	const onSubmit = (data: StoryFormValues) => {
		console.log('Form submitted:', data);
		// TODO: Handle form submission
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-3xl mx-auto">
				{/* Header */}
				<div className="text-center mb-8">
					<h1 className="text-4xl sm:text-5xl font-serif font-light text-slate-900 dark:text-white mb-4">
						Create Your Story
					</h1>
					<p className="text-lg text-slate-600 dark:text-slate-400">
						Tell us what you'd like to learn, and we'll turn it into
						a magical bedtime story
					</p>
				</div>

				{/* Form Card */}
				<div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 sm:p-8">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-6"
						>
							{/* Title Field */}
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Story Title</FormLabel>
										<FormControl>
											<Input
												placeholder="e.g., The Adventure of the Curious Cat"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Give your story a title (optional -
											we can generate one for you)
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Age Group Field */}
							<FormField
								control={form.control}
								name="age_group"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Age Group</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value}
										>
											<FormControl>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select age group" />
												</SelectTrigger>
											</FormControl>
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
										<FormDescription>
											Choose the age range for your child
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
									<FormItem>
										<FormLabel>Language</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value}
										>
											<FormControl>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select language" />
												</SelectTrigger>
											</FormControl>
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
										<FormDescription>
											Choose the language for your story
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Topic Field */}
							<FormField
								control={form.control}
								name="topic"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Topic</FormLabel>
										<Select
											onValueChange={handleTopicChange}
											value={field.value}
										>
											<FormControl>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select a topic" />
												</SelectTrigger>
											</FormControl>
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
										<FormDescription>
											What subject would you like the
											story to be about?
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
									<FormItem>
										<FormLabel>Subtopic</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value}
											disabled={
												!selectedTopic ||
												availableSubtopics.length === 0
											}
										>
											<FormControl>
												<SelectTrigger className="w-full">
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
															key={subtopic.value}
															value={
																subtopic.value
															}
														>
															{subtopic.label}
														</SelectItem>
													),
												)}
											</SelectContent>
										</Select>
										<FormDescription>
											Choose a specific area within your
											selected topic
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
									<FormItem>
										<FormLabel>Story Style</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value}
										>
											<FormControl>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select story style" />
												</SelectTrigger>
											</FormControl>
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
										<FormDescription>
											What kind of story would you like?
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Submit Button */}
							<Button
								type="submit"
								size="lg"
								className="w-full sm:w-auto min-w-[200px] bg-[#D97D55] hover:bg-[#C86A45] text-white"
							>
								<Sparkles className="mr-2 h-4 w-4" />
								Generate Story
							</Button>
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
}
