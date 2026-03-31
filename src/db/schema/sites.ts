import { pgTable, text, timestamp, boolean, integer, jsonb, pgEnum, primaryKey } from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";

export const indexStatusEnum = pgEnum("index_status", ["PENDING", "SUBMITTED", "INDEXED", "FAILED"]);
export const engineEnum = pgEnum("engine", ["BING_BATCH", "INDEXNOW", "GOOGLE_PING"]);

export const users = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

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
