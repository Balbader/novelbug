PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_stories` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`story_data_id` text NOT NULL,
	`story_output_id` text NOT NULL,
	`shared` integer DEFAULT 0 NOT NULL,
	`published` integer DEFAULT 0 NOT NULL,
	`published_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`story_data_id`) REFERENCES `stories_data`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`story_output_id`) REFERENCES `stories_output`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_stories`("id", "user_id", "story_data_id", "story_output_id", "shared", "published", "published_at", "created_at", "updated_at") SELECT "id", "user_id", "story_data_id", "story_output_id", "shared", "published", "published_at", "created_at", "updated_at" FROM `stories`;--> statement-breakpoint
DROP TABLE `stories`;--> statement-breakpoint
ALTER TABLE `__new_stories` RENAME TO `stories`;--> statement-breakpoint
PRAGMA foreign_keys=ON;