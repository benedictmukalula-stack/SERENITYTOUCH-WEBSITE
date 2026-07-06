import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendWhatsApp, buildStatusUpdateWA, buildPaymentConfirmedWA } from '@/lib/whatsapp';
import { sendEmail, paymentReceiptEmail, paymentNotificationEmail } from '@/lib/email';
import { validateAdminKey, unauthorizedResponse } from '@/lib/api-auth';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: CORS }); }

/**
 * PATCH /api/booking/[id]
 * Update booking status or payment status. Triggers WhatsApp + email notifications.
 * 
 * Body: { status?: 'confirmed'|'cancelled'|'completed'|'no_show', paymentStatus?: 'paid'|'pending', reason?: string }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateAdminKey(request)) return unauthorizedResponse();
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, paymentStatus, reason } = body;

    const booking = await db.booking.findUnique({ where: { bookingId: id } });
    if (!booking) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404, headers: CORS });
    }

    // Build update data
    const updateData: Record<string, unknown> = {};
    if (status) {
      updateData.status = status;
      if (status === 'confirmed') updateData.confirmedAt = new Date();
      if (status === 'cancelled') updateData.cancelledAt = new Date();
    }
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const updated = await db.booking.update({
      where: { bookingId: id },
      data: updateData,
    });

    // ── Trigger notifications ──

    // Status changed to confirmed
    if (status === 'confirmed' && booking.status !== 'confirmed') {
      if (booking.phone) {
        await sendWhatsApp(booking.phone, buildStatusUpdateWA({
          name: booking.name, bookingId: booking.bookingId, serviceName: booking.serviceName,
          date: booking.date, time: booking.time, status: 'confirmed',
        })).catch(() => {});
      }
    }

    // Status changed to cancelled
    if (status === 'cancelled') {
      if (booking.phone) {
        await sendWhatsApp(booking.phone, buildStatusUpdateWA({
          name: booking.name, bookingId: booking.bookingId, serviceName: booking.serviceName,
          date: booking.date, time: booking.time, status: 'cancelled', reason,
        })).catch(() => {});
      }
      // Email cancellation notice
      await sendEmail({
        to: booking.email,
        subject: `Booking Cancelled — ${booking.bookingId} | Serenity Touch Spa`,
        html: `
          <div style="max-width:560px;margin:0 auto;font-family:'Segoe UI',sans-serif;color:#333;">
            <div style="background:#E91E63;padding:24px;border-radius:12px 12px 0 0;">
              <h1 style="color:#fff;margin:0;font-size:20px;">Booking Cancelled</h1>
            </div>
            <div style="background:#fff;padding:24px;border-radius:0 0 12px 12px;border:1px solid #eee;border-top:none;">
              <p>Hi <strong>${booking.name}</strong>, your booking has been cancelled.</p>
              <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:16px;">
                <tr><td style="padding:8px 0;color:#888;">Booking</td><td style="font-family:monospace;color:#D4AF37;">${booking.bookingId}</td></tr>
                <tr><td style="padding:8px 0;color:#888;">Service</td><td>${booking.serviceName}</td></tr>
                <tr><td style="padding:8px 0;color:#888;">Date</td><td>${booking.date}</td></tr>
                ${reason ? `<tr><td style="padding:8px 0;color:#888;">Reason</td><td>${reason}</td></tr>` : ''}
              </table>
              <p style="margin-top:16px;font-size:13px;">We'd love to reschedule! Visit <a href="https://serenitytouch.co.za" style="color:#E91E63;">serenitytouch.co.za</a> or WhatsApp +260 761 404 555.</p>
            </div>
          </div>`,
        from: 'bookings',
      }).catch(() => {});
    }

    // Payment status changed to paid — also award loyalty points
    if (paymentStatus === 'paid' && booking.paymentStatus !== 'paid') {
      // WhatsApp receipt to client
      if (booking.phone) {
        await sendWhatsApp(booking.phone, buildPaymentConfirmedWA({
          name: booking.name, bookingId: booking.bookingId,
          serviceName: booking.serviceName, amount: booking.totalAmount,
        })).catch(() => {});
      }
      // Email receipt to client
      await sendEmail({
        to: booking.email,
        subject: `Payment Confirmed — ${booking.bookingId} | Serenity Touch Spa`,
        html: paymentReceiptEmail({
          name: booking.name, bookingId: booking.bookingId, serviceName: booking.serviceName,
          date: booking.date, totalAmount: booking.totalAmount, paymentMethod: booking.paymentMethod,
        }),
        from: 'payments',
      }).catch(() => {});
      // Internal payment notification
      await sendEmail({
        to: 'payments@serenitytouch.co.za',
        cc: 'taonga@serenitytouch.co.za',
        subject: `Payment Confirmed: ${booking.bookingId} — K${booking.totalAmount.toLocaleString()}`,
        html: paymentNotificationEmail({
          name: booking.name, email: booking.email, bookingId: booking.bookingId,
          serviceName: booking.serviceName, totalAmount: booking.totalAmount,
          paymentMethod: booking.paymentMethod,
        }),
        from: 'payments',
      }).catch(() => {});

      // Award loyalty points (fire and forget)
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/loyalty/earn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: booking.email, bookingId: booking.bookingId, amount: booking.totalAmount }),
      }).catch(() => {});
    }

    // Status changed to completed — also award loyalty points if not already paid
    if (status === 'completed' && booking.paymentStatus === 'paid' && booking.status !== 'completed') {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/loyalty/earn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: booking.email, bookingId: booking.bookingId, amount: booking.totalAmount }),
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, booking: updated }, { headers: CORS });
  } catch (error) {
    console.error('[Booking PATCH]', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500, headers: CORS });
  }
}