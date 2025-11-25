import { Agent } from '@mastra/core/agent';

export const sceneAgent = new Agent({
	name: 'Scene Architect',
	instructions: `Design 3 key scenes forming a narrative arc. Each scene: title, setting, characters, key events, lesson element, emotional tone. Match storytone and age mode. Be concise.`,
	model: 'anthropic/claude-haiku-4-5',
});
