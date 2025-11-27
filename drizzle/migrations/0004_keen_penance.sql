ALTER TABLE `users` ADD `is_password_reset_requested` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `is_suspended` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `user_since` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `last_login` integer NOT NULL;