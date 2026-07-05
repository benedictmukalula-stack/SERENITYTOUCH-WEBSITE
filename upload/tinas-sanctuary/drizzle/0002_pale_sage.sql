CREATE TABLE `therapistAvailability` (
	`id` int AUTO_INCREMENT NOT NULL,
	`therapist_id` int NOT NULL,
	`dayOfWeek` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
	`start_time` varchar(5) NOT NULL,
	`end_time` varchar(5) NOT NULL,
	`is_active` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `therapistAvailability_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `videoTestimonials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientName` varchar(100) NOT NULL,
	`clientLocation` varchar(100),
	`title` varchar(200) NOT NULL,
	`videoUrl` text NOT NULL,
	`thumbnailUrl` text,
	`description` text,
	`featured` int NOT NULL DEFAULT 0,
	`displayOrder` int NOT NULL DEFAULT 0,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `videoTestimonials_id` PRIMARY KEY(`id`)
);
