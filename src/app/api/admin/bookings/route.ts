import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { validateAdminKey, unauthorizedResponse } from '@/lib/api-auth';
import { Prisma } from '@prisma/client';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: CORS }); }

/**
 * GET /api/admin/bookings
 * List all bookings with filtering, sorting, and pagination.
 * 
 * Query params:
 *   ?status=confirmed|pending|cancelled|completed|no_show
 *   ?paymentStatus=paid|pending
 *   ?dateFrom=YYYY-MM-DD&dateTo=YYYY-MM-DD
 *   ?search=name or email or bookingId
 *   ?page=1&limit=20
 *   ?sort=createdAt|date|totalAmount (prefix - for desc)
 */
export async function GET(request: NextRequest) {
  if (!validateAdminKey(request)) return unauthorizedResponse();

  try {
    const url = request.nextUrl;
    const status = url.searchParams.get('status');
    const paymentStatus = url.searchParams.get('paymentStatus');
    const dateFrom = url.searchParams.get('dateFrom');
    const dateTo = url.searchParams.get('dateTo');
    const search = url.searchParams.get('search')?.trim();
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '20')));
    const sort = url.searchParams.get('sort') || '-createdAt';

    // Build where clause
    const where: Prisma.BookingWhereInput = {};
    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) (where.date as Prisma.StringNullableFilter).gte = dateFrom;
      if (dateTo) (where.date as Prisma.StringNullableFilter).lte = dateTo;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { bookingId: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }

    // Parse sort
    let orderBy: Prisma.BookingOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort.startsWith('-')) {
      const field = sort.slice(1) as keyof Prisma.BookingOrderByWithRelationInput;
      if (['createdAt', 'date', 'totalAmount', 'name'].includes(field)) {
        orderBy = { [field]: 'desc' };
      }
    } else {
      const field = sort as keyof Prisma.BookingOrderByWithRelationInput;
      if (['createdAt', 'date', 'totalAmount', 'name'].includes(field)) {
        orderBy = { [field]: 'asc' };
      }
    }

    const [bookings, total] = await Promise.all([
      db.booking.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true, bookingId: true, name: true, email: true, phone: true,
          serviceName: true, serviceId: true, date: true, time: true,
          status: true, bookingType: true, calloutZone: true, calloutAddress: true,
          totalAmount: true, paymentMethod: true, paymentStatus: true,
          therapistName: true, notes: true, confirmedAt: true, cancelledAt: true,
          createdAt: true, memberId: true,
        },
      }),
      db.booking.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        bookings: bookings.map((b) => ({
          ...b,
          createdAt: b.createdAt.toISOString(),
          confirmedAt: b.confirmedAt?.toISOString() || null,
          cancelledAt: b.cancelledAt?.toISOString() || null,
        })),
        pagination: {
          page, limit, total,
          pages: Math.ceil(total / limit),
        },
      },
    }, { headers: CORS });
  } catch (error) {
    console.error('[Admin Bookings]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch bookings' }, { status: 500, headers: CORS });
  }
}

/**
 * PATCH /api/admin/bookings
 * Batch update booking statuses.
 * 
 * Body: { bookingIds: string[], status?: string, paymentStatus?: string, reason?: string }
 */
export async function PATCH(request: NextRequest) {
  if (!validateAdminKey(request)) return unauthorizedResponse();

  try {
    const { bookingIds, status, paymentStatus, reason } = await request.json();

    if (!Array.isArray(bookingIds) || bookingIds.length === 0) {
      return NextResponse.json({ success: false, error: 'bookingIds array is required' }, { status: 400, headers: CORS });
    }

    const updateData: Record<string, unknown> = {};
    if (status) {
      updateData.status = status;
      if (status === 'confirmed') updateData.confirmedAt = new Date();
      if (status === 'cancelled') updateData.cancelledAt = new Date();
    }
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const result = await db.booking.updateMany({
      where: { bookingId: { in: bookingIds } },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      updated: result.count,
    }, { headers: CORS });
  } catch (error) {
    console.error('[Admin Bookings PATCH]', error);
    return NextResponse.json({ success: false, error: 'Failed to update bookings' }, { status: 500, headers: CORS });
  }
}