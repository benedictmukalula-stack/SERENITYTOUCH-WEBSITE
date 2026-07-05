CREATE TABLE `appointmentReminders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`consultationId` int NOT NULL,
	`reminderType` enum('24_hours','1_hour','on_day') NOT NULL,
	`sentAt` timestamp,
	`isSent` int NOT NULL DEFAULT 0,
	`scheduledFor` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `appointmentReminders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `giftCards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(20) NOT NULL,
	`amount` int NOT NULL,
	`purchasedBy` int NOT NULL,
	`recipientEmail` varchar(320),
	`recipientName` varchar(100),
	`message` text,
	`isRedeemed` int NOT NULL DEFAULT 0,
	`redeemedBy` int,
	`redeemedAt` timestamp,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `giftCards_id` PRIMARY KEY(`id`),
	CONSTRAINT `giftCards_code_unique` UNIQUE(`code`)
);
