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
 * GET /api/admin/therapists
 * List all therapists (active and inactive) for admin management.
 */
export async function GET(request: NextRequest) {
  if (!validateAdminKey(request)) return unauthorizedResponse();

  try {
    const includeInactive = request.nextUrl.searchParams.get('all') === 'true';
    const therapists = await db.therapist.findMany({
      where: includeInactive ? {} : { active: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { bookings: true } },
      },
    });

    return NextResponse.json({
      success: true,
      therapists: therapists.map(t => ({
        id: t.id,
        name: t.name,
        specialty: t.specialty,
        bio: t.bio,
        image: t.image,
        active: t.active,
        sortOrder: t.sortOrder,
        totalBookings: t._count.bookings,
        createdAt: t.createdAt.toISOString(),
      })),
    }, { headers: CORS });
  } catch (error) {
    console.error('[Admin Therapists]', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500, headers: CORS });
  }
}

/**
 * POST /api/admin/therapists
 * Add a new therapist.
 * 
 * Body: { name, specialty, bio?, image?, sortOrder? }
 */
export async function POST(request: NextRequest) {
  if (!validateAdminKey(request)) return unauthorizedResponse();

  try {
    const { name, specialty, bio, image, sortOrder } = await request.json();

    if (!name || !specialty) {
      return NextResponse.json(
        { success: false, error: 'Name and specialty are required' },
        { status: 400, headers: CORS }
      );
    }

    const therapist = await db.therapist.create({
      data: {
        name,
        specialty,
        bio: bio || '',
        image: image || '',
        sortOrder: sortOrder || 0,
      },
    });

    return NextResponse.json({
      success: true,
      therapist: { id: therapist.id, name: therapist.name, specialty: therapist.specialty },
    }, { headers: CORS });
  } catch (error) {
    console.error('[Admin Therapists POST]', error);
    return NextResponse.json({ success: false, error: 'Failed to create therapist' }, { status: 500, headers: CORS });
  }
}

/**
 * PATCH /api/admin/therapists
 * Update therapist (toggle active, change details).
 * 
 * Body: { id, name?, specialty?, bio?, image?, active?, sortOrder? }
 */
export async function PATCH(request: NextRequest) {
  if (!validateAdminKey(request)) return unauthorizedResponse();

  try {
    const { id, ...data } = await request.json();

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400, headers: CORS });
    }

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.specialty !== undefined) updateData.specialty = data.specialty;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.active !== undefined) updateData.active = data.active;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

    const therapist = await db.therapist.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      therapist: { id: therapist.id, name: therapist.name, active: therapist.active },
    }, { headers: CORS });
  } catch (error) {
    console.error('[Admin Therapists PATCH]', error);
    return NextResponse.json({ success: false, error: 'Failed to update therapist' }, { status: 500, headers: CORS });
  }
}