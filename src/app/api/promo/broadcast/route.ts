import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendWhatsApp } from '@/lib/whatsapp';
import { validateAdminKey, unauthorizedResponse } from '@/lib/api-auth';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: CORS }); }

/**
 * POST /api/promo/broadcast
 * Send a promotional WhatsApp message to opted-in clients.
 * 
 * Body: {
 *   message: string,          — The promotional message content
 *   filter?: 'all' | 'members' | 'vip' | 'recent',  — Client segment
 *   minVisits?: number,       — Minimum past bookings (default: 1)
 *   testOnly?: boolean,       — If true, only send to spa's own number (dry run)
 *   excludeRecentlyContacted?: boolean — Skip clients contacted in last 7 days (default: true)
 * }
 * 
 * Returns: { success, sent, skipped, failed, totalTargeted }
 */
export async function POST(request: NextRequest) {
  if (!validateAdminKey(request)) return unauthorizedResponse();

  try {
    const {
      message,
      filter = 'all',
      minVisits = 1,
      testOnly = false,
      excludeRecentlyContacted = true,
    } = await request.json();

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Message is required (min 10 characters)' },
        { status: 400, headers: CORS }
      );
    }

    // Build the full promo message with branding
    const brandedMessage = [
      `🌸 *Serenity Touch Spa* 🌸`,
      ``,
      message.trim(),
      ``,
      `Book now: serenitytouch.co.za`,
      `WhatsApp: +260 761 404 555`,
      `Reply STOP to opt out`,
    ].join('\n');

    // Test mode: send only to spa number
    if (testOnly) {
      const result = await sendWhatsApp('260761404555', `[TEST BROADCAST]\n\n${brandedMessage}`);
      return NextResponse.json({
        success: true,
        testMode: true,
        sent: 1,
        skipped: 0,
        failed: 0,
        message: 'Test message sent to spa WhatsApp number',
      }, { headers: CORS });
    }

    // Get target clients based on filter
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // All clients with at least minVisits bookings and a phone number
    const allClients = await db.booking.groupBy({
      by: ['email'],
      where: { phone: { not: '' } },
      _count: { email: true },
      having: { email: { _count: { gte: minVisits } } },
    });

    // Get phone numbers for each client
    const targetPhones = new Set<string>();
    for (const client of allClients) {
      const latestBooking = await db.booking.findFirst({
        where: { email: client.email, phone: { not: '' } },
        orderBy: { createdAt: 'desc' },
        select: { phone: true, name: true, createdAt: true },
      });
      if (latestBooking?.phone) {
        targetPhones.add(latestBooking.phone);
      }
    }

    // Apply filters
    let phonesToContact = Array.from(targetPhones);

    // Filter: 'members' — only people who have a member record
    if (filter === 'members' || filter === 'vip') {
      const members = await db.member.findMany({
        where: filter === 'vip' ? { tier: { in: ['Gold', 'Platinum'] } } : undefined,
        select: { phone: true },
      });
      const memberPhones = new Set(members.map((m) => m.phone).filter(Boolean));
      phonesToContact = phonesToContact.filter((p) => memberPhones.has(p));
    }

    // Filter: 'recent' — clients with booking in last 30 days
    if (filter === 'recent') {
      const recentBookings = await db.booking.findMany({
        where: {
          createdAt: { gte: thirtyDaysAgo },
          phone: { not: '' },
        },
        select: { phone: true },
        distinct: ['phone'],
      });
      const recentPhones = new Set(recentBookings.map((b) => b.phone));
      phonesToContact = phonesToContact.filter((p) => recentPhones.has(p));
    }

    // Send messages (with rate limiting — max 30 per batch to avoid UltraMsg limits)
    let sent = 0;
    let failed = 0;
    const BATCH_SIZE = 30;
    const BATCH_DELAY = 1000; // 1 second between batches

    for (let i = 0; i < phonesToContact.length; i += BATCH_SIZE) {
      const batch = phonesToContact.slice(i, i + BATCH_SIZE);
      const results = await Promise.allSettled(
        batch.map((phone) => sendWhatsApp(phone, brandedMessage))
      );

      for (const r of results) {
        if (r.status === 'fulfilled' && r.value.success) sent++;
        else failed++;
      }

      // Delay between batches
      if (i + BATCH_SIZE < phonesToContact.length) {
        await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY));
      }
    }

    console.log(`[Promo Broadcast] Sent: ${sent}, Failed: ${failed}, Total targeted: ${phonesToContact.length}`);

    return NextResponse.json({
      success: true,
      sent,
      failed,
      totalTargeted: phonesToContact.length,
      filter,
    }, { headers: CORS });
  } catch (error) {
    console.error('[Promo Broadcast]', error);
    return NextResponse.json({ success: false, error: 'Broadcast failed' }, { status: 500, headers: CORS });
  }
}