import StoryPage from '@/components/dashboard/my-stories/StoryPage';

export default async function StoryPageComponent({
	params,
}: {
	params: Promise<{ 'story-id': string }>;
}) {
	const { 'story-id': storyId } = await params;
	return <StoryPage storyId={storyId} />;
}
