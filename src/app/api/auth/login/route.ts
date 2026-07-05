import { NextRequest, NextResponse } from 'next/server';

const demoMembers = {
  'silver@tinassanctuary.zm': {
    password: 'silver2026',
    member: {
      id: 'MEM-001',
      name: 'Chipo Mwale',
      email: 'silver@tinassanctuary.zm',
      phone: '+260 779 721 772',
      tier: 'Silver' as const,
      memberSince: '2025-03-15',
      bookingsUsed: 4,
      bookingsRemaining: 1,
      nextBilling: '2026-08-15',
    },
  },
  'gold@tinassanctuary.zm': {
    password: 'gold2026',
    member: {
      id: 'MEM-002',
      name: 'Bwalya Nkomo',
      email: 'gold@tinassanctuary.zm',
      phone: '+260 977 555 123',
      tier: 'Gold' as const,
      memberSince: '2024-11-01',
      bookingsUsed: 18,
      bookingsRemaining: 2,
      nextBilling: '2026-08-01',
    },
  },
  'platinum@tinassanctuary.zm': {
    password: 'platinum2026',
    member: {
      id: 'MEM-003',
      name: 'Grace Banda',
      email: 'platinum@tinassanctuary.zm',
      phone: '+260 955 888 456',
      tier: 'Platinum' as const,
      memberSince: '2024-06-01',
      bookingsUsed: 52,
      bookingsRemaining: -1,
      nextBilling: '2026-08-01',
    },
  },
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Demo auth — in production, use next-auth + database
    const account = demoMembers[email as keyof typeof demoMembers];
    if (!account || account.password !== password) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password. Please check your credentials or contact support via WhatsApp.' },
        { status: 401 }
      );
    }

    // In production, create a JWT session here
    return NextResponse.json({
      success: true,
      member: account.member,
      message: 'Login successful',
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}