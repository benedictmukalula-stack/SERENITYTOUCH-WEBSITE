import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendWhatsApp, buildVoucherWA } from '@/lib/whatsapp';
import { sendEmail } from '@/lib/email';

const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: CORS }); }

/**
 * POST /api/voucher/purchase
 * Purchase a gift voucher. Delivers via WhatsApp (to recipient) + email (to sender).
 * 
 * Body: { senderName, senderEmail, senderPhone?, recipientName, recipientPhone?, recipientEmail?, amount, message? }
 */
export async function POST(request: NextRequest) {
  try {
    const { senderName, senderEmail, senderPhone, recipientName, recipientPhone, recipientEmail, amount, message } = await request.json();

    if (!senderName || !senderEmail || !recipientName || !amount) {
      return NextResponse.json({ success: false, error: 'Sender name, sender email, recipient name, and amount are required' }, { status: 400, headers: CORS });
    }

    // Validate amount
    const validAmounts = [500, 1000, 1500, 2000, 2500, 3000, 4000, 5000];
    if (!validAmounts.includes(amount)) {
      return NextResponse.json({ success: false, error: `Amount must be one of: K${validAmounts.join(', K')}` }, { status: 400, headers: CORS });
    }

    // Generate unique voucher code
    const code = `STS-${Array.from({ length: 6 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 30)]).join('')}`;

    // Save to DB
    await db.voucherPurchase.create({
      data: { code, amount, senderName, senderEmail, recipientName, recipientEmail: recipientEmail || '', message: message || '', status: 'active' },
    });

    // WhatsApp to recipient (if phone provided)
    if (recipientPhone) {
      await sendWhatsApp(recipientPhone, buildVoucherWA({
        recipientName, code, amount, senderName, message,
      })).catch(() => {});
    }

    // Email receipt to sender
    await sendEmail({
      to: senderEmail,
      subject: `Gift Voucher Purchased — K${amount.toLocaleString()} | Serenity Touch Spa`,
      html: `
        <div style="max-width:560px;margin:0 auto;font-family:'Segoe UI',sans-serif;color:#333;">
          <div style="background:linear-gradient(135deg,#0a0508,#1a0f14);padding:32px;border-radius:12px 12px 0 0;text-align:center;">
            <h1 style="color:#D4AF37;margin:0;font-size:24px;">Serenity Touch Spa</h1>
            <p style="color:rgba(212,175,55,0.6);margin:8px 0 0;font-size:13px;">Gift Voucher</p>
          </div>
          <div style="background:#fff;padding:32px;border-radius:0 0 12px 12px;border:1px solid #eee;border-top:none;text-align:center;">
            <p style="font-size:15px;margin:0 0 20px;">Your gift voucher for <strong>${recipientName}</strong> has been created!</p>
            <div style="background:#f9f9f9;border:2px dashed #D4AF37;border-radius:12px;padding:24px;margin:0 0 20px;">
              <p style="margin:0 0 8px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Voucher Code</p>
              <p style="margin:0;font-size:28px;font-weight:700;color:#D4AF37;font-family:monospace;letter-spacing:3px;">${code}</p>
              <p style="margin:12px 0 0;font-size:20px;font-weight:600;color:#E91E63;">K${amount.toLocaleString()}</p>
            </div>
            <p style="font-size:13px;color:#888;">Valid for 12 months. Redeem at serenitytouch.co.za or at the spa.</p>
            ${message ? `<p style="font-size:14px;font-style:italic;margin-top:16px;">"${message}"</p>` : ''}
          </div>
          <div style="text-align:center;padding:16px;font-size:12px;color:#999;">serenitytouch.co.za | +260 572 782 539</div>
        </div>`,
      from: 'info',
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      code,
      amount,
      message: `Voucher ${code} created for ${recipientName}! K${amount.toLocaleString()}.`,
    }, { headers: CORS });
  } catch (error) {
    console.error('[Voucher Purchase]', error);
    return NextResponse.json({ error: 'Failed to create voucher' }, { status: 500, headers: CORS });
  }
}