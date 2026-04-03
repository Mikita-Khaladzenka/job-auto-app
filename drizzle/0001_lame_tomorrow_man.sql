CREATE TABLE `jobApplications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`offerId` int NOT NULL,
	`portal` enum('olx','pracuj') NOT NULL,
	`status` enum('pending','submitted','failed','viewed') NOT NULL DEFAULT 'pending',
	`appliedAt` timestamp,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `jobApplications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `jobOffers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`portal` enum('olx','pracuj') NOT NULL,
	`externalId` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`company` varchar(255),
	`location` varchar(255),
	`description` text,
	`url` text NOT NULL,
	`salary` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `jobOffers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `portalCredentials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`portal` enum('olx','pracuj') NOT NULL,
	`email` varchar(320) NOT NULL,
	`passwordEncrypted` text NOT NULL,
	`isActive` int NOT NULL DEFAULT 1,
	`lastLoginAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `portalCredentials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `searchCriteria` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`portal` enum('olx','pracuj','both') NOT NULL,
	`position` varchar(255) NOT NULL,
	`location` varchar(255),
	`keywords` text,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `searchCriteria_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`firstName` varchar(255),
	`lastName` varchar(255),
	`phone` varchar(20),
	`cv` text,
	`coverLetterTemplate` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `userProfiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
ALTER TABLE `jobApplications` ADD CONSTRAINT `jobApplications_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `jobApplications` ADD CONSTRAINT `jobApplications_offerId_jobOffers_id_fk` FOREIGN KEY (`offerId`) REFERENCES `jobOffers`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `jobOffers` ADD CONSTRAINT `jobOffers_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `portalCredentials` ADD CONSTRAINT `portalCredentials_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `searchCriteria` ADD CONSTRAINT `searchCriteria_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userProfiles` ADD CONSTRAINT `userProfiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;