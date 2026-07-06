import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { validateAdminKey, unauthorizedResponse } from '@/lib/api-auth';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: CORS }); }

/**
 * POST /api/admin/setup
 * Create admin/staff users. Protected by ADMIN_KEY.
 * 
 * Body: { name, email, password, role? }
 */
export async function POST(request: NextRequest) {
  if (!validateAdminKey(request)) return unauthorizedResponse();

  try {
    const { name, email, password, role = 'admin' } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400, headers: CORS }
      );
    }

    const validRoles = ['admin', 'receptionist', 'therapist', 'manager'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, error: `Role must be one of: ${validRoles.join(', ')}` },
        { status: 400, headers: CORS }
      );
    }

    const existing = await db.adminUser.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409, headers: CORS }
      );
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'serenity-admin-salt-2026');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashedPassword = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

    const admin = await db.adminUser.create({
      data: { name, email: email.toLowerCase(), password: hashedPassword, role },
    });

    return NextResponse.json({
      success: true,
      admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
    }, { headers: CORS });
  } catch (error) {
    console.error('[Admin Setup]', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500, headers: CORS });
  }
}

/**
 * GET /api/admin/setup
 * List all admin/staff users.
 */
export async function GET(request: NextRequest) {
  if (!validateAdminKey(request)) return unauthorizedResponse();

  try {
    const admins = await db.adminUser.findMany({
      select: { id: true, name: true, email: true, role: true, active: true, lastLogin: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({
      success: true,
      admins: admins.map(a => ({
        ...a,
        lastLogin: a.lastLogin?.toISOString() || null,
        createdAt: a.createdAt.toISOString(),
      })),
    }, { headers: CORS });
  } catch (error) {
    console.error('[Admin Setup GET]', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500, headers: CORS });
  }
}