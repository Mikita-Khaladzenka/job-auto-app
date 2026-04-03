import { describe, it, expect, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("Portal Credentials Router", () => {
  it("should save portal credentials", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.portal.saveCredentials({
      portal: "olx",
      email: "test@olx.com",
      password: "password123",
    });

    expect(result).toEqual({ success: true });
  });

  it("should get portal credentials", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // First save credentials
    await caller.portal.saveCredentials({
      portal: "olx",
      email: "test@olx.com",
      password: "password123",
    });

    // Then retrieve them
    const credentials = await caller.portal.getCredentials();

    expect(Array.isArray(credentials)).toBe(true);
  });
});

describe("Search Router", () => {
  it("should save search criteria", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.search.saveCriteria({
      name: "Frontend Developer",
      portal: "olx",
      position: "Frontend Developer",
      location: "Warszawa",
      keywords: "React, TypeScript",
    });

    expect(result).toEqual({ success: true });
  });

  it("should get search criteria", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // First save criteria
    await caller.search.saveCriteria({
      name: "Frontend Developer",
      portal: "olx",
      position: "Frontend Developer",
      location: "Warszawa",
    });

    // Then retrieve them
    const criteria = await caller.search.getCriteria();

    expect(Array.isArray(criteria)).toBe(true);
  });
});

describe("Profile Router", () => {
  it("should update user profile", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.profile.update({
      firstName: "Jan",
      lastName: "Kowalski",
      phone: "+48 123 456 789",
      cv: undefined,
      coverLetterTemplate: undefined,
    });

    expect(result).toBeDefined();
  });

  it("should get user profile", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // First update profile
    await caller.profile.update({
      firstName: "Jan",
      lastName: "Kowalski",
      phone: "+48 123 456 789",
      cv: undefined,
      coverLetterTemplate: undefined,
    });

    // Then retrieve it
    const profile = await caller.profile.get();

    expect(profile).toBeDefined();
  });
});

describe("Applications Router", () => {
  it("should get application stats", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const stats = await caller.applications.getStats();

    expect(stats).toHaveProperty("total");
    expect(stats).toHaveProperty("submitted");
    expect(stats).toHaveProperty("failed");
    expect(stats).toHaveProperty("pending");
  });

  it("should get application history", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const history = await caller.applications.getHistory();

    expect(Array.isArray(history)).toBe(true);
  });
});
