import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendWhatsApp } from '@/lib/whatsapp';
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

// LLM call (same pattern as chat route)
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
RULES: For bookings, direct them to serenitytouch.co.za or the AI chat on the website. Never try to book here — this channel doesn't support it. Keep responses SHORT — people are on WhatsApp.`;
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

      // Check for quick-command shortcuts first
      const lower = text.toLowerCase();

      if (/^(hi|hello|hey|good\s*(morning|afternoon|evening)|halo|shani|muli\b|mwabuka)/i.test(lower)) {
        const reply = `🌸 *Welcome to Serenity Touch Spa!*\n\nI'm your virtual assistant. Ask me anything about treatments, prices, booking, or payments.\n\nOr visit *serenitytouch.co.za* for full service and instant AI booking.`;
        await sendWhatsApp(phone, reply).catch(() => {});
        memory.push({ role: 'assistant', content: reply });
        return NextResponse.json({ received: true, replied: true }, { headers: CORS });
      }

      // LLM-powered response
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