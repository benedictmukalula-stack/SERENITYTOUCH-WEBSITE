import nodemailer from 'nodemailer';

// SMTP configuration from environment variables
const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465');
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const SMTP_FROM = process.env.SMTP_FROM || 'info@serenitytouch.co.za';

// Create reusable transporter
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // true for 465, false for 587
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }

  return transporter;
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, replyTo }: EmailOptions): Promise<{ success: boolean; error?: string }> {
  const transport = getTransporter();

  if (!transport) {
    console.warn('[Email] SMTP not configured — skipping email send');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    await transport.sendMail({
      from: `"Serenity Touch Spa" <${SMTP_FROM}>`,
      to,
      subject,
      html,
      replyTo: replyTo || 'taonga@serenitytouch.co.za',
    });
    console.log(`[Email] Sent to ${to}: ${subject}`);
    return { success: true };
  } catch (error) {
    console.error('[Email] Failed to send:', error);
    return { success: false, error: String(error) };
  }
}

// Pre-built email templates
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
    <div style="max-width: 560px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333;">
      <div style="background: linear-gradient(135deg, #0a0508 0%, #1a0f14 100%); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: #D4AF37; margin: 0; font-size: 24px; font-weight: 600;">Serenity Touch Spa</h1>
        <p style="color: rgba(212,175,55,0.6); margin: 8px 0 0; font-size: 13px;">Booking Confirmation</p>
      </div>
      <div style="background: #fff; padding: 32px; border-radius: 0 0 12px 12px; border: 1px solid #eee; border-top: none;">
        <p style="margin: 0 0 20px; font-size: 15px; color: #555;">Dear <strong>${data.name}</strong>, your booking has been confirmed!</p>
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
      </div>
      <div style="text-align: center; padding: 20px; font-size: 12px; color: #999;">
        <p>183 Ibex Hill, Lusaka, Zambia | +260 572 782 539</p>
        <p>bookings@serenitytouch.co.za | www.serenitytouch.co.za</p>
      </div>
    </div>
  `;
}

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
    <div style="max-width: 560px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333;">
      <div style="background: linear-gradient(135deg, #E91E63, #AD1457); padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: #fff; margin: 0; font-size: 20px;">New Booking Received</h1>
      </div>
      <div style="background: #fff; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #eee; border-top: none;">
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
      </div>
    </div>
  `;
}