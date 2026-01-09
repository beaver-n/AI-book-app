CREATE TABLE `stories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`coverImage` text,
	`prompt` text,
	`isPublic` int NOT NULL DEFAULT 0,
	`shareToken` varchar(64),
	`viewCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stories_id` PRIMARY KEY(`id`),
	CONSTRAINT `stories_shareToken_unique` UNIQUE(`shareToken`)
);
--> statement-breakpoint
CREATE TABLE `storyShares` (
	`id` int AUTO_INCREMENT NOT NULL,
	`storyId` int NOT NULL,
	`shareToken` varchar(64) NOT NULL,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `storyShares_id` PRIMARY KEY(`id`),
	CONSTRAINT `storyShares_shareToken_unique` UNIQUE(`shareToken`)
);
--> statement-breakpoint
ALTER TABLE `stories` ADD CONSTRAINT `stories_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `storyShares` ADD CONSTRAINT `storyShares_storyId_stories_id_fk` FOREIGN KEY (`storyId`) REFERENCES `stories`(`id`) ON DELETE cascade ON UPDATE no action;