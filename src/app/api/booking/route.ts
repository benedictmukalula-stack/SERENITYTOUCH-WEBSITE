import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, service, date, time, message } = body;

    if (!name || !email || !service || !date || !time) {
      return NextResponse.json(
        { success: false, error: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    // Simulate booking processing delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    return NextResponse.json({
      success: true,
      message: 'Booking request submitted successfully! We will confirm your appointment shortly via email.',
      booking: {
        id: `TS-${Date.now().toString(36).toUpperCase()}`,
        name,
        email,
        phone,
        service,
        date,
        time,
        message,
        status: 'confirmed',
        confirmationSent: true,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to process booking' },
      { status: 500 }
    );
  }
}