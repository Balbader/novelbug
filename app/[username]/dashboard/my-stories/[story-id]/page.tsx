import StoryPage from '@/components/dashboard/my-stories/StoryPage';

export default async function StoryPageComponent({
	params,
}: {
	params: Promise<{ storyId: string }>;
}) {
	const { storyId } = await params;
	return <StoryPage storyId={storyId} />;
}
