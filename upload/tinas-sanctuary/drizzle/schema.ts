import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  serviceType: varchar("serviceType", { length: 100 }).notNull(),
  therapistName: varchar("therapistName", { length: 100 }),
  bookingDate: timestamp("bookingDate").notNull(),
  duration: int("duration").notNull(), // in minutes
  status: mysqlEnum("status", ["pending", "confirmed", "completed", "cancelled"]).default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

export const members = mysqlTable("members", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  membershipTier: mysqlEnum("membershipTier", ["silver", "gold", "platinum"]).notNull(),
  monthlySessionsUsed: int("monthlySessionsUsed").default(0).notNull(),
  monthlySessionsLimit: int("monthlySessionsLimit").notNull(),
  joinDate: timestamp("joinDate").defaultNow().notNull(),
  renewalDate: timestamp("renewalDate").notNull(),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Member = typeof members.$inferSelect;
export type InsertMember = typeof members.$inferInsert;

export const galleryImages = mysqlTable("galleryImages", {
  id: int("id").autoincrement().primaryKey(),
  category: varchar("category", { length: 50 }).notNull(), // "services", "therapists", "facilities"
  title: varchar("title", { length: 200 }).notNull(),
  imageUrl: text("imageUrl").notNull(),
  description: text("description"),
  displayOrder: int("displayOrder").default(0).notNull(),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GalleryImage = typeof galleryImages.$inferSelect;
export type InsertGalleryImage = typeof galleryImages.$inferInsert;

export const referrals = mysqlTable("referrals", {
  id: int("id").autoincrement().primaryKey(),
  referrerId: int("referrer_id").notNull(),
  referredId: int("referred_id"),
  referralCode: varchar("referral_code", { length: 20 }).notNull().unique(),
  status: mysqlEnum("status", ["pending", "completed", "claimed"]).default("pending").notNull(),
  rewardAmount: int("reward_amount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
  claimedAt: timestamp("claimedAt"),
});

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = typeof referrals.$inferInsert;

export const referralRewards = mysqlTable("referral_rewards", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  referralId: int("referral_id").notNull(),
  rewardType: mysqlEnum("reward_type", ["discount", "credit", "free_service"]).default("discount").notNull(),
  rewardValue: int("reward_value").notNull(),
  description: text("description"),
  claimed: int("claimed").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  claimedAt: timestamp("claimedAt"),
});

export type ReferralReward = typeof referralRewards.$inferSelect;
export type InsertReferralReward = typeof referralRewards.$inferInsert;

export const consultations = mysqlTable("consultations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  therapistId: int("therapist_id"),
  consultationType: varchar("consultation_type", { length: 50 }).notNull(), // "initial", "follow-up"
  scheduledDate: timestamp("scheduled_date").notNull(),
  duration: int("duration").default(30).notNull(), // in minutes
  status: mysqlEnum("status", ["scheduled", "in-progress", "completed", "cancelled"]).default("scheduled").notNull(),
  videoRoomId: varchar("video_room_id", { length: 100 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Consultation = typeof consultations.$inferSelect;
export type InsertConsultation = typeof consultations.$inferInsert;

export const videoTestimonials = mysqlTable("videoTestimonials", {
  id: int("id").autoincrement().primaryKey(),
  clientName: varchar("clientName", { length: 100 }).notNull(),
  clientLocation: varchar("clientLocation", { length: 100 }),
  title: varchar("title", { length: 200 }).notNull(),
  videoUrl: text("videoUrl").notNull(),
  thumbnailUrl: text("thumbnailUrl"),
  description: text("description"),
  featured: int("featured").default(0).notNull(),
  displayOrder: int("displayOrder").default(0).notNull(),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VideoTestimonial = typeof videoTestimonials.$inferSelect;
export type InsertVideoTestimonial = typeof videoTestimonials.$inferInsert;

export const therapistAvailability = mysqlTable("therapistAvailability", {
  id: int("id").autoincrement().primaryKey(),
  therapistId: int("therapist_id").notNull(),
  dayOfWeek: mysqlEnum("dayOfWeek", ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]).notNull(),
  startTime: varchar("start_time", { length: 5 }).notNull(), // HH:MM format
  endTime: varchar("end_time", { length: 5 }).notNull(),
  isActive: int("is_active").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TherapistAvailability = typeof therapistAvailability.$inferSelect;
export type InsertTherapistAvailability = typeof therapistAvailability.$inferInsert;

export const giftCards = mysqlTable("giftCards", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  amount: int("amount").notNull(), // Amount in Kwacha
  purchasedBy: int("purchasedBy").notNull(),
  recipientEmail: varchar("recipientEmail", { length: 320 }),
  recipientName: varchar("recipientName", { length: 100 }),
  message: text("message"),
  isRedeemed: int("isRedeemed").default(0).notNull(),
  redeemedBy: int("redeemedBy"),
  redeemedAt: timestamp("redeemedAt"),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GiftCard = typeof giftCards.$inferSelect;
export type InsertGiftCard = typeof giftCards.$inferInsert;

export const appointmentReminders = mysqlTable("appointmentReminders", {
  id: int("id").autoincrement().primaryKey(),
  consultationId: int("consultationId").notNull(),
  reminderType: mysqlEnum("reminderType", ["24_hours", "1_hour", "on_day"]).notNull(),
  sentAt: timestamp("sentAt"),
  isSent: int("isSent").default(0).notNull(),
  scheduledFor: timestamp("scheduledFor").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AppointmentReminder = typeof appointmentReminders.$inferSelect;
export type InsertAppointmentReminder = typeof appointmentReminders.$inferInsert;
