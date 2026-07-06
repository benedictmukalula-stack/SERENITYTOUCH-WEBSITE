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
 * GET /api/admin/campaigns?page=&limit=&status=
 * List all campaigns with stats.
 */
export async function GET(request: NextRequest) {
  if (!validateAdminKey(request)) return unauthorizedResponse();

  try {
    const status = request.nextUrl.searchParams.get('status') || undefined;
    const page = Math.max(1, parseInt(request.nextUrl.searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(request.nextUrl.searchParams.get('limit') || '20')));

    const where: Record<string, unknown> = {};
    if (status && status !== 'All') where.status = status;

    const [campaigns, total] = await Promise.all([
      db.campaign.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.campaign.count({ where }),
    ]);

    // KPIs
    const [totalCampaigns, sentCampaigns, totalSent, totalFailed] = await Promise.all([
      db.campaign.count(),
      db.campaign.count({ where: { status: 'sent' } }),
      db.campaign.aggregate({ _sum: { sentCount: true } }),
      db.campaign.aggregate({ _sum: { failCount: true } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        campaigns: campaigns.map(c => ({
          id: c.id,
          name: c.name,
          message: c.message.substring(0, 120) + (c.message.length > 120 ? '...' : ''),
          filter: c.filter,
          audience: c.audience,
          status: c.status,
          sentCount: c.sentCount,
          failCount: c.failCount,
          scheduledAt: c.scheduledAt?.toISOString() || null,
          sentAt: c.sentAt?.toISOString() || null,
          createdBy: c.createdBy,
          createdAt: c.createdAt.toISOString(),
        })),
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        kpis: {
          totalCampaigns,
          sentCampaigns,
          totalMessagesSent: totalSent._sum.sentCount || 0,
          totalMessagesFailed: totalFailed._sum.failCount || 0,
        },
      },
    }, { headers: CORS });
  } catch (error) {
    console.error('[Admin Campaigns GET]', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500, headers: CORS });
  }
}

/**
 * POST /api/admin/campaigns
 * Create a campaign (saved as draft).
 * Body: { name, message, filter, audience, scheduledAt? }
 */
export async function POST(request: NextRequest) {
  if (!validateAdminKey(request)) return unauthorizedResponse();

  try {
    const { name, message, filter = 'all', audience = 'all', scheduledAt, createdBy } = await request.json();

    if (!name || !message) {
      return NextResponse.json(
        { success: false, error: 'name and message are required' },
        { status: 400, headers: CORS }
      );
    }

    if (message.length < 20) {
      return NextResponse.json(
        { success: false, error: 'Message must be at least 20 characters' },
        { status: 400, headers: CORS }
      );
    }

    const campaign = await db.campaign.create({
      data: {
        name,
        message,
        filter,
        audience,
        status: scheduledAt ? 'scheduled' : 'draft',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        createdBy: createdBy || 'admin',
      },
    });

    return NextResponse.json({
      success: true,
      campaign: { id: campaign.id, name: campaign.name, status: campaign.status },
    }, { headers: CORS });
  } catch (error) {
    console.error('[Admin Campaigns POST]', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500, headers: CORS });
  }
}

/**
 * PATCH /api/admin/campaigns
 * Update campaign (name, message, status, schedule).
 * Body: { id, name?, message?, status?, scheduledAt? }
 */
export async function PATCH(request: NextRequest) {
  if (!validateAdminKey(request)) return unauthorizedResponse();

  try {
    const { id, ...data } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400, headers: CORS });
    }

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.message !== undefined) updateData.message = data.message;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.filter !== undefined) updateData.filter = data.filter;
    if (data.audience !== undefined) updateData.audience = data.audience;
    if (data.scheduledAt !== undefined) updateData.scheduledAt = data.scheduledAt ? new Date(data.scheduledAt) : null;
    if (data.sentCount !== undefined) updateData.sentCount = data.sentCount;
    if (data.failCount !== undefined) updateData.failCount = data.failCount;

    const campaign = await db.campaign.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      campaign: { id: campaign.id, name: campaign.name, status: campaign.status },
    }, { headers: CORS });
  } catch (error) {
    console.error('[Admin Campaigns PATCH]', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500, headers: CORS });
  }
}

/**
 * DELETE /api/admin/campaigns?id=
 * Delete a draft campaign.
 */
export async function DELETE(request: NextRequest) {
  if (!validateAdminKey(request)) return unauthorizedResponse();

  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400, headers: CORS });
    }

    const campaign = await db.campaign.findUnique({ where: { id } });
    if (campaign && campaign.status === 'sent') {
      return NextResponse.json(
        { success: false, error: 'Cannot delete a sent campaign' },
        { status: 400, headers: CORS }
      );
    }

    await db.campaign.delete({ where: { id } });
    return NextResponse.json({ success: true }, { headers: CORS });
  } catch (error) {
    console.error('[Admin Campaigns DELETE]', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500, headers: CORS });
  }
}