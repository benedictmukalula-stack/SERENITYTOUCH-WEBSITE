import Twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = Twilio(accountSid, authToken);

export async function sendBookingSMS(
  phoneNumber: string,
  clientName: string,
  service: string,
  bookingDate: Date
): Promise<boolean> {
  try {
    if (!accountSid || !authToken || !twilioPhoneNumber) {
      console.warn("Twilio credentials not configured");
      return false;
    }

    const message = `Hi ${clientName}, your booking for ${service} on ${bookingDate.toLocaleDateString()} has been confirmed. Reply CONFIRM to confirm or CANCEL to cancel. - Tina's Sanctuary`;

    await client.messages.create({
      from: twilioPhoneNumber,
      to: phoneNumber,
      body: message,
    });

    return true;
  } catch (error) {
    console.error("Failed to send booking SMS:", error);
    return false;
  }
}

export async function sendRenewalReminder(
  phoneNumber: string,
  clientName: string,
  membershipTier: string
): Promise<boolean> {
  try {
    if (!accountSid || !authToken || !twilioPhoneNumber) {
      console.warn("Twilio credentials not configured");
      return false;
    }

    const message = `Hi ${clientName}, your ${membershipTier} membership renews in 3 days. Reply YES to renew or CANCEL to manage your subscription. - Tina's Sanctuary`;

    await client.messages.create({
      from: twilioPhoneNumber,
      to: phoneNumber,
      body: message,
    });

    return true;
  } catch (error) {
    console.error("Failed to send renewal reminder:", error);
    return false;
  }
}

export async function sendBookingReminder(
  phoneNumber: string,
  clientName: string,
  service: string,
  bookingTime: string
): Promise<boolean> {
  try {
    if (!accountSid || !authToken || !twilioPhoneNumber) {
      console.warn("Twilio credentials not configured");
      return false;
    }

    const message = `Hi ${clientName}, reminder: your ${service} is scheduled for today at ${bookingTime}. See you soon! - Tina's Sanctuary`;

    await client.messages.create({
      from: twilioPhoneNumber,
      to: phoneNumber,
      body: message,
    });

    return true;
  } catch (error) {
    console.error("Failed to send booking reminder:", error);
    return false;
  }
}
