import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseClient && supabaseUrl && supabaseServiceKey) {
    supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
  }
  return supabaseClient;
}

export async function testEmailConfiguration(): Promise<boolean> {
  try {
    const client = getSupabaseClient();
    if (!client) {
      console.error("[Email Config] Supabase client not initialized");
      return false;
    }

    // Test by checking if we can access the auth endpoint
    const { data, error } = await client.auth.admin.listUsers();
    
    if (error) {
      console.error("[Email Config] Supabase auth test failed:", error);
      return false;
    }

    console.log("[Email Config] Supabase connection successful");
    return true;
  } catch (error) {
    console.error("[Email Config] Email configuration test failed:", error);
    return false;
  }
}

export async function sendTestEmail(toEmail: string): Promise<boolean> {
  try {
    const client = getSupabaseClient();
    if (!client) {
      console.error("[Email] Supabase client not initialized");
      return false;
    }

    // Use Supabase's built-in email service
    const { error } = await client.auth.admin.inviteUserByEmail(toEmail, {
      redirectTo: `${process.env.VITE_OAUTH_PORTAL_URL || "https://tinassanctuary.zm"}/auth/callback`,
    });

    if (error) {
      console.error("[Email] Failed to send test email:", error);
      return false;
    }

    console.log(`[Email] Test email sent to ${toEmail}`);
    return true;
  } catch (error) {
    console.error("[Email] Error sending test email:", error);
    return false;
  }
}
