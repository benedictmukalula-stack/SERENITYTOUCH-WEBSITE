import { nanoid } from "nanoid";
import { getDb } from "./db";
import { giftCards } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export async function generateGiftCard(
  amount: number,
  purchasedBy: number,
  recipientEmail?: string,
  recipientName?: string,
  message?: string
): Promise<string | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const code = `TINA-${nanoid(12).toUpperCase()}`;
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 year expiry

    await db.insert(giftCards).values({
      code,
      amount,
      purchasedBy,
      recipientEmail,
      recipientName,
      message,
      isRedeemed: 0,
      expiresAt,
    });

    return code;
  } catch (error) {
    console.error("[GiftCard] Failed to generate:", error);
    return null;
  }
}

export async function redeemGiftCard(code: string, userId: number): Promise<number | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const card = await db.select().from(giftCards).where(eq(giftCards.code, code)).limit(1);

    if (card.length === 0) {
      console.error("[GiftCard] Card not found:", code);
      return null;
    }

    const giftCard = card[0];

    // Check if already redeemed
    if (giftCard.isRedeemed) {
      console.error("[GiftCard] Card already redeemed:", code);
      return null;
    }

    // Check expiry
    if (giftCard.expiresAt && new Date(giftCard.expiresAt) < new Date()) {
      console.error("[GiftCard] Card expired:", code);
      return null;
    }

    // Mark as redeemed
    await db
      .update(giftCards)
      .set({
        isRedeemed: 1,
        redeemedBy: userId,
        redeemedAt: new Date(),
      })
      .where(eq(giftCards.code, code));

    return giftCard.amount;
  } catch (error) {
    console.error("[GiftCard] Failed to redeem:", error);
    return null;
  }
}

export async function getGiftCardBalance(code: string): Promise<{ balance: number; isValid: boolean } | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const card = await db.select().from(giftCards).where(eq(giftCards.code, code)).limit(1);

    if (card.length === 0) return { balance: 0, isValid: false };

    const giftCard = card[0];
    const isExpired = giftCard.expiresAt && new Date(giftCard.expiresAt) < new Date();
    const isValid = !giftCard.isRedeemed && !isExpired;

    return {
      balance: isValid ? giftCard.amount : 0,
      isValid,
    };
  } catch (error) {
    console.error("[GiftCard] Failed to get balance:", error);
    return null;
  }
}
