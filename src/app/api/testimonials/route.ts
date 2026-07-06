import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  try {
    const testimonials = await db.testimonial.findMany({
      where: { active: true },
      orderBy: [
        { featured: 'desc' },
        { sortOrder: 'asc' },
      ],
      select: {
        id: true,
        name: true,
        rating: true,
        content: true,
        image: true,
        service: true,
        featured: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        testimonials,
      },
      { headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error('[Testimonials GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch testimonials' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}