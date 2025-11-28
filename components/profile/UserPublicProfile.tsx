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
	Users,
	TrendingUp,
	Star,
	ArrowRight,
	BookMarked,
	Sparkles,
	MapPin,
	Award,
	Zap,
	Palette,
	UserPlus,
	UserMinus,
	UserCheck,
} from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
	getCuteAvatar,
	getEmojiAvatar,
	type AvatarStyle,
} from '@/lib/avatar-utils';
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

interface FollowData {
	isFollowing: boolean;
	followersCount: number;
	followingCount: number;
}

export default function UserPublicProfile() {
	const [profileData, setProfileData] = useState<UserProfileData | null>(
		null,
	);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [followData, setFollowData] = useState<FollowData | null>(null);
	const [isFollowing, setIsFollowing] = useState(false);
	const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);
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
					// Fetch follow status if not own profile
					if (!data.isOwnProfile) {
						fetchFollowStatus();
					}
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

		if (username) {
			fetchProfile();
		}
	}, [username]);

	const fetchFollowStatus = async () => {
		try {
			const response = await fetch(`/api/users/${username}/follow`);
			const data = await response.json();

			if (response.ok && data.success) {
				setFollowData(data);
				setIsFollowing(data.isFollowing);
			}
		} catch (err) {
			console.error('Failed to fetch follow status:', err);
		}
	};

	const handleFollow = async () => {
		if (!profileData || profileData.isOwnProfile) return;

		setIsUpdatingFollow(true);
		try {
			const method = isFollowing ? 'DELETE' : 'POST';
			const response = await fetch(`/api/users/${username}/follow`, {
				method,
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to update follow status');
			}

			if (data.success) {
				setIsFollowing(!isFollowing);
				if (followData) {
					setFollowData({
						...followData,
						isFollowing: !isFollowing,
						followersCount: isFollowing
							? followData.followersCount - 1
							: followData.followersCount + 1,
					});
				}
				toast.success(
					isFollowing ? 'Unfollowed successfully' : 'Following!',
					{
						description: isFollowing
							? `You're no longer following ${profileData.user.first_name}`
							: `You're now following ${profileData.user.first_name}`,
					},
				);
			}
		} catch (err) {
			console.error('Error updating follow status:', err);
			toast.error('Failed to update follow status', {
				description:
					err instanceof Error
						? err.message
						: 'Please try again later.',
			});
		} finally {
			setIsUpdatingFollow(false);
		}
	};

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
									? 'Please try again later.'
									: 'The profile you are looking for does not exist.'}
							</p>
							<Link href="/">
								<Button
									size="lg"
									className="font-sans font-light tracking-wide rounded-xl border-0 shadow-md hover:shadow-lg transition-all duration-300 text-white text-sm sm:text-base px-6 sm:px-8"
									style={{
										backgroundColor: '#D97D55',
									}}
								>
									Go Home
								</Button>
							</Link>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	const { user, stats, recentStories, sharedStories } = profileData;

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
								{!profileData.isOwnProfile && (
									<div className="flex items-center gap-3">
										<Button
											onClick={handleFollow}
											disabled={isUpdatingFollow}
											className="font-sans font-light shadow-md hover:shadow-lg transition-all"
											style={{
												backgroundColor: isFollowing
													? 'transparent'
													: '#D97D55',
												borderColor: '#D97D55',
												color: isFollowing
													? '#D97D55'
													: 'white',
											}}
											variant={
												isFollowing
													? 'outline'
													: 'default'
											}
										>
											{isUpdatingFollow ? (
												<>
													<Spinner className="size-4 mr-2" />
													{isFollowing
														? 'Unfollowing...'
														: 'Following...'}
												</>
											) : isFollowing ? (
												<>
													<UserCheck className="size-4 mr-2" />
													Following
												</>
											) : (
												<>
													<UserPlus className="size-4 mr-2" />
													Follow
												</>
											)}
										</Button>
										{followData && (
											<div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 font-sans font-light">
												<div className="flex items-center gap-1">
													<Users className="size-4" />
													<span className="font-medium">
														{
															followData.followersCount
														}
													</span>
													<span>
														{followData.followersCount ===
														1
															? 'follower'
															: 'followers'}
													</span>
												</div>
												<div className="flex items-center gap-1">
													<UserPlus className="size-4" />
													<span className="font-medium">
														{
															followData.followingCount
														}
													</span>
													<span>following</span>
												</div>
											</div>
										)}
									</div>
								)}
								<div className="flex flex-wrap items-center gap-4 sm:gap-5 text-sm sm:text-base">
									{user.country &&
										user.country !== 'Unknown' && (
											<div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300">
												<MapPin className="size-4 text-[#D97D55]" />
												<span className="font-sans font-light">
													{user.country}
												</span>
											</div>
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
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
							{sharedStories.length > 0 && (
								<div className="flex gap-2">
									<Link href={`/(pages)/community-stories`}>
										<Button
											variant="ghost"
											size="sm"
											className="font-sans font-light text-[#D97D55]"
										>
											View All Shared
											<ArrowRight className="size-4 ml-2" />
										</Button>
									</Link>
								</div>
							)}
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
									{recentStories.filter(
										(story) => story.shared,
									).length > 0 ? (
										<div className="space-y-2.5">
											{recentStories
												.filter((story) => story.shared)
												.map((story) => (
													<Link
														key={story.id}
														href={`/(pages)/community-stories/${story.id}`}
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
												No shared stories yet
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
								No stories yet
							</h3>
							<p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-sans font-light mb-6">
								This user has not shared any stories yet.
							</p>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
