import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { validateAdminKey, unauthorizedResponse } from '@/lib/api-auth';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: CORS }); }

/**
 * GET /api/admin/vouchers?status=&page=&limit=
 * List all vouchers with redemption history. Admin view.
 */
export async function GET(request: NextRequest) {
  if (!validateAdminKey(request)) return unauthorizedResponse();

  try {
    const status = request.nextUrl.searchParams.get('status') || undefined;
    const search = request.nextUrl.searchParams.get('search') || undefined;
    const page = Math.max(1, parseInt(request.nextUrl.searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(request.nextUrl.searchParams.get('limit') || '20')));

    const where: Record<string, unknown> = {};
    if (status && status !== 'All') where.status = status;
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' as const } },
        { senderName: { contains: search, mode: 'insensitive' as const } },
        { recipientName: { contains: search, mode: 'insensitive' as const } },
        { senderEmail: { contains: search, mode: 'insensitive' as const } },
        { recipientEmail: { contains: search, mode: 'insensitive' as const } },
      ];
    }

    const [vouchers, total] = await Promise.all([
      db.voucherPurchase.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          _count: { select: { redemptions: true } },
        },
      }),
      db.voucherPurchase.count({ where }),
    ]);

    // KPIs
    const [activeCount, redeemedCount, totalValue, redeemedValue] = await Promise.all([
      db.voucherPurchase.count({ where: { status: 'active' } }),
      db.voucherPurchase.count({ where: { status: 'redeemed' } }),
      db.voucherPurchase.aggregate({ _sum: { amount: true }, where: {} }),
      db.voucherPurchase.aggregate({ _sum: { amount: true }, where: { status: 'redeemed' } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        vouchers: vouchers.map(v => ({
          id: v.id,
          code: v.code,
          amount: v.amount,
          senderName: v.senderName,
          senderEmail: v.senderEmail,
          recipientName: v.recipientName,
          recipientEmail: v.recipientEmail,
          message: v.message,
          status: v.status,
          redemptionCount: v._count.redemptions,
          createdAt: v.createdAt.toISOString(),
        })),
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        kpis: {
          totalVouchers: total,
          activeVouchers: activeCount,
          redeemedVouchers: redeemedCount,
          totalValue: totalValue._sum.amount || 0,
          redeemedValue: redeemedValue._sum.amount || 0,
          outstandingValue: (totalValue._sum.amount || 0) - (redeemedValue._sum.amount || 0),
        },
      },
    }, { headers: CORS });
  } catch (error) {
    console.error('[Admin Vouchers GET]', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500, headers: CORS });
  }
}

/**
 * POST /api/admin/vouchers
 * Create a voucher manually (admin-generated).
 * Body: { amount, senderName, senderEmail, recipientName, recipientEmail?, message? }
 */
export async function POST(request: NextRequest) {
  if (!validateAdminKey(request)) return unauthorizedResponse();

  try {
    const { amount, senderName, senderEmail, recipientName, recipientEmail, message } = await request.json();

    if (!amount || !recipientName) {
      return NextResponse.json(
        { success: false, error: 'amount and recipientName are required' },
        { status: 400, headers: CORS }
      );
    }

    const code = `STS-${Array.from({ length: 6 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 30)]).join('')}`;

    const voucher = await db.voucherPurchase.create({
      data: {
        code,
        amount,
        senderName: senderName || 'Serenity Touch',
        senderEmail: senderEmail || 'info@serenitytouch.co.za',
        recipientName,
        recipientEmail: recipientEmail || '',
        message: message || '',
        status: 'active',
      },
    });

    return NextResponse.json({
      success: true,
      voucher: { id: voucher.id, code: voucher.code, amount: voucher.amount, recipientName: voucher.recipientName },
    }, { headers: CORS });
  } catch (error) {
    console.error('[Admin Vouchers POST]', error);
    return NextResponse.json({ success: false, error: 'Failed to create voucher' }, { status: 500, headers: CORS });
  }
}

/**
 * PATCH /api/admin/vouchers
 * Update voucher status (void, extend, etc.)
 * Body: { id, status?, recipientEmail?, message? }
 */
export async function PATCH(request: NextRequest) {
  if (!validateAdminKey(request)) return unauthorizedResponse();

  try {
    const { id, ...data } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400, headers: CORS });
    }

    const updateData: Record<string, unknown> = {};
    if (data.status !== undefined) updateData.status = data.status;
    if (data.recipientEmail !== undefined) updateData.recipientEmail = data.recipientEmail;
    if (data.message !== undefined) updateData.message = data.message;

    const voucher = await db.voucherPurchase.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      voucher: { id: voucher.id, code: voucher.code, status: voucher.status },
    }, { headers: CORS });
  } catch (error) {
    console.error('[Admin Vouchers PATCH]', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500, headers: CORS });
  }
}