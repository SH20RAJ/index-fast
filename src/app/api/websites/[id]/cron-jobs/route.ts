import { NextResponse } from "next/server";
import { stackServerApp } from "@/stack";
import { db } from "@/lib/db";
import { cronJobs, websites } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

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

    const nextRunDate = calculateNextRun(body.frequency);

    const result = await db.insert(cronJobs).values({
      websiteId,
      enabled: true,
      frequency: body.frequency,
      engine: body.engine as "indexnow" | "bing" | "google",
      sourceMode: body.sourceMode,
      nextRunAt: nextRunDate,
    });

    return NextResponse.json({
      message: "Cron job created successfully",
    });
  } catch (error) {
    console.error("Error creating cron job:", error);
    return NextResponse.json(
      { error: "Failed to create cron job" },
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

    return NextResponse.json({ jobs });
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
