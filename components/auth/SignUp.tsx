'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
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

export function SignUp() {
	const containerRef = useRef<HTMLDivElement>(null);
	const cardRef = useRef<HTMLDivElement>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<SignUpFormValues>({
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
					stagger: 0.1,
					delay: 0.2,
					ease: 'power2.out',
				});
			}
		}, containerRef);

		return () => ctx.revert();
	}, []);

	const onSubmit = async (data: SignUpFormValues) => {
		setIsSubmitting(true);
		try {
			// TODO: Implement actual signup API call
			console.log('Sign up data:', data);

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Reset form on success
			form.reset();

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
				className="w-full max-w-2xl shadow-lg border-slate-200/40 dark:border-slate-800/40 mx-2 sm:mx-0"
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
						Create Your Account
					</CardTitle>
					<CardDescription className="text-slate-600 font-sans font-light">
						Join NovelBug and start creating magical bedtime stories
					</CardDescription>
				</CardHeader>

				<CardContent className="px-4 sm:px-6">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-3 sm:space-y-4"
						>
							{/* Username */}
							<FormField
								control={form.control}
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

							{/* First Name and Last Name */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
								<FormField
									control={form.control}
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
									control={form.control}
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
												placeholder="john@example.com"
												{...field}
												className="font-sans"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Date of Birth and Country */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
								<FormField
									control={form.control}
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
									control={form.control}
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

							{/* Password */}
							<FormField
								control={form.control}
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

							{/* Confirm Password */}
							<FormField
								control={form.control}
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
										Creating Account...
									</>
								) : (
									'Create Account'
								)}
							</Button>
						</form>
					</Form>
				</CardContent>

				<CardFooter className="flex flex-col space-y-4">
					<div className="text-sm text-center text-slate-600 font-sans font-light">
						Already have an account?{' '}
						<Link
							href="/signin"
							className="font-medium hover:underline"
							style={{ color: '#D97D55' }}
						>
							Sign in
						</Link>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
