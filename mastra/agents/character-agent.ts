import { Agent } from '@mastra/core/agent';

export const characterAgent = new Agent({
	name: 'Character Creator',
	instructions: `Create 2-3 memorable characters that embody the lesson. Each needs: name, role, 3-4 personality traits, motivation, and lesson relationship. Match storytone and age mode. Be concise.`,
	model: 'anthropic/claude-haiku-4-5',
});
