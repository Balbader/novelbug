'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Image from 'next/image';

const loginSchema = z.object({
	email: z.string().email('Please enter a valid email address'),
	password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function Login() {
	const containerRef = useRef<HTMLDivElement>(null);
	const cardRef = useRef<HTMLDivElement>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	useEffect(() => {
		const ctx = gsap.context(() => {
			// Animate card entrance
			gsap.from(cardRef.current, {
				opacity: 0,
				y: 30,
				scale: 0.95,
				duration: 0.8,
				ease: 'power3.out',
			});

			// Animate form fields sequentially
			const formFields = cardRef.current?.querySelectorAll(
				'[data-form-field]',
			) as NodeListOf<HTMLElement>;
			if (formFields) {
				gsap.from(formFields, {
					opacity: 0,
					x: -20,
					duration: 0.6,
					stagger: 0.15,
					delay: 0.2,
					ease: 'power2.out',
				});
			}

			// Animate button
			const button = cardRef.current?.querySelector(
				'button[type="submit"]',
			) as HTMLElement;
			if (button) {
				gsap.from(button, {
					opacity: 0,
					y: 10,
					duration: 0.6,
					delay: 0.5,
					ease: 'power2.out',
				});
			}
		}, containerRef);

		return () => ctx.revert();
	}, []);

	const onSubmit = async (data: LoginFormValues) => {
		setIsSubmitting(true);
		try {
			// TODO: Implement actual login API call
			console.log('Login data:', data);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Handle success (redirect, etc.)
			// router.push('/dashboard');
		} catch (error) {
			console.error('Login error:', error);
			// Handle error (show toast, etc.)
			form.setError('root', {
				message: 'Invalid email or password. Please try again.',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div
			ref={containerRef}
			className="min-h-screen flex items-center justify-center px-4 py-12 sm:py-16"
			style={{
				backgroundColor: '#F5F1E8',
				backgroundImage: `
					linear-gradient(rgba(139, 111, 71, 0.06) 1px, transparent 1px),
					linear-gradient(90deg, rgba(139, 111, 71, 0.06) 1px, transparent 1px)
				`,
				backgroundSize: '20px 20px',
			}}
		>
			<Card
				ref={cardRef}
				className="w-full max-w-md shadow-lg border-slate-200/40 dark:border-slate-800/40 mx-2 sm:mx-0"
				style={{
					backgroundColor: 'white',
				}}
			>
				<CardHeader className="space-y-1 text-center px-4 sm:px-6">
					<div className="flex justify-center mb-4">
						<div className="relative">
							<Image
								src="/novelbug_bounce.gif"
								alt="NovelBug Logo"
								width={70}
								height={70}
								className="drop-shadow-sm w-14 h-14 sm:w-[70px] sm:h-[70px]"
								style={{
									mixBlendMode: 'multiply',
								}}
								priority
								unoptimized
							/>
						</div>
					</div>
					<CardTitle className="text-3xl font-serif font-light tracking-tight text-slate-900">
						Welcome Back
					</CardTitle>
					<CardDescription className="text-slate-600 font-sans font-light">
						Sign in to continue creating magical bedtime stories
					</CardDescription>
				</CardHeader>

				<CardContent className="px-4 sm:px-6">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-3 sm:space-y-4"
						>
							{/* Email */}
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem data-form-field>
										<FormLabel className="font-sans font-light">
											Email
										</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="you@example.com"
												{...field}
												className="font-sans"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Password */}
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem data-form-field>
										<div className="flex items-center justify-between">
											<FormLabel className="font-sans font-light">
												Password
											</FormLabel>
											<Link
												href="/forgot-password"
												className="text-sm font-sans font-light hover:underline"
												style={{ color: '#D97D55' }}
											>
												Forgot password?
											</Link>
										</div>
										<FormControl>
											<div className="relative">
												<Input
													type={
														showPassword
															? 'text'
															: 'password'
													}
													placeholder="Enter your password"
													{...field}
													className="font-sans pr-10"
												/>
												<button
													type="button"
													onClick={() =>
														setShowPassword(
															!showPassword,
														)
													}
													className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
													aria-label="Toggle password visibility"
												>
													{showPassword ? (
														<EyeOff className="size-4" />
													) : (
														<Eye className="size-4" />
													)}
												</button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Error message */}
							{form.formState.errors.root && (
								<div className="text-sm text-destructive font-sans">
									{form.formState.errors.root.message}
								</div>
							)}

							<Button
								type="submit"
								className="w-full font-sans font-light text-white shadow-md hover:shadow-lg transition-all duration-300"
								style={{
									backgroundColor: '#D97D55',
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.backgroundColor =
										'#C86A45';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.backgroundColor =
										'#D97D55';
								}}
								disabled={isSubmitting}
							>
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 size-4 animate-spin" />
										Logging in...
									</>
								) : (
									'Login'
								)}
							</Button>
						</form>
					</Form>
				</CardContent>

				<CardFooter className="flex flex-col space-y-4">
					<div className="text-sm text-center text-slate-600 font-sans font-light">
						Don't have an account?{' '}
						<Link
							href="/signup"
							className="font-medium hover:underline"
							style={{ color: '#D97D55' }}
						>
							Sign Up
						</Link>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
