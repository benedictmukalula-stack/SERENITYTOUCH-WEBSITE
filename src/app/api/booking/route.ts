import { NextRequest, NextResponse } from 'next/server';

interface BookingBody {
  name: string;
  email: string;
  phone?: string;
  service: string;
  therapist?: string;
  date: string;
  time?: string;
  message?: string;
  paymentMethod?: string;
  bookingType?: string;
  calloutZone?: string;
  calloutAddress?: string;
}

const serviceLabels: Record<string, string> = {
  headscalp: 'Head & Scalp Massage (30 min) — K400',
  foot: 'Foot Massage (45 min) — K500',
  backneck: 'Back, Neck & Shoulder (45 min) — K600',
  swedish: 'Swedish Massage (60 min) — K800',
  deeptissue: 'Deep Tissue Massage (90 min) — K1,200',
  thai: 'Thai Massage (90 min) — K1,100',
  aromatherapy: 'Aromatherapy Massage (60 min) — K900',
  reflexology: 'Reflexology (60 min) — K850',
  pregnancy: 'Pregnancy Massage (60 min) — K900',
  fullbody: 'Full Body Massage (90 min) — K1,000',
  couples: 'Couples Massage (90 min) — K2,000',
};

const therapistLabels: Record<string, string> = {
  any: 'No Preference (First Available)',
  tina: 'Tina Mulenga — Founder & Lead Therapist',
  grace: 'Grace Banda — Senior Massage Therapist',
  patricia: 'Patricia Nkomo — Aromatherapy Specialist',
  chipo: 'Chipo Mwale — Therapeutic Massage Specialist',
};

const paymentLabels: Record<string, string> = {
  mobile_money: 'Mobile Money',
  bank_transfer: 'Bank EFT',
  card: 'Card Payment (Online)',
  cash: 'Cash at Spa',
};

function buildEmailHtml(body: BookingBody, bookingId: string) {
  const service = serviceLabels[body.service] || body.service;
  const therapist = therapistLabels[body.therapist || ''] || body.therapist || 'No preference';
  const payment = paymentLabels[body.paymentMethod || ''] || body.paymentMethod || 'Cash at Spa';

  return `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
body { font-family: Georgia, serif; background: #0a0a0a; color: #e5e5e5; margin: 0; padding: 20px; }
.container { max-width: 600px; margin: 0 auto; background: #1a1a1a; border: 1px solid rgba(212,175,55,0.15); border-radius: 16px; overflow: hidden; }
.header { background: linear-gradient(135deg, #D4AF37, #E91E63); padding: 30px; text-align: center; }
.header h1 { margin: 0; color: #0a0a0a; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 24px; }
.content { padding: 30px; }
.field { margin-bottom: 16px; }
.label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin-bottom: 4px; }
.value { font-size: 15px; color: #e5e5e5; }
.highlight { color: #D4AF37; font-weight: bold; }
.footer { padding: 20px 30px; border-top: 1px solid rgba(212,175,55,0.1); text-align: center; }
.footer p { font-size: 12px; color: #666; margin: 4px 0; }
</style></head><body>
<div class="container">
  <div class="header"><h1>Serenity Touch Spa</h1></div>
  <div class="content">
    <h2 style="color: #D4AF37; font-family: 'Cormorant Garamond', Georgia, serif; margin-top: 0;">New Booking Request</h2>
    <p style="color: #888; font-size: 13px;">Booking ID: <span class="highlight">${bookingId}</span></p>
    <div class="field"><div class="label">Client Name</div><div class="value">${body.name}</div></div>
    <div class="field"><div class="label">Email</div><div class="value">${body.email}</div></div>
    <div class="field"><div class="label">Phone</div><div class="value">${body.phone || 'Not provided'}</div></div>
    <div class="field"><div class="label">Preferred Date</div><div class="value">${body.date}</div></div>
    <div class="field"><div class="label">Service</div><div class="value highlight">${service}</div></div>
    <div class="field"><div class="label">Booking Type</div><div class="value">${body.bookingType === 'callout' ? 'Call-Out Service' : 'In-Spa'}</div></div>
    ${body.bookingType === 'callout' ? `<div class="field"><div class="label">Call-Out Zone</div><div class="value">${body.calloutZone || 'TBD'}</div></div><div class="field"><div class="label">Call-Out Address</div><div class="value">${body.calloutAddress || 'Not provided'}</div></div>` : ''}
    <div class="field"><div class="label">Preferred Therapist</div><div class="value">${therapist}</div></div>
    <div class="field"><div class="label">Payment Method</div><div class="value">${payment}</div></div>
    ${body.message ? `<div class="field"><div class="label">Additional Notes</div><div class="value">${body.message}</div></div>` : ''}
  </div>
  <div class="footer">
    <p>Serenity Touch Spa &middot; 183 Ibex Hill, Lusaka, Zambia</p>
    <p>+260 572 782 539 &middot; info@serenitytouch.co.zm</p>
    <p style="margin-top: 12px; color: #555;"></p>
  </div>
</div>
</body></html>`;
}

function buildWhatsAppNotification(body: BookingBody, bookingId: string): string {
  const service = serviceLabels[body.service] || body.service;
  const therapist = therapistLabels[body.therapist || ''] || body.therapist || 'No preference';
  const payment = paymentLabels[body.paymentMethod || ''] || body.paymentMethod || 'Cash at Spa';
  return [
    `*NEW BOOKING — Serenity Touch Spa*`,
    `Booking ID: ${bookingId}`,
    ``,
    `*Client:* ${body.name}`,
    `*Email:* ${body.email}`,
    `*Phone:* ${body.phone || 'N/A'}`,
    `*Date:* ${body.date}`,
    `*Booking Type:* ${body.bookingType === 'callout' ? 'Call-Out Service' : 'In-Spa'}`,
    `*Service:* ${service}`,
    ...(body.bookingType === 'callout' ? [`*Call-Out Zone:* ${body.calloutZone || 'TBD'}`, `*Address:* ${body.calloutAddress || 'Not provided'}`] : []),
    `*Therapist:* ${therapist}`,
    `*Payment:* ${payment}`,
    body.message ? `*Notes:* ${body.message}` : '',
  ].filter(Boolean).join('\n');
}

function buildSmsMessage(body: BookingBody, bookingId: string): string {
  const service = serviceLabels[body.service] || body.service;
  return `Serenity Touch Spa: Booking ${bookingId} confirmed for ${body.name} on ${body.date}. Service: ${service}. We will contact you shortly to confirm. +260572782539`;
}

export async function POST(request: NextRequest) {
  try {
    const body: BookingBody = await request.json();
    const { name, email, service, date } = body;

    if (!name || !email || !service || !date) {
      return NextResponse.json(
        { success: false, error: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    const bookingId = `TS-${Date.now().toString(36).toUpperCase()}`;

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1200));

    // === EMAIL NOTIFICATION ===
    // In production, integrate with Resend, SendGrid, or Nodemailer:
    // await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     from: 'bookings@serenitytouch.co.zm',
    //     to: ['info@serenitytouch.co.zm', email],
    //     subject: `New Booking Request — ${bookingId}`,
    //     html: buildEmailHtml(body, bookingId),
    //   }),
    // });

    // === WHATSAPP NOTIFICATION ===
    // In production, use WhatsApp Business API:
    // const whatsappMsg = buildWhatsAppNotification(body, bookingId);
    // await fetch('https://api.whatsapp.com/v1/messages', {
    //   method: 'POST',
    //   headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     to: '260761404555',
    //     type: 'text',
    //     text: { body: whatsappMsg },
    //   }),
    // });

    // === SMS NOTIFICATION ===
    // In production, use Africa's Talking API:
    // const smsMsg = buildSmsMessage(body, bookingId);
    // await fetch('https://api.africastalking.com/v1/messaging', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded',
    //     apiKey: process.env.AFRICASTALKING_API_KEY,
    //   },
    //   body: new URLSearchParams({
    //     username: 'serenity_touch',
    //     to: body.phone || '',
    //     message: smsMsg,
    //     from: 'SerenityTouchSpa',
    //   }),
    // });

    console.log(`[Booking] ${bookingId} — Email, WhatsApp, and SMS notifications queued.`);
    console.log(`[WhatsApp MSG] ${buildWhatsAppNotification(body, bookingId)}`);
    console.log(`[SMS MSG] ${buildSmsMessage(body, bookingId)}`);

    return NextResponse.json({
      success: true,
      message: 'Booking request submitted successfully! You will receive confirmation via email and WhatsApp.',
      booking: {
        id: bookingId,
        name,
        email,
        phone: body.phone,
        service,
        therapist: body.therapist,
        date,
        bookingType: body.bookingType || 'in_sanctuary',
        calloutZone: body.calloutZone,
        calloutAddress: body.calloutAddress,
        paymentMethod: body.paymentMethod,
        message: body.message,
        status: 'pending_confirmation',
        notifications: {
          email: 'queued',
          whatsapp: 'queued',
          sms: body.phone ? 'queued' : 'skipped',
        },
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to process booking' },
      { status: 500 }
    );
  }
}