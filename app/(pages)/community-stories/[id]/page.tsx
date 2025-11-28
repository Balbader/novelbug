import OpenCommunityStoryPage from '@/components/community/OpenCommunityStoryPage';

export default async function OpenCommunityStoryPageComponent({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <OpenCommunityStoryPage id={id} />;
}
