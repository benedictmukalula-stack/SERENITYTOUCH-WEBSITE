import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendWhatsApp, sendBookingNotifications } from '@/lib/whatsapp';
import { spawn } from 'child_process';
import { existsSync, readFileSync, unlinkSync, mkdirSync } from 'fs';
import { join } from 'path';

const OUT_DIR = '/tmp/llm-wa-out';
try { mkdirSync(OUT_DIR, { recursive: true }); } catch {}

const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };

export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: CORS }); }

// Health check
export async function GET() {
  return NextResponse.json({ status: 'active', service: 'Serenity Touch WhatsApp AI' }, { headers: CORS });
}

// LLM call
function callLLM(systemPrompt: string, userMessage: string): Promise<string> {
  return new Promise((resolve) => {
    const outFile = join(OUT_DIR, `wa-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.json`);
    const child = spawn('z-ai', ['chat', '-p', userMessage, '-s', systemPrompt, '-o', outFile], { detached: true, stdio: 'ignore' });
    child.unref();
    const poll = setInterval(() => {
      if (existsSync(outFile)) {
        clearInterval(poll);
        try { const raw = readFileSync(outFile, 'utf-8'); unlinkSync(outFile); const data = JSON.parse(raw); resolve(data.choices?.[0]?.message?.content || ''); } catch { resolve(''); }
      }
    }, 300);
    setTimeout(() => { clearInterval(poll); try { if (existsSync(outFile)) unlinkSync(outFile); } catch {} resolve(''); }, 30000);
  });
}

// Session memory: last 6 messages per phone number
const sessionMemory = new Map<string, Array<{ role: string; content: string }>>();
const MAX_MEMORY = 6;

// ═══════════════════════════════════════════════════════════════
// WHATSAPP BOOKING FLOW (step-by-step state machine)
// ═══════════════════════════════════════════════════════════════

type BookingStep = 'idle' | 'ask_name' | 'ask_service' | 'ask_date' | 'ask_time' | 'ask_email' | 'ask_phone' | 'confirm';

interface WABookingSession {
  step: BookingStep;
  data: {
    name: string;
    email: string;
    phone: string;
    serviceSlug: string;
    serviceName: string;
    date: string;
    time: string;
    bookingType: string;
  };
}

const bookingSessions = new Map<string, WABookingSession>();
const SESSION_TTL = 10 * 60 * 1000; // 10 minutes

// Clean expired sessions every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, session] of bookingSessions.entries()) {
    // We don't track creation time explicitly, but the flow should complete quickly
    // A simple heuristic: if a session has been sitting on a step too long, clear it
  }
}, 5 * 60 * 1000);

async function getWASystemPrompt(): Promise<string> {
  const [services, configs] = await Promise.all([
    db.service.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
    db.siteConfig.findMany(),
  ]);
  const gc = (k: string) => configs.find((c) => c.key === k)?.value ?? '';
  const svc = services.map((s) => `- ${s.name} (slug:"${s.slug}"): K${s.price}, ${s.duration}`).join('\n');

  return `You are the Serenity Touch Spa WhatsApp assistant in Lusaka, Zambia. Be warm, brief (1-3 sentences), use K for prices.
SERVICES:\n${svc}
HOURS: Mon-Fri ${gc('spa_hours_weekday') || '9AM-6PM'}, Sat ${gc('spa_hours_saturday') || '10AM-5PM'}, Sun Closed
LOCATION: 183 Ibex Hill, Lusaka, Zambia
PHONE: +260 572 782 539
WHATSAPP: +260 761 404 555
EMAILS: bookings@ (reservations), info@ (general), payments@ (payment), taonga@ (founder) — all @serenitytouch.co.za
PAYMENT: MTN Mobile Money +260 761 404 555, Airtel Money +260 572 782 539, Bank Transfer, Cash at spa
BANK: Benedict Bwalya Mukalula, Acc# 7291199200262, Branch 040, Sort 010040
MEMBERSHIP: Silver K800/mo, Gold K1,600/mo, Platinum K3,200/mo
VOUCHERS: K500-K5,000 at serenitytouch.co.za
CALLOUT: Zone 1 K200, Zone 2 K350, Zone 3 K500
RULES: If someone wants to BOOK, tell them to type "BOOK" to start the quick booking flow. For general questions, answer normally. Keep responses SHORT — people are on WhatsApp.`;
}

// Handle the step-by-step booking flow
async function handleBookingFlow(phone: string, text: string): Promise<{ reply: string; handled: boolean }> {
  const lower = text.toLowerCase();
  const session = bookingSessions.get(phone);

  // Start new booking
  if (lower === 'book' || lower === '1' || lower === 'book now' || lower === 'i want to book') {
    bookingSessions.set(phone, {
      step: 'ask_name',
      data: { name: '', email: '', phone: '', serviceSlug: '', serviceName: '', date: '', time: '', bookingType: 'in_spa' },
    });
    return {
      reply: `🌸 *Let's book your appointment!*\n\nStep 1/5: What's your *full name*?`,
      handled: true,
    };
  }

  // Cancel booking flow
  if (lower === 'cancel' || lower === 'stop' && session) {
    bookingSessions.delete(phone);
    return {
      reply: `Booking cancelled. No worries! Type *BOOK* whenever you're ready to try again, or ask me anything about our services. 🌸`,
      handled: true,
    };
  }

  // No active session — not a booking flow message
  if (!session) return { reply: '', handled: false };

  // Process current step
  const data = session.data;

  switch (session.step) {
    case 'ask_name': {
      if (text.length < 2) return { reply: `Please enter your full name.`, handled: true };
      data.name = text.trim();
      session.step = 'ask_service';

      // Get service list for quick selection
      const services = await db.service.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' }, take: 10 });
      const serviceList = services.map((s, i) => `${i + 1}. ${s.name} — K${s.price}`).join('\n');

      return {
        reply: `Nice to meet you, *${data.name}*! ✨\n\nStep 2/5: Which service would you like?\n\n${serviceList}\n\nType the number or the service name.`,
        handled: true,
      };
    }

    case 'ask_service': {
      // Try to match by number or name
      const services = await db.service.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } });
      const numMatch = parseInt(text);
      let matched = numMatch > 0 && numMatch <= services.length ? services[numMatch - 1] : null;
      if (!matched) {
        matched = services.find((s) => s.name.toLowerCase().includes(lower) || s.slug.toLowerCase().includes(lower));
      }
      if (!matched) {
        return {
          reply: `I couldn't find that service. Please type a number from the list or the service name.\n\nYou can also type *CANCEL* to start over.`,
          handled: true,
        };
      }

      data.serviceSlug = matched.slug;
      data.serviceName = matched.name;
      session.step = 'ask_date';

      return {
        reply: `Great choice! *${matched.name}* — K${matched.price}\n\nStep 3/5: What *date* works for you?\n\nPlease enter in format: YYYY-MM-DD (e.g. 2026-07-15)\n\nOr just say "tomorrow" or "next Monday".`,
        handled: true,
      };
    }

    case 'ask_date': {
      let dateStr = '';

      // Parse natural dates
      if (/tomorrow/i.test(lower)) {
        const d = new Date(); d.setDate(d.getDate() + 1);
        dateStr = d.toISOString().split('T')[0];
      } else if (/next\s+monday/i.test(lower)) {
        const d = new Date(); d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7 || 7));
        dateStr = d.toISOString().split('T')[0];
      } else if (/next\s+tuesday/i.test(lower)) {
        const d = new Date(); d.setDate(d.getDate() + ((2 + 7 - d.getDay()) % 7 || 7));
        dateStr = d.toISOString().split('T')[0];
      } else if (/next\s+wednesday/i.test(lower)) {
        const d = new Date(); d.setDate(d.getDate() + ((3 + 7 - d.getDay()) % 7 || 7));
        dateStr = d.toISOString().split('T')[0];
      } else if (/next\s+thursday/i.test(lower)) {
        const d = new Date(); d.setDate(d.getDate() + ((4 + 7 - d.getDay()) % 7 || 7));
        dateStr = d.toISOString().split('T')[0];
      } else if (/next\s+friday/i.test(lower)) {
        const d = new Date(); d.setDate(d.getDate() + ((5 + 7 - d.getDay()) % 7 || 7));
        dateStr = d.toISOString().split('T')[0];
      } else if (/next\s+saturday/i.test(lower)) {
        const d = new Date(); d.setDate(d.getDate() + ((6 + 7 - d.getDay()) % 7 || 7));
        dateStr = d.toISOString().split('T')[0];
      } else {
        // Try YYYY-MM-DD
        const dateMatch = text.match(/(\d{4})-(\d{2})-(\d{2})/);
        if (dateMatch) {
          dateStr = text.match(/(\d{4}-\d{2}-\d{2})/)![0];
        } else {
          // Try DD/MM/YYYY
          const dmyMatch = text.match(/(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})/);
          if (dmyMatch) dateStr = `${dmyMatch[3]}-${dmyMatch[2].padStart(2, '0')}-${dmyMatch[1].padStart(2, '0')}`;
        }
      }

      if (!dateStr) {
        return {
          reply: `I couldn't understand that date. Please use:\n• YYYY-MM-DD (e.g. 2026-07-15)\n• "tomorrow"\n• "next Monday"`,
          handled: true,
        };
      }

      // Validate: not Sunday
      const dateObj = new Date(dateStr + 'T00:00:00');
      if (dateObj.getDay() === 0) {
        return {
          reply: `We're closed on Sundays! 🙏 Please choose a different day (Mon-Sat).`,
          handled: true,
        };
      }

      // Validate: not in the past
      const today = new Date(); today.setHours(0, 0, 0, 0);
      if (dateObj < today) {
        return { reply: `That date has passed. Please choose a future date.`, handled: true };
      }

      data.date = dateStr;
      session.step = 'ask_time';

      return {
        reply: `✅ Date set: *${dateStr}*\n\nStep 4/5: What *time* do you prefer?\n\nWe're open 9AM-6PM (Mon-Fri), 10AM-5PM (Sat).\n\nExample: 10:00 AM, 2:30 PM`,
        handled: true,
      };
    }

    case 'ask_time': {
      // Parse time
      const tm = text.match(/(\d{1,2})[:\s]?(\d{2})?\s*(am|pm)/i) || text.match(/(\d{1,2})\s*(am|pm)/i);
      if (!tm) {
        return { reply: `Please enter a time like: 10:00 AM or 2:30 PM`, handled: true };
      }

      let h = parseInt(tm[1]);
      const m = parseInt(tm[2] || '0');
      const ampm = tm[3].toUpperCase();

      if (ampm === 'PM' && h !== 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;

      // Validate hours
      if (h < 9 || h >= 18) {
        return { reply: `Please choose a time between 9:00 AM and 6:00 PM.`, handled: true };
      }

      data.time = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      session.step = 'ask_email';

      return {
        reply: `✅ Time set: *${tm[0].toUpperCase()}*\n\nStep 5/5: What's your *email address*?\n\nWe'll send your booking confirmation there.`,
        handled: true,
      };
    }

    case 'ask_email': {
      const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
      if (!emailMatch) {
        return { reply: `That doesn't look like a valid email. Please enter your email address.`, handled: true };
      }

      data.email = emailMatch[0].toLowerCase();
      data.phone = phone;
      session.step = 'confirm';

      const displayTime = `${parseInt(data.time.split(':')[0]) > 12 ? parseInt(data.time.split(':')[0]) - 12 : parseInt(data.time.split(':')[0]) || 12}:${data.time.split(':')[1]} ${parseInt(data.time.split(':')[0]) >= 12 ? 'PM' : 'AM'}`;

      return {
        reply: `📋 *Please confirm your booking:*\n\n👤 *Name:* ${data.name}\n💆 *Service:* ${data.serviceName}\n📅 *Date:* ${data.date}\n🕐 *Time:* ${displayTime}\n📧 *Email:* ${data.email}\n📍 *Location:* 183 Ibex Hill, Lusaka\n\nReply:\n• *YES* to confirm\n• *CHANGE* to modify\n• *CANCEL* to start over`,
        handled: true,
      };
    }

    case 'confirm': {
      if (/^yes|confirm|yep$/i.test(lower)) {
        // Create the booking!
        try {
          const service = await db.service.findUnique({ where: { slug: data.serviceSlug } });
          if (!service) {
            bookingSessions.delete(phone);
            return { reply: `Service not found. Please start over by typing BOOK.`, handled: true };
          }

          const bookingId = `ST-${Array.from({ length: 6 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]).join('')}`;

          await db.booking.create({
            data: {
              bookingId,
              name: data.name,
              email: data.email,
              phone: data.phone,
              serviceId: service.id,
              serviceName: service.name,
              date: data.date,
              time: data.time,
              bookingType: 'in_spa',
              totalAmount: service.price,
              paymentMethod: 'cash',
              paymentStatus: 'pending',
              status: 'confirmed',
            },
          });

          // Send all 4-channel notifications
          await sendBookingNotifications({
            clientName: data.name,
            clientEmail: data.email,
            clientPhone: data.phone,
            bookingId,
            serviceName: service.name,
            date: data.date,
            time: data.time,
            therapistName: 'First Available',
            totalAmount: service.price,
            bookingType: 'in_spa',
            paymentMethod: 'cash',
            notes: `Booked via WhatsApp`,
          }).catch(() => {});

          bookingSessions.delete(phone);

          return {
            reply: `🎉 *Booking Confirmed!*\n\n📋 Booking ID: *${bookingId}*\n💆 ${service.name}\n📅 ${data.date}\n\nCheck your email for full confirmation.\n\nPayment: Cash at spa, MTN MM, Airtel MM, or Bank Transfer.\n\nSee you soon! 🌸\n\n_type BOOK for another appointment_`,
            handled: true,
          };
        } catch (err) {
          console.error('[WA Booking Create]', err);
          bookingSessions.delete(phone);
          return { reply: `Something went wrong creating your booking. Please try again or visit serenitytouch.co.za. Sorry! 😔`, handled: true };
        }
      }

      if (/^change|modify|edit$/i.test(lower)) {
        session.step = 'ask_service';
        return {
          reply: `Let's change your service.\n\nWhich would you prefer? (type number or name)\n\n${(await db.service.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' }, take: 10 })).map((s, i) => `${i + 1}. ${s.name} — K${s.price}`).join('\n')}`,
          handled: true,
        };
      }

      // Default: treat as cancel
      bookingSessions.delete(phone);
      return {
        reply: `No problem! Type *BOOK* whenever you're ready to try again. 🌸`,
        handled: true,
      };
    }

    default:
      return { reply: '', handled: false };
  }
}

// POST: incoming WhatsApp message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, data } = body;

    // ACK events — just log
    if (event === 'ack') {
      console.log(`[WA Webhook] ACK: msg ${data?.id} status=${data?.ack}`);
      return NextResponse.json({ received: true }, { headers: CORS });
    }

    // Handle incoming message
    if (event === 'message' && data) {
      const { id, from, body: msgBody, type } = data;

      // Only handle text messages
      if (type !== 'chat' || !msgBody) {
        return NextResponse.json({ received: true, ignored: true }, { headers: CORS });
      }

      const phone = from?.replace(/[\s\-\+\@]/g, '') || '';
      const text = (msgBody || '').trim();
      console.log(`[WA Webhook] From ${phone}: "${text.slice(0, 80)}"`);

      // Get or create session memory
      if (!sessionMemory.has(phone)) sessionMemory.set(phone, []);
      const memory = sessionMemory.get(phone)!;
      memory.push({ role: 'user', content: text });
      if (memory.length > MAX_MEMORY) memory.splice(0, memory.length - MAX_MEMORY);

      const lower = text.toLowerCase();

      // ── Quick commands ──
      if (/^(hi|hello|hey|good\s*(morning|afternoon|evening)|halo|shani|muli\b|mwabuka)/i.test(lower)) {
        const reply = `🌸 *Welcome to Serenity Touch Spa!*\n\nI can help with:\n• *BOOK* — Quick booking in 5 steps\n• *Services* — Our treatments & prices\n• *Location* — Find us\n• *Payment* — Payment methods\n• Or ask me anything!\n\nType *BOOK* to make an appointment now.`;
        await sendWhatsApp(phone, reply).catch(() => {});
        memory.push({ role: 'assistant', content: reply });
        return NextResponse.json({ received: true, replied: true }, { headers: CORS });
      }

      if (/^(services|treatments|menu|2)$/.test(lower)) {
        const services = await db.service.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } });
        const list = services.slice(0, 8).map((s) => `💆 *${s.name}* — K${s.price} (${s.duration})`).join('\n');
        const reply = `*Our Treatments:*\n\n${list}\n\n${services.length > 8 ? `+ ${services.length - 8} more at serenitytouch.co.za\n\n` : ''}Type *BOOK* to make an appointment!`;
        await sendWhatsApp(phone, reply).catch(() => {});
        memory.push({ role: 'assistant', content: reply });
        return NextResponse.json({ received: true, replied: true }, { headers: CORS });
      }

      if (/^(location|directions|address|where|3)$/.test(lower)) {
        const reply = `📍 *Serenity Touch Spa*\n183 Ibex Hill, Lusaka, Zambia\n\n🕐 Mon-Fri: 9AM-6PM\n🕐 Sat: 10AM-5PM\n🕐 Sun: Closed\n\n📞 +260 572 782 539`;
        await sendWhatsApp(phone, reply).catch(() => {});
        memory.push({ role: 'assistant', content: reply });
        return NextResponse.json({ received: true, replied: true }, { headers: CORS });
      }

      if (/^(payment|pay|prices?|4)$/.test(lower)) {
        const reply = `*Payment Methods:*\n\n📱 MTN Mobile Money: +260 761 404 555\n📱 Airtel Money: +260 572 782 539\n🏦 Bank: Benedict Bwalya Mukalula\n   Acc# 7291199200262, Branch 040\n💵 Cash at the spa\n\nAlways use your *booking ID* as reference.`;
        await sendWhatsApp(phone, reply).catch(() => {});
        memory.push({ role: 'assistant', content: reply });
        return NextResponse.json({ received: true, replied: true }, { headers: CORS });
      }

      // ── Booking flow ──
      const bookingResult = await handleBookingFlow(phone, text);
      if (bookingResult.handled) {
        await sendWhatsApp(phone, bookingResult.reply).catch(() => {});
        memory.push({ role: 'assistant', content: bookingResult.reply });
        return NextResponse.json({ received: true, replied: true }, { headers: CORS });
      }

      // ── LLM fallback for general questions ──
      const systemPrompt = await getWASystemPrompt();
      const historyStr = memory.map((m) => `${m.role === 'user' ? 'Customer' : 'Assistant'}: ${m.content}`).join('\n');
      const llmReply = await callLLM(systemPrompt, historyStr);

      const reply = llmReply.trim() ||
        `Thank you for reaching out! 🌸 I'd love to help. Could you tell me more about what you need? You can also visit *serenitytouch.co.za* for instant booking.`;

      memory.push({ role: 'assistant', content: reply });
      if (memory.length > MAX_MEMORY) memory.splice(0, memory.length - MAX_MEMORY);

      await sendWhatsApp(phone, reply).catch(() => {});

      return NextResponse.json({ received: true, replied: true }, { headers: CORS });
    }

    return NextResponse.json({ received: true }, { headers: CORS });
  } catch (error) {
    console.error('[WA Webhook]', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500, headers: CORS });
  }
}