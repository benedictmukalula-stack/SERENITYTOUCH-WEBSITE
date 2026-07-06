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
 * GET /api/admin/services?all=true&category=
 * List all services with addon count. Admin view (includes inactive).
 */
export async function GET(request: NextRequest) {
  if (!validateAdminKey(request)) return unauthorizedResponse();

  try {
    const includeInactive = request.nextUrl.searchParams.get('all') === 'true';
    const category = request.nextUrl.searchParams.get('category');

    const where: Record<string, unknown> = {};
    if (!includeInactive) where.active = true;
    if (category && category !== 'All') where.category = category;

    const services = await db.service.findMany({
      where,
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
      include: {
        _count: { select: { addons: true, bookings: true } },
        addons: { select: { id: true, name: true, price: true, active: true }, orderBy: { name: 'asc' } },
      },
    });

    // Also return distinct categories
    const categories = await db.service.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });

    return NextResponse.json({
      success: true,
      services: services.map(s => ({
        id: s.id,
        slug: s.slug,
        name: s.name,
        category: s.category,
        price: s.price,
        duration: s.duration,
        durationMin: s.durationMin,
        description: s.description,
        benefits: s.benefits,
        image: s.image,
        active: s.active,
        sortOrder: s.sortOrder,
        addonCount: s._count.addons,
        bookingCount: s._count.bookings,
        addons: s.addons,
        createdAt: s.createdAt.toISOString(),
      })),
      categories: categories.map(c => c.category),
    }, { headers: CORS });
  } catch (error) {
    console.error('[Admin Services GET]', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500, headers: CORS });
  }
}

/**
 * POST /api/admin/services
 * Create a new service.
 * Body: { name, slug, category, price, duration, durationMin, description?, benefits?, image?, sortOrder? }
 */
export async function POST(request: NextRequest) {
  if (!validateAdminKey(request)) return unauthorizedResponse();

  try {
    const { name, slug, category, price, duration, durationMin, description, benefits, image, sortOrder } = await request.json();

    if (!name || !slug || !category || price === undefined || !duration || !durationMin) {
      return NextResponse.json(
        { success: false, error: 'name, slug, category, price, duration, durationMin are required' },
        { status: 400, headers: CORS }
      );
    }

    // Check slug uniqueness
    const existing = await db.service.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A service with this slug already exists' },
        { status: 409, headers: CORS }
      );
    }

    const service = await db.service.create({
      data: {
        name, slug, category, price, duration, durationMin,
        description: description || '',
        benefits: benefits || '',
        image: image || '',
        sortOrder: sortOrder || 0,
      },
    });

    return NextResponse.json({
      success: true,
      service: { id: service.id, name: service.name, slug: service.slug },
    }, { headers: CORS });
  } catch (error) {
    console.error('[Admin Services POST]', error);
    return NextResponse.json({ success: false, error: 'Failed to create service' }, { status: 500, headers: CORS });
  }
}

/**
 * PATCH /api/admin/services
 * Update a service.
 * Body: { id, name?, slug?, category?, price?, duration?, durationMin?, description?, benefits?, image?, active?, sortOrder? }
 */
export async function PATCH(request: NextRequest) {
  if (!validateAdminKey(request)) return unauthorizedResponse();

  try {
    const { id, slug, ...data } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400, headers: CORS });
    }

    // If changing slug, check uniqueness
    if (slug) {
      const existing = await db.service.findFirst({ where: { slug, NOT: { id } } });
      if (existing) {
        return NextResponse.json({ success: false, error: 'Slug already in use by another service' }, { status: 409, headers: CORS });
      }
      data.slug = slug;
    }

    const allowedFields = ['name', 'slug', 'category', 'price', 'duration', 'durationMin', 'description', 'benefits', 'image', 'active', 'sortOrder'];
    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (data[field] !== undefined) updateData[field] = data[field];
    }

    const service = await db.service.update({ where: { id }, data: updateData });

    return NextResponse.json({
      success: true,
      service: { id: service.id, name: service.name, slug: service.slug, active: service.active },
    }, { headers: CORS });
  } catch (error) {
    console.error('[Admin Services PATCH]', error);
    return NextResponse.json({ success: false, error: 'Failed to update service' }, { status: 500, headers: CORS });
  }
}

/**
 * DELETE /api/admin/services?id=
 * Soft-delete a service (set active=false).
 */
export async function DELETE(request: NextRequest) {
  if (!validateAdminKey(request)) return unauthorizedResponse();

  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400, headers: CORS });
    }

    await db.service.update({ where: { id }, data: { active: false } });
    return NextResponse.json({ success: true }, { headers: CORS });
  } catch (error) {
    console.error('[Admin Services DELETE]', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500, headers: CORS });
  }
}