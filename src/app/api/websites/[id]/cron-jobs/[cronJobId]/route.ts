import { NextResponse } from "next/server";
import { stackServerApp } from "@/stack";
import { db } from "@/lib/db";
import { cronJobs, users, websites } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { resolvePlanId, type PlanId } from "@/lib/billing/plans";

const CRON_PLAN_LIMITS: Record<PlanId, { maxTotalJobs: number; allowHourly: boolean }> = {
  free: { maxTotalJobs: 1, allowHourly: false },
  pro: { maxTotalJobs: 25, allowHourly: true },
  agency: { maxTotalJobs: 200, allowHourly: true },
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; cronJobId: string }> }
) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: websiteId, cronJobId } = await params;

  try {
    const [userRow] = await db
      .select({ subscriptionStatus: users.subscriptionStatus, isPro: users.isPro })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);
    const planId = resolvePlanId(userRow?.subscriptionStatus ?? null, userRow?.isPro ?? false);
    const limits = CRON_PLAN_LIMITS[planId];

    // Verify website ownership
    const website = await db
      .select()
      .from(websites)
        .where(and(eq(websites.id, websiteId), eq(websites.userId, user.id)))
      .limit(1);

    if (!website || website.length === 0) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    const body = (await request.json()) as { enabled?: boolean };

    const [targetJob] = await db
      .select({ id: cronJobs.id, enabled: cronJobs.enabled, frequency: cronJobs.frequency })
      .from(cronJobs)
      .where(and(eq(cronJobs.id, cronJobId), eq(cronJobs.websiteId, websiteId)))
      .limit(1);

    if (!targetJob) {
      return NextResponse.json({ error: "Cron job not found" }, { status: 404 });
    }

    if (body.enabled === true && !targetJob.enabled) {
      if (!limits.allowHourly && targetJob.frequency === "hourly") {
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

      if (existingUserJobs.length > limits.maxTotalJobs) {
        return NextResponse.json(
          { error: `Your ${planId.toUpperCase()} plan allows up to ${limits.maxTotalJobs} auto-submit job${limits.maxTotalJobs === 1 ? "" : "s"}.` },
          { status: 403 }
        );
      }
    }

    await db
      .update(cronJobs)
      .set({
        enabled: body.enabled,
        updatedAt: new Date(),
      })
      .where(and(eq(cronJobs.id, cronJobId), eq(cronJobs.websiteId, websiteId)));

    return NextResponse.json({ message: "Cron job updated" });
  } catch (error) {
    console.error("Error updating cron job:", error);
    return NextResponse.json(
      { error: "Failed to update cron job" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; cronJobId: string }> }
) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: websiteId, cronJobId } = await params;

  try {
    // Verify website ownership
    const website = await db
      .select()
      .from(websites)
        .where(and(eq(websites.id, websiteId), eq(websites.userId, user.id)))
      .limit(1);

    if (!website || website.length === 0) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    await db
      .delete(cronJobs)
      .where(and(eq(cronJobs.id, cronJobId), eq(cronJobs.websiteId, websiteId)));

    return NextResponse.json({ message: "Cron job deleted" });
  } catch (error) {
    console.error("Error deleting cron job:", error);
    return NextResponse.json(
      { error: "Failed to delete cron job" },
      { status: 500 }
    );
  }
}
