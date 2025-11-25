ALTER TABLE `users` ADD `kinde_id` text(255) NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `users_kinde_id_unique` ON `users` (`kinde_id`);