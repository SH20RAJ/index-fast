import { NextResponse } from "next/server";
import { stackServerApp } from "@/stack";
import { db } from "@/lib/db";
import { cronJobs, users, websites } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { PLAN_DEFINITIONS, resolvePlanId } from "@/lib/billing/plans";
import { ensureUserRecord } from "@/lib/db/user-sync";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: websiteId } = await params;

  try {
    await ensureUserRecord({ id: user.id, primaryEmail: user.primaryEmail });

    const [userRow] = await db
      .select({ subscriptionStatus: users.subscriptionStatus, isPro: users.isPro })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);
    const planId = resolvePlanId(userRow?.subscriptionStatus ?? null, userRow?.isPro ?? false);
    const limits = PLAN_DEFINITIONS[planId];

    // Verify website ownership
    const website = await db
      .select()
      .from(websites)
      .where(and(eq(websites.id, websiteId), eq(websites.userId, user.id)))
      .limit(1);

    if (website.length === 0) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    const body = (await request.json()) as {
      frequency: string;
      engine: string;
      sourceMode: string;
    };

    if (!limits.allowHourly && body.frequency === "hourly") {
      return NextResponse.json(
        { error: "Hourly schedules are available on Pro and Agency plans." },
        { status: 403 }
      );
    }

    const existingUserJobs = await db
      .select({ id: cronJobs.id })
      .from(cronJobs)
      .innerJoin(websites, eq(cronJobs.websiteId, websites.id))
      .where(eq(websites.userId, user.id));

    if (existingUserJobs.length >= limits.cronLimit) {
      const planLabel = planId.toUpperCase();
      console.warn(`Plan limit reached for user ${user.id}: ${existingUserJobs.length}/${limits.cronLimit}`);
      return NextResponse.json(
        { error: `Your ${planLabel} plan allows up to ${limits.cronLimit} auto-submit job${limits.cronLimit === 1 ? "" : "s"}. Upgrade to create more.` },
        { status: 403 }
      );
    }

    const nextRunDate = calculateNextRun(body.frequency);

    // Validate engine type matches enum
    const validEngines = ["indexnow", "bing", "google"] as const;
    const engine = body.engine as typeof validEngines[number];
    
    if (!validEngines.includes(engine)) {
      return NextResponse.json({ error: `Invalid engine: ${body.engine}` }, { status: 400 });
    }

    const validFrequencies = ["hourly", "daily", "weekly", "monthly"] as const;
    const validSourceModes = ["sitemap", "inventory"] as const;

    if (!validFrequencies.includes(body.frequency as typeof validFrequencies[number])) {
      return NextResponse.json({ error: `Invalid frequency: ${body.frequency}` }, { status: 400 });
    }

    if (!validSourceModes.includes(body.sourceMode as typeof validSourceModes[number])) {
      return NextResponse.json({ error: `Invalid source mode: ${body.sourceMode}` }, { status: 400 });
    }

    console.log(`Creating cron job for website ${websiteId}: ${body.frequency}, ${engine}, ${body.sourceMode}`);

    const result = await db.insert(cronJobs).values({
      websiteId: websiteId as any, // websiteId is uuid in schema
      enabled: true,
      frequency: body.frequency,
      engine: engine,
      sourceMode: body.sourceMode,
      nextRunAt: nextRunDate,
    });

    console.log(`Cron job created successfully:`, result);

    return NextResponse.json({
      message: "Cron job created successfully",
    });
  } catch (error) {
    console.error("CRITICAL ERROR creating cron job:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create cron job" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: websiteId } = await params;

  try {
    // Verify website ownership
    const website = await db
        .select()
        .from(websites)
        .where(and(eq(websites.id, websiteId), eq(websites.userId, user.id)))
      .limit(1);

      if (website.length === 0) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    const jobs = await db
      .select()
      .from(cronJobs)
      .where(eq(cronJobs.websiteId, websiteId));

    const [userRow] = await db
      .select({ subscriptionStatus: users.subscriptionStatus, isPro: users.isPro })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);
    const planId = resolvePlanId(userRow?.subscriptionStatus ?? null, userRow?.isPro ?? false);
    const limits = PLAN_DEFINITIONS[planId];

    return NextResponse.json({
      jobs,
      limits: {
        planId,
        maxTotalJobs: limits.cronLimit,
        allowHourly: limits.allowHourly,
      },
    });
  } catch (error) {
    console.error("Error fetching cron jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch cron jobs" },
      { status: 500 }
    );
  }
}

function calculateNextRun(frequency: string): Date {
  const now = new Date();

  switch (frequency) {
    case "hourly":
      return new Date(now.getTime() + 60 * 60 * 1000);
    case "daily":
      return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    case "weekly":
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    case "monthly":
      return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() + 24 * 60 * 60 * 1000);
  }
}
