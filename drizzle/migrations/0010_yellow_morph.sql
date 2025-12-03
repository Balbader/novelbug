CREATE TABLE `deleted_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`reason` text NOT NULL,
	`feedback` text,
	`deleted_at` integer NOT NULL
);
