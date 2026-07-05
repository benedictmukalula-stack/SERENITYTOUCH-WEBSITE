import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { referrals, referralRewards, InsertReferral, InsertReferralReward } from "../drizzle/schema";
import { ENV } from "./_core/env";
import { nanoid } from "nanoid";

let _db: ReturnType<typeof drizzle> | null = null;

async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function generateReferralCode(referrerId: number): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const code = `TINA${nanoid(8).toUpperCase()}`;

  const referral: InsertReferral = {
    referrerId: referrerId,
    referralCode: code,
    status: "pending",
    rewardAmount: 0,
  };

  await db.insert(referrals).values(referral);
  return code;
}

export async function getReferralStats(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const userReferrals = await db
    .select()
    .from(referrals)
    .where(eq(referrals.referrerId, userId));

  const rewards = await db
    .select()
    .from(referralRewards)
    .where(eq(referralRewards.userId, userId));

  const totalReferrals = userReferrals.length;
  const completedReferrals = userReferrals.filter((r) => r.status === "completed").length;
  const totalRewards = rewards.reduce((sum, r) => sum + r.rewardValue, 0);
  const claimedRewards = rewards.filter((r) => r.claimed).reduce((sum, r) => sum + r.rewardValue, 0);

  return {
    totalReferrals,
    completedReferrals,
    totalRewards,
    claimedRewards,
    pendingRewards: totalRewards - claimedRewards,
    referrals: userReferrals,
    rewards,
  };
}

export async function claimReward(rewardId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    await db
      .update(referralRewards)
      .set({ claimed: 1, claimedAt: new Date() })
      .where(eq(referralRewards.id, rewardId));

    return true;
  } catch (error) {
    console.error("Failed to claim reward:", error);
    return false;
  }
}

export async function completeReferral(referralCode: string, referredUserId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    const referral = await db
    .select()
    .from(referrals)
    .where(eq(referrals.referralCode, referralCode))
    .limit(1);

    if (!referral.length) return false;

    const ref = referral[0];
    const rewardAmount = 500; // K500 credit

    await db
      .update(referrals)
      .set({
        status: "completed",
        referredId: referredUserId,
        rewardAmount: rewardAmount,
        completedAt: new Date(),
      })
      .where(eq(referrals.id, ref.id));

    // Create reward record
    const reward: InsertReferralReward = {
      userId: ref.referrerId,
      referralId: ref.id,
      rewardType: "credit",
      rewardValue: rewardAmount,
      description: `Referral reward for ${referredUserId}`,
    };

    await db.insert(referralRewards).values(reward);

    return true;
  } catch (error) {
    console.error("Failed to complete referral:", error);
    return false;
  }
}
