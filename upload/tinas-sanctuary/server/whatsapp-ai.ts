import Twilio from "twilio";
import OpenAI from "openai";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const openaiApiKey = process.env.OPENAI_API_KEY;

const client = Twilio(accountSid, authToken);
const openai = new OpenAI({ apiKey: openaiApiKey });

export async function handleWhatsAppMessage(
  incomingMessage: string,
  senderPhoneNumber: string
): Promise<string> {
  try {
    // Use OpenAI to generate a response
    const systemPrompt = `You are Tina's Sanctuary AI Assistant, a helpful wellness concierge for a luxury spa in Lusaka, Zambia. 
You help clients with:
- Booking appointments and checking availability
- Information about services (Swedish Massage, Deep Tissue, Hot Stone Therapy, etc.)
- Membership details (Silver K800/mo, Gold K1,600/mo, Platinum K3,200/mo)
- Pricing and special offers
- General wellness advice
- Contact information: +260 572 782 539, info@tinassanctuary.zm

Be professional, warm, and concise. Keep responses under 160 characters when possible for SMS/WhatsApp.
Always offer to connect them with a human therapist if needed.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: incomingMessage,
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const assistantMessage =
      response.choices[0]?.message?.content || "Thank you for reaching out. How can we help you today?";

    // Send response via WhatsApp
    if (accountSid && authToken && twilioPhoneNumber) {
      await client.messages.create({
        from: `whatsapp:${twilioPhoneNumber}`,
        to: `whatsapp:${senderPhoneNumber}`,
        body: assistantMessage,
      });
    }

    return assistantMessage;
  } catch (error) {
    console.error("WhatsApp AI error:", error);
    const fallbackMessage =
      "Thank you for your message! Our team will respond shortly. For urgent inquiries, call +260 572 782 539.";

    // Send fallback message
    if (accountSid && authToken && twilioPhoneNumber) {
      await client.messages.create({
        from: `whatsapp:${twilioPhoneNumber}`,
        to: `whatsapp:${senderPhoneNumber}`,
        body: fallbackMessage,
      });
    }

    return fallbackMessage;
  }
}

export async function sendWhatsAppNotification(
  phoneNumber: string,
  message: string
): Promise<boolean> {
  try {
    if (!accountSid || !authToken || !twilioPhoneNumber) {
      console.warn("Twilio credentials not configured");
      return false;
    }

    await client.messages.create({
      from: `whatsapp:${twilioPhoneNumber}`,
      to: `whatsapp:${phoneNumber}`,
      body: message,
    });

    return true;
  } catch (error) {
    console.error("Failed to send WhatsApp notification:", error);
    return false;
  }
}
