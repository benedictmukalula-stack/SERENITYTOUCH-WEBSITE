import Stripe from "stripe";

let stripe: Stripe | null = null;

function getStripe() {
  if (!stripe && process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripe;
}

export const STRIPE_PRODUCTS = {
  silver: {
    name: "Silver Membership",
    description: "1 massage per month + 10% off services",
    priceInCents: 80000,
  },
  gold: {
    name: "Gold Membership",
    description: "2 massages per month + 20% off services + VIP booking",
    priceInCents: 160000,
  },
  platinum: {
    name: "Platinum Membership",
    description: "Unlimited massages + 30% off services + 24/7 concierge",
    priceInCents: 320000,
  },
};

export async function createCheckoutSession(
  userId: number,
  userEmail: string,
  userName: string,
  membershipTier: "silver" | "gold" | "platinum",
  successUrl: string,
  cancelUrl: string
) {
  const product = STRIPE_PRODUCTS[membershipTier];
  const stripeClient = getStripe();
  if (!stripeClient) throw new Error("Stripe not initialized");

  try {
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.priceInCents,
            recurring: {
              interval: "month",
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer_email: userEmail,
      client_reference_id: userId.toString(),
      metadata: {
        user_id: userId.toString(),
        membership_tier: membershipTier,
        customer_email: userEmail,
        customer_name: userName,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
    });

    return session;
  } catch (error) {
    console.error("[Stripe] Error creating checkout session:", error);
    throw error;
  }
}

export async function handleSubscriptionCreated(
  stripeSubscriptionId: string,
  userId: number
) {
  const stripeClient = getStripe();
  if (!stripeClient) throw new Error("Stripe not initialized");

  try {
    const subscription = await stripeClient.subscriptions.retrieve(stripeSubscriptionId);
    console.log(`[Stripe] Subscription created for user ${userId}:`, subscription.id);
    return subscription;
  } catch (error) {
    console.error("[Stripe] Error retrieving subscription:", error);
    throw error;
  }
}

export async function handlePaymentSucceeded(paymentIntentId: string) {
  const stripeClient = getStripe();
  if (!stripeClient) throw new Error("Stripe not initialized");

  try {
    const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);
    console.log("[Stripe] Payment succeeded:", paymentIntent.id);
    return paymentIntent;
  } catch (error) {
    console.error("[Stripe] Error retrieving payment intent:", error);
    throw error;
  }
}

export { getStripe };
