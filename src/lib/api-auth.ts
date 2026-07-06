/* ═══════════════════════════════════════════════════════════════
   Serenity Touch Spa — API Authentication Utilities
   
   Two levels of protection:
   
   1. CRON_KEY — simple shared secret for cron-job.org callbacks
      Pass as ?key=CRON_KEY query parameter
   
   2. ADMIN_KEY — Bearer token for admin dashboard API calls
      Pass as Authorization: Bearer ADMIN_KEY header
   ═══════════════════════════════════════════════════════════════ */

const CRON_KEY = process.env.CRON_KEY || '';
const ADMIN_KEY = process.env.ADMIN_KEY || '';

/** Check if a cron request is authenticated via ?key= query param */
export function validateCronKey(request: Request): boolean {
  if (!CRON_KEY) {
    // If no key configured in env, allow all (dev mode)
    console.warn('[API Auth] CRON_KEY not set — cron endpoints are unprotected');
    return true;
  }
  const url = new URL(request.url);
  const providedKey = url.searchParams.get('key');
  return providedKey === CRON_KEY;
}

/** Check if an admin request is authenticated via Authorization header */
export function validateAdminKey(request: Request): boolean {
  if (!ADMIN_KEY) {
    console.warn('[API Auth] ADMIN_KEY not set — admin endpoints are unprotected');
    return true;
  }
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;
  const expected = `Bearer ${ADMIN_KEY}`;
  return authHeader === expected;
}

/** Returns 401 JSON response for failed auth */
export function unauthorizedResponse() {
  return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}