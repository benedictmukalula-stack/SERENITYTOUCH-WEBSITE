import { ENV } from "./_core/env";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendBookingConfirmationEmail(
  userEmail: string,
  userName: string,
  serviceType: string,
  bookingDate: Date,
  bookingId: number
): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("[Email] Supabase credentials not configured");
    return;
  }

  const formattedDate = bookingDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = bookingDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Playfair Display', serif; background-color: #1a1a1a; color: #fff; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { text-align: center; margin-bottom: 40px; }
          .header h1 { font-size: 32px; color: #D4A574; margin: 0; }
          .content { background-color: #2a2a2a; padding: 30px; border-radius: 8px; }
          .booking-details { margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #444; }
          .detail-label { color: #999; }
          .detail-value { color: #D4A574; font-weight: bold; }
          .cta-button { display: inline-block; background-color: #E91E63; color: white; padding: 12px 30px; border-radius: 25px; text-decoration: none; margin-top: 20px; }
          .footer { text-align: center; margin-top: 40px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Tina's Sanctuary</h1>
            <p style="color: #999; margin: 10px 0 0 0;">Exclusive Wellness Sanctuary</p>
          </div>

          <div class="content">
            <h2 style="color: #fff; margin-top: 0;">Booking Confirmation</h2>
            <p>Dear ${userName},</p>
            <p>Thank you for booking with Tina's Sanctuary. Your booking request has been received and is pending confirmation.</p>

            <div class="booking-details">
              <div class="detail-row">
                <span class="detail-label">Service:</span>
                <span class="detail-value">${serviceType}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${formattedDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span class="detail-value">${formattedTime}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Booking ID:</span>
                <span class="detail-value">#${bookingId}</span>
              </div>
            </div>

            <p>We will confirm your booking within 24 hours. If you have any questions, please contact us at +260 572 782 539 or info@tinassanctuary.zm</p>

            <a href="https://tinassanctuary.zm/member-portal" class="cta-button">View Your Bookings</a>
          </div>

          <div class="footer">
            <p>© 2026 Tina's Sanctuary. All rights reserved.</p>
            <p>183 Ibex Hill, Lusaka, Zambia | R18 - Members must be 18 or older</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({
        to: userEmail,
        subject: `Booking Confirmation - Tina's Sanctuary`,
        html,
      }),
    });

    if (!response.ok) {
      console.error("[Email] Failed to send email:", await response.text());
    } else {
      console.log("[Email] Booking confirmation sent to", userEmail);
    }
  } catch (error) {
    console.error("[Email] Error sending email:", error);
  }
}

export async function sendMembershipConfirmationEmail(
  userEmail: string,
  userName: string,
  membershipTier: string,
  monthlyPrice: number
): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("[Email] Supabase credentials not configured");
    return;
  }

  const tierBenefits: Record<string, string[]> = {
    silver: [
      "1 massage per month",
      "10% off additional services",
      "Priority booking",
      "Birthday special",
      "Access to member lounge",
    ],
    gold: [
      "2 massages per month",
      "20% off all services",
      "VIP booking",
      "Free aromatherapy upgrade",
      "Quarterly wellness consult",
      "Guest privileges",
    ],
    platinum: [
      "Unlimited massages",
      "30% off all services",
      "24/7 concierge",
      "Personal wellness plan",
      "Private therapy room",
      "Monthly spa day",
      "Home visit services",
    ],
  };

  const benefits = tierBenefits[membershipTier.toLowerCase()] || [];

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Playfair Display', serif; background-color: #1a1a1a; color: #fff; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { text-align: center; margin-bottom: 40px; }
          .header h1 { font-size: 32px; color: #D4A574; margin: 0; }
          .content { background-color: #2a2a2a; padding: 30px; border-radius: 8px; }
          .tier-badge { display: inline-block; background-color: #E91E63; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 20px 0; }
          .benefits-list { list-style: none; padding: 0; margin: 20px 0; }
          .benefits-list li { padding: 10px 0; border-bottom: 1px solid #444; }
          .benefits-list li:before { content: "✦ "; color: #BFFF00; margin-right: 10px; }
          .price { font-size: 24px; color: #D4A574; font-weight: bold; margin: 20px 0; }
          .cta-button { display: inline-block; background-color: #E91E63; color: white; padding: 12px 30px; border-radius: 25px; text-decoration: none; margin-top: 20px; }
          .footer { text-align: center; margin-top: 40px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Tina's Sanctuary</h1>
            <p style="color: #999; margin: 10px 0 0 0;">Welcome to Our Membership</p>
          </div>

          <div class="content">
            <h2 style="color: #fff; margin-top: 0;">Membership Activated</h2>
            <p>Dear ${userName},</p>
            <p>Congratulations! Your ${membershipTier.toUpperCase()} membership is now active.</p>

            <div class="tier-badge">${membershipTier.toUpperCase()} MEMBER</div>

            <h3 style="color: #D4A574;">Your Benefits:</h3>
            <ul class="benefits-list">
              ${benefits.map((benefit) => `<li>${benefit}</li>`).join("")}
            </ul>

            <div class="price">K${monthlyPrice}/month</div>

            <p>Your membership will renew automatically each month. You can manage your membership and view your bookings from your member portal.</p>

            <a href="https://tinassanctuary.zm/member-portal" class="cta-button">Access Member Portal</a>
          </div>

          <div class="footer">
            <p>© 2026 Tina's Sanctuary. All rights reserved.</p>
            <p>183 Ibex Hill, Lusaka, Zambia | +260 572 782 539</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({
        to: userEmail,
        subject: `Welcome to Tina's Sanctuary ${membershipTier.toUpperCase()} Membership`,
        html,
      }),
    });

    if (!response.ok) {
      console.error("[Email] Failed to send email:", await response.text());
    } else {
      console.log("[Email] Membership confirmation sent to", userEmail);
    }
  } catch (error) {
    console.error("[Email] Error sending email:", error);
  }
}
