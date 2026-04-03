import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, portalCredentials, searchCriteria, jobApplications, jobOffers, userProfiles } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
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

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Portal Credentials
export async function getPortalCredentials(userId: number, portal?: string) {
  const db = await getDb();
  if (!db) return [];

  if (portal) {
    return await db
      .select()
      .from(portalCredentials)
      .where(and(eq(portalCredentials.userId, userId), eq(portalCredentials.portal, portal as any)));
  }

  return await db.select().from(portalCredentials).where(eq(portalCredentials.userId, userId));
}

// Search Criteria
export async function getSearchCriteria(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(searchCriteria).where(eq(searchCriteria.userId, userId));
}

// Job Applications
export async function getJobApplications(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(jobApplications).where(eq(jobApplications.userId, userId));
}

export async function getApplicationStats(userId: number) {
  const db = await getDb();
  if (!db) return { total: 0, submitted: 0, failed: 0, pending: 0 };

  const apps = await db.select().from(jobApplications).where(eq(jobApplications.userId, userId));

  return {
    total: apps.length,
    submitted: apps.filter((a) => a.status === "submitted").length,
    failed: apps.filter((a) => a.status === "failed").length,
    pending: apps.filter((a) => a.status === "pending").length,
  };
}

// User Profile
export async function getUserProfile(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function upsertUserProfile(userId: number, data: any) {
  const db = await getDb();
  if (!db) return null;

  const existing = await getUserProfile(userId);

  if (existing) {
    await db.update(userProfiles).set(data).where(eq(userProfiles.userId, userId));
  } else {
    await db.insert(userProfiles).values({ userId, ...data });
  }

  return await getUserProfile(userId);
}
