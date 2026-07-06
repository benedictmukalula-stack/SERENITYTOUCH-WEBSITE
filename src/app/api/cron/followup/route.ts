import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendWhatsApp, buildFollowUpWA } from '@/lib/whatsapp';

const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: CORS }); }

/**
 * POST /api/cron/followup
 * Finds clients who haven't booked in 30+ days and sends a re-engagement WhatsApp.
 * Run weekly.
 */
export async function POST(request: NextRequest) {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get all completed/past bookings
    const pastBookings = await db.booking.findMany({
      where: { createdAt: { lt: thirtyDaysAgo }, status: { in: ['confirmed', 'completed'] } },
      orderBy: { createdAt: 'desc' },
      distinct: ['email'],
    });

    let sent = 0;
    for (const b of pastBookings) {
      if (!b.phone) continue;

      // Check if they have a more recent booking (skip if active client)
      const recent = await db.booking.findFirst({
        where: { email: b.email, createdAt: { gte: thirtyDaysAgo } },
      });
      if (recent) continue;

      await sendWhatsApp(b.phone, buildFollowUpWA({
        name: b.name, lastService: b.serviceName, lastDate: b.date,
      })).catch(() => {});
      sent++;
    }

    console.log(`[Cron FollowUp] ${sent} re-engagement messages sent`);
    return NextResponse.json({ scanned: pastBookings.length, sent }, { headers: CORS });
  } catch (error) {
    console.error('[Cron FollowUp]', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500, headers: CORS });
  }
}