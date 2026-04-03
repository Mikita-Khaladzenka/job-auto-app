import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  portal: router({
    saveCredentials: protectedProcedure
      .input((val: any) => ({
        portal: val.portal as "olx" | "pracuj",
        email: val.email as string,
        password: val.password as string,
      }))
      .mutation(async ({ ctx, input }) => {
        const { encryptPassword } = await import("./encryption");
        const { getDb } = await import("./db");
        const { portalCredentials } = await import("../drizzle/schema");
        const { eq, and } = await import("drizzle-orm");

        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const encrypted = encryptPassword(input.password);

        // Check if exists
        const existing = await db
          .select()
          .from(portalCredentials)
          .where(
            and(
              eq(portalCredentials.userId, ctx.user.id),
              eq(portalCredentials.portal, input.portal)
            )
          )
          .limit(1);

        if (existing.length > 0) {
          await db
            .update(portalCredentials)
            .set({
              email: input.email,
              passwordEncrypted: encrypted,
              updatedAt: new Date(),
            })
            .where(
              and(
                eq(portalCredentials.userId, ctx.user.id),
                eq(portalCredentials.portal, input.portal)
              )
            );
        } else {
          await db.insert(portalCredentials).values({
            userId: ctx.user.id,
            portal: input.portal,
            email: input.email,
            passwordEncrypted: encrypted,
          });
        }

        return { success: true };
      }),

    getCredentials: protectedProcedure.query(async ({ ctx }) => {
      const { getPortalCredentials } = await import("./db");
      const creds = await getPortalCredentials(ctx.user.id);
      return creds.map((c) => ({
        id: c.id,
        portal: c.portal,
        email: c.email,
        isActive: c.isActive,
      }));
    }),
  }),

  search: router({
    saveCriteria: protectedProcedure
      .input((val: any) => ({
        name: val.name as string,
        portal: val.portal as "olx" | "pracuj" | "both",
        position: val.position as string,
        location: val.location as string,
        keywords: val.keywords as string | undefined,
      }))
      .mutation(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const { searchCriteria } = await import("../drizzle/schema");

        const db = await getDb();
        if (!db) throw new Error("Database not available");

        await db.insert(searchCriteria).values({
          userId: ctx.user.id,
          name: input.name,
          portal: input.portal,
          position: input.position,
          location: input.location,
          keywords: input.keywords,
        });

        return { success: true };
      }),

    getCriteria: protectedProcedure.query(async ({ ctx }) => {
      const { getSearchCriteria } = await import("./db");
      return await getSearchCriteria(ctx.user.id);
    }),

    runSearch: protectedProcedure
      .input((val: any) => ({
        portal: val.portal as "olx" | "pracuj" | "both",
        position: val.position as string,
        location: val.location as string,
      }))
      .mutation(async ({ ctx, input }) => {
        const { JobAutomationService } = await import("./automation.service");
        const { getUserProfile } = await import("./db");

        const userProfile = await getUserProfile(ctx.user.id);
        if (!userProfile) {
          throw new Error("User profile not found. Please complete your profile first.");
        }

        const service = new JobAutomationService();
        await service.initialize();

        try {
          const result = await service.searchAndApply(
            ctx.user.id,
            input.portal,
            input.position,
            input.location,
            {
              name: `${userProfile.firstName || ""} ${userProfile.lastName || ""}`.trim(),
              email: ctx.user.email || "",
              phone: userProfile.phone || "",
            }
          );

          return result;
        } finally {
          await service.close();
        }
      }),
  }),

  applications: router({
    getHistory: protectedProcedure.query(async ({ ctx }) => {
      const { getDb } = await import("./db");
      const { jobApplications, jobOffers } = await import("../drizzle/schema");
      const { eq } = await import("drizzle-orm");

      const db = await getDb();
      if (!db) return [];

      const apps = await db
        .select()
        .from(jobApplications)
        .where(eq(jobApplications.userId, ctx.user.id));

      // Enrich with offer details
      const enriched = await Promise.all(
        apps.map(async (app) => {
          const offer = await db
            .select()
            .from(jobOffers)
            .where(eq(jobOffers.id, app.offerId))
            .limit(1);

          return {
            ...app,
            offer: offer[0] || null,
          };
        })
      );

      return enriched;
    }),

    getStats: protectedProcedure.query(async ({ ctx }) => {
      const { getApplicationStats } = await import("./db");
      return await getApplicationStats(ctx.user.id);
    }),
  }),

  profile: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const { getUserProfile } = await import("./db");
      return await getUserProfile(ctx.user.id);
    }),

    update: protectedProcedure
      .input((val: any) => ({
        firstName: val.firstName as string | undefined,
        lastName: val.lastName as string | undefined,
        phone: val.phone as string | undefined,
        cv: val.cv as string | undefined,
        coverLetterTemplate: val.coverLetterTemplate as string | undefined,
      }))
      .mutation(async ({ ctx, input }) => {
        const { upsertUserProfile } = await import("./db");
        return await upsertUserProfile(ctx.user.id, input);
      }),
  }),
});

export type AppRouter = typeof appRouter;
