import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { validateAdminKey, unauthorizedResponse } from '@/lib/api-auth';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: CORS }); }

// Points configuration
const POINTS_CONFIG = {
  earnPerKwacha: 1,          // 1 point per K1 spent
  bookingBonus: 50,           // Bonus points per booking
  referralBonus: 200,         // Points for referring a friend
  reviewBonus: 100,           // Points for leaving a review
  redeemRate: 100,            // 100 points = K100 discount
  tiers: {
    Silver: { pointsForUpgrade: 500, name: 'Gold' },
    Gold: { pointsForUpgrade: 1500, name: 'Platinum' },
    Platinum: { pointsForUpgrade: 0, name: 'Platinum' },
  } as Record<string, { pointsForUpgrade: number; name: string }>,
};

/**
 * POST /api/loyalty/earn
 * Award loyalty points to a member after a completed booking.
 * Called automatically when a booking is marked as 'completed' or 'paid'.
 * 
 * Body: { email, bookingId, amount }
 */
export async function POST(request: NextRequest) {
  try {
    const { email, bookingId, amount } = await request.json();

    if (!email || !bookingId || !amount) {
      return NextResponse.json(
        { success: false, error: 'Email, bookingId, and amount are required' },
        { status: 400, headers: CORS }
      );
    }

    const member = await db.member.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!member) {
      return NextResponse.json({ success: false, error: 'Member not found' }, { status: 404, headers: CORS });
    }

    // Calculate points: 1 per K1 spent + 50 booking bonus
    const earnedPoints = Math.floor(amount * POINTS_CONFIG.earnPerKwacha) + POINTS_CONFIG.bookingBonus;

    const updatedMember = await db.member.update({
      where: { email: email.toLowerCase() },
      data: { points: { increment: earnedPoints } },
    });

    // Check for tier upgrade
    let tierUpgraded = false;
    let newTier = updatedMember.tier;
    const tierConfig = POINTS_CONFIG.tiers[updatedMember.tier];
    if (tierConfig && tierConfig.pointsForUpgrade > 0 && updatedMember.points >= tierConfig.pointsForUpgrade) {
      newTier = tierConfig.name;
      await db.member.update({
        where: { email: email.toLowerCase() },
        data: { tier: newTier },
      });
      tierUpgraded = true;
    }

    console.log(`[Loyalty] +${earnedPoints} pts to ${member.email} (booking: ${bookingId}, total: ${updatedMember.points + (tierUpgraded ? 0 : 0)})${tierUpgraded ? ` → Upgraded to ${newTier}!` : ''}`);

    return NextResponse.json({
      success: true,
      pointsEarned: earnedPoints,
      totalPoints: updatedMember.points,
      tierUpgraded,
      newTier,
    }, { headers: CORS });
  } catch (error) {
    console.error('[Loyalty Earn]', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500, headers: CORS });
  }
}

/**
 * GET /api/loyalty/balance?email=
 * Check a member's loyalty points balance and tier info.
 */
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');
    if (!email) {
      return NextResponse.json({ success: false, error: 'Email parameter required' }, { status: 400, headers: CORS });
    }

    const member = await db.member.findUnique({
      where: { email: email.toLowerCase() },
      select: { name: true, email: true, tier: true, points: true, createdAt: true },
    });

    if (!member) {
      return NextResponse.json({ success: false, error: 'Member not found' }, { status: 404, headers: CORS });
    }

    const tierConfig = POINTS_CONFIG.tiers[member.tier];
    const nextTier = tierConfig?.name || null;
    const pointsToNext = tierConfig && tierConfig.pointsForUpgrade > 0
      ? Math.max(0, tierConfig.pointsForUpgrade - member.points)
      : 0;
    const redeemableValue = Math.floor(member.points / POINTS_CONFIG.redeemRate) * 100;

    return NextResponse.json({
      success: true,
      member: {
        name: member.name,
        tier: member.tier,
        points: member.points,
        pointsToNextTier: pointsToNext,
        nextTier,
        redeemableValue, // in Kwacha
        memberSince: member.createdAt.toISOString().split('T')[0],
      },
    }, { headers: CORS });
  } catch (error) {
    console.error('[Loyalty Balance]', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500, headers: CORS });
  }
}