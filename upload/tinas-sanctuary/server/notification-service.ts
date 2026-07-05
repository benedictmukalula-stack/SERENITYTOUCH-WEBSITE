import { ENV } from "./_core/env";

interface NotificationPayload {
  phone?: string;
  email?: string;
  subject?: string;
  message: string;
  type: "sms" | "email";
}

export async function sendNotification(payload: NotificationPayload): Promise<boolean> {
  try {
    if (payload.type === "sms" && payload.phone) {
      return await sendSMS(payload.phone, payload.message);
    } else if (payload.type === "email" && payload.email) {
      return await sendEmail(payload.email, payload.subject || "Tina's Sanctuary", payload.message);
    }
    return false;
  } catch (error) {
    console.error("[Notification] Failed to send:", error);
    return false;
  }
}

async function sendSMS(phone: string, message: string): Promise<boolean> {
  try {
    // Using Twilio SMS service
    const response = await fetch("https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`YOUR_ACCOUNT_SID:YOUR_AUTH_TOKEN`).toString("base64")}`,
      },
      body: new URLSearchParams({
        From: "+1234567890", // Your Twilio number
        To: phone,
        Body: message,
      }).toString(),
    });

    return response.ok;
  } catch (error) {
    console.error("[SMS] Failed to send:", error);
    return false;
  }
}

async function sendEmail(email: string, subject: string, message: string): Promise<boolean> {
  try {
    // Using Supabase email service
    const supabaseUrl = process.env.SUPABASE_URL || "";
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/send_email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({
        to: email,
        subject,
        html: message,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("[Email] Failed to send:", error);
    return false;
  }
}

export async function notifyReferralCompleted(
  referrerEmail: string,
  referrerName: string,
  rewardAmount: number
): Promise<void> {
  const message = `
    <h2>Congratulations, ${referrerName}!</h2>
    <p>Your referral has been completed and you've earned K${rewardAmount} in rewards!</p>
    <p>Visit your referral dashboard to claim your reward and share your code with more friends.</p>
    <p>Best regards,<br/>Tina's Sanctuary Team</p>
  `;

  await sendNotification({
    type: "email",
    email: referrerEmail,
    subject: "Referral Reward Earned!",
    message,
  });
}

export async function notifyConsultationBooked(
  clientEmail: string,
  clientName: string,
  therapistName: string,
  consultationDate: string,
  videoRoomUrl: string
): Promise<void> {
  const message = `
    <h2>Your Consultation is Confirmed, ${clientName}!</h2>
    <p>You have a consultation scheduled with ${therapistName} on ${consultationDate}</p>
    <p><a href="${videoRoomUrl}" style="background-color: #E91E63; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Join Video Call</a></p>
    <p>If you have any questions, please contact us at info@tinassanctuary.zm</p>
    <p>Best regards,<br/>Tina's Sanctuary Team</p>
  `;

  await sendNotification({
    type: "email",
    email: clientEmail,
    subject: "Your Consultation is Confirmed",
    message,
  });
}

export async function notifyConsultationReminder(
  clientEmail: string,
  clientName: string,
  therapistName: string,
  consultationTime: string,
  videoRoomUrl: string
): Promise<void> {
  const message = `
    <h2>Reminder: Your Consultation Today!</h2>
    <p>Hi ${clientName},</p>
    <p>Your consultation with ${therapistName} is scheduled for ${consultationTime}</p>
    <p><a href="${videoRoomUrl}" style="background-color: #E91E63; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Join Video Call</a></p>
    <p>Best regards,<br/>Tina's Sanctuary Team</p>
  `;

  await sendNotification({
    type: "email",
    email: clientEmail,
    subject: "Consultation Reminder - Join Now",
    message,
  });
}
