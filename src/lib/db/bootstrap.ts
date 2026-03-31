import { sqlClient } from "@/lib/db";

let initialized = false;
let inFlight: Promise<void> | null = null;

async function run(query: string) {
  await sqlClient.unsafe(query);
}

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

    await run(`DO $$ BEGIN
      CREATE TYPE submission_engine AS ENUM ('bing', 'indexnow', 'google', 'pingomatic', 'pingler');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END $$;`);

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

    await run(`CREATE TABLE IF NOT EXISTS "users" (
      "id" text PRIMARY KEY,
      "email" text NOT NULL,
      "is_pro" boolean DEFAULT false,
      "dodo_subscription_id" text,
      "dodo_customer_id" text,
      "subscription_status" text,
      "created_at" timestamp DEFAULT now(),
      "updated_at" timestamp DEFAULT now()
    );`);

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
      "gsc_connected" boolean DEFAULT false,
      "site_health" jsonb,
      "last_sync_at" timestamp,
      "created_at" timestamp DEFAULT now()
    );`);

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

    initialized = true;
    inFlight = null;
  })();

  await inFlight;
}
