/* ═══════════════════════════════════════════════════════════════
   Serenity Touch Spa — WhatsApp Notification System
   
   Uses Ultramsg API (popular WhatsApp gateway in Zambia/region).
   Sends booking confirmations to both client and spa team.
   
   Falls back silently if not configured.
   ═══════════════════════════════════════════════════════════════ */

const WA_API_URL  = process.env.WA_API_URL  || '';   // e.g. https://api.ultramsg.com/instance1234
const WA_API_TOKEN = process.env.WA_API_TOKEN || '';
const WA_SPANUMBER = process.env.WA_SPANUMBER || '260761404555'; // spa's own WhatsApp

export function isWhatsAppConfigured(): boolean {
  return !!(WA_API_URL && WA_API_TOKEN);
}

/** Send a WhatsApp message via Ultramsg-compatible API */
export async function sendWhatsApp(to: string, body: string): Promise<{ success: boolean; error?: string }> {
  if (!WA_API_URL || !WA_API_TOKEN) {
    console.warn('[WhatsApp] API not configured — skipping');
    return { success: false, error: 'WhatsApp API not configured' };
  }

  // Normalize phone: strip +, spaces, dashes; ensure international format
  let phone = to.replace(/[\s\-\(\)]/g, '').replace(/^\+/, '');
  // If starts with 0, replace with country code
  if (phone.startsWith('0')) phone = '260' + phone.slice(1);

  try {
    const url = `${WA_API_URL.replace(/\/+$/, '')}/messages/chat`;
    const formBody = new URLSearchParams();
    formBody.append('token', WA_API_TOKEN);
    formBody.append('to', phone);
    formBody.append('body', body);

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody.toString(),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[WhatsApp] API error ${res.status}:`, errText);
      return { success: false, error: `API ${res.status}` };
    }

    const data = await res.json();
    console.log(`[WhatsApp] Sent to ${phone}:`, data.id || 'ok');
    return { success: true };
  } catch (error) {
    console.error('[WhatsApp] Send failed:', error);
    return { success: false, error: String(error) };
  }
}

/** Build a booking confirmation message for WhatsApp */
export function buildBookingWA(data: {
  name: string;
  bookingId: string;
  serviceName: string;
  date: string;
  time: string;
  therapistName: string;
  totalAmount: number;
  bookingType: string;
}): string {
  const amount = `K${data.totalAmount.toLocaleString()}`;
  const loc = data.bookingType === 'callout' ? 'Call-Out Service' : '183 Ibex Hill, Lusaka';
  return [
    `✨ *Serenity Touch Spa — Booking Confirmed* ✨`,
    ``,
    `📋 *Booking ID:* ${data.bookingId}`,
    `👤 *Guest:* ${data.name}`,
    `💆 *Service:* ${data.serviceName}`,
    `📅 *Date:* ${data.date}`,
    `🕐 *Time:* ${data.time || 'To be confirmed'}`,
    `🧑‍⚕️ *Therapist:* ${data.therapistName}`,
    `📍 *Location:* ${loc}`,
    `💰 *Total:* ${amount}`,
    ``,
    `*Payment Details:*
MTN Mobile Money: +260 761 404 555
Airtel Money: +260 572 782 539
Use booking ID as reference.`,
    ``,
    `Thank you for choosing Serenity Touch Spa! 🌸`,
    `Questions? Reply here or call +260 572 782 539`,
  ].join('\n');
}

/** Build internal booking alert for spa team WhatsApp */
export function buildBookingAlertWA(data: {
  name: string;
  email: string;
  phone: string;
  bookingId: string;
  serviceName: string;
  date: string;
  time: string;
  totalAmount: number;
  bookingType: string;
}): string {
  const amount = `K${data.totalAmount.toLocaleString()}`;
  return [
    `🔔 *NEW BOOKING*`,
    ``,
    `📋 *ID:* ${data.bookingId}`,
    `👤 *${data.name}* (${data.email})`,
    data.phone ? `📱 *Phone:* ${data.phone}` : '',
    `💆 *${data.serviceName}* — ${amount}`,
    `📅 ${data.date} ${data.time || ''}`,
    `📍 ${data.bookingType === 'callout' ? 'Call-Out' : 'In-Spa'}`,
  ].filter(Boolean).join('\n');
}

/** Send booking notifications to all 4 channels:
 *  1. Email to client (from bookings@)
 *  2. Email to bookings@ team
 *  3. WhatsApp to client (if phone provided)
 *  4. WhatsApp to spa team
 */
export async function sendBookingNotifications(params: {
  // Client details
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  // Booking details
  bookingId: string;
  serviceName: string;
  date: string;
  time: string;
  therapistName: string;
  totalAmount: number;
  bookingType: string;
  paymentMethod: string;
  notes?: string;
}): Promise<void> {
  const {
    clientName, clientEmail, clientPhone,
    bookingId, serviceName, date, time,
    therapistName, totalAmount, bookingType, paymentMethod, notes,
  } = params;

  // Dynamic import to avoid circular deps — email.ts doesn't import whatsapp.ts
  const { sendEmail, bookingConfirmationEmail, newBookingNotificationEmail } = await import('@/lib/email');

  // ── 1. Email to client ──
  sendEmail({
    to: clientEmail,
    subject: `Booking Confirmed — ${bookingId} | Serenity Touch Spa`,
    html: bookingConfirmationEmail({
      name: clientName, email: clientEmail, bookingId, serviceName,
      date, time, therapistName, totalAmount, bookingType, paymentMethod,
    }),
    from: 'bookings',
  }).catch(() => {});

  // ── 2. Email to bookings@ team ──
  sendEmail({
    to: 'bookings@serenitytouch.co.za',
    subject: `New Booking: ${bookingId} — ${serviceName}`,
    html: newBookingNotificationEmail({
      name: clientName, email: clientEmail, phone: clientPhone || '',
      bookingId, serviceName, date, time, therapistName,
      totalAmount, bookingType, paymentMethod, notes: notes || '',
    }),
    from: 'bookings',
  }).catch(() => {});

  // ── 3. WhatsApp to client ──
  if (clientPhone) {
    sendWhatsApp(clientPhone, buildBookingWA({
      name: clientName, bookingId, serviceName, date, time,
      therapistName, totalAmount, bookingType,
    })).catch(() => {});
  }

  // ── 4. WhatsApp to spa team ──
  sendWhatsApp(WA_SPANUMBER, buildBookingAlertWA({
    name: clientName, email: clientEmail, phone: clientPhone || '',
    bookingId, serviceName, date, time, totalAmount, bookingType,
  })).catch(() => {});
}