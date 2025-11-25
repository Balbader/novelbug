import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';

import { characterAgent } from './agents/character-agent';
import { sceneAgent } from './agents/scene-agent';
import { storyGeneratorAgent } from './agents/story-generator-agent';

export const mastra = new Mastra({
	agents: { characterAgent, sceneAgent, storyGeneratorAgent },
	logger: new PinoLogger({
		name: 'Mastra',
		level: 'info',
	}),
	telemetry: {
		// Telemetry is deprecated and will be removed in the Nov 4th release
		enabled: false,
	},
	observability: {
		// Enables DefaultExporter and CloudExporter for AI tracing
		default: { enabled: true },
	},
});
