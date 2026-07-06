import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { validateAdminKey, unauthorizedResponse } from '@/lib/api-auth';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: CORS }); }

/**
 * GET /api/admin/clients
 * List all unique clients with their booking history summary.
 * 
 * Query params:
 *   ?search=name or email or phone
 *   ?tier=Silver|Gold|Platinum (member filter)
 *   ?page=1&limit=20
 */
export async function GET(request: NextRequest) {
  if (!validateAdminKey(request)) return unauthorizedResponse();

  try {
    const url = request.nextUrl;
    const search = url.searchParams.get('search')?.trim();
    const tier = url.searchParams.get('tier');
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '20')));

    // Build client aggregation query
    // Get all bookings grouped by email to build client profiles
    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }

    // Get all matching bookings, then aggregate client-side for now
    // (SQLite groupBy with aggregations is limited in Prisma)
    const allBookings = await db.booking.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        name: true, email: true, phone: true,
        status: true, paymentStatus: true, totalAmount: true,
        serviceName: true, date: true, createdAt: true, memberId: true,
      },
    });

    // Aggregate by email to build unique client list
    const clientMap = new Map<string, {
      name: string;
      email: string;
      phone: string;
      totalBookings: number;
      totalSpent: number;
      completedBookings: number;
      cancelledBookings: number;
      lastVisit: string;
      firstVisit: string;
      lastService: string;
      memberId: string | null;
    }>();

    for (const b of allBookings) {
      const key = b.email.toLowerCase();
      if (!clientMap.has(key)) {
        clientMap.set(key, {
          name: b.name,
          email: b.email,
          phone: b.phone || '',
          totalBookings: 0,
          totalSpent: 0,
          completedBookings: 0,
          cancelledBookings: 0,
          lastVisit: b.createdAt.toISOString(),
          firstVisit: b.createdAt.toISOString(),
          lastService: b.serviceName,
          memberId: b.memberId,
        });
      }
      const client = clientMap.get(key)!;
      client.totalBookings++;
      client.totalSpent += b.totalAmount;
      if (b.status === 'completed' || b.status === 'confirmed') client.completedBookings++;
      if (b.status === 'cancelled') client.cancelledBookings++;
      if (b.createdAt > new Date(client.lastVisit)) {
        client.lastVisit = b.createdAt.toISOString();
        client.lastService = b.serviceName;
      }
      if (b.createdAt < new Date(client.firstVisit)) {
        client.firstVisit = b.createdAt.toISOString();
      }
    }

    // If tier filter, cross-reference with members table
    let memberTierMap = new Map<string, string>();
    if (tier) {
      const members = await db.member.findMany({
        where: { tier: tier as 'Silver' | 'Gold' | 'Platinum' },
        select: { email: true, tier: true },
      });
      memberTierMap = new Map(members.map((m) => [m.email.toLowerCase(), m.tier]));
    }

    let clients = Array.from(clientMap.values());

    // Apply tier filter if provided
    if (tier && memberTierMap.size > 0) {
      clients = clients.filter((c) => memberTierMap.has(c.email.toLowerCase()));
    }

    // Enrich with member tier info
    const allMembers = await db.member.findMany({
      select: { email: true, tier: true, points: true, createdAt: true },
    });
    const memberLookup = new Map(allMembers.map((m) => [m.email.toLowerCase(), m]));

    const enrichedClients = clients.map((c) => {
      const member = memberLookup.get(c.email.toLowerCase());
      return {
        ...c,
        isMember: !!member,
        memberTier: member?.tier || null,
        memberPoints: member?.points || 0,
        memberSince: member?.createdAt?.toISOString() || null,
      };
    });

    // Sort by totalSpent descending
    enrichedClients.sort((a, b) => b.totalSpent - a.totalSpent);

    // Paginate
    const total = enrichedClients.length;
    const paginatedClients = enrichedClients.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      success: true,
      data: {
        clients: paginatedClients,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      },
    }, { headers: CORS });
  } catch (error) {
    console.error('[Admin Clients]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch clients' }, { status: 500, headers: CORS });
  }
}