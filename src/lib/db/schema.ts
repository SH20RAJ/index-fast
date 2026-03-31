import { pgTable, text, timestamp, uuid, boolean, integer, pgEnum } from "drizzle-orm/pg-core";

export const submissionEngineEnum = pgEnum("submission_engine", [
  "bing",
  "indexnow",
  "google",
  "pingomatic",
  "pingler",
]);

export const submissionStatusEnum = pgEnum("submission_status", [
  "success",
  "failed",
  "pending",
]);

export const websites = pgTable("websites", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(), // Linked to Stack Auth user ID
  url: text("url").notNull(),
  sitemapUrl: text("sitemap_url"),
  indexNowKey: text("indexnow_key"),
  bingApiKey: text("bing_api_key"),
  isPro: boolean("is_pro").default(false),
  lastSyncAt: timestamp("last_sync_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const urlInventory = pgTable("url_inventory", {
  id: uuid("id").defaultRandom().primaryKey(),
  websiteId: uuid("website_id").references(() => websites.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  hash: text("hash"), // To track content changes
  lastDetectedAt: timestamp("last_detected_at").defaultNow(),
  lastSubmittedAt: timestamp("last_submitted_at"),
});

export const submissions = pgTable("submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  websiteId: uuid("website_id").references(() => websites.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  engine: submissionEngineEnum("engine").notNull(),
  status: submissionStatusEnum("status").notNull(),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Website = typeof websites.$inferSelect;
export type NewWebsite = typeof websites.$inferInsert;
export type UrlInventory = typeof urlInventory.$inferSelect;
export type NewUrlInventory = typeof urlInventory.$inferInsert;
export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
