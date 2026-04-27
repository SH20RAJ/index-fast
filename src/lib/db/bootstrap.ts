import { sqlClient } from "@/lib/db";

let initialized = false;
let inFlight: Promise<void> | null = null;

async function run(query: string) {
  await sqlClient.unsafe(query);
}

/**
 * Idempotent schema bootstrap.
 *
 * Safe to run on every server start: uses IF NOT EXISTS / ADD VALUE IF NOT EXISTS
 * everywhere, so it both creates the schema from scratch and evolves an
 * older database to the current shape without manual migrations.
 */
export async function ensureDbSchema() {
  if (initialized) {
    return;
  }

  if (inFlight) {
    await inFlight;
    return;
  }

  inFlight = (async () => {
    await run('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

    // --- Enums -------------------------------------------------------------
    await run(`DO $$ BEGIN
      CREATE TYPE submission_engine AS ENUM ('bing', 'indexnow', 'google', 'pingomatic', 'pingler');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;`);

    // Evolve the enum with engines added after the original deploy.
    await run(`ALTER TYPE submission_engine ADD VALUE IF NOT EXISTS 'yandex';`);
    await run(`ALTER TYPE submission_engine ADD VALUE IF NOT EXISTS 'baidu';`);
    await run(`ALTER TYPE submission_engine ADD VALUE IF NOT EXISTS 'naver';`);

    await run(`DO $$ BEGIN
      CREATE TYPE submission_status AS ENUM ('success', 'failed', 'pending');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;`);

    await run(`DO $$ BEGIN
      CREATE TYPE subscription_plan AS ENUM ('free', 'pro', 'agency');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;`);

    await run(`DO $$ BEGIN
      CREATE TYPE subscription_interval AS ENUM ('monthly', 'yearly');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;`);

    await run(`DO $$ BEGIN
      CREATE TYPE subscription_lifecycle_status AS ENUM ('inactive', 'trialing', 'active', 'past_due', 'canceled');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;`);

    // --- Tables ------------------------------------------------------------
    await run(`CREATE TABLE IF NOT EXISTS "users" (
      "id" text PRIMARY KEY,
      "email" text NOT NULL,
      "is_pro" boolean DEFAULT false,
      "dodo_subscription_id" text,
      "dodo_customer_id" text,
      "subscription_status" text,
      "api_key" text,
      "created_at" timestamp DEFAULT now(),
      "updated_at" timestamp DEFAULT now()
    );`);

    // Evolve users: api_key column + unique index (added after initial deploy).
    // Intentionally using a partial unique index (WHERE api_key IS NOT NULL)
    // instead of a standard UNIQUE constraint — this allows multiple rows with
    // NULL api_key, which Drizzle's .unique() would not. If Drizzle push/diff
    // is ever run against this DB it may flag this divergence.
    await run(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "api_key" text;`);
    await run(`CREATE UNIQUE INDEX IF NOT EXISTS "users_api_key_unique" ON "users"("api_key") WHERE "api_key" IS NOT NULL;`);

    await run(`CREATE TABLE IF NOT EXISTS "subscription_plans" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "code" subscription_plan NOT NULL UNIQUE,
      "name" text NOT NULL,
      "description" text,
      "monthly_price_usd" integer NOT NULL DEFAULT 0,
      "yearly_price_usd" integer NOT NULL DEFAULT 0,
      "website_limit" integer NOT NULL DEFAULT 1,
      "monthly_submission_limit" integer NOT NULL DEFAULT 1000,
      "ping_network_enabled" boolean NOT NULL DEFAULT false,
      "priority_support_enabled" boolean NOT NULL DEFAULT false,
      "features" jsonb,
      "created_at" timestamp DEFAULT now(),
      "updated_at" timestamp DEFAULT now()
    );`);

    await run(`CREATE TABLE IF NOT EXISTS "websites" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
      "url" text NOT NULL,
      "sitemap_url" text,
      "indexnow_key" text,
      "bing_api_key" text,
      "yandex_token" text,
      "baidu_token" text,
      "naver_token" text,
      "gsc_connected" boolean DEFAULT false,
      "site_health" jsonb,
      "last_sync_at" timestamp,
      "created_at" timestamp DEFAULT now()
    );`);

    // Evolve websites: new token columns (added after initial deploy).
    await run(`ALTER TABLE "websites" ADD COLUMN IF NOT EXISTS "yandex_token" text;`);
    await run(`ALTER TABLE "websites" ADD COLUMN IF NOT EXISTS "baidu_token" text;`);
    await run(`ALTER TABLE "websites" ADD COLUMN IF NOT EXISTS "naver_token" text;`);

    await run(`CREATE TABLE IF NOT EXISTS "user_subscriptions" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "user_id" text NOT NULL UNIQUE REFERENCES "users"("id") ON DELETE CASCADE,
      "plan_code" subscription_plan NOT NULL DEFAULT 'free',
      "status" subscription_lifecycle_status NOT NULL DEFAULT 'inactive',
      "interval" subscription_interval NOT NULL DEFAULT 'monthly',
      "current_period_start" timestamp,
      "current_period_end" timestamp,
      "cancel_at_period_end" boolean NOT NULL DEFAULT false,
      "provider" text,
      "provider_customer_id" text,
      "provider_subscription_id" text,
      "metadata" jsonb,
      "created_at" timestamp DEFAULT now(),
      "updated_at" timestamp DEFAULT now()
    );`);

    await run(`CREATE TABLE IF NOT EXISTS "url_inventory" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "website_id" uuid REFERENCES "websites"("id") ON DELETE CASCADE,
      "url" text NOT NULL,
      "hash" text,
      "is_indexed" boolean DEFAULT false,
      "ai_view_text" text,
      "discoverability_score" integer DEFAULT 0,
      "last_detected_at" timestamp DEFAULT now(),
      "last_submitted_at" timestamp
    );`);

    await run(`CREATE TABLE IF NOT EXISTS "submissions" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "website_id" uuid REFERENCES "websites"("id") ON DELETE CASCADE,
      "url" text NOT NULL,
      "engine" submission_engine NOT NULL,
      "status" submission_status NOT NULL,
      "error_message" text,
      "created_at" timestamp DEFAULT now()
    );`);

    await run(`CREATE TABLE IF NOT EXISTS "usage_events" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
      "website_id" uuid REFERENCES "websites"("id") ON DELETE SET NULL,
      "metric" text NOT NULL,
      "quantity" integer NOT NULL DEFAULT 1,
      "metadata" jsonb,
      "occurred_at" timestamp DEFAULT now()
    );`);

    await run(`CREATE TABLE IF NOT EXISTS "cron_jobs" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "website_id" uuid NOT NULL REFERENCES "websites"("id") ON DELETE CASCADE,
      "enabled" boolean NOT NULL DEFAULT true,
      "frequency" text NOT NULL,
      "engine" submission_engine NOT NULL,
      "source_mode" text NOT NULL,
      "last_run_at" timestamp,
      "next_run_at" timestamp,
      "created_at" timestamp DEFAULT now(),
      "updated_at" timestamp DEFAULT now()
    );`);

    await run(`CREATE TABLE IF NOT EXISTS "gsc_properties" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
      "site_url" text NOT NULL,
      "permission_level" text NOT NULL,
      "already_imported" boolean DEFAULT false,
      "last_synced_at" timestamp DEFAULT now()
    );`);

    await run(`CREATE UNIQUE INDEX IF NOT EXISTS "idx_gsc_props_user_site_unique" ON "gsc_properties"("user_id", "site_url");`);

    // --- Indexes -----------------------------------------------------------
    await run(`CREATE INDEX IF NOT EXISTS "idx_websites_user_id" ON "websites"("user_id");`);
    await run(`CREATE INDEX IF NOT EXISTS "idx_websites_created_at" ON "websites"("created_at");`);
    await run(`CREATE INDEX IF NOT EXISTS "idx_url_inventory_website_id" ON "url_inventory"("website_id");`);
    await run(`CREATE INDEX IF NOT EXISTS "idx_submissions_website_id" ON "submissions"("website_id");`);
    await run(`CREATE INDEX IF NOT EXISTS "idx_submissions_created_at" ON "submissions"("created_at");`);
    await run(`CREATE INDEX IF NOT EXISTS "idx_usage_events_user_id" ON "usage_events"("user_id");`);
    await run(`CREATE INDEX IF NOT EXISTS "idx_usage_events_occurred_at" ON "usage_events"("occurred_at");`);
    await run(`CREATE INDEX IF NOT EXISTS "idx_cron_jobs_website_id" ON "cron_jobs"("website_id");`);
    await run(`CREATE INDEX IF NOT EXISTS "idx_cron_jobs_next_run_at" ON "cron_jobs"("next_run_at");`);

    initialized = true;
  })();

  try {
    await inFlight;
  } catch (err) {
    // Reset so a subsequent request can retry instead of being permanently
    // stuck with a rejected cached promise.
    initialized = false;
    throw err;
  } finally {
    inFlight = null;
  }
}
