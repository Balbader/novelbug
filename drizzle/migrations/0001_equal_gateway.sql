CREATE TABLE `stories_data` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text(255) NOT NULL,
	`age_group` text(255) NOT NULL,
	`language` text(255) NOT NULL,
	`topic` text(255) NOT NULL,
	`subtopic` text(255) NOT NULL,
	`style` text(255) NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `stories_output` (
	`id` text PRIMARY KEY NOT NULL,
	`story_data_id` text NOT NULL,
	`story_content` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`story_data_id`) REFERENCES `stories_data`(`id`) ON UPDATE no action ON DELETE no action
);
