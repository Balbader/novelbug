import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { storiesService } from '@/backend/services/story.service';
import { usersService } from '@/backend/services/user.service';
import { editStoryAgent } from '@/mastra/agents/edit-story-agent';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
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

		const { id } = await params;

		console.log('Fetching story with ID:', id);

		// Fetch story with details
		const story = await storiesService.getStoryWithDetails(id);

		console.log('Story fetched:', story ? 'Found' : 'Not found');

		if (!story) {
			return NextResponse.json(
				{ error: 'Story not found', storyId: id },
				{ status: 404 },
			);
		}

		// Allow viewing any story - users can view stories from public profiles
		// All stories are accessible for viewing from any user's public profile

		// Transform the data to a more client-friendly format
		const formattedStory = {
			id: story.id,
			title: story.storyData?.title || 'Untitled',
			age_group: story.storyData?.age_group || '',
			language: story.storyData?.language || '',
			topic: story.storyData?.topic || '',
			subtopic: story.storyData?.subtopic || '',
			style: story.storyData?.style || '',
			first_name: story.storyData?.first_name || '',
			gender: story.storyData?.gender || '',
			story_content: story.storyOutput?.story_content || '',
			created_at: story.created_at,
			updated_at: story.updated_at,
			shared: story.shared === 1,
			published: story.published === 1,
			author: story.user
				? {
						username: story.user.username || 'Unknown',
						first_name: story.user.first_name || '',
						last_name: story.user.last_name || '',
					}
				: undefined,
		};

		return NextResponse.json(
			{
				success: true,
				story: formattedStory,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error('Error fetching story:', error);
		return NextResponse.json(
			{
				error: 'Failed to fetch story. Please try again later.',
				details:
					error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
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

		const { id } = await params;
		const body = await request.json();

		// Verify the story belongs to the user
		const story = await storiesService.getStoryWithDetails(id);
		if (!story) {
			return NextResponse.json(
				{ error: 'Story not found' },
				{ status: 404 },
			);
		}

		if (story.user_id !== dbUser.id) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
		}

		// Handle shared status update (backward compatibility)
		if (body.shared !== undefined) {
			const updatedStory = await storiesService.updateStory(id, {
				shared: body.shared ? 1 : 0,
			});

			return NextResponse.json(
				{
					success: true,
					story: {
						id: updatedStory.id,
						shared: updatedStory.shared === 1,
					},
				},
				{ status: 200 },
			);
		}

		// Handle full story update
		const {
			title,
			age_group,
			language,
			topic,
			subtopic,
			style,
			first_name,
			gender,
			story_content,
			shared,
		} = body;

		// Get original story data for comparison
		const originalStoryData = story.storyData;
		const originalStoryContent = story.storyOutput?.story_content || '';
		const originalTitle = originalStoryData?.title || '';

		// Check if metadata fields changed (fields that would require story adaptation)
		const metadataChanged =
			(age_group !== undefined &&
				age_group !== originalStoryData?.age_group) ||
			(language !== undefined &&
				language !== originalStoryData?.language) ||
			(topic !== undefined && topic !== originalStoryData?.topic) ||
			(subtopic !== undefined &&
				subtopic !== originalStoryData?.subtopic) ||
			(style !== undefined && style !== originalStoryData?.style) ||
			(first_name !== undefined &&
				first_name !== originalStoryData?.first_name) ||
			(gender !== undefined && gender !== originalStoryData?.gender);

		// Determine if story content needs to be regenerated
		// Priority:
		// 1. If story_content is provided and different from original, use it (user manually edited)
		// 2. If metadata changed but story_content is unchanged, use the agent to adapt
		// 3. Otherwise, keep the original content
		const storyContentChanged =
			story_content !== undefined &&
			story_content.trim() !== originalStoryContent.trim();

		let finalStoryContent: string | undefined = undefined;
		let finalTitle: string | undefined = undefined;

		if (storyContentChanged) {
			// User manually edited the story content, use it directly
			finalStoryContent = story_content;
		} else if (metadataChanged) {
			// Use the edit agent to adapt the story to new parameters
			const originalParams = {
				title: originalTitle,
				age_group: originalStoryData?.age_group || '',
				language: originalStoryData?.language || '',
				topic: originalStoryData?.topic || '',
				subtopic: originalStoryData?.subtopic || '',
				style: originalStoryData?.style || '',
				first_name: originalStoryData?.first_name || '',
				gender: originalStoryData?.gender || '',
			};

			const newParams = {
				age_group: age_group ?? originalParams.age_group,
				language: language ?? originalParams.language,
				topic: topic ?? originalParams.topic,
				subtopic: subtopic ?? originalParams.subtopic,
				style: style ?? originalParams.style,
				first_name: first_name ?? originalParams.first_name,
				gender: gender ?? originalParams.gender,
			};

			// Get language name for better context
			const languageNames: Record<string, string> = {
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

			const originalLanguageName =
				languageNames[originalParams.language] ||
				originalParams.language;
			const newLanguageName =
				languageNames[newParams.language] || newParams.language;

			// Build the edit prompt for story content
			let editPrompt = `Adapt the following story to match the new parameters while preserving the narrative structure and plot.

ORIGINAL STORY TITLE:
${originalParams.title}

ORIGINAL STORY:
${originalStoryContent}

ORIGINAL PARAMETERS:
- Age Group: ${originalParams.age_group}
- Language: ${originalLanguageName}
- Topic: ${originalParams.topic}
- Subtopic: ${originalParams.subtopic}
- Style: ${originalParams.style}
${originalParams.first_name ? `- First Name: ${originalParams.first_name}` : ''}
${originalParams.gender ? `- Gender: ${originalParams.gender}` : ''}

NEW PARAMETERS:
- Age Group: ${newParams.age_group}
- Language: ${newLanguageName}
- Topic: ${newParams.topic}
- Subtopic: ${newParams.subtopic}
- Style: ${newParams.style}
${newParams.first_name ? `- First Name: ${newParams.first_name}` : ''}
${newParams.gender ? `- Gender: ${newParams.gender}` : ''}

Please adapt the story to match the new parameters while:
- Keeping the same narrative structure and plot
- Maintaining the same sequence of events
- Preserving the story's emotional beats and key moments
- Only changing what's necessary to match the new parameters`;

			try {
				const editResult = await editStoryAgent.generate(editPrompt);
				finalStoryContent = editResult.text;

				// Generate a new title that matches the adapted story
				const titlePrompt = `Generate an engaging, age-appropriate title for the following adapted story.

Story Title (Original): ${originalParams.title}

Adapted Story:
${finalStoryContent}

New Parameters:
- Age Group: ${newParams.age_group}
- Language: ${newLanguageName}
- Topic: ${newParams.topic}
- Subtopic: ${newParams.subtopic}
- Style: ${newParams.style}
${newParams.first_name ? `- Main character: ${newParams.first_name}${newParams.gender ? ` (${newParams.gender})` : ''}` : ''}

Generate a creative, catchy title that:
- Is appropriate for ${newParams.age_group} year old children
- Reflects the story's new topic (${newParams.topic} - ${newParams.subtopic})
- Matches the ${newParams.style} style
- Is written in ${newLanguageName}
- Is between 3-8 words
- Is engaging and memorable
- Adapts the original title concept to the new parameters

Return ONLY the title, nothing else. No quotes, no explanations, just the title.`;

				const titleResult = await editStoryAgent.generate(titlePrompt);
				finalTitle = titleResult.text.trim();
				// Remove quotes if present
				finalTitle = finalTitle.replace(/^["']|["']$/g, '');
			} catch (error) {
				console.error('Error adapting story with agent:', error);
				// Fall back to original content if agent fails
				finalStoryContent = originalStoryContent;
				finalTitle = originalTitle;
			}
		} else {
			// No changes to story content, keep original
			finalStoryContent = originalStoryContent;
		}

		// Determine final title:
		// 1. If user explicitly changed the title, use it
		// 2. If metadata changed and we adapted the story, use the adapted title
		// 3. If metadata changed but story wasn't adapted, still adapt the title
		// 4. Otherwise, keep original
		if (title !== undefined && title.trim() !== originalTitle.trim()) {
			// User explicitly changed the title
			finalTitle = title;
		} else if (metadataChanged && finalTitle === undefined) {
			// Metadata changed but story wasn't adapted (user manually edited story_content)
			// Still adapt the title to match new parameters
			const originalParams = {
				title: originalTitle,
				age_group: originalStoryData?.age_group || '',
				language: originalStoryData?.language || '',
				topic: originalStoryData?.topic || '',
				subtopic: originalStoryData?.subtopic || '',
				style: originalStoryData?.style || '',
				first_name: originalStoryData?.first_name || '',
				gender: originalStoryData?.gender || '',
			};

			const newParams = {
				age_group: age_group ?? originalParams.age_group,
				language: language ?? originalParams.language,
				topic: topic ?? originalParams.topic,
				subtopic: subtopic ?? originalParams.subtopic,
				style: style ?? originalParams.style,
				first_name: first_name ?? originalParams.first_name,
				gender: gender ?? originalParams.gender,
			};

			const languageNames: Record<string, string> = {
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

			const newLanguageName =
				languageNames[newParams.language] || newParams.language;

			try {
				const titlePrompt = `Generate an engaging, age-appropriate title for a story with the following parameters.

Original Title: ${originalParams.title}

New Parameters:
- Age Group: ${newParams.age_group}
- Language: ${newLanguageName}
- Topic: ${newParams.topic}
- Subtopic: ${newParams.subtopic}
- Style: ${newParams.style}
${newParams.first_name ? `- Main character: ${newParams.first_name}${newParams.gender ? ` (${newParams.gender})` : ''}` : ''}

Generate a creative, catchy title that:
- Is appropriate for ${newParams.age_group} year old children
- Reflects the story's new topic (${newParams.topic} - ${newParams.subtopic})
- Matches the ${newParams.style} style
- Is written in ${newLanguageName}
- Is between 3-8 words
- Is engaging and memorable
- Adapts the original title concept to the new parameters

Return ONLY the title, nothing else. No quotes, no explanations, just the title.`;

				const titleResult = await editStoryAgent.generate(titlePrompt);
				finalTitle = titleResult.text.trim();
				finalTitle = finalTitle.replace(/^["']|["']$/g, '');
			} catch (error) {
				console.error('Error adapting title with agent:', error);
				// Fall back to original title if agent fails
				finalTitle = originalTitle;
			}
		} else if (finalTitle === undefined) {
			// No title change, keep original
			finalTitle = originalTitle;
		}
		// If finalTitle was set by the agent above (when story was adapted), use it

		// Update story data if provided
		if (
			finalTitle !== originalTitle ||
			age_group ||
			language ||
			topic ||
			subtopic ||
			style !== undefined ||
			first_name !== undefined ||
			gender !== undefined
		) {
			const updateData: any = {};
			if (finalTitle !== originalTitle) updateData.title = finalTitle;
			if (age_group !== undefined) updateData.age_group = age_group;
			if (language !== undefined) updateData.language = language;
			if (topic !== undefined) updateData.topic = topic;
			if (subtopic !== undefined) updateData.subtopic = subtopic;
			if (style !== undefined) updateData.style = style;
			if (first_name !== undefined) updateData.first_name = first_name;
			if (gender !== undefined) updateData.gender = gender;

			await storiesService.updateStoryData(
				story.story_data_id,
				updateData,
			);
		}

		// Update story output if content changed or was regenerated
		if (
			finalStoryContent !== undefined &&
			finalStoryContent !== originalStoryContent
		) {
			await storiesService.updateStoryOutput(story.story_output_id, {
				story_content: finalStoryContent,
			});
		}

		// Update story shared status if provided
		if (shared !== undefined) {
			await storiesService.updateStory(id, {
				shared: shared ? 1 : 0,
			});
		}

		// Fetch updated story
		const updatedStory = await storiesService.getStoryWithDetails(id);

		// Transform the data to a more client-friendly format
		const formattedStory = {
			id: updatedStory!.id,
			title: updatedStory!.storyData?.title || 'Untitled',
			age_group: updatedStory!.storyData?.age_group || '',
			language: updatedStory!.storyData?.language || '',
			topic: updatedStory!.storyData?.topic || '',
			subtopic: updatedStory!.storyData?.subtopic || '',
			style: updatedStory!.storyData?.style || '',
			first_name: updatedStory!.storyData?.first_name || '',
			gender: updatedStory!.storyData?.gender || '',
			story_content: updatedStory!.storyOutput?.story_content || '',
			created_at: updatedStory!.created_at,
			updated_at: updatedStory!.updated_at,
			shared: updatedStory!.shared === 1,
			published: updatedStory!.published === 1,
		};

		return NextResponse.json(
			{
				success: true,
				story: formattedStory,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error('Error updating story:', error);
		return NextResponse.json(
			{
				error: 'Failed to update story. Please try again later.',
				details:
					error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
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

		const { id } = await params;

		// Verify the story belongs to the user
		const story = await storiesService.getStoryWithDetails(id);
		if (!story) {
			return NextResponse.json(
				{ error: 'Story not found' },
				{ status: 404 },
			);
		}

		if (story.user_id !== dbUser.id) {
			return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
		}

		// Delete the story
		await storiesService.deleteStory(id);

		return NextResponse.json(
			{
				success: true,
				message: 'Story deleted successfully',
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error('Error deleting story:', error);
		return NextResponse.json(
			{
				error: 'Failed to delete story. Please try again later.',
				details:
					error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
