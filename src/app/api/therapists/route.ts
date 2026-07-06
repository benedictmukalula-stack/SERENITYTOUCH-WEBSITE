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
    const therapists = await db.therapist.findMany({
      where: { active: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        name: true,
        specialty: true,
        bio: true,
        image: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        therapists,
      },
      { headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error('[Therapists GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch therapists' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}