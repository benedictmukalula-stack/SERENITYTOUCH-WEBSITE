import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get('slug');

    if (slug) {
      const service = await db.service.findUnique({
        where: { slug, active: true },
        include: {
          addons: {
            where: { active: true },
            select: { id: true, name: true, price: true, description: true, icon: true },
          },
        },
      });

      if (!service) {
        return NextResponse.json(
          { success: false, error: 'Service not found' },
          { status: 404, headers: CORS_HEADERS }
        );
      }

      return NextResponse.json(
        {
          success: true,
          service: {
            id: service.id,
            slug: service.slug,
            name: service.name,
            category: service.category,
            price: service.price,
            duration: service.duration,
            durationMin: service.durationMin,
            description: service.description,
            benefits: service.benefits,
            image: service.image,
            addons: service.addons,
          },
        },
        { headers: CORS_HEADERS }
      );
    }

    const services = await db.service.findMany({
      where: { active: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        addons: {
          where: { active: true },
          select: { id: true, name: true, price: true, description: true, icon: true },
          orderBy: { name: 'asc' },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        services: services.map((s) => ({
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
          addons: s.addons,
        })),
      },
      { headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error('[Services GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch services' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}