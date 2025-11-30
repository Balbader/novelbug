'use client';

import { useEffect, useState } from 'react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
	BookOpen,
	Calendar,
	Clock,
	Globe,
	Users,
	Palette,
	TrendingUp,
	Heart,
	Star,
	ArrowRight,
	BookMarked,
	Sparkles,
	User,
	MapPin,
	LogIn,
	Award,
	Zap,
	Edit,
	UserPlus,
} from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
	getCuteAvatar,
	getEmojiAvatar,
	AVATAR_STYLES,
	type AvatarStyle,
} from '@/lib/avatar-utils';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { COUNTRIES } from '@/lib/countries';
import { toast } from 'sonner';

interface Story {
	id: string;
	title: string;
	topic: string;
	subtopic: string;
	style: string;
	age_group: string;
	language: string;
	story_content: string;
	created_at: Date | string;
	shared: boolean;
}

interface UserProfileData {
	user: {
		id: string;
		username: string;
		first_name: string;
		last_name: string;
		email: string;
		country: string;
		user_since: Date | string;
		last_login: Date | string;
		login_count: number;
		avatar_style: string | null;
	};
	stats: {
		totalStories: number;
		sharedStories: number;
		totalReadingTime: number;
		favoriteTopic: string;
		favoriteStyle: string;
		storiesThisWeek: number;
	};
	recentStories: Story[];
	sharedStories: Story[];
	isOwnProfile: boolean;
}

export default function UserProfile() {
	const [profileData, setProfileData] = useState<UserProfileData | null>(
		null,
	);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
	const [selectedAvatarStyle, setSelectedAvatarStyle] =
		useState<AvatarStyle | null>(null);
	const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
	const [isCountryDialogOpen, setIsCountryDialogOpen] = useState(false);
	const [countryInput, setCountryInput] = useState('');
	const [isUpdatingCountry, setIsUpdatingCountry] = useState(false);
	const [followersCount, setFollowersCount] = useState<number>(0);
	const [followingCount, setFollowingCount] = useState<number>(0);
	const pathname = usePathname();
	const username = pathname?.split('/')[1] || '';

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await fetch(`/api/users/${username}`);
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || 'Failed to fetch profile');
				}

				if (data.success) {
					setProfileData(data);
					setSelectedAvatarStyle(
						data.user.avatar_style as AvatarStyle | null,
					);
				} else {
					setError(data.error || 'Failed to load profile');
				}
			} catch (err) {
				console.error('Failed to fetch profile:', err);
				setError(
					err instanceof Error
						? err.message
						: 'Failed to load profile. Please try again later.',
				);
			} finally {
				setIsLoading(false);
			}
		};

		const fetchFollowData = async () => {
			try {
				const response = await fetch(`/api/users/${username}/follow`);
				if (response.ok) {
					const data = await response.json();
					if (data.success) {
						// Ensure we're getting the correct counts for the profile user
						// followersCount = people who follow this user
						// followingCount = people this user follows
						setFollowersCount(
							typeof data.followersCount === 'number'
								? data.followersCount
								: 0,
						);
						setFollowingCount(
							typeof data.followingCount === 'number'
								? data.followingCount
								: 0,
						);
					}
				} else {
					// If API fails, set to 0
					setFollowersCount(0);
					setFollowingCount(0);
				}
			} catch (err) {
				console.error('Failed to fetch follow data:', err);
				// Set to 0 on error
				setFollowersCount(0);
				setFollowingCount(0);
			}
		};

		if (username) {
			fetchProfile();
			fetchFollowData();
		}
	}, [username]);

	const formatDate = (date: Date | string) => {
		const d = typeof date === 'string' ? new Date(date) : date;
		return new Intl.DateTimeFormat('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric',
		}).format(d);
	};

	const getInitials = (firstName: string, lastName: string) => {
		return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
	};

	const getLanguageLabel = (code: string) => {
		const languageMap: Record<string, string> = {
			en: 'English',
			es: 'Spanish',
			fr: 'French',
			de: 'German',
			it: 'Italian',
			pt: 'Portuguese',
			ar: 'Arabic',
			ru: 'Russian',
			zh: 'Chinese',
			ja: 'Japanese',
			ko: 'Korean',
			hi: 'Hindi',
			bn: 'Bengali',
			pa: 'Punjabi',
			ta: 'Tamil',
		};
		return languageMap[code.toLowerCase()] || code.toUpperCase();
	};

	const getReadingTime = (content: string) => {
		const wordsPerMinute = 200;
		const wordCount = content.split(/\s+/).length;
		return Math.ceil(wordCount / wordsPerMinute);
	};

	const getPreview = (content: string, maxLength: number = 120) => {
		if (content.length <= maxLength) return content;
		return content.substring(0, maxLength).trim() + '...';
	};

	const handleAvatarStyleChange = async (style: AvatarStyle) => {
		if (!profileData || !isOwnProfile) return;

		setIsUpdatingAvatar(true);
		try {
			const response = await fetch(`/api/users/${username}/avatar`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ avatar_style: style }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to update avatar style');
			}

			if (data.success) {
				setSelectedAvatarStyle(style);
				setProfileData({
					...profileData,
					user: {
						...profileData.user,
						avatar_style: style,
					},
				});
				setIsAvatarDialogOpen(false);
				toast.success('Avatar style updated!', {
					description: 'Your avatar has been changed.',
				});
			}
		} catch (err) {
			console.error('Error updating avatar style:', err);
			toast.error('Failed to update avatar style', {
				description:
					err instanceof Error
						? err.message
						: 'Please try again later.',
			});
		} finally {
			setIsUpdatingAvatar(false);
		}
	};

	const handleCountrySave = async () => {
		if (!profileData || !countryInput) {
			toast.error('Please select a country');
			return;
		}

		setIsUpdatingCountry(true);
		try {
			const response = await fetch(`/api/users/${username}/profile`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ country: countryInput.trim() }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to update country');
			}

			if (data.success) {
				setProfileData({
					...profileData,
					user: {
						...profileData.user,
						country: data.user.country,
					},
				});
				setIsCountryDialogOpen(false);
				toast.success('Country updated!', {
					description: 'Your country has been updated.',
				});
			}
		} catch (err) {
			console.error('Error updating country:', err);
			toast.error('Failed to update country', {
				description:
					err instanceof Error
						? err.message
						: 'Please try again later.',
			});
		} finally {
			setIsUpdatingCountry(false);
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
				<div className="max-w-7xl mx-auto">
					<div className="flex items-center justify-center min-h-[400px]">
						<Spinner className="size-8 text-[#D97D55]" />
					</div>
				</div>
			</div>
		);
	}

	if (error || !profileData) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
				<div className="max-w-7xl mx-auto">
					<Card className="border-slate-200/60 dark:border-slate-800/60">
						<CardContent className="p-6 sm:p-8 md:p-12 text-center">
							<h3 className="text-lg sm:text-xl md:text-2xl font-serif font-normal text-slate-900 dark:text-slate-50 mb-2">
								{error || 'Profile not found'}
							</h3>
							<p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-sans font-light mb-6">
								{error
									? 'Please try again later or go back to the dashboard.'
									: 'The profile you are looking for does not exist.'}
							</p>
							<Link href={`/${username}/dashboard`}>
								<Button
									size="lg"
									className="font-sans font-light tracking-wide rounded-xl border-0 shadow-md hover:shadow-lg transition-all duration-300 text-white text-sm sm:text-base px-6 sm:px-8"
									style={{
										backgroundColor: '#D97D55',
									}}
								>
									Back to Dashboard
								</Button>
							</Link>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	const { user, stats, recentStories, sharedStories, isOwnProfile } =
		profileData;

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
			<div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
				{/* Profile Header */}
				<Card className="border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white via-slate-50/30 to-white dark:from-slate-900 dark:via-slate-900/50 dark:to-slate-950 overflow-hidden relative">
					{/* Decorative background pattern */}
					<div className="absolute inset-0 opacity-5 dark:opacity-10">
						<div
							className="absolute inset-0"
							style={{
								backgroundImage: `
									linear-gradient(rgba(217, 125, 85, 0.1) 1px, transparent 1px),
									linear-gradient(90deg, rgba(217, 125, 85, 0.1) 1px, transparent 1px)
								`,
								backgroundSize: '40px 40px',
							}}
						/>
					</div>
					<CardContent className="p-6 sm:p-8 md:p-12 relative z-10">
						<div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-center">
							<div className="relative">
								{isOwnProfile ? (
									<Dialog
										open={isAvatarDialogOpen}
										onOpenChange={setIsAvatarDialogOpen}
									>
										<DialogTrigger asChild>
											<button className="relative group cursor-pointer">
												<Avatar className="size-24 sm:size-28 md:size-36 border-4 border-white dark:border-slate-800 shadow-2xl ring-4 ring-[#D97D55]/20 group-hover:ring-[#D97D55]/40 transition-all">
													<AvatarImage
														src={getCuteAvatar(
															user.id ||
																user.username,
															selectedAvatarStyle ||
																undefined,
														)}
														alt={`${user.first_name} ${user.last_name}`}
														className="object-cover"
													/>
													<AvatarFallback className="bg-gradient-to-br from-[#D97D55] via-[#C96A45] to-[#8B6F47] text-white text-3xl sm:text-4xl md:text-5xl font-serif">
														{getEmojiAvatar(
															user.id ||
																user.username,
														)}
													</AvatarFallback>
												</Avatar>
												<div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
													<div className="opacity-0 group-hover:opacity-100 transition-opacity">
														<Palette className="size-6 text-white drop-shadow-lg" />
													</div>
												</div>
												{stats.totalStories > 0 && (
													<div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-[#D97D55] to-[#8B6F47] rounded-full p-2 shadow-lg border-4 border-white dark:border-slate-800 z-10">
														<Award className="size-4 sm:size-5 text-white" />
													</div>
												)}
											</button>
										</DialogTrigger>
										<DialogContent className="max-w-2xl">
											<DialogHeader>
												<DialogTitle className="text-xl sm:text-2xl font-serif font-light">
													Choose Your Avatar Style
												</DialogTitle>
												<DialogDescription className="text-sm font-sans font-light">
													Select a cute avatar style
													that represents you!
												</DialogDescription>
											</DialogHeader>
											<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 max-h-[500px] overflow-y-auto pr-2">
												{AVATAR_STYLES.map((style) => {
													const avatarUrl =
														getCuteAvatar(
															user.id ||
																user.username,
															style.value,
														);
													const isSelected =
														selectedAvatarStyle ===
														style.value;

													return (
														<button
															key={style.value}
															onClick={() =>
																handleAvatarStyleChange(
																	style.value,
																)
															}
															disabled={
																isUpdatingAvatar
															}
															className={`relative group p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
																isSelected
																	? 'border-[#D97D55] bg-[#D97D55]/5 shadow-md'
																	: 'border-slate-200 dark:border-slate-700 hover:border-[#D97D55]/50'
															} ${
																isUpdatingAvatar
																	? 'opacity-50 cursor-not-allowed'
																	: 'cursor-pointer'
															}`}
														>
															<div className="flex flex-col items-center gap-3">
																<div
																	className={`relative w-20 h-20 rounded-full overflow-hidden border-2 transition-all ${
																		isSelected
																			? 'border-[#D97D55] ring-2 ring-[#D97D55]/30'
																			: 'border-slate-200 dark:border-slate-700'
																	}`}
																>
																	<img
																		src={
																			avatarUrl
																		}
																		alt={
																			style.label
																		}
																		className="w-full h-full object-cover"
																	/>
																	{isSelected && (
																		<div className="absolute inset-0 bg-[#D97D55]/20 flex items-center justify-center">
																			<Star className="size-6 text-[#D97D55] fill-[#D97D55]" />
																		</div>
																	)}
																</div>
																<div className="text-center">
																	<p className="text-sm font-sans font-medium text-slate-900 dark:text-slate-50">
																		{
																			style.label
																		}
																	</p>
																	<p className="text-xs text-slate-500 dark:text-slate-400 font-sans font-light mt-0.5">
																		{
																			style.description
																		}
																	</p>
																</div>
															</div>
														</button>
													);
												})}
											</div>
											{isUpdatingAvatar && (
												<div className="flex items-center justify-center gap-2 mt-4">
													<Spinner className="size-4 text-[#D97D55]" />
													<p className="text-sm text-slate-600 dark:text-slate-400 font-sans font-light">
														Updating avatar...
													</p>
												</div>
											)}
										</DialogContent>
									</Dialog>
								) : (
									<div className="relative">
										<Avatar className="size-24 sm:size-28 md:size-36 border-4 border-white dark:border-slate-800 shadow-2xl ring-4 ring-[#D97D55]/20">
											<AvatarImage
												src={getCuteAvatar(
													user.id || user.username,
													(user.avatar_style as AvatarStyle) ||
														undefined,
												)}
												alt={`${user.first_name} ${user.last_name}`}
												className="object-cover"
											/>
											<AvatarFallback className="bg-gradient-to-br from-[#D97D55] via-[#C96A45] to-[#8B6F47] text-white text-3xl sm:text-4xl md:text-5xl font-serif">
												{getEmojiAvatar(
													user.id || user.username,
												)}
											</AvatarFallback>
										</Avatar>
										{stats.totalStories > 0 && (
											<div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-[#D97D55] to-[#8B6F47] rounded-full p-2 shadow-lg border-4 border-white dark:border-slate-800">
												<Award className="size-4 sm:size-5 text-white" />
											</div>
										)}
									</div>
								)}
							</div>
							<div className="flex-1 space-y-4 sm:space-y-5">
								<div>
									<div className="flex items-center gap-3 mb-2">
										<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-light text-slate-900 dark:text-slate-50">
											{user.first_name} {user.last_name}
										</h1>
										{stats.sharedStories > 0 && (
											<Badge className="bg-gradient-to-r from-[#D97D55] to-[#C96A45] text-white border-0 px-3 py-1">
												<Users className="size-3 mr-1" />
												Creator
											</Badge>
										)}
									</div>
									<p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 font-sans font-light flex items-center gap-2">
										<span>@{user.username}</span>
										{stats.totalStories >= 10 && (
											<Badge
												variant="outline"
												className="border-[#D97D55] text-[#D97D55]"
											>
												<Star className="size-3 mr-1 fill-[#D97D55]" />
												Pro Storyteller
											</Badge>
										)}
									</p>
								</div>
								<div className="flex flex-wrap items-center gap-4 sm:gap-5 text-sm sm:text-base">
									{isOwnProfile ? (
										<Dialog
											open={isCountryDialogOpen}
											onOpenChange={(open) => {
												setIsCountryDialogOpen(open);
												if (open && profileData) {
													setCountryInput(
														profileData.user
															.country || '',
													);
												}
											}}
										>
											<DialogTrigger asChild>
												<button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group">
													<MapPin className="size-4 text-[#D97D55]" />
													<span className="font-sans font-light">
														{user.country &&
														user.country !==
															'Unknown'
															? user.country
															: 'Set country'}
													</span>
													<Edit className="size-3 opacity-0 group-hover:opacity-50 transition-opacity" />
												</button>
											</DialogTrigger>
											<DialogContent className="max-w-md">
												<DialogHeader>
													<DialogTitle className="text-xl sm:text-2xl font-serif font-light">
														Update Your Country
													</DialogTitle>
													<DialogDescription className="text-sm font-sans font-light">
														Select your country from
														the list
													</DialogDescription>
												</DialogHeader>
												<div className="space-y-4 mt-4">
													<div>
														<label
															htmlFor="country-select"
															className="text-sm font-sans font-medium text-slate-700 dark:text-slate-300 mb-2 block"
														>
															Country
														</label>
														<Select
															value={countryInput}
															onValueChange={
																setCountryInput
															}
															disabled={
																isUpdatingCountry
															}
														>
															<SelectTrigger
																id="country-select"
																className="w-full font-sans font-light"
															>
																<SelectValue placeholder="Select a country" />
															</SelectTrigger>
															<SelectContent className="max-h-[300px]">
																{COUNTRIES.map(
																	(
																		country,
																	) => (
																		<SelectItem
																			key={
																				country
																			}
																			value={
																				country
																			}
																			className="font-sans font-light"
																		>
																			{
																				country
																			}
																		</SelectItem>
																	),
																)}
															</SelectContent>
														</Select>
													</div>
													<div className="flex justify-end gap-2">
														<Button
															variant="outline"
															onClick={() =>
																setIsCountryDialogOpen(
																	false,
																)
															}
															disabled={
																isUpdatingCountry
															}
															className="font-sans font-light"
														>
															Cancel
														</Button>
														<Button
															onClick={
																handleCountrySave
															}
															disabled={
																isUpdatingCountry ||
																!countryInput
															}
															className="font-sans font-light text-white"
															style={{
																backgroundColor:
																	'#D97D55',
															}}
														>
															{isUpdatingCountry ? (
																<>
																	<Spinner className="size-4 mr-2" />
																	Saving...
																</>
															) : (
																'Save'
															)}
														</Button>
													</div>
												</div>
											</DialogContent>
										</Dialog>
									) : (
										user.country &&
										user.country !== 'Unknown' && (
											<div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300">
												<MapPin className="size-4 text-[#D97D55]" />
												<span className="font-sans font-light">
													{user.country}
												</span>
											</div>
										)
									)}
									<div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300">
										<Calendar className="size-4 text-[#D97D55]" />
										<span className="font-sans font-light">
											Joined {formatDate(user.user_since)}
										</span>
									</div>
									<div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300">
										<Zap className="size-4 text-[#D97D55]" />
										<span className="font-sans font-light">
											{user.login_count}{' '}
											{user.login_count === 1
												? 'visit'
												: 'visits'}
										</span>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Statistics Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
					<Card className="group border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-default">
						<CardHeader className="pb-3">
							<CardDescription className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
								<div className="p-2 rounded-lg bg-[#D97D55]/10 group-hover:bg-[#D97D55]/20 transition-colors">
									<BookOpen className="size-4 text-[#D97D55]" />
								</div>
								Total Stories
							</CardDescription>
						</CardHeader>
						<CardContent>
							<CardTitle className="text-4xl sm:text-5xl font-serif font-light text-slate-900 dark:text-slate-50 mb-1">
								{stats.totalStories}
							</CardTitle>
							<p className="text-xs text-slate-500 dark:text-slate-400 font-sans font-light">
								stories created
							</p>
						</CardContent>
					</Card>

					<Card className="group border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-default">
						<CardHeader className="pb-3">
							<CardDescription className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
								<div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
									<Users className="size-4 text-blue-600 dark:text-blue-400" />
								</div>
								Shared Stories
							</CardDescription>
						</CardHeader>
						<CardContent>
							<CardTitle className="text-4xl sm:text-5xl font-serif font-light text-slate-900 dark:text-slate-50 mb-1">
								{stats.sharedStories}
							</CardTitle>
							<p className="text-xs text-slate-500 dark:text-slate-400 font-sans font-light">
								with community
							</p>
						</CardContent>
					</Card>

					<Card className="group border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-default">
						<CardHeader className="pb-3">
							<CardDescription className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
								<div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
									<Clock className="size-4 text-purple-600 dark:text-purple-400" />
								</div>
								Reading Time
							</CardDescription>
						</CardHeader>
						<CardContent>
							<CardTitle className="text-4xl sm:text-5xl font-serif font-light text-slate-900 dark:text-slate-50 mb-1">
								{stats.totalReadingTime}
							</CardTitle>
							<p className="text-xs text-slate-500 dark:text-slate-400 font-sans font-light">
								minutes of stories
							</p>
						</CardContent>
					</Card>

					<Card className="group border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-default">
						<CardHeader className="pb-3">
							<CardDescription className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
								<div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
									<TrendingUp className="size-4 text-green-600 dark:text-green-400" />
								</div>
								This Week
							</CardDescription>
						</CardHeader>
						<CardContent>
							<CardTitle className="text-4xl sm:text-5xl font-serif font-light text-slate-900 dark:text-slate-50 mb-1">
								{stats.storiesThisWeek}
							</CardTitle>
							<p className="text-xs text-slate-500 dark:text-slate-400 font-sans font-light">
								new stories
							</p>
						</CardContent>
					</Card>

					<Card className="group border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-default">
						<CardHeader className="pb-3">
							<CardDescription className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
								<div className="p-2 rounded-lg bg-pink-100 dark:bg-pink-900/30 group-hover:bg-pink-200 dark:group-hover:bg-pink-900/50 transition-colors">
									<Users className="size-4 text-pink-600 dark:text-pink-400" />
								</div>
								Followers
							</CardDescription>
						</CardHeader>
						<CardContent>
							<CardTitle className="text-4xl sm:text-5xl font-serif font-light text-slate-900 dark:text-slate-50 mb-1">
								{followersCount}
							</CardTitle>
							<p className="text-xs text-slate-500 dark:text-slate-400 font-sans font-light">
								{followersCount === 1
									? 'follower'
									: 'followers'}
							</p>
						</CardContent>
					</Card>

					<Card className="group border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-default">
						<CardHeader className="pb-3">
							<CardDescription className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
								<div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-900/50 transition-colors">
									<UserPlus className="size-4 text-cyan-600 dark:text-cyan-400" />
								</div>
								Following
							</CardDescription>
						</CardHeader>
						<CardContent>
							<CardTitle className="text-4xl sm:text-5xl font-serif font-light text-slate-900 dark:text-slate-50 mb-1">
								{followingCount}
							</CardTitle>
							<p className="text-xs text-slate-500 dark:text-slate-400 font-sans font-light">
								following
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Favorites Section */}
				{(stats.favoriteTopic || stats.favoriteStyle) && (
					<Card className="border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950 overflow-hidden relative">
						<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#D97D55]/10 to-transparent rounded-full blur-3xl" />
						<CardHeader className="relative z-10">
							<CardTitle className="text-xl sm:text-2xl font-serif font-light text-slate-900 dark:text-slate-50 flex items-center gap-2">
								<div className="p-2 rounded-lg bg-[#D97D55]/10">
									<Star className="size-5 text-[#D97D55] fill-[#D97D55]" />
								</div>
								Favorites
							</CardTitle>
						</CardHeader>
						<CardContent className="relative z-10">
							<div className="flex flex-wrap gap-3 sm:gap-4">
								{stats.favoriteTopic && (
									<Badge
										variant="outline"
										className="px-4 py-2.5 text-sm font-sans font-light border-2 border-[#D97D55] text-[#D97D55] bg-[#D97D55]/5 hover:bg-[#D97D55]/10 transition-colors"
									>
										<BookMarked className="size-4 mr-2" />
										<span className="font-medium">
											Favorite Topic:
										</span>{' '}
										{stats.favoriteTopic
											.charAt(0)
											.toUpperCase() +
											stats.favoriteTopic.slice(1)}
									</Badge>
								)}
								{stats.favoriteStyle && (
									<Badge
										variant="outline"
										className="px-4 py-2.5 text-sm font-sans font-light border-2 border-[#D97D55] text-[#D97D55] bg-[#D97D55]/5 hover:bg-[#D97D55]/10 transition-colors"
									>
										<Palette className="size-4 mr-2" />
										<span className="font-medium">
											Favorite Style:
										</span>{' '}
										{stats.favoriteStyle
											.charAt(0)
											.toUpperCase() +
											stats.favoriteStyle.slice(1)}
									</Badge>
								)}
							</div>
						</CardContent>
					</Card>
				)}

				{/* Stories Section with Tabs */}
				{(recentStories.length > 0 || sharedStories.length > 0) && (
					<Card className="border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950">
						<CardHeader className="flex flex-row items-center justify-between pb-4">
							<CardTitle className="text-xl sm:text-2xl font-serif font-light text-slate-900 dark:text-slate-50 flex items-center gap-2">
								<BookOpen className="size-5 text-[#D97D55]" />
								Stories
							</CardTitle>
							<div className="flex gap-2">
								{isOwnProfile && recentStories.length > 0 && (
									<Link
										href={`/${username}/dashboard/my-stories`}
									>
										<Button
											variant="ghost"
											size="sm"
											className="font-sans font-light text-[#D97D55]"
										>
											View All
											<ArrowRight className="size-4 ml-2" />
										</Button>
									</Link>
								)}
								{sharedStories.length > 0 && (
									<Link href={`/${username}/dashboard/community`}>
										<Button
											variant="ghost"
											size="sm"
											className="font-sans font-light text-[#D97D55]"
										>
											Community
											<ArrowRight className="size-4 ml-2" />
										</Button>
									</Link>
								)}
							</div>
						</CardHeader>
						<CardContent>
							<Tabs defaultValue="recent" className="w-full">
								<TabsList className="grid w-full max-w-md grid-cols-2 mb-6 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg">
									<TabsTrigger
										value="recent"
										className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-[#D97D55] data-[state=active]:shadow-sm font-sans font-light"
										disabled={recentStories.length === 0}
									>
										<Clock className="size-4 mr-2" />
										Recent
										{recentStories.length > 0 && (
											<Badge
												variant="secondary"
												className="ml-2 h-5 px-1.5 text-xs bg-[#D97D55]/10 text-[#D97D55] border-0"
											>
												{recentStories.length}
											</Badge>
										)}
									</TabsTrigger>
									<TabsTrigger
										value="shared"
										className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-[#D97D55] data-[state=active]:shadow-sm font-sans font-light"
										disabled={sharedStories.length === 0}
									>
										<Users className="size-4 mr-2" />
										Shared
										{sharedStories.length > 0 && (
											<Badge
												variant="secondary"
												className="ml-2 h-5 px-1.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-0"
											>
												{sharedStories.length}
											</Badge>
										)}
									</TabsTrigger>
								</TabsList>

								<TabsContent value="recent" className="mt-0">
									{recentStories.length > 0 ? (
										<div className="space-y-2.5">
											{recentStories.map((story) => (
												<Link
													key={story.id}
													href={`/${username}/dashboard/my-stories/${story.id}`}
												>
													<Card className="group border-slate-200/60 dark:border-slate-800/60 hover:shadow-lg hover:border-[#D97D55]/30 transition-all duration-300 cursor-pointer bg-gradient-to-r from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
														<CardContent className="p-3 sm:p-4">
															<div className="flex items-start justify-between gap-3">
																<div className="flex-1 min-w-0 space-y-1.5">
																	<div>
																		<h3 className="text-base sm:text-lg font-serif font-light text-slate-900 dark:text-slate-50 mb-1 group-hover:text-[#D97D55] transition-colors line-clamp-1">
																			{
																				story.title
																			}
																		</h3>
																		<p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-sans font-light line-clamp-1">
																			{getPreview(
																				story.story_content,
																				80,
																			)}
																		</p>
																	</div>
																	<div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
																		<Badge
																			variant="outline"
																			className="text-[10px] sm:text-xs font-sans font-light border-[#D97D55]/30 text-[#D97D55] bg-[#D97D55]/5 px-1.5 py-0.5"
																		>
																			{
																				story.topic
																			}
																		</Badge>
																		{story.subtopic && (
																			<Badge
																				variant="outline"
																				className="text-[10px] sm:text-xs font-sans font-light px-1.5 py-0.5"
																			>
																				{
																					story.subtopic
																				}
																			</Badge>
																		)}
																		<Badge
																			variant="outline"
																			className="text-[10px] sm:text-xs font-sans font-light px-1.5 py-0.5"
																		>
																			{
																				story.style
																			}
																		</Badge>
																		<div className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-sans font-light">
																			<Clock className="size-2.5 sm:size-3" />
																			{getReadingTime(
																				story.story_content,
																			)}{' '}
																			min
																		</div>
																		<span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-sans font-light">
																			{formatDate(
																				story.created_at,
																			)}
																		</span>
																	</div>
																</div>
																<ArrowRight className="size-4 text-slate-400 group-hover:text-[#D97D55] group-hover:translate-x-1 transition-all shrink-0 mt-0.5" />
															</div>
														</CardContent>
													</Card>
												</Link>
											))}
										</div>
									) : (
										<div className="text-center py-8">
											<Clock className="size-10 mx-auto mb-3 text-slate-400" />
											<p className="text-sm text-slate-600 dark:text-slate-400 font-sans font-light">
												No recent stories yet
											</p>
										</div>
									)}
								</TabsContent>

								<TabsContent value="shared" className="mt-0">
									{sharedStories.length > 0 ? (
										<div className="space-y-2.5">
											{sharedStories.map((story) => (
												<Link
													key={story.id}
													href={`/(pages)/community-stories/${story.id}`}
												>
													<Card className="group border-slate-200/60 dark:border-slate-800/60 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 cursor-pointer bg-gradient-to-r from-white to-blue-50/30 dark:from-slate-900 dark:to-blue-950/20 relative overflow-hidden">
														<div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full blur-xl" />
														<CardContent className="p-3 sm:p-4 relative z-10">
															<div className="flex items-start justify-between gap-3">
																<div className="flex-1 min-w-0 space-y-1.5">
																	<div className="flex items-start gap-1.5">
																		<Users className="size-3 text-blue-500 mt-0.5 shrink-0" />
																		<div className="flex-1">
																			<h3 className="text-base sm:text-lg font-serif font-light text-slate-900 dark:text-slate-50 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
																				{
																					story.title
																				}
																			</h3>
																			<p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-sans font-light line-clamp-1">
																				{getPreview(
																					story.story_content,
																					80,
																				)}
																			</p>
																		</div>
																	</div>
																	<div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
																		<Badge
																			variant="outline"
																			className="text-[10px] sm:text-xs font-sans font-light border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-1.5 py-0.5"
																		>
																			{
																				story.topic
																			}
																		</Badge>
																		{story.subtopic && (
																			<Badge
																				variant="outline"
																				className="text-[10px] sm:text-xs font-sans font-light px-1.5 py-0.5"
																			>
																				{
																					story.subtopic
																				}
																			</Badge>
																		)}
																		<Badge
																			variant="outline"
																			className="text-[10px] sm:text-xs font-sans font-light px-1.5 py-0.5"
																		>
																			{
																				story.style
																			}
																		</Badge>
																		<div className="flex items-center gap-1 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-sans font-light">
																			<Clock className="size-2.5 sm:size-3" />
																			{getReadingTime(
																				story.story_content,
																			)}{' '}
																			min
																		</div>
																		<span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-sans font-light">
																			{formatDate(
																				story.created_at,
																			)}
																		</span>
																	</div>
																</div>
																<ArrowRight className="size-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all shrink-0 mt-0.5" />
															</div>
														</CardContent>
													</Card>
												</Link>
											))}
										</div>
									) : (
										<div className="text-center py-8">
											<Users className="size-10 mx-auto mb-3 text-slate-400" />
											<p className="text-sm text-slate-600 dark:text-slate-400 font-sans font-light">
												No shared stories yet
											</p>
											{isOwnProfile && (
												<p className="text-xs text-slate-500 dark:text-slate-500 mt-1.5 font-sans font-light">
													Share your stories to make
													them visible to the
													community
												</p>
											)}
										</div>
									)}
								</TabsContent>
							</Tabs>
						</CardContent>
					</Card>
				)}

				{/* Empty State */}
				{stats.totalStories === 0 && (
					<Card className="border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950">
						<CardContent className="p-12 text-center">
							<Sparkles className="size-12 sm:size-16 mx-auto mb-4 text-[#D97D55]" />
							<h3 className="text-xl sm:text-2xl font-serif font-light text-slate-900 dark:text-slate-50 mb-2">
								{isOwnProfile
									? "You haven't created any stories yet"
									: 'No stories yet'}
							</h3>
							<p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-sans font-light mb-6">
								{isOwnProfile
									? 'Start creating magical stories for children!'
									: 'This user has not created any stories yet.'}
							</p>
							{isOwnProfile && (
								<Link href={`/${username}/dashboard/generate`}>
									<Button
										size="lg"
										className="font-sans font-light tracking-wide rounded-xl border-0 shadow-md hover:shadow-lg transition-all duration-300 text-white text-sm sm:text-base px-6 sm:px-8"
										style={{
											backgroundColor: '#D97D55',
										}}
									>
										<Sparkles className="size-4 mr-2" />
										Create Your First Story
									</Button>
								</Link>
							)}
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
