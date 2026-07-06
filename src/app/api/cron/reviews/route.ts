import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendWhatsApp, buildReviewRequestWA } from '@/lib/whatsapp';

const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: CORS }); }

/**
 * POST /api/cron/reviews
 * Finds bookings from TODAY that are confirmed, sends a review request via WhatsApp.
 * Call 2-3 hours after appointments typically end (e.g. 7 PM daily).
 */
export async function POST(request: NextRequest) {
  try {
    const today = new Date().toISOString().split('T')[0];

    const bookings = await db.booking.findMany({
      where: { date: today, status: 'confirmed' },
    });

    let sent = 0;
    for (const b of bookings) {
      if (b.phone) {
        await sendWhatsApp(b.phone, buildReviewRequestWA({
          name: b.name, serviceName: b.serviceName,
        })).catch(() => {});
        sent++;
      }
    }

    console.log(`[Cron Reviews] ${today}: ${sent} review requests sent`);
    return NextResponse.json({ date: today, total: bookings.length, sent }, { headers: CORS });
  } catch (error) {
    console.error('[Cron Reviews]', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500, headers: CORS });
  }
}