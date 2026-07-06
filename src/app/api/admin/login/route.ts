import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: CORS }); }

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'serenity-admin-salt-2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * POST /api/admin/login
 * Authenticate admin users (Admin, Receptionist, Therapist, Manager).
 * 
 * Body: { email, password }
 * Returns: { success, admin: { id, name, email, role, token } }
 * 
 * The token is the ADMIN_KEY from .env — the client stores this and
 * sends it as Authorization: Bearer to all /api/admin/* endpoints.
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400, headers: CORS }
      );
    }

    const admin = await db.adminUser.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401, headers: CORS }
      );
    }

    // Verify password
    const inputHash = await hashPassword(password);
    const passwordValid = admin.password === inputHash || admin.password === password;
    if (!passwordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401, headers: CORS }
      );
    }

    if (!admin.active) {
      return NextResponse.json(
        { success: false, error: 'Account deactivated. Contact the system administrator.' },
        { status: 403, headers: CORS }
      );
    }

    // Update last login
    await db.adminUser.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() },
    });

    // The "token" is the ADMIN_KEY — client will use this for subsequent API calls
    const token = process.env.ADMIN_KEY || 'st-admin-2026-secure-key';

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token,
      },
    }, { headers: CORS });
  } catch (error) {
    console.error('[Admin Login]', error);
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500, headers: CORS }
    );
  }
}