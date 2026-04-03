import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const portalCredentials = mysqlTable("portalCredentials", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  portal: mysqlEnum("portal", ["olx", "pracuj"]).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  passwordEncrypted: text("passwordEncrypted").notNull(),
  isActive: int("isActive").default(1).notNull(),
  lastLoginAt: timestamp("lastLoginAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PortalCredential = typeof portalCredentials.$inferSelect;
export type InsertPortalCredential = typeof portalCredentials.$inferInsert;

export const searchCriteria = mysqlTable("searchCriteria", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  portal: mysqlEnum("portal", ["olx", "pracuj", "both"]).notNull(),
  position: varchar("position", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }),
  keywords: text("keywords"),
  isActive: int("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SearchCriteria = typeof searchCriteria.$inferSelect;
export type InsertSearchCriteria = typeof searchCriteria.$inferInsert;

export const jobOffers = mysqlTable("jobOffers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  portal: mysqlEnum("portal", ["olx", "pracuj"]).notNull(),
  externalId: varchar("externalId", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  location: varchar("location", { length: 255 }),
  description: text("description"),
  url: text("url").notNull(),
  salary: varchar("salary", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type JobOffer = typeof jobOffers.$inferSelect;
export type InsertJobOffer = typeof jobOffers.$inferInsert;

export const jobApplications = mysqlTable("jobApplications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  offerId: int("offerId").notNull().references(() => jobOffers.id, { onDelete: "cascade" }),
  portal: mysqlEnum("portal", ["olx", "pracuj"]).notNull(),
  status: mysqlEnum("status", ["pending", "submitted", "failed", "viewed"]).default("pending").notNull(),
  appliedAt: timestamp("appliedAt"),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type JobApplication = typeof jobApplications.$inferSelect;
export type InsertJobApplication = typeof jobApplications.$inferInsert;

export const userProfiles = mysqlTable("userProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  firstName: varchar("firstName", { length: 255 }),
  lastName: varchar("lastName", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  cv: text("cv"),
  coverLetterTemplate: text("coverLetterTemplate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;