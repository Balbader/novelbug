import { NextRequest, NextResponse } from 'next/server';
import { characterAgent } from '@/mastra/agents/character-agent';
import { sceneAgent } from '@/mastra/agents/scene-agent';
import { storyGeneratorAgent } from '@/mastra/agents/story-generator-agent';

interface StoryGenerationRequest {
	title?: string;
	age_group: string;
	language: string;
	topic: string;
	subtopic: string;
	style: string;
}

export async function POST(request: NextRequest) {
	try {
		const body: StoryGenerationRequest = await request.json();
		const { title, age_group, language, topic, subtopic, style } = body;

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

		// Step 1: Generate characters using characterAgent
		const characterPrompt = `Create 2-3 memorable characters for a ${age_group} year old story about ${topic} - specifically ${subtopic}. The story style is ${style}. The story should be written in ${languageName}. Make the characters engaging and appropriate for this age group.`;

		const characterResult = await characterAgent.generate(characterPrompt);

		// Step 2: Generate scenes using sceneAgent
		const scenePrompt = `Design 3 key scenes for a ${age_group} year old story about ${topic} - specifically ${subtopic}. The story style is ${style}. The story should be written in ${languageName}. Here are the characters: ${characterResult.text}. Create scenes that form a complete narrative arc.`;

		const sceneResult = await sceneAgent.generate(scenePrompt);

		// Step 3: Generate the full story using storyGeneratorAgent
		const storyPrompt = `Write a complete, engaging story for ${age_group} year old children about ${topic} - specifically ${subtopic}.

Story Style: ${style}
Language: ${languageName}
${title ? `Title: ${title}` : ''}

Characters:
${characterResult.text}

Scenes:
${sceneResult.text}

Write a complete story that incorporates these characters and follows these scenes. The story should be age-appropriate, educational, engaging, and written in ${languageName}.`;

		const storyResult = await storyGeneratorAgent.generate(storyPrompt);

		return NextResponse.json(
			{
				success: true,
				story: storyResult.text,
				characters: characterResult.text,
				scenes: sceneResult.text,
				metadata: {
					title: title || 'Untitled Story',
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
