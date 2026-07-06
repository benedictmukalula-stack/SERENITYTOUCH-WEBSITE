import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { existsSync, readFileSync, unlinkSync, mkdirSync } from 'fs';
import { join } from 'path';
import { db } from '@/lib/db';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const OUT_DIR = '/tmp/llm-out';
try { mkdirSync(OUT_DIR, { recursive: true }); } catch {}

// AI via detached z-ai CLI + file polling
function callLLM(messages: Array<{ role: string; content: string }>): Promise<string> {
  return new Promise((resolve) => {
    const systemPrompt = messages[0].content;
    const prompt = messages.slice(1)
      .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n') + '\nAssistant:';
    const outFile = join(OUT_DIR, `chat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.json`);
    const child = spawn('z-ai', ['chat', '-p', prompt, '-s', systemPrompt, '-o', outFile], { detached: true, stdio: 'ignore' });
    child.unref();
    const poll = setInterval(() => {
      if (existsSync(outFile)) {
        clearInterval(poll);
        try { const raw = readFileSync(outFile, 'utf-8'); unlinkSync(outFile); const data = JSON.parse(raw); resolve(data.choices?.[0]?.message?.content || ''); } catch { resolve(''); }
      }
    }, 300);
    setTimeout(() => { clearInterval(poll); try { if (existsSync(outFile)) unlinkSync(outFile); } catch {} resolve(''); }, 45000);
  });
}

// Build system prompt from live DB data
async function buildSystemPrompt(): Promise<string> {
  const [services, therapists, configs] = await Promise.all([
    db.service.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
    db.therapist.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
    db.siteConfig.findMany(),
  ]);
  const gc = (k: string) => configs.find((c) => c.key === k)?.value ?? '';
  const svc = services.map((s) => `- ${s.name} (slug:"${s.slug}"): K${s.price}, ${s.duration}`).join('\n');
  const team = therapists.map((t) => `- ${t.name}: ${t.specialty}`).join('\n');
  return `You are "Serenity", the AI assistant for Serenity Touch Spa in Lusaka, Zambia. Be warm, concise (2-3 sentences).
SERVICES:\n${svc}\n
TEAM:\n${team}\n
HOURS: Mon-Fri ${gc('spa_hours_weekday') || '9AM-6PM'}, Sat ${gc('spa_hours_saturday') || '10AM-5PM'}, Sun Closed
LOCATION: ${gc('spa_address') || '183 Ibex Hill, Lusaka, Zambia'}
PHONE: ${gc('spa_phone') || '+260 572 782 539'}
WHATSAPP: ${gc('spa_whatsapp') || '+260 761 404 555'}
EMAIL: ${gc('spa_email') || 'info@serenitytouch.co.zm'}
MOBILE MONEY: Airtel Money ${gc('mobile_money_airtel') || '+260 761 404 555'}, MTN Mobile Money ${gc('mobile_money_mtn') || '+260 977 555 123'}
PAYMENT: Cash, Airtel Money, MTN Mobile Money, Bank Transfer (ZANACO 1234567890 Ibex Hill Branch), Card at spa
MEMBERSHIP: Silver K800/mo, Gold K1,600/mo, Platinum K3,200/mo
VOUCHERS: K500-K5,000, valid 12 months
CALLOUT: Zone 1 K200, Zone 2 K350, Zone 3 K500
RULES: Use K for prices. When user wants to book, collect name, email, phone, service slug, date (YYYY-MM-DD), time (HH:MM AM/PM). Then append exactly: [BOOKING:{"name":"...","email":"...","phone":"...","service":"slug","date":"YYYY-MM-DD","time":"HH:MM AM/PM","bookingType":"in_spa"}]`;
}

// GET: chat history
export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('sessionId');
    if (!sessionId) return NextResponse.json({ success: false, error: 'sessionId required' }, { status: 400, headers: CORS_HEADERS });
    const msgs = await db.chatMessage.findMany({ where: { sessionId }, orderBy: { createdAt: 'asc' }, take: 50 });
    return NextResponse.json({ success: true, messages: msgs.map((m) => ({ role: m.role, content: m.content, timestamp: m.createdAt.toISOString() })) }, { headers: CORS_HEADERS });
  } catch (error) { console.error('[Chat GET]', error); return NextResponse.json({ success: false, error: 'Failed' }, { status: 500, headers: CORS_HEADERS }); }
}

// POST: send message, get AI response, optionally create booking
export async function POST(request: NextRequest) {
  try {
    const { sessionId, content } = await request.json();
    if (!sessionId || !content) return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400, headers: CORS_HEADERS });
    await db.chatMessage.create({ data: { sessionId, role: 'user', content } });
    const history = await db.chatMessage.findMany({ where: { sessionId }, orderBy: { createdAt: 'asc' }, take: 16 });
    const systemPrompt = await buildSystemPrompt();
    const llmMessages = [{ role: 'assistant', content: systemPrompt }, ...history.map((m) => ({ role: m.role, content: m.content }))];
    let aiResponse = await callLLM(llmMessages);
    if (!aiResponse.trim()) aiResponse = "I'm here! Could you rephrase that? I'd love to help you with treatments, booking, or anything about Serenity Touch Spa.";
    // Extract booking
    let bookingResult: { success: boolean; bookingId?: string; totalAmount?: number; error?: string } | null = null;
    const bm = aiResponse.match(/\[BOOKING:(\{[^}]+\})\]/);
    if (bm) {
      try {
        const ba = JSON.parse(bm[1]);
        aiResponse = aiResponse.replace(/\[BOOKING:\{[^}]+\}]/, '').trim();
        if (ba.name && ba.email && ba.service && ba.date) {
          const service = await db.service.findUnique({ where: { slug: ba.service } });
          if (service) {
            let total = service.price;
            const tm = ba.time?.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
            let t24 = '';
            if (tm) { let h = parseInt(tm[1]); const m = parseInt(tm[2]); const p = tm[3].toUpperCase(); if (p === 'PM' && h !== 12) h += 12; if (p === 'AM' && h === 12) h = 0; t24 = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`; }
            const rid = `ST-${Array.from({ length: 6 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]).join('')}`;
            await db.booking.create({ data: { bookingId: rid, name: ba.name, email: ba.email, phone: ba.phone || '', serviceId: service.id, serviceName: service.name, date: ba.date, time: t24, bookingType: ba.bookingType || 'in_spa', totalAmount: total, paymentMethod: 'cash' } });
            bookingResult = { success: true, bookingId: rid, totalAmount: total };
          } else { bookingResult = { success: false, error: `Service "${ba.service}" not found` }; }
        }
      } catch (err) { console.error('[Booking]', err); bookingResult = { success: false, error: 'Booking failed' }; }
    }
    if (bookingResult?.success) aiResponse += `\n\nBooking confirmed! **ID: ${bookingResult.bookingId}** | K${bookingResult.totalAmount?.toLocaleString()} | Check your email.`;
    else if (bookingResult && !bookingResult.success) aiResponse += `\n\nBooking issue: ${bookingResult.error}. Try WhatsApp +260 761 404 555.`;
    await db.chatMessage.create({ data: { sessionId, role: 'assistant', content: aiResponse } });
    return NextResponse.json({ success: true, message: { role: 'assistant', content: aiResponse, timestamp: new Date().toISOString() }, booking: bookingResult || undefined }, { headers: CORS_HEADERS });
  } catch (error) { console.error('[Chat POST]', error); return NextResponse.json({ success: false, error: 'Failed' }, { status: 500, headers: CORS_HEADERS }); }
}

export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: CORS_HEADERS }); }