import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { validateAdminKey, unauthorizedResponse } from '@/lib/api-auth';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: CORS }); }

/**
 * GET /api/admin/loyalty?email=&page=&limit=
 * View member loyalty details, points log, and manage points.
 */
export async function GET(request: NextRequest) {
  if (!validateAdminKey(request)) return unauthorizedResponse();

  try {
    const email = request.nextUrl.searchParams.get('email');
    const page = Math.max(1, parseInt(request.nextUrl.searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(request.nextUrl.searchParams.get('limit') || '20')));

    if (email) {
      // Single member loyalty detail
      const member = await db.member.findUnique({
        where: { email: email.toLowerCase() },
        include: {
          loyaltyLogs: {
            orderBy: { createdAt: 'desc' },
            take: 50,
          },
          _count: { select: { bookings: true, referrals: true, loyaltyLogs: true } },
        },
      });

      if (!member) {
        return NextResponse.json({ success: false, error: 'Member not found' }, { status: 404, headers: CORS });
      }

      const tierThresholds = { Silver: 0, Gold: 500, Platinum: 1500 };
      const nextTier = member.tier === 'Silver' ? 'Gold' : member.tier === 'Gold' ? 'Platinum' : null;
      const pointsToNext = nextTier ? Math.max(0, (tierThresholds as Record<string, number>)[nextTier] - member.points) : 0;

      return NextResponse.json({
        success: true,
        member: {
          id: member.id,
          name: member.name,
          email: member.email,
          phone: member.phone,
          tier: member.tier,
          points: member.points,
          nextTier,
          pointsToNext,
          redeemableValue: Math.floor(member.points / 100) * 100,
          totalBookings: member._count.bookings,
          totalReferrals: member._count.referrals,
          memberSince: member.createdAt.toISOString().split('T')[0],
          logs: member.loyaltyLogs.map(l => ({
            id: l.id,
            points: l.points,
            reason: l.reason,
            description: l.description,
            bookingId: l.bookingId,
            createdAt: l.createdAt.toISOString(),
          })),
        },
      }, { headers: CORS });
    }

    // All members loyalty overview
    const where: Record<string, unknown> = { active: true };
    const tierFilter = request.nextUrl.searchParams.get('tier');
    if (tierFilter && tierFilter !== 'All') where.tier = tierFilter;

    const search = request.nextUrl.searchParams.get('search');
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const [members, total] = await Promise.all([
      db.member.findMany({
        where,
        orderBy: { points: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true, name: true, email: true, phone: true, tier: true, points: true, createdAt: true,
          _count: { select: { bookings: true, referrals: true, loyaltyLogs: true } },
        },
      }),
      db.member.count({ where }),
    ]);

    // Tier distribution
    const tierDist = await db.member.groupBy({
      by: ['tier'],
      _count: true,
      _sum: { points: true },
    });

    // Total points in system
    const pointsAgg = await db.member.aggregate({ _sum: { points: true } });

    return NextResponse.json({
      success: true,
      data: {
        members: members.map(m => ({
          id: m.id,
          name: m.name,
          email: m.email,
          phone: m.phone,
          tier: m.tier,
          points: m.points,
          totalBookings: m._count.bookings,
          totalReferrals: m._count.referrals,
          memberSince: m.createdAt.toISOString().split('T')[0],
        })),
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        tierDistribution: tierDist.map(t => ({ tier: t.tier, count: t._count, totalPoints: t._sum.points || 0 })),
        totalPointsInSystem: pointsAgg._sum.points || 0,
      },
    }, { headers: CORS });
  } catch (error) {
    console.error('[Admin Loyalty GET]', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500, headers: CORS });
  }
}

/**
 * POST /api/admin/loyalty
 * Manually adjust member points (earn/redeem/bonus).
 * Body: { email, points, reason, description?, bookingId? }
 */
export async function POST(request: NextRequest) {
  if (!validateAdminKey(request)) return unauthorizedResponse();

  try {
    const { email, points, reason, description, bookingId, adminName } = await request.json();

    if (!email || points === undefined || !reason) {
      return NextResponse.json(
        { success: false, error: 'email, points, and reason are required' },
        { status: 400, headers: CORS }
      );
    }

    const member = await db.member.findUnique({ where: { email: email.toLowerCase() } });
    if (!member) {
      return NextResponse.json({ success: false, error: 'Member not found' }, { status: 404, headers: CORS });
    }

    // Prevent negative balance on redeem
    if (points < 0 && member.points + points < 0) {
      return NextResponse.json(
        { success: false, error: `Insufficient points. Member has ${member.points}, cannot deduct ${Math.abs(points)}` },
        { status: 400, headers: CORS }
      );
    }

    const updatedMember = await db.member.update({
      where: { email: email.toLowerCase() },
      data: {
        points: { increment: points },
      },
    });

    // Log the transaction
    await db.loyaltyLog.create({
      data: {
        memberId: member.id,
        bookingId: bookingId || null,
        points,
        reason,
        description: description || `Manual ${points > 0 ? 'award' : 'deduction'} of ${Math.abs(points)} points`,
        createdById: adminName || 'admin',
      },
    });

    // Check tier upgrade after earning
    let tierUpgraded = false;
    let newTier = updatedMember.tier;
    const tierThresholds: Record<string, { min: number; next: string | null }> = {
      Silver: { min: 0, next: 'Gold' },
      Gold: { min: 500, next: 'Platinum' },
      Platinum: { min: 1500, next: null },
    };

    // Find the highest tier the member qualifies for
    if (updatedMember.points >= 1500 && updatedMember.tier !== 'Platinum') {
      newTier = 'Platinum';
      tierUpgraded = true;
    } else if (updatedMember.points >= 500 && updatedMember.tier === 'Silver') {
      newTier = 'Gold';
      tierUpgraded = true;
    }

    if (tierUpgraded) {
      await db.member.update({
        where: { email: email.toLowerCase() },
        data: { tier: newTier },
      });
    }

    return NextResponse.json({
      success: true,
      member: {
        name: updatedMember.name,
        email: updatedMember.email,
        tier: newTier,
        points: updatedMember.points + (tierUpgraded ? 0 : 0), // already incremented
        tierUpgraded,
        previousTier: member.tier,
      },
    }, { headers: CORS });
  } catch (error) {
    console.error('[Admin Loyalty POST]', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500, headers: CORS });
  }
}