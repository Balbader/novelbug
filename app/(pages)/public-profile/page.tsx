import UserPublicProfile from "@/components/profile/UserPublicProfile";

export default function PublicProfilePage() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
			<div className="max-w-7xl mx-auto">
				<UserPublicProfile />
			</div>
		</div>
	);
}
