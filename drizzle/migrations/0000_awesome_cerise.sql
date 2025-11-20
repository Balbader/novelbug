CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text(255) NOT NULL,
	`first_name` text(255) NOT NULL,
	`last_name` text(255) NOT NULL,
	`date_of_birth` integer NOT NULL,
	`email` text(255) NOT NULL,
	`country` text(255) NOT NULL,
	`login_count` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);