export type AvatarStyle =
	| 'adventurer'
	| 'avataaars'
	| 'big-smile'
	| 'lorelei'
	| 'notionists'
	| 'bottts'
	| 'micah'
	| 'open-peeps'
	| 'personas'
	| 'identicon'
	| 'initials'
	| 'shapes'
	| 'pixel-art'
	| 'rings'
	| 'thumbs';

export const AVATAR_STYLES: {
	value: AvatarStyle;
	label: string;
	description: string;
}[] = [
	{
		value: 'adventurer',
		label: 'Adventurer',
		description: 'Cute character avatars',
	},
	{
		value: 'avataaars',
		label: 'Avataaars',
		description: 'Friendly cartoon style',
	},
	{
		value: 'big-smile',
		label: 'Big Smile',
		description: 'Happy, smiling faces',
	},
	{
		value: 'lorelei',
		label: 'Lorelei',
		description: 'Simple, friendly faces',
	},
	{
		value: 'notionists',
		label: 'Notionists',
		description: 'Playful, colorful',
	},
	{
		value: 'bottts',
		label: 'Robots',
		description: 'Cute robot characters',
	},
	{
		value: 'micah',
		label: 'Micah',
		description: 'Adorable character faces',
	},
	{
		value: 'open-peeps',
		label: 'Open Peeps',
		description: 'Friendly illustrated people',
	},
	{
		value: 'personas',
		label: 'Personas',
		description: 'Diverse character styles',
	},
	{
		value: 'identicon',
		label: 'Identicon',
		description: 'Geometric patterns',
	},
	{
		value: 'initials',
		label: 'Initials',
		description: 'Letter-based avatars',
	},
	{
		value: 'shapes',
		label: 'Shapes',
		description: 'Geometric and fun',
	},
	{
		value: 'pixel-art',
		label: 'Pixel Art',
		description: 'Retro pixel style',
	},
	{
		value: 'rings',
		label: 'Rings',
		description: 'Colorful ring patterns',
	},
	{
		value: 'thumbs',
		label: 'Thumbs',
		description: 'Thumbs up style',
	},
];

/**
 * Generates a cute avatar URL for a user based on their ID or username
 * Uses DiceBear API to create deterministic, cute avatars
 */
export function getCuteAvatar(
	seed: string,
	style?: AvatarStyle | null,
): string {
	// Use cute, child-friendly avatar styles
	const avatarStyles: AvatarStyle[] = [
		'adventurer', // Cute character avatars
		'avataaars', // Friendly cartoon style
		'big-smile', // Happy, smiling faces
		'lorelei', // Simple, friendly faces
		'notionists', // Playful, colorful
		'bottts', // Cute robot characters
		'micah', // Adorable character faces
		'open-peeps', // Friendly illustrated people
		'personas', // Diverse character styles
		'identicon', // Geometric patterns
		'initials', // Letter-based avatars
		'shapes', // Geometric and fun
		'pixel-art', // Retro pixel style
		'rings', // Colorful ring patterns
		'thumbs', // Thumbs up style
	];

	// Use provided style or deterministically select a style based on seed
	const selectedStyle =
		style ||
		(() => {
			const styleIndex =
				seed
					.split('')
					.reduce((acc, char) => acc + char.charCodeAt(0), 0) %
				avatarStyles.length;
			return avatarStyles[styleIndex];
		})();

	// Cute pastel background colors
	const backgrounds = [
		'b6e3f4', // Light blue
		'c0aede', // Lavender
		'd1d4f9', // Light purple
		'ffd5dc', // Pink
		'ffdfbf', // Peach
		'ffe4e6', // Rose
		'e0e7ff', // Light indigo
		'fef3c7', // Light yellow
	];

	const bgIndex =
		seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) %
		backgrounds.length;
	const backgroundColor = backgrounds[bgIndex];

	// Generate avatar URL using DiceBear API
	return `https://api.dicebear.com/7.x/${selectedStyle}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${backgroundColor}&radius=50`;
}

/**
 * Gets a cute emoji avatar as fallback
 */
export function getEmojiAvatar(seed: string): string {
	const cuteEmojis = [
		'🐱',
		'🐰',
		'🐻',
		'🐼',
		'🐨',
		'🦊',
		'🐶',
		'🐸',
		'🦄',
		'🐝',
		'🦋',
		'🐢',
		'🐙',
		'🐠',
		'🐳',
		'🦉',
		'🐺',
		'🐯',
		'🦁',
		'🐮',
	];

	const emojiIndex =
		seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) %
		cuteEmojis.length;
	return cuteEmojis[emojiIndex];
}
