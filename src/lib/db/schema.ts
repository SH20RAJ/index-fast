import { pgTable, text, timestamp, uuid, boolean, integer, pgEnum, jsonb } from "drizzle-orm/pg-core";

/**
 * Submission Engine Types
 */
export const submissionEngineEnum = pgEnum("submission_engine", [
  "bing",
  "indexnow",
  "google",
  "pingomatic",
  "pingler",
]);

/**
 * Status of each submission attempt
 */
export const submissionStatusEnum = pgEnum("submission_status", [
  "success",
  "failed",
  "pending",
]);

/**
 * Users table: Storing global settings and subscription info (Dodo Payments)
 */
export const users = pgTable("users", {
  id: text("id").primaryKey(), // Stack Auth user ID
  email: text("email").notNull(),
  isPro: boolean("is_pro").default(false),
  dodoSubscriptionId: text("dodo_subscription_id"),
  dodoCustomerId: text("dodo_customer_id"),
  subscriptionStatus: text("subscription_status"), // active, trialing, canceled, etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/**
 * Websites table: Storing properties to be indexed
 */
export const websites = pgTable("websites", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  url: text("url").notNull(),
  sitemapUrl: text("sitemap_url"),
  indexNowKey: text("indexnow_key"),
  bingApiKey: text("bing_api_key"),
  gscConnected: boolean("gsc_connected").default(false),
  siteHealth: jsonb("site_health"), // Storing errors, warnings from GSC/Audit
  lastSyncAt: timestamp("last_sync_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * URL Inventory: Tracking individual URLs and their AI metrics
 */
export const urlInventory = pgTable("url_inventory", {
  id: uuid("id").defaultRandom().primaryKey(),
  websiteId: uuid("website_id").references(() => websites.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  hash: text("hash"), // To track content changes and skip duplicates
  isIndexed: boolean("is_indexed").default(false),
  aiViewText: text("ai_view_text"), // Stripped content for LLMs (ChatGPT/Claude)
  discoverabilityScore: integer("discoverability_score").default(0), // AI citing probability
  lastDetectedAt: timestamp("last_detected_at").defaultNow(),
  lastSubmittedAt: timestamp("last_submitted_at"),
});

/**
 * Submissions: Log of every attempt to notify search engines
 */
export const submissions = pgTable("submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  websiteId: uuid("website_id").references(() => websites.id, { onDelete: "cascade" }),
  url: text("url").notNull(), // Can be a single URL or "Batch #X"
  engine: submissionEngineEnum("engine").notNull(),
  status: submissionStatusEnum("status").notNull(),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * Exporting Types for Drizzle
 */
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Website = typeof websites.$inferSelect;
export type NewWebsite = typeof websites.$inferInsert;
export type UrlInventory = typeof urlInventory.$inferSelect;
export type NewUrlInventory = typeof urlInventory.$inferInsert;
export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
