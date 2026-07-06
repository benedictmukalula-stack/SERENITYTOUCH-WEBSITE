import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { validateAdminKey, unauthorizedResponse } from '@/lib/api-auth';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
export async function OPTIONS() { return new NextResponse(null, { status: 204, headers: CORS }); }

/**
 * GET /api/admin/settings?group=
 * Get site configuration. Group filter: 'business', 'payments', 'booking', 'whatsapp', 'all'
 */
export async function GET(request: NextRequest) {
  if (!validateAdminKey(request)) return unauthorizedResponse();

  try {
    const group = request.nextUrl.searchParams.get('group') || 'all';

    const configs = await db.siteConfig.findMany({
      orderBy: { key: 'asc' },
    });

    const configMap: Record<string, string> = {};
    for (const c of configs) {
      configMap[c.key] = c.value;
    }

    return NextResponse.json({
      success: true,
      settings: configMap,
      grouped: {
        business: {
          spa_name: configMap['spa_name'] || 'Serenity Touch Spa',
          spa_email_info: configMap['spa_email_info'] || '',
          spa_email_bookings: configMap['spa_email_bookings'] || '',
          spa_email_payments: configMap['spa_email_payments'] || '',
          spa_email_taonga: configMap['spa_email_taonga'] || '',
          spa_phone: configMap['spa_phone'] || '260761404555',
          spa_address: configMap['spa_address'] || '183 Ibex Hill, Lusaka, Zambia',
          spa_whatsapp: configMap['spa_whatsapp'] || '260761404555',
          operating_hours_weekday: configMap['operating_hours_weekday'] || '9:00 AM - 5:00 PM',
          operating_hours_saturday: configMap['operating_hours_saturday'] || '10:00 AM - 4:00 PM',
          operating_hours_sunday: configMap['operating_hours_sunday'] || 'Closed',
        },
        payments: {
          payment_methods: configMap['payment_methods'] || 'cash,mobile_money,bank_transfer,card',
          mobile_money_number: configMap['mobile_money_number'] || '260761404555',
          mobile_money_name: configMap['mobile_money_name'] || 'Taonga Phiri',
          bank_name: configMap['bank_name'] || '',
          bank_account_name: configMap['bank_account_name'] || '',
          bank_account_number: configMap['bank_account_number'] || '',
          bank_branch: configMap['bank_branch'] || '',
          callout_zones: configMap['callout_zones'] || '',
        },
        booking: {
          slot_interval_min: configMap['slot_interval_min'] || '30',
          max_booking_days_ahead: configMap['max_booking_days_ahead'] || '30',
          cancel_policy_hours: configMap['cancel_policy_hours'] || '24',
          auto_confirm: configMap['auto_confirm'] || 'true',
        },
        whatsapp: {
          wa_enabled: configMap['wa_enabled'] || 'true',
          wa_auto_reply: configMap['wa_auto_reply'] || 'true',
          wa_review_delay_days: configMap['wa_review_delay_days'] || '2',
          wa_followup_days: configMap['wa_followup_days'] || '7',
          wa_reminder_hours_before: configMap['wa_reminder_hours_before'] || '24',
        },
      },
    }, { headers: CORS });
  } catch (error) {
    console.error('[Admin Settings GET]', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500, headers: CORS });
  }
}

/**
 * POST /api/admin/settings
 * Batch upsert settings.
 * Body: { settings: { key: value, ... } }
 */
export async function POST(request: NextRequest) {
  if (!validateAdminKey(request)) return unauthorizedResponse();

  try {
    const { settings } = await request.json();

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { success: false, error: 'settings object is required' },
        { status: 400, headers: CORS }
      );
    }

    const entries = Object.entries(settings) as [string, string][];
    const results = [];

    for (const [key, value] of entries) {
      const result = await db.siteConfig.upsert({
        where: { key },
        create: { key, value: String(value) },
        update: { value: String(value) },
      });
      results.push({ key: result.key, value: result.value });
    }

    return NextResponse.json({
      success: true,
      updated: results.length,
      settings: Object.fromEntries(results),
    }, { headers: CORS });
  } catch (error) {
    console.error('[Admin Settings POST]', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500, headers: CORS });
  }
}