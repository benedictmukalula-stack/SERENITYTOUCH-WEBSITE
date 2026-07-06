import nodemailer from 'nodemailer';

/* ═══════════════════════════════════════════════════════════════
   Serenity Touch Spa — Multi-Account Email System
   
   4 email accounts, each with a specific role:
   
   info@        → General enquiries, contact form, website default
   bookings@    → Booking confirmations (to customer), new booking alerts (internal)
   payments@    → Payment receipts, payment confirmation emails
   taonga@      → Founder direct line, reply-to for all outgoing emails
   
   SMTP: mail.serenitytouch.co.za:587 (STARTTLS)
   Password: shared across all accounts (env: SMTP_PASS)
   ═══════════════════════════════════════════════════════════════ */

const SMTP_HOST = process.env.SMTP_HOST || 'mail.serenitytouch.co.za';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
const SMTP_PASS = process.env.SMTP_PASS || '';

const ACCOUNTS = {
  info:     process.env.SMTP_USER_INFO     || 'info@serenitytouch.co.za',
  bookings: process.env.SMTP_USER_BOOKINGS || 'bookings@serenitytouch.co.za',
  payments: process.env.SMTP_USER_PAYMENTS  || 'payments@serenitytouch.co.za',
  taonga:   process.env.SMTP_USER_TAONGA   || 'taonga@serenitytouch.co.za',
} as const;

export type EmailAccount = keyof typeof ACCOUNTS;

// Transporter cache keyed by account email
const transporters = new Map<string, nodemailer.Transporter>();

function getTransporter(account: EmailAccount): nodemailer.Transporter | null {
  const user = ACCOUNTS[account];
  if (!SMTP_HOST || !SMTP_PASS) {
    console.warn('[Email] SMTP not configured — missing host or password');
    return null;
  }

  if (!transporters.has(user)) {
    transporters.set(user, nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: { user, pass: SMTP_PASS },
      // Connection pool settings
      pool: true,
      maxConnections: 3,
      maxMessages: 20,
      rateLimit: 5,
    }));
  }

  return transporters.get(user)!;
}

export interface EmailOptions {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  /** Which email account to send FROM (default: 'info') */
  from?: EmailAccount;
  /** Custom FROM display name (default: 'Serenity Touch Spa') */
  fromName?: string;
}

export async function sendEmail(opts: EmailOptions): Promise<{ success: boolean; error?: string }> {
  const account = opts.from || 'info';
  const transport = getTransporter(account);

  if (!transport) {
    console.warn('[Email] Transport not available — skipping');
    return { success: false, error: 'Email service not configured' };
  }

  const fromName = opts.fromName || 'Serenity Touch Spa';
  const fromUser = ACCOUNTS[account];
  const replyTo = opts.replyTo || ACCOUNTS.taonga;

  try {
    const result = await transport.sendMail({
      from: `"${fromName}" <${fromUser}>`,
      to: opts.to,
      cc: opts.cc,
      bcc: opts.bcc,
      subject: opts.subject,
      html: opts.html,
      replyTo,
    });
    console.log(`[Email] Sent via ${account}@: to=${JSON.stringify(opts.to)} subject="${opts.subject}" id=${result.messageId}`);
    return { success: true };
  } catch (error) {
    console.error(`[Email] Failed (${account}@):`, error);
    return { success: false, error: String(error) };
  }
}

/* ═══════════════════════════════════════════════════════════════
   EMAIL TEMPLATES
   ═══════════════════════════════════════════════════════════════ */

const FOOTER = `
  <div style="text-align: center; padding: 20px; font-size: 12px; color: #999;">
    <p>183 Ibex Hill, Lusaka, Zambia | +260 572 782 539</p>
    <p>
      <a href="mailto:bookings@serenitytouch.co.za" style="color: #D4AF37;">bookings@serenitytouch.co.za</a>
      &nbsp;|&nbsp;
      <a href="mailto:info@serenitytouch.co.za" style="color: #D4AF37;">info@serenitytouch.co.za</a>
      &nbsp;|&nbsp;
      <a href="mailto:payments@serenitytouch.co.za" style="color: #D4AF37;">payments@serenitytouch.co.za</a>
    </p>
    <p><a href="https://serenitytouch.co.za" style="color: #D4AF37;">www.serenitytouch.co.za</a></p>
  </div>
`;

const HEADER_GOLD = `
  <div style="background: linear-gradient(135deg, #0a0508 0%, #1a0f14 100%); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
    <h1 style="color: #D4AF37; margin: 0; font-size: 24px; font-weight: 600;">Serenity Touch Spa</h1>
  </div>
`;

const HEADER_PINK = `
  <div style="background: linear-gradient(135deg, #E91E63, #AD1457); padding: 24px; border-radius: 12px 12px 0 0;">
    <h1 style="color: #fff; margin: 0; font-size: 20px;">Serenity Touch Spa</h1>
  </div>
`;

const WRAPPER_OPEN = `<div style="max-width: 560px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333;">`;
const WRAPPER_CLOSE = `</div>`;
const BODY_OPEN = `<div style="background: #fff; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #eee; border-top: none;">`;
const BODY_CLOSE = `</div>`;

/** Booking confirmation sent TO the customer (from bookings@) */
export function bookingConfirmationEmail(data: {
  name: string;
  email: string;
  bookingId: string;
  serviceName: string;
  date: string;
  time: string;
  therapistName: string;
  totalAmount: number;
  bookingType: string;
  paymentMethod: string;
}): string {
  const amount = `K${data.totalAmount.toLocaleString()}`;
  return `
    ${WRAPPER_OPEN}
    ${HEADER_GOLD}
    <p style="color: rgba(212,175,55,0.6); text-align: center; margin: 0; font-size: 13px;">Booking Confirmation</p>
    ${BODY_OPEN}
      <p style="margin: 20px 0; font-size: 15px; color: #555;">Dear <strong>${data.name}</strong>, your booking has been confirmed!</p>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 12px 0; color: #888; width: 40%;">Booking ID</td>
          <td style="padding: 12px 0; font-weight: 600; color: #D4AF37; font-family: monospace;">${data.bookingId}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 12px 0; color: #888;">Service</td>
          <td style="padding: 12px 0; font-weight: 600;">${data.serviceName}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 12px 0; color: #888;">Date</td>
          <td style="padding: 12px 0; font-weight: 600;">${data.date}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 12px 0; color: #888;">Time</td>
          <td style="padding: 12px 0; font-weight: 600;">${data.time || 'To be confirmed'}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 12px 0; color: #888;">Therapist</td>
          <td style="padding: 12px 0; font-weight: 600;">${data.therapistName}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 12px 0; color: #888;">Location</td>
          <td style="padding: 12px 0; font-weight: 600;">${data.bookingType === 'callout' ? 'Call-Out Service' : '183 Ibex Hill, Lusaka'}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 12px 0; color: #888;">Total</td>
          <td style="padding: 12px 0; font-weight: 700; font-size: 18px; color: #E91E63;">${amount}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; color: #888;">Payment</td>
          <td style="padding: 12px 0; font-weight: 600;">${data.paymentMethod === 'cash' ? 'Cash at Spa' : data.paymentMethod === 'mobile_money' ? 'Mobile Money' : data.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : data.paymentMethod}</td>
        </tr>
      </table>
      <div style="margin-top: 24px; padding: 16px; background: #f9f9f9; border-radius: 8px; font-size: 13px; color: #666;">
        <p style="margin: 0 0 8px;"><strong>Payment Details:</strong></p>
        <p style="margin: 0 0 4px;">MTN Mobile Money: +260 761 404 555 (Taonga Phiri)</p>
        <p style="margin: 0 0 4px;">Airtel Money: +260 572 782 539 (Taonga Phiri)</p>
        <p style="margin: 0; font-size: 12px; color: #999;">Use booking ID <strong>${data.bookingId}</strong> as reference</p>
      </div>
    ${BODY_CLOSE}
    ${FOOTER}
    ${WRAPPER_CLOSE}
  `;
}

/** Internal notification sent TO bookings@ when a new booking is created (from bookings@) */
export function newBookingNotificationEmail(data: {
  name: string;
  email: string;
  phone: string;
  bookingId: string;
  serviceName: string;
  date: string;
  time: string;
  therapistName: string;
  totalAmount: number;
  bookingType: string;
  paymentMethod: string;
  notes: string;
}): string {
  const amount = `K${data.totalAmount.toLocaleString()}`;
  return `
    ${WRAPPER_OPEN}
    ${HEADER_PINK}
    <p style="color: rgba(255,255,255,0.8); text-align: center; margin: 4px 0 0; font-size: 13px;">New Booking Received</p>
    ${BODY_OPEN}
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 8px 0; color: #888;">Booking ID</td><td style="font-weight: 600; font-family: monospace; color: #D4AF37;">${data.bookingId}</td></tr>
        <tr><td style="padding: 8px 0; color: #888;">Guest</td><td style="font-weight: 600;">${data.name} (${data.email})</td></tr>
        <tr><td style="padding: 8px 0; color: #888;">Phone</td><td>${data.phone || 'N/A'}</td></tr>
        <tr><td style="padding: 8px 0; color: #888;">Service</td><td style="font-weight: 600;">${data.serviceName}</td></tr>
        <tr><td style="padding: 8px 0; color: #888;">Date / Time</td><td>${data.date} ${data.time || ''}</td></tr>
        <tr><td style="padding: 8px 0; color: #888;">Therapist</td><td>${data.therapistName}</td></tr>
        <tr><td style="padding: 8px 0; color: #888;">Type</td><td>${data.bookingType === 'callout' ? 'Call-Out' : 'In-Spa'}</td></tr>
        <tr><td style="padding: 8px 0; color: #888;">Payment</td><td>${data.paymentMethod}</td></tr>
        <tr><td style="padding: 8px 0; color: #888;">Total</td><td style="font-weight: 700; color: #E91E63;">${amount}</td></tr>
        ${data.notes ? `<tr><td style="padding: 8px 0; color: #888;">Notes</td><td>${data.notes}</td></tr>` : ''}
      </table>
    ${BODY_CLOSE}
    ${FOOTER}
    ${WRAPPER_CLOSE}
  `;
}

/** Payment receipt sent TO the customer after payment is confirmed (from payments@) */
export function paymentReceiptEmail(data: {
  name: string;
  bookingId: string;
  serviceName: string;
  date: string;
  totalAmount: number;
  paymentMethod: string;
  referenceNumber?: string;
}): string {
  const amount = `K${data.totalAmount.toLocaleString()}`;
  const pmLabel = data.paymentMethod === 'mobile_money' ? 'Mobile Money' : data.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : data.paymentMethod;
  return `
    ${WRAPPER_OPEN}
    <div style="background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
      <h1 style="color: #fff; margin: 0; font-size: 24px; font-weight: 600;">Payment Confirmed</h1>
      <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 13px;">Serenity Touch Spa</p>
    </div>
    ${BODY_OPEN}
      <p style="margin: 0 0 20px; font-size: 15px; color: #555;">Dear <strong>${data.name}</strong>, your payment has been received. Thank you!</p>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 12px 0; color: #888; width: 40%;">Booking ID</td>
          <td style="padding: 12px 0; font-weight: 600; color: #D4AF37; font-family: monospace;">${data.bookingId}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 12px 0; color: #888;">Service</td>
          <td style="padding: 12px 0; font-weight: 600;">${data.serviceName}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 12px 0; color: #888;">Appointment Date</td>
          <td style="padding: 12px 0; font-weight: 600;">${data.date}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 12px 0; color: #888;">Amount Paid</td>
          <td style="padding: 12px 0; font-weight: 700; font-size: 18px; color: #2E7D32;">${amount}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 12px 0; color: #888;">Payment Method</td>
          <td style="padding: 12px 0; font-weight: 600;">${pmLabel}</td>
        </tr>
        ${data.referenceNumber ? `
        <tr>
          <td style="padding: 12px 0; color: #888;">Reference</td>
          <td style="padding: 12px 0; font-weight: 600; font-family: monospace;">${data.referenceNumber}</td>
        </tr>` : ''}
      </table>
      <div style="margin-top: 24px; padding: 16px; background: #E8F5E9; border-radius: 8px; font-size: 13px; color: #2E7D32; text-align: center;">
        <strong>We look forward to seeing you!</strong>
      </div>
    ${BODY_CLOSE}
    ${FOOTER}
    ${WRAPPER_CLOSE}
  `;
}

/** Internal payment notification sent TO payments@ and taonga@ (from payments@) */
export function paymentNotificationEmail(data: {
  name: string;
  email: string;
  bookingId: string;
  serviceName: string;
  totalAmount: number;
  paymentMethod: string;
  referenceNumber?: string;
}): string {
  const amount = `K${data.totalAmount.toLocaleString()}`;
  return `
    ${WRAPPER_OPEN}
    ${HEADER_PINK}
    <p style="color: rgba(255,255,255,0.8); text-align: center; margin: 4px 0 0; font-size: 13px;">Payment Received</p>
    ${BODY_OPEN}
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 8px 0; color: #888;">Booking ID</td><td style="font-weight: 600; font-family: monospace; color: #D4AF37;">${data.bookingId}</td></tr>
        <tr><td style="padding: 8px 0; color: #888;">Customer</td><td style="font-weight: 600;">${data.name} (${data.email})</td></tr>
        <tr><td style="padding: 8px 0; color: #888;">Service</td><td>${data.serviceName}</td></tr>
        <tr><td style="padding: 8px 0; color: #888;">Amount</td><td style="font-weight: 700; color: #2E7D32;">${amount}</td></tr>
        <tr><td style="padding: 8px 0; color: #888;">Method</td><td>${data.paymentMethod}</td></tr>
        ${data.referenceNumber ? `<tr><td style="padding: 8px 0; color: #888;">Reference</td><td style="font-family: monospace;">${data.referenceNumber}</td></tr>` : ''}
      </table>
    ${BODY_CLOSE}
    ${FOOTER}
    ${WRAPPER_CLOSE}
  `;
}

/** Contact form enquiry — sent TO info@, CC taonga@ (from info@) */
export function contactFormEmail(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): string {
  return `
    ${WRAPPER_OPEN}
    ${HEADER_GOLD}
    <p style="color: rgba(212,175,55,0.6); text-align: center; margin: 0; font-size: 13px;">Website Enquiry</p>
    ${BODY_OPEN}
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 10px 0; color: #888; width: 30%;">From</td>
          <td style="padding: 10px 0; font-weight: 600;">${data.name} (${data.email})</td>
        </tr>
        ${data.phone ? `<tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 10px 0; color: #888;">Phone</td>
          <td style="padding: 10px 0;">${data.phone}</td>
        </tr>` : ''}
        <tr>
          <td style="padding: 10px 0; color: #888;">Message</td>
          <td style="padding: 10px 0; white-space: pre-wrap;">${data.message}</td>
        </tr>
      </table>
      <div style="margin-top: 20px; text-align: center;">
        <a href="mailto:${data.email}" style="display: inline-block; background: #E91E63; color: #fff; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">Reply to ${data.name}</a>
      </div>
    ${BODY_CLOSE}
    ${FOOTER}
    ${WRAPPER_CLOSE}
  `;
}