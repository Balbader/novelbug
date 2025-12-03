'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	User,
	Mail,
	Globe,
	Calendar as CalendarIcon,
	LogIn,
	TrendingUp,
	Palette,
	Save,
	Edit,
	MapPin,
	Settings as SettingsIcon,
	Shield,
	Bell,
	Key,
} from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
	getCuteAvatar,
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { COUNTRIES } from '@/lib/countries';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UserData {
	id: string;
	username: string;
	first_name: string;
	last_name: string;
	email: string;
	country: string;
	date_of_birth: Date | string;
	user_since: Date | string;
	last_login: Date | string;
	login_count: number;
	avatar_style: string | null;
}

export default function Settings() {
	const [userData, setUserData] = useState<UserData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
	const [selectedAvatarStyle, setSelectedAvatarStyle] =
		useState<AvatarStyle | null>(null);
	const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
	const [isCountryDialogOpen, setIsCountryDialogOpen] = useState(false);
	const [selectedCountry, setSelectedCountry] = useState('');
	const [isUpdatingCountry, setIsUpdatingCountry] = useState(false);
	const [isDateOfBirthDialogOpen, setIsDateOfBirthDialogOpen] =
		useState(false);
	const [selectedDateOfBirth, setSelectedDateOfBirth] = useState<Date | null>(
		null,
	);
	const [isUpdatingDateOfBirth, setIsUpdatingDateOfBirth] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isDeletingAccount, setIsDeletingAccount] = useState(false);
	const pathname = usePathname();
	const router = useRouter();
	const username = pathname?.split('/')[1] || '';

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await fetch(`/api/users/${username}`);
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || 'Failed to fetch user data');
				}

				if (data.success && data.user) {
					setUserData(data.user);
					setSelectedAvatarStyle(
						data.user.avatar_style as AvatarStyle | null,
					);
					setSelectedCountry(data.user.country || '');
					// Set date of birth
					const dob =
						typeof data.user.date_of_birth === 'string'
							? new Date(data.user.date_of_birth)
							: data.user.date_of_birth;
					setSelectedDateOfBirth(dob instanceof Date ? dob : null);
				} else {
					setError(data.error || 'Failed to load user data');
				}
			} catch (err) {
				console.error('Failed to fetch user data:', err);
				setError(
					err instanceof Error
						? err.message
						: 'Failed to load settings. Please try again later.',
				);
			} finally {
				setIsLoading(false);
			}
		};

		if (username) {
			fetchUserData();
		}
	}, [username]);

	const formatDate = (date: Date | string) => {
		const d = typeof date === 'string' ? new Date(date) : date;
		return new Intl.DateTimeFormat('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		}).format(d);
	};

	const formatDateShort = (date: Date | string) => {
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

	const handleAvatarUpdate = async () => {
		if (!userData || !selectedAvatarStyle) return;

		setIsUpdatingAvatar(true);
		try {
			const response = await fetch(`/api/users/${username}/avatar`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					avatar_style: selectedAvatarStyle,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to update avatar');
			}

			if (data.success) {
				setUserData({
					...userData,
					avatar_style: selectedAvatarStyle,
				});
				setIsAvatarDialogOpen(false);
				toast.success('Avatar style updated successfully!');
			} else {
				throw new Error(data.error || 'Failed to update avatar');
			}
		} catch (err) {
			console.error('Failed to update avatar:', err);
			toast.error(
				err instanceof Error
					? err.message
					: 'Failed to update avatar. Please try again.',
			);
		} finally {
			setIsUpdatingAvatar(false);
		}
	};

	const handleCountryUpdate = async () => {
		if (!userData || !selectedCountry) return;

		setIsUpdatingCountry(true);
		try {
			const response = await fetch(`/api/users/${username}/profile`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					country: selectedCountry,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to update country');
			}

			if (data.success) {
				setUserData({
					...userData,
					country: selectedCountry,
				});
				setIsCountryDialogOpen(false);
				toast.success('Country updated successfully!');
			} else {
				throw new Error(data.error || 'Failed to update country');
			}
		} catch (err) {
			console.error('Failed to update country:', err);
			toast.error(
				err instanceof Error
					? err.message
					: 'Failed to update country. Please try again.',
			);
		} finally {
			setIsUpdatingCountry(false);
		}
	};

	const handleDateOfBirthUpdate = async () => {
		if (!userData || !selectedDateOfBirth) return;

		setIsUpdatingDateOfBirth(true);
		try {
			const response = await fetch(`/api/users/${username}/profile`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					date_of_birth: selectedDateOfBirth.toISOString(),
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to update date of birth');
			}

			if (data.success) {
				setUserData({
					...userData,
					date_of_birth: selectedDateOfBirth,
				});
				setIsDateOfBirthDialogOpen(false);
				toast.success('Date of birth updated successfully!');
			} else {
				throw new Error(data.error || 'Failed to update date of birth');
			}
		} catch (err) {
			console.error('Failed to update date of birth:', err);
			toast.error(
				err instanceof Error
					? err.message
					: 'Failed to update date of birth. Please try again.',
			);
		} finally {
			setIsUpdatingDateOfBirth(false);
		}
	};

	const handleDeleteAccount = async () => {
		if (!userData) return;

		setIsDeletingAccount(true);
		try {
			const response = await fetch(`/api/users/${username}`, {
				method: 'DELETE',
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Failed to delete account');
			}

			if (data.success) {
				toast.success('Account deleted successfully');
				// Redirect to home page after deletion
				setTimeout(() => {
					router.push('/home');
				}, 1500);
			} else {
				throw new Error(data.error || 'Failed to delete account');
			}
		} catch (err) {
			console.error('Failed to delete account:', err);
			toast.error(
				err instanceof Error
					? err.message
					: 'Failed to delete account. Please try again.',
			);
			setIsDeletingAccount(false);
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<Spinner className="size-8" />
			</div>
		);
	}

	if (error || !userData) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
				<p className="text-destructive text-lg font-medium">{error}</p>
				<Button
					onClick={() => window.location.reload()}
					variant="outline"
				>
					Retry
				</Button>
			</div>
		);
	}

	const avatarUrl = getCuteAvatar(
		userData.id,
		userData.avatar_style as AvatarStyle | null,
	);
	const initials = getInitials(userData.first_name, userData.last_name);

	return (
		<div className="container mx-auto py-8 px-4 max-w-6xl">
			<div className="mb-8">
				<div className="flex items-center gap-3 mb-2">
					<SettingsIcon className="size-8 text-[#D97D55]" />
					<h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
						Settings
					</h1>
				</div>
				<p className="text-slate-600 dark:text-slate-400">
					Manage your account settings and preferences
				</p>
			</div>

			<Tabs defaultValue="profile" className="w-full">
				<div className="flex items-center justify-between mb-6">
					<TabsList className="grid w-full max-w-md grid-cols-3">
						<TabsTrigger value="profile">Profile</TabsTrigger>
						<TabsTrigger value="account">Account</TabsTrigger>
						<TabsTrigger value="preferences">
							Preferences
						</TabsTrigger>
					</TabsList>
					<AlertDialog
						open={isDeleteDialogOpen}
						onOpenChange={setIsDeleteDialogOpen}
					>
						<AlertDialogTrigger asChild>
							<Button variant="destructive" className="gap-2">
								<Trash2 className="size-4" />
								Delete Account
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Delete Account
								</AlertDialogTitle>
								<AlertDialogDescription>
									Are you sure you want to delete your
									account? This action cannot be undone. All
									your data, including stories, will be
									permanently deleted.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel disabled={isDeletingAccount}>
									Cancel
								</AlertDialogCancel>
								<AlertDialogAction
									onClick={handleDeleteAccount}
									disabled={isDeletingAccount}
									className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
								>
									{isDeletingAccount ? (
										<>
											<Spinner className="size-4 mr-2" />
											Deleting...
										</>
									) : (
										'Delete Account'
									)}
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>

				{/* Profile Settings */}
				<TabsContent value="profile" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<User className="size-5 text-[#D97D55]" />
								Profile Information
							</CardTitle>
							<CardDescription>
								Update your profile details and avatar
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Avatar Section */}
							<div className="flex items-center gap-6">
								<div className="relative">
									<Avatar className="size-24 border-4 border-white dark:border-slate-800 shadow-lg">
										<AvatarImage
											src={avatarUrl}
											alt={`${userData.first_name} ${userData.last_name}`}
										/>
										<AvatarFallback
											className="text-2xl font-semibold"
											style={{
												backgroundColor: '#D97D55',
												color: 'white',
											}}
										>
											{initials}
										</AvatarFallback>
									</Avatar>
								</div>
								<div className="flex-1">
									<h3 className="font-semibold text-lg mb-1">
										Profile Picture
									</h3>
									<p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
										Choose your avatar style from our
										collection
									</p>
									<Dialog
										open={isAvatarDialogOpen}
										onOpenChange={setIsAvatarDialogOpen}
									>
										<DialogTrigger asChild>
											<Button
												variant="outline"
												className="gap-2"
											>
												<Edit className="size-4" />
												Change Avatar
											</Button>
										</DialogTrigger>
										<DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
											<DialogHeader>
												<DialogTitle>
													Choose Avatar Style
												</DialogTitle>
												<DialogDescription>
													Select a style for your
													avatar. Your avatar will be
													generated based on your
													account.
												</DialogDescription>
											</DialogHeader>
											<div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
												{AVATAR_STYLES.map((style) => {
													const previewUrl =
														getCuteAvatar(
															userData.id,
															style.value,
														);
													const isSelected =
														selectedAvatarStyle ===
														style.value;
													return (
														<button
															key={style.value}
															type="button"
															onClick={() =>
																setSelectedAvatarStyle(
																	style.value,
																)
															}
															className={`p-4 rounded-lg border-2 transition-all ${
																isSelected
																	? 'border-[#D97D55] bg-[#F4E9D7]/20'
																	: 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
															}`}
														>
															<div className="flex flex-col items-center gap-2">
																<Avatar className="size-16">
																	<AvatarImage
																		src={
																			previewUrl
																		}
																		alt={
																			style.label
																		}
																	/>
																	<AvatarFallback>
																		{
																			initials
																		}
																	</AvatarFallback>
																</Avatar>
																<div className="text-center">
																	<p className="text-sm font-medium">
																		{
																			style.label
																		}
																	</p>
																	<p className="text-xs text-slate-500 dark:text-slate-400">
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
											<div className="flex justify-end gap-2 pt-4 border-t">
												<Button
													variant="outline"
													onClick={() =>
														setIsAvatarDialogOpen(
															false,
														)
													}
												>
													Cancel
												</Button>
												<Button
													onClick={handleAvatarUpdate}
													disabled={
														!selectedAvatarStyle ||
														isUpdatingAvatar ||
														selectedAvatarStyle ===
															userData.avatar_style
													}
													className="gap-2"
												>
													{isUpdatingAvatar ? (
														<>
															<Spinner className="size-4" />
															Saving...
														</>
													) : (
														<>
															<Save className="size-4" />
															Save Changes
														</>
													)}
												</Button>
											</div>
										</DialogContent>
									</Dialog>
								</div>
							</div>

							<Separator />

							{/* Name Information */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-2">
									<Label className="flex items-center gap-2">
										<User className="size-4 text-slate-500" />
										First Name
									</Label>
									<Input
										value={userData.first_name}
										disabled
										className="bg-slate-50 dark:bg-slate-900"
									/>
									<p className="text-xs text-slate-500">
										Contact support to change your name
									</p>
								</div>
								<div className="space-y-2">
									<Label className="flex items-center gap-2">
										<User className="size-4 text-slate-500" />
										Last Name
									</Label>
									<Input
										value={userData.last_name}
										disabled
										className="bg-slate-50 dark:bg-slate-900"
									/>
									<p className="text-xs text-slate-500">
										Contact support to change your name
									</p>
								</div>
							</div>

							{/* Email */}
							<div className="space-y-2">
								<Label className="flex items-center gap-2">
									<Mail className="size-4 text-slate-500" />
									Email Address
								</Label>
								<Input
									value={userData.email}
									disabled
									className="bg-slate-50 dark:bg-slate-900"
								/>
								<p className="text-xs text-slate-500">
									Email is managed through your authentication
									provider
								</p>
							</div>

							{/* Username */}
							<div className="space-y-2">
								<Label className="flex items-center gap-2">
									<User className="size-4 text-slate-500" />
									Username
								</Label>
								<Input
									value={userData.username}
									disabled
									className="bg-slate-50 dark:bg-slate-900"
								/>
								<p className="text-xs text-slate-500">
									Username cannot be changed
								</p>
							</div>

							{/* Country */}
							<div className="space-y-2">
								<Label className="flex items-center gap-2">
									<MapPin className="size-4 text-slate-500" />
									Country
								</Label>
								<div className="flex items-center gap-2">
									<Input
										value={userData.country}
										disabled
										className="bg-slate-50 dark:bg-slate-900 flex-1"
									/>
									<Dialog
										open={isCountryDialogOpen}
										onOpenChange={setIsCountryDialogOpen}
									>
										<DialogTrigger asChild>
											<Button
												variant="outline"
												className="gap-2"
											>
												<Edit className="size-4" />
												Edit
											</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>
													Update Country
												</DialogTitle>
												<DialogDescription>
													Select your country from the
													list below.
												</DialogDescription>
											</DialogHeader>
											<div className="space-y-4 py-4">
												<div className="space-y-2">
													<Label>Country</Label>
													<Select
														value={selectedCountry}
														onValueChange={
															setSelectedCountry
														}
													>
														<SelectTrigger>
															<SelectValue placeholder="Select a country" />
														</SelectTrigger>
														<SelectContent className="max-h-[300px]">
															{COUNTRIES.map(
																(country) => (
																	<SelectItem
																		key={
																			country
																		}
																		value={
																			country
																		}
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
											</div>
											<div className="flex justify-end gap-2">
												<Button
													variant="outline"
													onClick={() =>
														setIsCountryDialogOpen(
															false,
														)
													}
												>
													Cancel
												</Button>
												<Button
													onClick={
														handleCountryUpdate
													}
													disabled={
														!selectedCountry ||
														isUpdatingCountry ||
														selectedCountry ===
															userData.country
													}
													className="gap-2"
												>
													{isUpdatingCountry ? (
														<>
															<Spinner className="size-4" />
															Saving...
														</>
													) : (
														<>
															<Save className="size-4" />
															Save Changes
														</>
													)}
												</Button>
											</div>
										</DialogContent>
									</Dialog>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Account Information */}
				<TabsContent value="account" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Shield className="size-5 text-[#D97D55]" />
								Account Information
							</CardTitle>
							<CardDescription>
								View your account details and activity
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-2">
									<Label className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
										<CalendarIcon className="size-4" />
										Date of Birth
									</Label>
									<div className="space-y-2">
										<div className="p-3 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
											<p className="text-sm font-medium">
												{formatDateShort(
													userData.date_of_birth,
												)}
											</p>
										</div>
										<Dialog
											open={isDateOfBirthDialogOpen}
											onOpenChange={(open) => {
												setIsDateOfBirthDialogOpen(
													open,
												);
												if (open && userData) {
													// Initialize with current date of birth when dialog opens
													const dob =
														typeof userData.date_of_birth ===
														'string'
															? new Date(
																	userData.date_of_birth,
																)
															: userData.date_of_birth;
													if (
														dob instanceof Date &&
														!isNaN(dob.getTime())
													) {
														setSelectedDateOfBirth(
															dob,
														);
													}
												}
											}}
										>
											<DialogTrigger asChild>
												<Button
													variant="outline"
													size="sm"
													className="gap-2 w-full"
												>
													<Edit className="size-4" />
													Edit Date of Birth
												</Button>
											</DialogTrigger>
											<DialogContent>
												<DialogHeader>
													<DialogTitle>
														Update Date of Birth
													</DialogTitle>
													<DialogDescription>
														Select your date of
														birth. This information
														helps us provide
														age-appropriate content.
													</DialogDescription>
												</DialogHeader>
												<div className="space-y-4 py-4">
													<div className="space-y-2">
														<Label>
															Date of Birth
														</Label>
														<Popover>
															<PopoverTrigger
																asChild
															>
																<Button
																	variant="outline"
																	className="w-full justify-start text-left font-normal"
																>
																	<CalendarIcon className="mr-2 h-4 w-4" />
																	{selectedDateOfBirth ? (
																		format(
																			selectedDateOfBirth,
																			'PPP',
																		)
																	) : (
																		<span className="text-muted-foreground">
																			Pick
																			a
																			date
																		</span>
																	)}
																</Button>
															</PopoverTrigger>
															<PopoverContent
																className="w-auto p-0"
																align="start"
															>
																<Calendar
																	mode="single"
																	captionLayout="dropdown"
																	fromYear={
																		1900
																	}
																	toYear={new Date().getFullYear()}
																	selected={
																		selectedDateOfBirth ||
																		undefined
																	}
																	onSelect={(
																		date:
																			| Date
																			| undefined,
																	) => {
																		setSelectedDateOfBirth(
																			date ||
																				null,
																		);
																	}}
																	disabled={(
																		date: Date,
																	) =>
																		date >
																			new Date() ||
																		date <
																			new Date(
																				'1900-01-01',
																			)
																	}
																	initialFocus
																/>
															</PopoverContent>
														</Popover>
													</div>
												</div>
												<div className="flex justify-end gap-2">
													<Button
														variant="outline"
														onClick={() =>
															setIsDateOfBirthDialogOpen(
																false,
															)
														}
													>
														Cancel
													</Button>
													<Button
														onClick={
															handleDateOfBirthUpdate
														}
														disabled={
															!selectedDateOfBirth ||
															isUpdatingDateOfBirth ||
															selectedDateOfBirth.getTime() ===
																new Date(
																	userData.date_of_birth,
																).getTime()
														}
														className="gap-2"
													>
														{isUpdatingDateOfBirth ? (
															<>
																<Spinner className="size-4" />
																Saving...
															</>
														) : (
															<>
																<Save className="size-4" />
																Save Changes
															</>
														)}
													</Button>
												</div>
											</DialogContent>
										</Dialog>
									</div>
								</div>

								<div className="space-y-2">
									<Label className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
										<CalendarIcon className="size-4" />
										Member Since
									</Label>
									<div className="p-3 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
										<p className="text-sm font-medium">
											{formatDateShort(
												userData.user_since,
											)}
										</p>
									</div>
								</div>

								<div className="space-y-2">
									<Label className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
										<LogIn className="size-4" />
										Last Login
									</Label>
									<div className="p-3 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
										<p className="text-sm font-medium">
											{formatDate(userData.last_login)}
										</p>
									</div>
								</div>

								<div className="space-y-2">
									<Label className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
										<TrendingUp className="size-4" />
										Total Logins
									</Label>
									<div className="p-3 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
										<p className="text-sm font-medium">
											{userData.login_count.toLocaleString()}
										</p>
									</div>
								</div>
							</div>

							<Separator />

							<div className="space-y-4">
								<h3 className="font-semibold text-lg flex items-center gap-2">
									<Key className="size-5 text-slate-600 dark:text-slate-400" />
									Security
								</h3>
								<div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
									<p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
										Password and authentication are managed
										through your authentication provider.
									</p>
									<p className="text-xs text-slate-500">
										To change your password or update
										security settings, please visit your
										authentication provider's settings page.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Preferences */}
				<TabsContent value="preferences" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Palette className="size-5 text-[#D97D55]" />
								Preferences
							</CardTitle>
							<CardDescription>
								Customize your experience and appearance
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-2">
								<Label className="flex items-center gap-2">
									<Palette className="size-4 text-slate-500" />
									Avatar Style
								</Label>
								<div className="p-3 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<Avatar className="size-10">
												<AvatarImage
													src={avatarUrl}
													alt="Current avatar"
												/>
												<AvatarFallback>
													{initials}
												</AvatarFallback>
											</Avatar>
											<div>
												<p className="text-sm font-medium">
													{userData.avatar_style
														? AVATAR_STYLES.find(
																(s) =>
																	s.value ===
																	userData.avatar_style,
															)?.label ||
															userData.avatar_style
														: 'Default'}
												</p>
												<p className="text-xs text-slate-500">
													Current avatar style
												</p>
											</div>
										</div>
										<Button
											variant="outline"
											size="sm"
											onClick={() =>
												setIsAvatarDialogOpen(true)
											}
											className="gap-2"
										>
											<Edit className="size-4" />
											Change
										</Button>
									</div>
								</div>
								<p className="text-xs text-slate-500">
									You can change your avatar style from the
									Profile tab
								</p>
							</div>

							<Separator />

							<div className="space-y-4">
								<h3 className="font-semibold text-lg flex items-center gap-2">
									<Bell className="size-5 text-slate-600 dark:text-slate-400" />
									Notifications
								</h3>
								<div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
									<p className="text-sm text-slate-600 dark:text-slate-400">
										Notification preferences are coming
										soon. Stay tuned for updates!
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
