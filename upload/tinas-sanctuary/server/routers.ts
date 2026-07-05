import { COOKIE_NAME } from "@shared/const";
  import { getSessionCookieOptions } from "./_core/cookies";
  import { systemRouter } from "./_core/systemRouter";
  import { publicProcedure, router } from "./_core/trpc";
  import { protectedProcedure } from "./_core/trpc";
  import { createBooking, getBookingsByUserId, getMemberByUserId, createMember, getGalleryImages } from "./db";
  import { z } from "zod";
  import { sendBookingConfirmationEmail, sendMembershipConfirmationEmail } from "./email";
import { createCheckoutSession } from "./stripe";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  booking: router({
    create: protectedProcedure
      .input(z.object({
        serviceType: z.string(),
        therapistName: z.string().optional(),
        bookingDate: z.date(),
        duration: z.number(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await createBooking({
          userId: ctx.user.id,
          serviceType: input.serviceType,
          therapistName: input.therapistName,
          bookingDate: input.bookingDate,
          duration: input.duration,
          notes: input.notes,
          status: "pending",
        });
        
        // Send confirmation email
        if (ctx.user?.email) {
          await sendBookingConfirmationEmail(
            ctx.user.email || "",
            ctx.user.name || "Member",
            input.serviceType,
            input.bookingDate,
            0
          );
        }
      }),
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getBookingsByUserId(ctx.user.id);
    }),
  }),

  member: router({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      return await getMemberByUserId(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        membershipTier: z.enum(["silver", "gold", "platinum"]),
      }))
      .mutation(async ({ ctx, input }) => {
        const tierLimits = {
          silver: 1,
          gold: 2,
          platinum: 999,
        };
        const tierPrices = {
          silver: 800,
          gold: 1600,
          platinum: 3200,
        };
        const renewalDate = new Date();
        renewalDate.setMonth(renewalDate.getMonth() + 1);
        
        const result = await createMember({
          userId: ctx.user.id,
          membershipTier: input.membershipTier,
          monthlySessionsLimit: tierLimits[input.membershipTier],
          renewalDate,
        });
        
        // Send membership confirmation email
        if (ctx.user?.email) {
          await sendMembershipConfirmationEmail(
            ctx.user.email || "",
            ctx.user.name || "Member",
            input.membershipTier,
            tierPrices[input.membershipTier]
          );
        }
        
        return result;
      }),
  }),

  gallery: router({
    list: publicProcedure
      .input(z.object({ category: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return await getGalleryImages(input?.category);
      }),
  }),

  payment: router({
    createCheckoutSession: protectedProcedure
      .input(z.object({
        membershipTier: z.enum(["silver", "gold", "platinum"]),
        successUrl: z.string(),
        cancelUrl: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const session = await createCheckoutSession(
          ctx.user.id,
          ctx.user.email || "",
          ctx.user.name || "Member",
          input.membershipTier,
          input.successUrl,
          input.cancelUrl
        );
        return { checkoutUrl: session.url };
      }),
  }),
});

export type AppRouter = typeof appRouter;
