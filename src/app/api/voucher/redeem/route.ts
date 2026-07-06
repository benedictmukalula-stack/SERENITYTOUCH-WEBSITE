import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: CORS }); }

/**
 * POST /api/voucher/redeem
 * Redeem a voucher code against a booking or standalone.
 * Body: { code, redeemedByName, redeemedByPhone?, bookingId?, discountAmount? }
 */
export async function POST(request: NextRequest) {
  try {
    const { code, redeemedByName, redeemedByPhone, bookingId, discountAmount } = await request.json();

    if (!code || !redeemedByName) {
      return NextResponse.json(
        { success: false, error: 'Voucher code and redeemer name are required' },
        { status: 400, headers: CORS }
      );
    }

    // Find the voucher
    const voucher = await db.voucherPurchase.findUnique({
      where: { code: code.toUpperCase() },
      include: { _count: { select: { redemptions: true } } },
    });

    if (!voucher) {
      return NextResponse.json(
        { success: false, error: 'Invalid voucher code. Please check and try again.' },
        { status: 404, headers: CORS }
      );
    }

    if (voucher.status !== 'active') {
      return NextResponse.json(
        { success: false, error: `This voucher has already been ${voucher.status}.` },
        { status: 400, headers: CORS }
      );
    }

    // Single-use: mark as redeemed
    const discount = discountAmount || voucher.amount;

    // Create redemption record
    const redemption = await db.voucherRedemption.create({
      data: {
        voucherId: voucher.id,
        bookingId: bookingId || null,
        redeemedByName,
        redeemedByPhone: redeemedByPhone || '',
        discountAmount: discount,
      },
    });

    // Mark voucher as redeemed
    await db.voucherPurchase.update({
      where: { id: voucher.id },
      data: { status: 'redeemed' },
    });

    return NextResponse.json({
      success: true,
      redemption: {
        id: redemption.id,
        code: voucher.code,
        amount: discount,
        redeemedByName,
        message: `Voucher ${voucher.code} redeemed successfully! K${discount.toLocaleString()} discount applied.`,
      },
    }, { headers: CORS });
  } catch (error) {
    console.error('[Voucher Redeem]', error);
    return NextResponse.json({ success: false, error: 'Failed to redeem voucher' }, { status: 500, headers: CORS });
  }
}

/**
 * GET /api/voucher/redeem?code=STS-XXXXXX
 * Look up a voucher code (check validity without redeeming).
 */
export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get('code');
    if (!code) {
      return NextResponse.json({ success: false, error: 'code parameter required' }, { status: 400, headers: CORS });
    }

    const voucher = await db.voucherPurchase.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!voucher) {
      return NextResponse.json({ success: false, error: 'Voucher not found' }, { status: 404, headers: CORS });
    }

    return NextResponse.json({
      success: true,
      voucher: {
        code: voucher.code,
        amount: voucher.amount,
        status: voucher.status,
        recipientName: voucher.recipientName,
        createdAt: voucher.createdAt.toISOString(),
        valid: voucher.status === 'active',
      },
    }, { headers: CORS });
  } catch (error) {
    console.error('[Voucher Lookup]', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500, headers: CORS });
  }
}