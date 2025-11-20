'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { Send, Mail, MessageSquare, User } from 'lucide-react';

const contactFormSchema = z.object({
	name: z
		.string()
		.min(2, 'Name must be at least 2 characters')
		.max(100, 'Name must be less than 100 characters'),
	email: z.string().email('Please enter a valid email address'),
	subject: z
		.string()
		.min(3, 'Subject must be at least 3 characters')
		.max(200, 'Subject must be less than 200 characters'),
	message: z
		.string()
		.min(10, 'Message must be at least 10 characters')
		.max(2000, 'Message must be less than 2000 characters'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function Contact() {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<ContactFormValues>({
		resolver: zodResolver(contactFormSchema),
		defaultValues: {
			name: '',
			email: '',
			subject: '',
			message: '',
		},
	});

	const onSubmit = async (data: ContactFormValues) => {
		setIsSubmitting(true);

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Failed to send message');
			}

			toast.success('Message sent successfully!', {
				description: "We'll get back to you soon.",
			});

			form.reset();
		} catch (error) {
			toast.error('Failed to send message', {
				description:
					error instanceof Error
						? error.message
						: 'Please try again later.',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 py-16 sm:py-24 px-4 sm:px-6">
			<div className="container mx-auto max-w-4xl">
				{/* Header */}
				<div className="text-center mb-12 sm:mb-16">
					<h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-slate-900 dark:text-slate-50 mb-4 tracking-tight">
						Get in Touch
					</h1>
					<p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 font-sans font-light max-w-2xl mx-auto leading-relaxed">
						Have a question, suggestion, or just want to say hello?
						We'd love to hear from you. Send us a message and we'll
						respond as soon as possible.
					</p>
				</div>

				{/* Contact Form */}
				<div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 lg:p-10">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-6"
						>
							{/* Name Field */}
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-slate-700 dark:text-slate-300 font-sans font-light text-sm tracking-wide flex items-center gap-2">
											<User className="size-4" />
											Your Name
										</FormLabel>
										<FormControl>
											<Input
												placeholder="John Doe"
												{...field}
												disabled={isSubmitting}
												className="font-sans"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Email Field */}
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-slate-700 dark:text-slate-300 font-sans font-light text-sm tracking-wide flex items-center gap-2">
											<Mail className="size-4" />
											Your Email
										</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="john@example.com"
												{...field}
												disabled={isSubmitting}
												className="font-sans"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Subject Field */}
							<FormField
								control={form.control}
								name="subject"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-slate-700 dark:text-slate-300 font-sans font-light text-sm tracking-wide">
											Subject
										</FormLabel>
										<FormControl>
											<Input
												placeholder="What's this about?"
												{...field}
												disabled={isSubmitting}
												className="font-sans"
											/>
										</FormControl>
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
											Your Message
										</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Tell us what's on your mind..."
												rows={8}
												{...field}
												disabled={isSubmitting}
												className="font-sans resize-none"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

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
										<span className="animate-spin mr-2">
											⏳
										</span>
										Sending...
									</>
								) : (
									<>
										<Send className="size-4 mr-2" />
										Send Message
									</>
								)}
							</Button>
						</form>
					</Form>

					{/* Additional Contact Info */}
					<div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
						<p className="text-sm text-slate-600 dark:text-slate-400 font-sans font-light text-center">
							Or reach us directly at{' '}
							<a
								href="mailto:hello@novelbug.com"
								className="text-[#D97D55] hover:text-[#C86A45] transition-colors underline underline-offset-2"
							>
								hello@novelbug.com
							</a>
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
