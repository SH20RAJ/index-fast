import { pgTable, text, timestamp, uuid, boolean, integer, pgEnum, jsonb, index } from "drizzle-orm/pg-core";

/**
 * Submission Engine Types
 */
export const submissionEngineEnum = pgEnum("submission_engine", [
  "bing",
  "indexnow",
  "google",
  "pingomatic",
  "pingler",
  "yandex",
  "baidu",
  "naver",
]);

/**
 * Status of each submission attempt
 */
export const submissionStatusEnum = pgEnum("submission_status", [
  "success",
  "failed",
  "pending",
]);

export const subscriptionPlanEnum = pgEnum("subscription_plan", [
  "free",
  "pro",
  "agency",
]);

export const subscriptionIntervalEnum = pgEnum("subscription_interval", [
  "monthly",
  "yearly",
]);

export const subscriptionLifecycleStatusEnum = pgEnum("subscription_lifecycle_status", [
  "inactive",
  "trialing",
  "active",
  "past_due",
  "canceled",
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
  apiKey: text("api_key").unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const subscriptionPlans = pgTable("subscription_plans", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: subscriptionPlanEnum("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  monthlyPriceUsd: integer("monthly_price_usd").notNull().default(0),
  yearlyPriceUsd: integer("yearly_price_usd").notNull().default(0),
  websiteLimit: integer("website_limit").notNull().default(1),
  monthlySubmissionLimit: integer("monthly_submission_limit").notNull().default(1000),
  pingNetworkEnabled: boolean("ping_network_enabled").notNull().default(false),
  prioritySupportEnabled: boolean("priority_support_enabled").notNull().default(false),
  features: jsonb("features"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userSubscriptions = pgTable("user_subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull().unique(),
  planCode: subscriptionPlanEnum("plan_code").notNull().default("free"),
  status: subscriptionLifecycleStatusEnum("status").notNull().default("inactive"),
  interval: subscriptionIntervalEnum("interval").notNull().default("monthly"),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
  provider: text("provider"),
  providerCustomerId: text("provider_customer_id"),
  providerSubscriptionId: text("provider_subscription_id"),
  metadata: jsonb("metadata"),
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
  yandexToken: text("yandex_token"),
  baiduToken: text("baidu_token"),
  naverToken: text("naver_token"),
  gscConnected: boolean("gsc_connected").default(false),
  siteHealth: jsonb("site_health"), // Storing errors, warnings from GSC/Audit
  lastSyncAt: timestamp("last_sync_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  userIdIdx: index("idx_websites_user_id").on(table.userId),
  createdAtIdx: index("idx_websites_created_at").on(table.createdAt),
}));

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
}, (table) => ({
  websiteIdIdx: index("idx_url_inventory_website_id").on(table.websiteId),
}));

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
}, (table) => ({
  websiteIdIdx: index("idx_submissions_website_id").on(table.websiteId),
  createdAtIdx: index("idx_submissions_created_at").on(table.createdAt),
}));

export const usageEvents = pgTable("usage_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  websiteId: uuid("website_id").references(() => websites.id, { onDelete: "set null" }),
  metric: text("metric").notNull(),
  quantity: integer("quantity").notNull().default(1),
  metadata: jsonb("metadata"),
  occurredAt: timestamp("occurred_at").defaultNow(),
}, (table) => ({
  userIdIdx: index("idx_usage_events_user_id").on(table.userId),
  occurredAtIdx: index("idx_usage_events_occurred_at").on(table.occurredAt),
}));

/**
 * Cron Jobs: Automated submission scheduling
 */
export const cronJobs = pgTable("cron_jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  websiteId: uuid("website_id").references(() => websites.id, { onDelete: "cascade" }).notNull(),
  enabled: boolean("enabled").default(true).notNull(),
  frequency: text("frequency").notNull(), // 'hourly', 'daily', 'weekly', 'monthly'
  engine: submissionEngineEnum("engine").notNull(), // 'indexnow', 'bing', 'google'
  sourceMode: text("source_mode").notNull(), // 'sitemap' or 'inventory'
  lastRunAt: timestamp("last_run_at"),
  nextRunAt: timestamp("next_run_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  websiteIdIdx: index("idx_cron_jobs_website_id").on(table.websiteId),
  nextRunAtIdx: index("idx_cron_jobs_next_run_at").on(table.nextRunAt),
}));

/**
 * Chat System: History and project-based AI context
 */
export const chatConversations = pgTable("chat_conversations", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  websiteId: uuid("website_id").references(() => websites.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userIdIdx: index("idx_chat_conv_user_id").on(table.userId),
}));

export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  conversationId: uuid("conversation_id").references(() => chatConversations.id, { onDelete: "cascade" }).notNull(),
  role: text("role").notNull(), // 'system', 'user', 'assistant', 'tool'
  content: text("content").notNull(),
  toolCalls: jsonb("tool_calls"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  conversationIdIdx: index("idx_chat_msg_conv_id").on(table.conversationId),
}));

/**
 * Exporting Types for Drizzle
 */
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type NewSubscriptionPlan = typeof subscriptionPlans.$inferInsert;
export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type NewUserSubscription = typeof userSubscriptions.$inferInsert;
export type Website = typeof websites.$inferSelect;
export type NewWebsite = typeof websites.$inferInsert;
export type UrlInventory = typeof urlInventory.$inferSelect;
export type NewUrlInventory = typeof urlInventory.$inferInsert;
export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
export type UsageEvent = typeof usageEvents.$inferSelect;
export type NewUsageEvent = typeof usageEvents.$inferInsert;
export type CronJob = typeof cronJobs.$inferSelect;
export type NewCronJob = typeof cronJobs.$inferInsert;
export type ChatConversation = typeof chatConversations.$inferSelect;
export type NewChatConversation = typeof chatConversations.$inferInsert;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type NewChatMessage = typeof chatMessages.$inferInsert;

