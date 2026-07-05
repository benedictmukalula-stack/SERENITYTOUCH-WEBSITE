CREATE TABLE `consultations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`therapist_id` int,
	`consultation_type` varchar(50) NOT NULL,
	`scheduled_date` timestamp NOT NULL,
	`duration` int NOT NULL DEFAULT 30,
	`status` enum('scheduled','in-progress','completed','cancelled') NOT NULL DEFAULT 'scheduled',
	`video_room_id` varchar(100),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `consultations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `referral_rewards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`referral_id` int NOT NULL,
	`reward_type` enum('discount','credit','free_service') NOT NULL DEFAULT 'discount',
	`reward_value` int NOT NULL,
	`description` text,
	`claimed` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`claimedAt` timestamp,
	CONSTRAINT `referral_rewards_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `referrals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`referrer_id` int NOT NULL,
	`referred_id` int,
	`referral_code` varchar(20) NOT NULL,
	`status` enum('pending','completed','claimed') NOT NULL DEFAULT 'pending',
	`reward_amount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	`claimedAt` timestamp,
	CONSTRAINT `referrals_id` PRIMARY KEY(`id`),
	CONSTRAINT `referrals_referral_code_unique` UNIQUE(`referral_code`)
);
