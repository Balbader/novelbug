import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { usersService } from '@/backend/services/user.service';
import { storiesService } from '@/backend/services/story.service';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ username: string }> },
) {
	try {
		const { getUser, isAuthenticated } = await getKindeServerSession();
		const user = await getUser();
		const isUserAuthenticated = await isAuthenticated();

		if (!isUserAuthenticated || !user) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 },
			);
		}

		// Get user from database
		const dbUser = await usersService.getByKindeId(user.id);
		if (!dbUser) {
			return NextResponse.json(
				{ error: 'User not found in database' },
				{ status: 404 },
			);
		}

		const { username } = await params;

		// Get the profile user
		const profileUser = await usersService.getByUsername(username);
		if (!profileUser) {
			return NextResponse.json(
				{ error: 'User not found' },
				{ status: 404 },
			);
		}

		// Get all stories for this user
		const stories = await storiesService.getStoriesByUserIdWithDetails(
			profileUser.id,
		);

		// Transform stories to client-friendly format
		const formattedStories = stories.map((story) => ({
			id: story.id,
			title: story.storyData?.title || 'Untitled',
			age_group: story.storyData?.age_group || '',
			language: story.storyData?.language || '',
			topic: story.storyData?.topic || '',
			subtopic: story.storyData?.subtopic || '',
			style: story.storyData?.style || '',
			story_content: story.storyOutput?.story_content || '',
			created_at: story.created_at,
			updated_at: story.updated_at,
			shared: story.shared === 1,
			published: story.published === 1,
		}));

		// Calculate statistics
		const totalStories = formattedStories.length;
		const sharedStories = formattedStories.filter((s) => s.shared).length;
		const totalReadingTime = formattedStories.reduce((total, story) => {
			const wordsPerMinute = 200;
			const wordCount = story.story_content.split(/\s+/).length;
			return total + Math.ceil(wordCount / wordsPerMinute);
		}, 0);

		// Get favorite topic
		const topicCounts: Record<string, number> = {};
		formattedStories.forEach((story) => {
			const topic = story.topic.toLowerCase();
			if (topic) {
				topicCounts[topic] = (topicCounts[topic] || 0) + 1;
			}
		});
		const favoriteTopic =
			Object.keys(topicCounts).length > 0
				? Object.entries(topicCounts).reduce((a, b) =>
						a[1] > b[1] ? a : b,
					)[0]
				: '';

		// Get favorite style
		const styleCounts: Record<string, number> = {};
		formattedStories.forEach((story) => {
			const style = story.style.toLowerCase();
			if (style) {
				styleCounts[style] = (styleCounts[style] || 0) + 1;
			}
		});
		const favoriteStyle =
			Object.keys(styleCounts).length > 0
				? Object.entries(styleCounts).reduce((a, b) =>
						a[1] > b[1] ? a : b,
					)[0]
				: '';

		// Get stories this week
		const now = new Date();
		const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
		const storiesThisWeek = formattedStories.filter((story) => {
			const createdDate = new Date(story.created_at);
			return createdDate >= weekAgo;
		}).length;

		// Get recent stories (last 5)
		const recentStories = formattedStories
			.sort(
				(a, b) =>
					new Date(b.created_at).getTime() -
					new Date(a.created_at).getTime(),
			)
			.slice(0, 5);

		// Get shared stories
		const sharedStoriesList = formattedStories
			.filter((s) => s.shared)
			.sort(
				(a, b) =>
					new Date(b.created_at).getTime() -
					new Date(a.created_at).getTime(),
			)
			.slice(0, 10);

		return NextResponse.json(
			{
				success: true,
				user: {
					id: profileUser.id,
					username: profileUser.username,
					first_name: profileUser.first_name,
					last_name: profileUser.last_name,
					email: profileUser.email,
					country: profileUser.country,
					user_since: profileUser.user_since,
					last_login: profileUser.last_login,
					login_count: profileUser.login_count,
					avatar_style: profileUser.avatar_style || null,
				},
				currentUser: {
					username: dbUser.username,
				},
				stats: {
					totalStories,
					sharedStories,
					totalReadingTime,
					favoriteTopic,
					favoriteStyle,
					storiesThisWeek,
				},
				recentStories,
				sharedStories: sharedStoriesList,
				isOwnProfile: dbUser.id === profileUser.id,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error('Error fetching user profile:', error);
		return NextResponse.json(
			{
				error: 'Failed to fetch user profile. Please try again later.',
				details:
					error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
