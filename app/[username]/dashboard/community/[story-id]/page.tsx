import CommunityStoryPage from "@/components/dashboard/community/CommunityStoryPage";

export default async function CommunityStoryPageComponent({
	params,
}: {
	params: Promise<{ 'story-id': string }>;
}) {
	const { 'story-id': storyId } = await params;
	return <CommunityStoryPage storyId={storyId} />;
}
