import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function to12Hour(h24: number, m: number): string {
  const period = h24 >= 12 ? 'PM' : 'AM';
  let h = h24 % 12;
  if (h === 0) h = 12;
  return `${h}:${m.toString().padStart(2, '0')} ${period}`;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request: NextRequest) {
  try {
    const dateStr = request.nextUrl.searchParams.get('date');
    const serviceSlug = request.nextUrl.searchParams.get('service');
    const therapistId = request.nextUrl.searchParams.get('therapist');

    if (!dateStr) {
      return NextResponse.json(
        { success: false, error: 'date parameter is required (YYYY-MM-DD)' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const dateObj = new Date(dateStr + 'T00:00:00');
    if (isNaN(dateObj.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const dayOfWeek = dateObj.getDay();

    // Sunday: closed
    if (dayOfWeek === 0) {
      return NextResponse.json(
        { success: true, date: dateStr, availableSlots: [], bookedSlots: [], closed: true },
        { headers: CORS_HEADERS }
      );
    }

    // Determine operating hours
    let startHour: number;
    let endHour: number;

    if (dayOfWeek === 6) {
      // Saturday: 10AM - 4PM
      startHour = 10;
      endHour = 16;
    } else {
      // Weekdays (Mon-Fri): 9AM - 5PM
      startHour = 9;
      endHour = 17;
    }

    // Get service duration to know how many consecutive slots to block
    let serviceDurationMin = 60;
    if (serviceSlug) {
      const service = await db.service.findUnique({
        where: { slug: serviceSlug, active: true },
        select: { durationMin: true },
      });
      if (service) {
        serviceDurationMin = service.durationMin;
      }
    }

    const slotsNeeded = Math.ceil(serviceDurationMin / 30);

    // Generate all 30-min interval time slots in 24h format, skip 12:30
    const allSlots24: string[] = [];
    for (let h = startHour; h < endHour; h++) {
      for (let m = 0; m < 60; m += 30) {
        if (h === 12 && m === 30) continue;
        allSlots24.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      }
    }

    // Find existing bookings for this date (confirmed or pending)
    const bookings = await db.booking.findMany({
      where:{
        date: dateStr,
        status:{
          in:[
            'confirmed',
            'pending_confirmation'
          ]
        },
        ...(therapistId && {
          therapistId
        })
      },
      select:{
        time:true,
        therapistId:true
      }
    });

    // Build a set of 24h time strings that are blocked
    const blocked24: Set<string> = new Set();
    for (const booking of bookings) {
      if (!booking.time) continue;
      const [bh, bm] = booking.time.split(':').map(Number);
      // Block the booking slot plus subsequent slots for the service duration
      for (let i = 0; i < slotsNeeded; i++) {
        const totalMin = bh * 60 + bm + i * 30;
        const blockH = Math.floor(totalMin / 60);
        const blockM = totalMin % 60;
        blocked24.add(`${blockH.toString().padStart(2, '0')}:${blockM.toString().padStart(2, '0')}`);
      }
    }

    // Split into available and booked, ensuring the booking can fit in remaining time
    const availableSlots: string[] = [];
    const bookedSlots: string[] = [];

    for (let i = 0; i < allSlots24.length; i++) {
      const slot24 = allSlots24[i];
      const slot12 = to12Hour(parseInt(slot24.split(':')[0]), parseInt(slot24.split(':')[1]));

      if (blocked24.has(slot24)) {
        bookedSlots.push(slot12);
      } else {
        // Check if there are enough consecutive free slots remaining for the service
        let canFit = true;
        for (let j = 1; j < slotsNeeded && canFit; j++) {
          const nextIdx = i + j;
          if (nextIdx >= allSlots24.length || blocked24.has(allSlots24[nextIdx])) {
            canFit = false;
          }
        }
        if (canFit) {
          availableSlots.push(slot12);
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
        date: dateStr,
        availableSlots,
        bookedSlots,
        closed: false,
      },
      { headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error('[Availability GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check availability' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}