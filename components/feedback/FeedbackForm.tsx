'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import posthog from 'posthog-js';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
	Form,
	FormControl,
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
import { toast } from 'sonner';
import {
	Send,
	MessageSquare,
	Bug,
	Sparkles,
	Heart,
	HelpCircle,
} from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

const feedbackFormSchema = z.object({
	type: z.enum(['bug', 'feature', 'general', 'other']),
	message: z
		.string()
		.min(10, 'Message must be at least 10 characters')
		.max(2000, 'Message must be less than 2000 characters'),
	email: z
		.string()
		.email('Please enter a valid email address')
		.optional()
		.or(z.literal('')),
	name: z
		.string()
		.max(100, 'Name must be less than 100 characters')
		.optional()
		.or(z.literal('')),
});

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

export default function FeedbackForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [userInfo, setUserInfo] = useState<{
		name?: string;
		email?: string;
	} | null>(null);

	// Try to get user info if authenticated
	useEffect(() => {
		const fetchUserInfo = async () => {
			try {
				// Try to get user info from stories API (which requires auth)
				const response = await fetch('/api/stories');
				if (response.ok) {
					const data = await response.json();
					if (data.user) {
						setUserInfo({
							name: data.user.name,
							email: data.user.email,
						});
					}
				}
			} catch (error) {
				// User not authenticated or error - that's fine
				console.log('Could not fetch user info');
			}
		};

		fetchUserInfo();
	}, []);

	const form = useForm<FeedbackFormValues>({
		resolver: zodResolver(feedbackFormSchema),
		defaultValues: {
			type: undefined as any,
			message: '',
			email: '',
			name: '',
		},
	});

	// Set user info when available
	useEffect(() => {
		if (userInfo) {
			form.setValue('email', userInfo.email || '');
			form.setValue('name', userInfo.name || '');
		}
	}, [userInfo, form]);

	const onSubmit = async (data: FeedbackFormValues) => {
		setIsSubmitting(true);

		try {
			const response = await fetch('/api/feedback', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					type: data.type,
					message: data.message,
					email: data.email || undefined,
					name: data.name || undefined,
				}),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Failed to send feedback');
			}

			toast.success('Feedback sent successfully!', {
				description:
					result.message || "We'll review your feedback soon.",
			});

			// Track feedback submitted
			posthog.capture('feedback_submitted', {
				feedback_type: data.type,
			});

			form.reset({
				type: undefined,
				message: '',
				email: userInfo?.email || '',
				name: userInfo?.name || '',
			});
		} catch (error) {
			// Track feedback error
			posthog.captureException(error);
			toast.error('Failed to send feedback', {
				description:
					error instanceof Error
						? error.message
						: 'Please try again later.',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const getTypeIcon = (type: string) => {
		switch (type) {
			case 'bug':
				return <Bug className="size-4" />;
			case 'feature':
				return <Sparkles className="size-4" />;
			case 'general':
				return <Heart className="size-4" />;
			default:
				return <HelpCircle className="size-4" />;
		}
	};

	const getTypeColor = (type: string) => {
		switch (type) {
			case 'bug':
				return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
			case 'feature':
				return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
			case 'general':
				return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400';
			default:
				return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
		}
	};

	return (
		<section className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 py-8 sm:py-12 md:py-16 px-4 sm:px-6">
			<div className="container mx-auto max-w-3xl">
				{/* Header */}
				<div className="text-center mb-8 sm:mb-12">
					<h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-slate-900 dark:text-slate-50 mb-4 tracking-tight">
						Share Your Feedback
					</h1>
					<p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-sans font-light max-w-2xl mx-auto leading-relaxed">
						We value your input! Whether you've found a bug, have a
						feature request, or just want to share your thoughts,
						we'd love to hear from you.
					</p>
				</div>

				{/* Feedback Form */}
				<div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 lg:p-10">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-6"
						>
							{/* Feedback Type Field */}
							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-slate-700 dark:text-slate-300 font-sans font-light text-sm tracking-wide">
											Feedback Type
										</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
											disabled={isSubmitting}
										>
											<FormControl>
												<SelectTrigger className="font-sans">
													<SelectValue placeholder="Select feedback type" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="bug">
													<div className="flex items-center gap-2">
														<Bug className="size-4" />
														<span>Bug Report</span>
													</div>
												</SelectItem>
												<SelectItem value="feature">
													<div className="flex items-center gap-2">
														<Sparkles className="size-4" />
														<span>
															Feature Request
														</span>
													</div>
												</SelectItem>
												<SelectItem value="general">
													<div className="flex items-center gap-2">
														<Heart className="size-4" />
														<span>
															General Feedback
														</span>
													</div>
												</SelectItem>
												<SelectItem value="other">
													<div className="flex items-center gap-2">
														<HelpCircle className="size-4" />
														<span>Other</span>
													</div>
												</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Message Field */}
							<FormField
								control={form.control}
								name="message"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-slate-700 dark:text-slate-300 font-sans font-light text-sm tracking-wide flex items-center gap-2">
											<MessageSquare className="size-4" />
											Your Feedback
										</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Tell us what's on your mind... Be as detailed as possible!"
												rows={8}
												{...field}
												disabled={isSubmitting}
												className="font-sans resize-none"
											/>
										</FormControl>
										<FormMessage />
										<p className="text-xs text-slate-500 dark:text-slate-400 font-sans font-light">
											{field.value?.length || 0} / 2000
											characters
										</p>
									</FormItem>
								)}
							/>

							{/* Optional: Name and Email (only show if not logged in or if user wants to override) */}
							{!userInfo && (
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-slate-700 dark:text-slate-300 font-sans font-light text-sm tracking-wide">
													Your Name (Optional)
												</FormLabel>
												<FormControl>
													<input
														type="text"
														placeholder="John Doe"
														{...field}
														disabled={isSubmitting}
														className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-sans"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="text-slate-700 dark:text-slate-300 font-sans font-light text-sm tracking-wide">
													Your Email (Optional)
												</FormLabel>
												<FormControl>
													<input
														type="email"
														placeholder="john@example.com"
														{...field}
														disabled={isSubmitting}
														className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-sans"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							)}

							{/* Submit Button */}
							<Button
								type="submit"
								disabled={isSubmitting}
								className="w-full sm:w-auto border-0 shadow-md hover:shadow-lg font-sans font-light text-sm tracking-wide transition-all duration-300 text-white disabled:opacity-50 disabled:cursor-not-allowed"
								style={{
									backgroundColor: '#D97D55',
								}}
								onMouseEnter={(e) => {
									if (!isSubmitting) {
										e.currentTarget.style.backgroundColor =
											'#C86A45';
									}
								}}
								onMouseLeave={(e) => {
									if (!isSubmitting) {
										e.currentTarget.style.backgroundColor =
											'#D97D55';
									}
								}}
							>
								{isSubmitting ? (
									<>
										<Spinner className="size-4 mr-2" />
										Sending...
									</>
								) : (
									<>
										<Send className="size-4 mr-2" />
										Send Feedback
									</>
								)}
							</Button>
						</form>
					</Form>

					{/* Additional Info */}
					<div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
						<p className="text-sm text-slate-600 dark:text-slate-400 font-sans font-light text-center">
							Your feedback helps us improve NovelBug. Thank you
							for taking the time to share your thoughts!
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
