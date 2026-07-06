import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendWhatsApp, buildReminderWA } from '@/lib/whatsapp';
import { sendEmail, bookingConfirmationEmail } from '@/lib/email';

const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: CORS }); }

/**
 * POST /api/cron/reminders
 * Call this daily (e.g. via cron-job.org or Ultramsg scheduler).
 * Finds all confirmed bookings for TOMORROW and sends WhatsApp + email reminders.
 * 
 * Security: pass ?key=REMINDERS_CRON_KEY (set in .env, optional for now).
 */
export async function POST(request: NextRequest) {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0]; // YYYY-MM-DD

    // Find all confirmed bookings for tomorrow
    const bookings = await db.booking.findMany({
      where: { date: tomorrowStr, status: 'confirmed' },
    });

    let sent = 0;
    for (const b of bookings) {
      // WhatsApp reminder to client
      if (b.phone) {
        await sendWhatsApp(b.phone, buildReminderWA({
          name: b.name, serviceName: b.serviceName, date: b.date,
          time: b.time || '', bookingId: b.bookingId, bookingType: b.bookingType,
        })).catch(() => {});
      }

      // Email reminder
      await sendEmail({
        to: b.email,
        subject: `Reminder: Your appointment tomorrow — ${b.bookingId}`,
        html: `
          <div style="max-width:560px;margin:0 auto;font-family:'Segoe UI',sans-serif;color:#333;">
            <div style="background:linear-gradient(135deg,#0a0508,#1a0f14);padding:28px;border-radius:12px 12px 0 0;text-align:center;">
              <h1 style="color:#D4AF37;margin:0;font-size:22px;">Serenity Touch Spa</h1>
              <p style="color:rgba(212,175,55,0.6);margin:6px 0 0;font-size:13px;">Appointment Reminder</p>
            </div>
            <div style="background:#fff;padding:28px;border-radius:0 0 12px 12px;border:1px solid #eee;border-top:none;">
              <p style="margin:0 0 16px;font-size:15px;">Hi <strong>${b.name}</strong>, this is a friendly reminder about your appointment tomorrow:</p>
              <table style="width:100%;border-collapse:collapse;font-size:14px;">
                <tr style="border-bottom:1px solid #f0f0f0;"><td style="padding:10px 0;color:#888;">Service</td><td style="font-weight:600;">${b.serviceName}</td></tr>
                <tr style="border-bottom:1px solid #f0f0f0;"><td style="padding:10px 0;color:#888;">Date</td><td style="font-weight:600;">${b.date}</td></tr>
                <tr style="border-bottom:1px solid #f0f0f0;"><td style="padding:10px 0;color:#888;">Time</td><td style="font-weight:600;">${b.time || 'To be confirmed'}</td></tr>
                <tr><td style="padding:10px 0;color:#888;">Location</td><td style="font-weight:600;">${b.bookingType === 'callout' ? 'Call-Out' : '183 Ibex Hill, Lusaka'}</td></tr>
              </table>
              <p style="margin-top:16px;font-size:13px;color:#888;">Please arrive 10 minutes early. Questions? Call +260 572 782 539 or reply to this email.</p>
            </div>
            <div style="text-align:center;padding:16px;font-size:12px;color:#999;">serenitytouch.co.za | +260 572 782 539</div>
          </div>`,
        from: 'bookings',
      }).catch(() => {});

      sent++;
    }

    console.log(`[Cron Reminders] ${tomorrowStr}: ${sent} reminders sent`);
    return NextResponse.json({ date: tomorrowStr, total: bookings.length, sent }, { headers: CORS });
  } catch (error) {
    console.error('[Cron Reminders]', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500, headers: CORS });
  }
}