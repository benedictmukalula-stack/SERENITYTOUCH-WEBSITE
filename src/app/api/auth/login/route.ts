import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Membership tier configurations
const TIER_CONFIG: Record<string, { monthlyPrice: number; monthlyBookings: number }> = {
  Silver: { monthlyPrice: 800, monthlyBookings: 1 },
  Gold: { monthlyPrice: 1600, monthlyBookings: 2 },
  Platinum: { monthlyPrice: 3200, monthlyBookings: -1 }, // unlimited
};

function getMonthRange() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return { startOfMonth, endOfMonth };
}

async function buildMemberResponse(member: {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: string;
  createdAt: Date;
}) {
  const { startOfMonth, endOfMonth } = getMonthRange();

  const bookingsThisMonth = await db.booking.count({
    where: {
      memberId: member.id,
      createdAt: { gte: startOfMonth, lt: endOfMonth },
    },
  });

  const tierInfo = TIER_CONFIG[member.tier] || TIER_CONFIG.Silver;
  const bookingsUsed = bookingsThisMonth;
  const bookingsRemaining = tierInfo.monthlyBookings === -1 ? -1 : Math.max(0, tierInfo.monthlyBookings - bookingsUsed);

  // Next billing: 1st of next month
  const now = new Date();
  const nextBilling = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString().split('T')[0];

  return {
    id: member.id,
    name: member.name,
    email: member.email,
    phone: member.phone,
    tier: member.tier,
    memberSince: member.createdAt.toISOString().split('T')[0],
    bookingsUsed,
    bookingsRemaining,
    nextBilling,
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, action, name, phone, tier } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Registration
    if (action === 'register') {
      if (!name) {
        return NextResponse.json(
          { success: false, error: 'Name is required for registration' },
          { status: 400, headers: CORS_HEADERS }
        );
      }

      // Check if member already exists
      const existing = await db.member.findUnique({ where: { email: email.toLowerCase() } });
      if (existing) {
        return NextResponse.json(
          { success: false, error: 'An account with this email already exists. Please log in instead.' },
          { status: 409, headers: CORS_HEADERS }
        );
      }

      const memberTier = tier && TIER_CONFIG[tier] ? tier : 'Silver';
      const member = await db.member.create({
        data: {
          name,
          email: email.toLowerCase(),
          phone: phone || '',
          password,
          tier: memberTier,
        },
      });

      const memberResponse = await buildMemberResponse(member);

      return NextResponse.json(
        {
          success: true,
          member: memberResponse,
          message: 'Account created successfully',
        },
        { headers: CORS_HEADERS }
      );
    }

    // Login
    const member = await db.member.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!member || member.password !== password) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password. Please check your credentials or contact support via WhatsApp.' },
        { status: 401, headers: CORS_HEADERS }
      );
    }

    if (!member.active) {
      return NextResponse.json(
        { success: false, error: 'Your account has been deactivated. Please contact us for assistance.' },
        { status: 403, headers: CORS_HEADERS }
      );
    }

    const memberResponse = await buildMemberResponse(member);

    return NextResponse.json(
      {
        success: true,
        member: memberResponse,
        message: 'Login successful',
      },
      { headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error('[Auth Login POST]', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed. Please try again.' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}