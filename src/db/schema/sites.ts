import { pgTable, text, timestamp, boolean, integer, jsonb, pgEnum } from "drizzle-orm/pg-core";

export const indexStatusEnum = pgEnum("index_status", ["PENDING", "SUBMITTED", "INDEXED", "FAILED"]);
export const engineEnum = pgEnum("engine", ["BING_BATCH", "INDEXNOW", "GOOGLE_PING"]);

export const users = pgTable("user", {
  id: text("id").primaryKey(), // This will be the Stack Auth User UUID
  name: text("name"),
  email: text("email").notNull().unique(),
  image: text("image"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});

export const sites = pgTable("site", {
  id: text("id").primaryKey(),
  url: text("url").notNull().unique(),
  ownerId: text("ownerId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  bingApiKey: text("bingApiKey"),
  indexNowKey: text("indexNowKey"),
  sitemapUrl: text("sitemapUrl"),
  lastSync: timestamp("lastSync", { mode: "date" }),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow(),
});

export const siteUrls = pgTable("site_url", {
  id: text("id").primaryKey(),
  siteId: text("siteId")
    .notNull()
    .references(() => sites.id, { onDelete: "cascade" }),
  url: text("url").notNull().unique(),
  lastSubmitted: timestamp("lastSubmitted", { mode: "date" }),
  status: indexStatusEnum("status").default("PENDING"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow(),
});

export const submissionLogs = pgTable("submission_log", {
  id: text("id").primaryKey(),
  siteUrlId: text("siteUrlId")
    .notNull()
    .references(() => siteUrls.id, { onDelete: "cascade" }),
  engine: engineEnum("engine").notNull(),
  statusCode: integer("statusCode"),
  response: jsonb("response"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});
