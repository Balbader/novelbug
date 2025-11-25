import { NextRequest, NextResponse } from 'next/server';
import { characterAgent } from '@/mastra/agents/character-agent';
import { sceneAgent } from '@/mastra/agents/scene-agent';
import { storyGeneratorAgent } from '@/mastra/agents/story-generator-agent';

interface StoryGenerationRequest {
	title?: string;
	first_name?: string;
	gender?: string;
	age_group: string;
	language: string;
	topic: string;
	subtopic: string;
	style: string;
}

export async function POST(request: NextRequest) {
	try {
		const body: StoryGenerationRequest = await request.json();
		const {
			title,
			first_name,
			gender,
			age_group,
			language,
			topic,
			subtopic,
			style,
		} = body;

		// Validate required fields
		if (!age_group || !language || !topic || !subtopic || !style) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 },
			);
		}

		// Get language name for better context
		const languageNames: Record<string, string> = {
			en: 'English',
			es: 'Spanish',
			fr: 'French',
			de: 'German',
			it: 'Italian',
			pt: 'Portuguese',
		};

		const languageName = languageNames[language] || language;

		// Build character prompt with optional personalization
		let characterPrompt = `Create 2-3 memorable characters for a ${age_group} year old story about ${topic} - specifically ${subtopic}.`;
		if (first_name && gender) {
			characterPrompt = `Create 2-3 memorable characters for a ${age_group} year old ${gender} named ${first_name}. The story is about ${topic} - specifically ${subtopic}. Consider making ${first_name} the main character or a key character in the story.`;
		} else if (first_name) {
			characterPrompt = `Create 2-3 memorable characters for a ${age_group} year old child named ${first_name}. The story is about ${topic} - specifically ${subtopic}. Consider making ${first_name} the main character or a key character in the story.`;
		} else if (gender) {
			characterPrompt = `Create 2-3 memorable characters for a ${age_group} year old ${gender} child. The story is about ${topic} - specifically ${subtopic}.`;
		}
		characterPrompt += ` The story style is ${style}. The story should be written in ${languageName}. Make the characters engaging and appropriate for this age group.`;

		const characterResult = await characterAgent.generate(characterPrompt);

		// Build scene prompt with optional personalization
		let scenePrompt = `Design 3 key scenes for a ${age_group} year old story about ${topic} - specifically ${subtopic}.`;
		if (first_name && gender) {
			scenePrompt = `Design 3 key scenes for a ${age_group} year old story about ${topic} - specifically ${subtopic}. The main character is ${first_name}, a ${gender} child.`;
		} else if (first_name) {
			scenePrompt = `Design 3 key scenes for a ${age_group} year old story about ${topic} - specifically ${subtopic}. The main character is ${first_name}.`;
		} else if (gender) {
			scenePrompt = `Design 3 key scenes for a ${age_group} year old ${gender} child's story about ${topic} - specifically ${subtopic}.`;
		}
		scenePrompt += ` The story style is ${style}. The story should be written in ${languageName}. Here are the characters: ${characterResult.text}. Create scenes that form a complete narrative arc.`;

		const sceneResult = await sceneAgent.generate(scenePrompt);

		// Generate title if not provided
		let finalTitle = title;
		if (!finalTitle || finalTitle.trim() === '') {
			const titlePrompt = `Generate an engaging, age-appropriate title for a ${age_group} year old child's story.

Story Details:
- Topic: ${topic} - ${subtopic}
- Style: ${style}
- Language: ${languageName}
${first_name ? `- Main character: ${first_name}${gender ? ` (${gender})` : ''}` : ''}

Characters:
${characterResult.text}

Scenes:
${sceneResult.text}

Generate a creative, catchy title that:
- Is appropriate for ${age_group} year old children
- Reflects the story's topic (${topic} - ${subtopic})
- Matches the ${style} style
- Is written in ${languageName}
- Is between 3-8 words
- Is engaging and memorable

Return ONLY the title, nothing else. No quotes, no explanations, just the title.`;

			const titleResult = await storyGeneratorAgent.generate(titlePrompt);
			finalTitle = titleResult.text.trim();
			// Remove quotes if present
			finalTitle = finalTitle.replace(/^["']|["']$/g, '');
		}

		// Build story prompt with optional personalization
		let storyPrompt = `Write a complete, engaging story for a ${age_group} year old child. The story is about ${topic} - specifically ${subtopic}.`;
		if (first_name && gender) {
			storyPrompt = `Write a complete, engaging story for ${first_name}, a ${age_group} year old ${gender} child. The story is about ${topic} - specifically ${subtopic}.`;
		} else if (first_name) {
			storyPrompt = `Write a complete, engaging story for ${first_name}, a ${age_group} year old child. The story is about ${topic} - specifically ${subtopic}.`;
		} else if (gender) {
			storyPrompt = `Write a complete, engaging story for a ${age_group} year old ${gender} child. The story is about ${topic} - specifically ${subtopic}.`;
		}

		storyPrompt += `

Story Title: ${finalTitle}
Story Style: ${style}
Language: ${languageName}

Characters:
${characterResult.text}

Scenes:
${sceneResult.text}

Write a complete story that incorporates these characters and follows these scenes. The story should be age-appropriate, educational, engaging, and written in ${languageName}.${first_name ? ` Personalize the story for ${first_name} where appropriate.` : ''}`;

		const storyResult = await storyGeneratorAgent.generate(storyPrompt);

		return NextResponse.json(
			{
				success: true,
				story: storyResult.text,
				characters: characterResult.text,
				scenes: sceneResult.text,
				metadata: {
					title: finalTitle,
					first_name: first_name || '',
					gender: gender || '',
					age_group,
					language,
					topic,
					subtopic,
					style,
				},
			},
			{ status: 200 },
		);
	} catch (error) {
		console.error('Error generating story:', error);
		return NextResponse.json(
			{
				error: 'Failed to generate story. Please try again later.',
				details:
					error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
