import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendEmail, paymentNotificationEmail } from '@/lib/email';
import { sendBookingNotifications } from '@/lib/whatsapp';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Callout zone fees
const CALLOUT_FEES: Record<string, number> = {
  zone_1: 200,
  zone_2: 350,
  zone_3: 500,
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

// POST: Create a new booking

async function checkSlotConflict(
  therapistId:string,
  date:string,
  time:string
){

  const existing = await db.bookingSlot.findFirst({
    where:{
      therapistId,
      startTime:{
        lt:new Date(`${date}T23:59:59`)
      },
      endTime:{
        gt:new Date(`${date}T00:00:00`)
      }
    }
  });

  return !!existing;
}




async function autoAssignTherapist(){

 const therapist = await db.therapist.findFirst({
   where:{
    active:true
   },
   orderBy:{
    sortOrder:"asc"
   }
 });

 return therapist?.id || null;
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      service,
      therapist,
      date,
      time,
      bookingType,
      calloutZone,
      calloutAddress,
      addons,
      paymentMethod,
      notes,
    } = body;

    // Validate required fields
    if (!name || !email || !service || !date) {
      return NextResponse.json(
        { success: false, error: 'Name, email, service, and date are required' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Look up service by slug
    const serviceRecord = await db.service.findUnique({
      where: { slug: service },
      include: {
        addons: {
          where: { active: true },
          select: { id: true, name: true, price: true },
        },
      },
    });

    if (!serviceRecord) {
      return NextResponse.json(
        { success: false, error: `Service "${service}" not found` },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    // Calculate total
    let totalAmount = serviceRecord.price;

    // Add addon prices
    let addonsData: Array<{ id: string; name: string; price: number }> = [];
    if (Array.isArray(addons) && addons.length > 0) {
      for (const addonId of addons) {
        const addon = serviceRecord.addons.find((a) => a.id === addonId);
        if (addon) {
          totalAmount += addon.price;
          addonsData.push({ id: addon.id, name: addon.name, price: addon.price });
        }
      }
    }

    // Add callout fee if applicable
    const isCallout = bookingType === 'callout';
    if (isCallout && calloutZone) {
      const zoneKey = `zone_${calloutZone.replace('zone_', '').replace('Zone ', '').toLowerCase()}`;
      const fee = CALLOUT_FEES[zoneKey] || CALLOUT_FEES[`zone_${calloutZone}`] || 0;
      totalAmount += fee;
    }



    // Resolve therapist
    let therapistName = 'First Available';
    let therapistId: string | undefined;

    // Manual therapist selection
    if (therapist && therapist !== 'any') {
      const therapistRecord = await db.therapist.findFirst({
        where: { id: therapist, active: true },
      });

      if (therapistRecord) {
        therapistId = therapistRecord.id;
        therapistName = therapistRecord.name;
      }
    }

        // Convert time from 12h to 24h format if needed
    let time24 = time || '';
    if (time) {
      const tm = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (tm) {
        let h = parseInt(tm[1]);
        const m = parseInt(tm[2]);
        const p = tm[3].toUpperCase();
        if (p === 'PM' && h !== 12) h += 12;
        if (p === 'AM' && h === 12) h = 0;
        time24 = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      }
    }

    // Automatic therapist allocation
    if (!therapistId) {

      const therapistRules: Record<string,string[]> = {
        "head-scalp": ["Taonga Phiri"],
        "foot-massage": ["Grace Phiri"],
        "back-neck-shoulder": ["Taonga Phiri"],
        "swedish": ["Taonga Phiri"],
        "deep-tissue": ["Taonga Phiri"],
        "aromatherapy": ["Taonga Phiri","Grace Phiri"],
        "pregnancy": ["Grace Phiri"],
        "reflexology": ["Grace Phiri","Patricia Banda"],
        "thai": ["Patricia Banda"],
        "full-body": ["Chipo Mulenga"],
        "couples": ["Chipo Mulenga"],
        "four-hands-massage": ["Chipo Mulenga"],
        "body-scrub": ["Grace Phiri"]
      };

      const preferred =
        therapistRules[serviceRecord.slug] || [];

      
      let candidates =
        await db.therapist.findMany({
          where:{
            active:true,
            name:{
              in: preferred
            }
          }
        });


      console.table(
        candidates.map(c=>({
          id:c.id,
          name:c.name
        }))
      );

      console.log("===== AUTO ALLOCATION =====");
console.log("Preferred:", preferred);
console.log("Candidates before fallback:", candidates.length);

// fallback all therapists
      if(candidates.length===0){
console.log("Fallback triggered");
        candidates =
        await db.therapist.findMany({
          where:{active:true}
        });
      }

console.log("CANDIDATE LIST");
console.table(candidates.map(c=>({id:c.id,name:c.name})));// check availability
      for(const candidate of candidates){
console.log("CHECKING:",candidate.name,candidate.id);


        const existing =
        await db.booking.findFirst({
          where:{
            therapistId:candidate.id,
            date,
            time:time24,
            status:{
              not:"cancelled"
            }
          }
        });


        console.log("[CHECK]",{
          therapist:candidate.name,
          therapistId:candidate.id,
          time24,
          existing:!!existing
        });

        console.log("Existing:", !!existing);

        if (!existing) {
          console.log("SELECTED:", candidate.name);
          therapistId=candidate.id;
          therapistName=candidate.name;
          break;
        }

      }

    }

    console.log("[SELECTED]",{
      therapistId,
      therapistName
    });

    // Generate unique booking ID
    const bookingId = `ST-${Array.from({ length: 6 }, () =>
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]
    ).join('')}`;

    // Create booking in database
    const booking = await db.booking.create({
      data: {
        bookingId,
        name,
        email,
        phone: phone || '',
        serviceName: serviceRecord.name,
        serviceId: serviceRecord.id,
        therapistId,
        therapistName,
        date,
        time: time24,
        bookingType: bookingType || 'in_spa',
        calloutZone: calloutZone || '',
        calloutAddress: calloutAddress || '',
        addons: JSON.stringify(addonsData),
        totalAmount,
        paymentMethod: paymentMethod || 'cash',
        paymentStatus: 'pending',
        notes: notes || '',
        status: 'confirmed',
      },
    });


    // Lock therapist appointment slot

    if (booking.therapistId && time24) {

      const start = new Date(`${date}T${time24}:00`);
      const end = new Date(start.getTime() + 60 * 60 * 1000);

      console.log("[SLOT CREATE]", {
        bookingId: booking.id,
        therapistId: booking.therapistId,
        start,
        end
      });

      await db.bookingSlot.create({
        data:{
          bookingId: booking.id,
          therapistId: booking.therapistId,
          startTime:start,
          endTime:end,
          status:"BOOKED"
        }
      });

      console.log("[SLOT CREATED]");
    }


    // Send all notifications: email client, email team, WhatsApp client, WhatsApp team
    sendBookingNotifications({
      clientName: name, clientEmail: email, clientPhone: phone || '',
      bookingId: booking.bookingId, serviceName: serviceRecord.name,
      date, time: time24, therapistName,
      totalAmount, bookingType: bookingType || 'in_spa',
      paymentMethod: paymentMethod || 'cash', notes: notes || '',
    }).catch(() => {});

    // 3. If payment method is mobile_money or bank_transfer, notify payments@ (from payments@)
    if (paymentMethod === 'mobile_money' || paymentMethod === 'bank_transfer') {
      sendEmail({
        to: 'payments@serenitytouch.co.za',
        cc: 'taonga@serenitytouch.co.za',
        subject: `Payment Pending: ${booking.bookingId} — K${totalAmount.toLocaleString()}`,
        html: paymentNotificationEmail({
          name, email, bookingId: booking.bookingId,
          serviceName: serviceRecord.name, totalAmount,
          paymentMethod: paymentMethod || 'cash',
        }),
        from: 'payments',
      }).catch(() => {});
    }

    return NextResponse.json(
      {
        success: true,
        bookingId: booking.bookingId,
        totalAmount: booking.totalAmount,
        message: 'Booking confirmed! You will receive a confirmation via email and WhatsApp.',
      },
      { headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error('[Booking POST]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create booking. Please try again or contact us via WhatsApp.' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

// GET: Retrieve bookings by email
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email parameter is required' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const bookings = await db.booking.findMany({
      where: { email: email.toLowerCase() },
      orderBy: { createdAt: 'desc' },
      select: {
        bookingId: true,
        name: true,
        serviceName: true,
        date: true,
        time: true,
        bookingType: true,
        calloutZone: true,
        status: true,
        totalAmount: true,
        paymentMethod: true,
        paymentStatus: true,
        therapistName: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        bookings: bookings.map((b) => ({
          ...b,
          createdAt: b.createdAt.toISOString(),
        })),
      },
      { headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error('[Booking GET]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}