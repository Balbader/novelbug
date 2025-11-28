export default function PublicProfileLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// This layout bypasses the username check in the parent layout
	// by being a nested layout that doesn't enforce username matching
	return <>{children}</>;
}
