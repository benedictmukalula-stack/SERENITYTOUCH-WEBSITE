import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, contactFormEmail } from '@/lib/email';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Send enquiry TO info@ (the general inbox), CC taonga@ (founder)
    // Sent FROM info@ account
    const result = await sendEmail({
      to: 'info@serenitytouch.co.za',
      cc: 'taonga@serenitytouch.co.za',
      subject: `[Website Enquiry] ${subject || 'General enquiry'} — from ${name}`,
      html: contactFormEmail({ name, email, phone: phone || '', subject: subject || 'General enquiry', message }),
      from: 'info',
      replyTo: email,
    });

    if (!result.success) {
      console.error('[Contact] Email send failed:', result.error);
      // Don't expose error details to user
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your enquiry! We will get back to you soon.',
      },
      { headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error('[Contact POST]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send enquiry. Please try again or contact us via WhatsApp.' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}