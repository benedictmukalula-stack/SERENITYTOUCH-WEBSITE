import { Request, Response } from "express";
import { getStripe } from "./stripe";
import { getDb } from "./db";
import { users, members } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const stripe = getStripe();

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    console.error("[Webhook] Stripe not initialized or webhook secret missing");
    return res.status(500).json({ error: "Webhook not configured" });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("[Webhook] Signature verification failed:", err);
    return res.status(400).send(`Webhook Error: ${err}`);
  }

  // Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({ verified: true });
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Webhook] Database not available");
    return res.status(500).json({ error: "Database unavailable" });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any;
        console.log("[Webhook] Checkout session completed:", session.id);

        if (session.client_reference_id && session.metadata?.membership_tier) {
          const userId = parseInt(session.client_reference_id);
          const membershipTier = session.metadata.membership_tier;

          // Update or create member record
          const tierLimits = {
            silver: 1,
            gold: 2,
            platinum: 999,
          };

          const renewalDate = new Date();
          renewalDate.setMonth(renewalDate.getMonth() + 1);

          await db
            .insert(members)
            .values({
              userId,
              membershipTier,
              monthlySessionsLimit: tierLimits[membershipTier as keyof typeof tierLimits],
              renewalDate,
              isActive: 1,
            })
            .onDuplicateKeyUpdate({
              set: {
                membershipTier,
                isActive: 1,
                renewalDate,
              },
            });

          console.log(`[Webhook] Member ${userId} upgraded to ${membershipTier}`);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as any;
        console.log("[Webhook] Subscription updated:", subscription.id);

        if (subscription.metadata?.user_id) {
          const userId = parseInt(subscription.metadata.user_id);

          // Update member status based on subscription status
          const isActive =
            subscription.status === "active" ? 1 : 0;

          await db
            .update(members)
            .set({ isActive })
            .where(eq(members.userId, userId));

          console.log(`[Webhook] Member ${userId} subscription status: ${subscription.status}`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any;
        console.log("[Webhook] Subscription deleted:", subscription.id);

        if (subscription.metadata?.user_id) {
          const userId = parseInt(subscription.metadata.user_id);

          // Mark membership as inactive
          await db
            .update(members)
            .set({ isActive: 0 })
            .where(eq(members.userId, userId));

          console.log(`[Webhook] Member ${userId} membership cancelled`);
        }
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as any;
        console.log("[Webhook] Payment succeeded:", paymentIntent.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as any;
        console.log("[Webhook] Payment failed:", paymentIntent.id);
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("[Webhook] Error processing event:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
}
