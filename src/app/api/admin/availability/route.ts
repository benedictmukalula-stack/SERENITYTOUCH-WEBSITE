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
 * GET /api/admin/availability?therapistId=
 * Get a therapist's weekly availability schedule.
 */
export async function GET(request: NextRequest) {
  if (!validateAdminKey(request)) return unauthorizedResponse();

  try {
    const therapistId = request.nextUrl.searchParams.get('therapistId');

    if (!therapistId) {
      // Return all therapists' availability
      const all = await db.staffAvailability.findMany({
        include: { therapist: { select: { id: true, name: true, specialty: true, active: true } } },
        orderBy: [{ therapist: { sortOrder: 'asc' } }, { dayOfWeek: 'asc' }],
      });
      return NextResponse.json({
        success: true,
        availability: all.map(a => ({
          id: a.id,
          therapistId: a.therapistId,
          therapistName: a.therapist.name,
          dayOfWeek: a.dayOfWeek,
          startTime: a.startTime,
          endTime: a.endTime,
          available: a.available,
        })),
      }, { headers: CORS });
    }

    const records = await db.staffAvailability.findMany({
      where: { therapistId },
      orderBy: { dayOfWeek: 'asc' },
    });

    return NextResponse.json({
      success: true,
      availability: records.map(a => ({
        id: a.id,
        dayOfWeek: a.dayOfWeek,
        startTime: a.startTime,
        endTime: a.endTime,
        available: a.available,
      })),
    }, { headers: CORS });
  } catch (error) {
    console.error('[Admin Availability GET]', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500, headers: CORS });
  }
}

/**
 * POST /api/admin/availability
 * Set or update a therapist's availability for a day.
 * Body: { therapistId, dayOfWeek, startTime, endTime, available? }
 */
export async function POST(request: NextRequest) {
  if (!validateAdminKey(request)) return unauthorizedResponse();

  try {
    const { therapistId, dayOfWeek, startTime, endTime, available = true } = await request.json();

    if (!therapistId || dayOfWeek === undefined || !startTime || !endTime) {
      return NextResponse.json(
        { success: false, error: 'therapistId, dayOfWeek, startTime, endTime are required' },
        { status: 400, headers: CORS }
      );
    }

    if (dayOfWeek < 0 || dayOfWeek > 6) {
      return NextResponse.json(
        { success: false, error: 'dayOfWeek must be 0-6 (Sun-Sat)' },
        { status: 400, headers: CORS }
      );
    }

    // Validate time format HH:MM
    const timeRegex = /^([01]?\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return NextResponse.json(
        { success: false, error: 'Times must be in HH:MM 24h format' },
        { status: 400, headers: CORS }
      );
    }

    // Upsert: create or update existing record for this therapist+day
    const record = await db.staffAvailability.upsert({
      where: {
        therapistId_dayOfWeek: { therapistId, dayOfWeek },
      },
      create: { therapistId, dayOfWeek, startTime, endTime, available },
      update: { startTime, endTime, available },
    });

    return NextResponse.json({
      success: true,
      availability: {
        id: record.id,
        dayOfWeek: record.dayOfWeek,
        startTime: record.startTime,
        endTime: record.endTime,
        available: record.available,
      },
    }, { headers: CORS });
  } catch (error) {
    console.error('[Admin Availability POST]', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500, headers: CORS });
  }
}

/**
 * PATCH /api/admin/availability
 * Toggle availability or update times.
 * Body: { id, available?, startTime?, endTime? }
 */
export async function PATCH(request: NextRequest) {
  if (!validateAdminKey(request)) return unauthorizedResponse();

  try {
    const { id, ...data } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400, headers: CORS });
    }

    const updateData: Record<string, unknown> = {};
    if (data.available !== undefined) updateData.available = data.available;
    if (data.startTime !== undefined) updateData.startTime = data.startTime;
    if (data.endTime !== undefined) updateData.endTime = data.endTime;

    const record = await db.staffAvailability.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      availability: {
        id: record.id,
        dayOfWeek: record.dayOfWeek,
        startTime: record.startTime,
        endTime: record.endTime,
        available: record.available,
      },
    }, { headers: CORS });
  } catch (error) {
    console.error('[Admin Availability PATCH]', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500, headers: CORS });
  }
}

/**
 * DELETE /api/admin/availability?id=
 * Remove availability for a day (therapist not working that day).
 */
export async function DELETE(request: NextRequest) {
  if (!validateAdminKey(request)) return unauthorizedResponse();

  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400, headers: CORS });
    }

    await db.staffAvailability.delete({ where: { id } });
    return NextResponse.json({ success: true }, { headers: CORS });
  } catch (error) {
    console.error('[Admin Availability DELETE]', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500, headers: CORS });
  }
}