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
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Loader2, LogIn, UserPlus } from 'lucide-react';
import Image from 'next/image';

// Login Schema
const loginSchema = z.object({
	email: z.string().email('Please enter a valid email address'),
	password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Sign Up Schema
const signUpSchema = z
	.object({
		username: z
			.string()
			.min(3, 'Username must be at least 3 characters')
			.max(30, 'Username must be less than 30 characters')
			.regex(
				/^[a-zA-Z0-9_]+$/,
				'Username can only contain letters, numbers, and underscores',
			),
		firstName: z
			.string()
			.min(1, 'First name is required')
			.max(50, 'First name is too long'),
		lastName: z
			.string()
			.min(1, 'Last name is required')
			.max(50, 'Last name is too long'),
		email: z.string().email('Please enter a valid email address'),
		dateOfBirth: z
			.string()
			.min(1, 'Date of birth is required')
			.refine((date) => {
				const birthDate = new Date(date);
				const today = new Date();
				const age = today.getFullYear() - birthDate.getFullYear();
				const monthDiff = today.getMonth() - birthDate.getMonth();
				if (
					monthDiff < 0 ||
					(monthDiff === 0 && today.getDate() < birthDate.getDate())
				) {
					return age - 1 >= 13;
				}
				return age >= 13;
			}, 'You must be at least 13 years old to sign up'),
		country: z.string().min(1, 'Country is required'),
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				'Password must contain at least one uppercase letter, one lowercase letter, and one number',
			),
		confirmPassword: z.string().min(1, 'Please confirm your password'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const COUNTRIES = [
	'United States',
	'Canada',
	'United Kingdom',
	'Australia',
	'Germany',
	'France',
	'Spain',
	'Italy',
	'Netherlands',
	'Sweden',
	'Norway',
	'Denmark',
	'Finland',
	'Poland',
	'Belgium',
	'Switzerland',
	'Austria',
	'Portugal',
	'Ireland',
	'New Zealand',
	'Japan',
	'South Korea',
	'Singapore',
	'India',
	'Brazil',
	'Mexico',
	'Argentina',
	'Chile',
	'South Africa',
	'Other',
];

export function AuthTabsDialog() {
	const containerRef = useRef<HTMLDivElement>(null);
	const [activeTab, setActiveTab] = useState('signup');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Login form
	const loginForm = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	// Sign up form
	const signUpForm = useForm<SignUpFormValues>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			username: '',
			firstName: '',
			lastName: '',
			email: '',
			dateOfBirth: '',
			country: '',
			password: '',
			confirmPassword: '',
		},
	});

	useEffect(() => {
		const ctx = gsap.context(() => {
			// Animate tabs
			const tabsList = containerRef.current?.querySelector(
				'[data-slot="tabs-list"]',
			) as HTMLElement;
			if (tabsList) {
				gsap.from(tabsList, {
					opacity: 0,
					y: -10,
					duration: 0.5,
					ease: 'power2.out',
				});
			}
		}, containerRef);

		return () => ctx.revert();
	}, []);

	// Animate content when tab changes
	useEffect(() => {
		const ctx = gsap.context(() => {
			const activeContent = containerRef.current?.querySelector(
				`[data-state="active"][role="tabpanel"]`,
			) as HTMLElement;
			if (activeContent) {
				gsap.from(activeContent, {
					opacity: 0,
					x: 20,
					duration: 0.3,
					ease: 'power2.out',
				});
			}
		}, containerRef);

		return () => ctx.revert();
	}, [activeTab]);

	const onLoginSubmit = async (data: LoginFormValues) => {
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
			loginForm.setError('root', {
				message: 'Invalid email or password. Please try again.',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const onSignUpSubmit = async (data: SignUpFormValues) => {
		setIsSubmitting(true);
		try {
			// TODO: Implement actual signup API call
			console.log('Sign up data:', data);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Reset form on success
			signUpForm.reset();

			// Show success message (you can use toast here)
			alert('Account created successfully!');
		} catch (error) {
			console.error('Sign up error:', error);
			// Handle error (show toast, etc.)
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div
			ref={containerRef}
			className="w-full min-w-0 max-w-full overflow-hidden"
		>
			{/* Header */}
			<div className="space-y-1 text-center mb-3 sm:mb-4 md:mb-6">
				<div className="flex justify-center mb-2 sm:mb-3 md:mb-4">
					<div className="relative flex-shrink-0">
						<Image
							src="/novelbug_bounce.gif"
							alt="NovelBug Logo"
							width={70}
							height={70}
							className="drop-shadow-sm w-12 h-12 sm:w-14 sm:h-14 md:w-[70px] md:h-[70px]"
							style={{
								mixBlendMode: 'multiply',
							}}
							priority
							unoptimized
						/>
					</div>
				</div>
				<h2 className="text-lg sm:text-xl md:text-2xl font-serif font-light tracking-tight text-slate-900 px-1 sm:px-2">
					Welcome to NovelBug
				</h2>
				<p className="text-slate-600 font-sans font-light text-xs sm:text-sm px-1 sm:px-2">
					Sign in or create an account to start creating magical
					bedtime stories
				</p>
			</div>

			<Tabs
				value={activeTab}
				onValueChange={setActiveTab}
				className="w-full min-w-0 max-w-full"
			>
				<TabsList className="grid w-full grid-cols-2 mb-3 sm:mb-4 md:mb-6 bg-slate-100/50 h-8 sm:h-9 md:h-10 gap-1 sm:gap-[3px]">
					<TabsTrigger
						value="signup"
						className="font-sans font-light text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm px-2 sm:px-3 text-center"
					>
						<UserPlus className="size-3 sm:size-4 mr-1 sm:mr-1.5 md:mr-2 flex-shrink-0" />
						<span className="truncate">Sign Up</span>
					</TabsTrigger>
					<TabsTrigger
						value="login"
						className="font-sans font-light text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm px-2 sm:px-3 text-center"
					>
						<LogIn className="size-3 sm:size-4 mr-1 sm:mr-1.5 md:mr-2 flex-shrink-0" />
						<span className="truncate">Sign In</span>
					</TabsTrigger>
				</TabsList>

				{/* Sign Up Tab */}
				<TabsContent
					value="signup"
					className="mt-0 min-w-0 max-w-full overflow-visible"
				>
					<Form {...signUpForm}>
						<form
							onSubmit={signUpForm.handleSubmit(onSignUpSubmit)}
							className="space-y-2.5 sm:space-y-3 md:space-y-4"
						>
							<FormField
								control={signUpForm.control}
								name="username"
								render={({ field }) => (
									<FormItem data-form-field>
										<FormLabel className="font-sans font-light">
											Username
										</FormLabel>
										<FormControl>
											<Input
												placeholder="Choose a username"
												{...field}
												className="font-sans"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
								<FormField
									control={signUpForm.control}
									name="firstName"
									render={({ field }) => (
										<FormItem data-form-field>
											<FormLabel className="font-sans font-light">
												First Name
											</FormLabel>
											<FormControl>
												<Input
													placeholder="John"
													{...field}
													className="font-sans"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={signUpForm.control}
									name="lastName"
									render={({ field }) => (
										<FormItem data-form-field>
											<FormLabel className="font-sans font-light">
												Last Name
											</FormLabel>
											<FormControl>
												<Input
													placeholder="Doe"
													{...field}
													className="font-sans"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={signUpForm.control}
								name="email"
								render={({ field }) => (
									<FormItem data-form-field>
										<FormLabel className="font-sans font-light">
											Email
										</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="john@example.com"
												{...field}
												className="font-sans"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
								<FormField
									control={signUpForm.control}
									name="dateOfBirth"
									render={({ field }) => (
										<FormItem data-form-field>
											<FormLabel className="font-sans font-light">
												Date of Birth
											</FormLabel>
											<FormControl>
												<Input
													type="date"
													{...field}
													className="font-sans"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={signUpForm.control}
									name="country"
									render={({ field }) => (
										<FormItem data-form-field>
											<FormLabel className="font-sans font-light">
												Country
											</FormLabel>
											<FormControl>
												<select
													{...field}
													className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-sans"
												>
													<option value="">
														Select a country
													</option>
													{COUNTRIES.map(
														(country) => (
															<option
																key={country}
																value={country}
															>
																{country}
															</option>
														),
													)}
												</select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={signUpForm.control}
								name="password"
								render={({ field }) => (
									<FormItem data-form-field>
										<FormLabel className="font-sans font-light">
											Password
										</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													type={
														showPassword
															? 'text'
															: 'password'
													}
													placeholder="Create a strong password"
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

							<FormField
								control={signUpForm.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem data-form-field>
										<FormLabel className="font-sans font-light">
											Confirm Password
										</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													type={
														showConfirmPassword
															? 'text'
															: 'password'
													}
													placeholder="Confirm your password"
													{...field}
													className="font-sans pr-10"
												/>
												<button
													type="button"
													onClick={() =>
														setShowConfirmPassword(
															!showConfirmPassword,
														)
													}
													className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
													aria-label="Toggle password visibility"
												>
													{showConfirmPassword ? (
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
										Signing up...
									</>
								) : (
									'Sign Up'
								)}
							</Button>
						</form>
					</Form>
				</TabsContent>

				{/* Login Tab */}
				<TabsContent
					value="login"
					className="mt-0 min-w-0 max-w-full overflow-visible"
				>
					<Form {...loginForm}>
						<form
							onSubmit={loginForm.handleSubmit(onLoginSubmit)}
							className="space-y-2.5 sm:space-y-3 md:space-y-4"
						>
							<FormField
								control={loginForm.control}
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

							<FormField
								control={loginForm.control}
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

							{loginForm.formState.errors.root && (
								<div className="text-sm text-destructive font-sans">
									{loginForm.formState.errors.root.message}
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
				</TabsContent>
			</Tabs>
		</div>
	);
}
