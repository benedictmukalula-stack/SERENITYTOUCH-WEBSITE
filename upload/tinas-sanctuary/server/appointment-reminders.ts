import { getDb } from "./db";
import { appointmentReminders, consultations } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { sendNotification } from "./notification-service";

export async function scheduleAppointmentReminders(consultationId: number, consultationDate: Date): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    // Schedule 24-hour reminder
    const reminder24h = new Date(consultationDate.getTime() - 24 * 60 * 60 * 1000);
    await db.insert(appointmentReminders).values({
      consultationId,
      reminderType: "24_hours",
      scheduledFor: reminder24h,
      isSent: 0,
    });

    // Schedule 1-hour reminder
    const reminder1h = new Date(consultationDate.getTime() - 60 * 60 * 1000);
    await db.insert(appointmentReminders).values({
      consultationId,
      reminderType: "1_hour",
      scheduledFor: reminder1h,
      isSent: 0,
    });

    console.log(`[Reminders] Scheduled for consultation ${consultationId}`);
  } catch (error) {
    console.error("[Reminders] Failed to schedule:", error);
  }
}

export async function sendPendingReminders(): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    const now = new Date();
    const pendingReminders = await db
      .select()
      .from(appointmentReminders)
      .where(eq(appointmentReminders.isSent, 0));

    for (const reminder of pendingReminders) {
      if (reminder.scheduledFor && new Date(reminder.scheduledFor) <= now) {
        const consultation = await db
          .select()
          .from(consultations)
          .where(eq(consultations.id, reminder.consultationId))
          .limit(1);

        if (consultation.length > 0) {
          const c = consultation[0];
          const reminderText =
            reminder.reminderType === "24_hours"
              ? "Your consultation is scheduled for tomorrow"
              : "Your consultation is in 1 hour";

          await sendNotification({
            type: "email",
            email: "client@example.com",
            subject: "Appointment Reminder",
            message: `${reminderText} at ${new Date(c.scheduledDate).toLocaleString()}`,
          });

          // Mark as sent
          await db
            .update(appointmentReminders)
            .set({ isSent: 1, sentAt: new Date() })
            .where(eq(appointmentReminders.id, reminder.id));
        }
      }
    }
  } catch (error) {
    console.error("[Reminders] Failed to send:", error);
  }
}
