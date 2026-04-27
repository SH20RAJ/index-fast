import { db } from "@/lib/db";
import { cronJobs, websites } from "@/lib/db/schema";
import { stackServerApp } from "@/stack";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

/**
 * GET: List all cron jobs for a specific website
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: websiteId } = await params;
  const user = await stackServerApp.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Verify ownership
    const [website] = await db
      .select()
      .from(websites)
      .where(and(eq(websites.id, websiteId), eq(websites.userId, user.id)));

    if (!website) return NextResponse.json({ error: "Website not found" }, { status: 404 });

    const jobs = await db
      .select()
      .from(cronJobs)
      .where(eq(cronJobs.websiteId, websiteId))
      .orderBy(cronJobs.createdAt);

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("[api/cron-jobs] GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * POST: Create a new cron job
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: websiteId } = await params;
  const user = await stackServerApp.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { frequency, engine, sourceMode } = body;

    if (!frequency || !engine || !sourceMode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify ownership
    const [website] = await db
      .select()
      .from(websites)
      .where(and(eq(websites.id, websiteId), eq(websites.userId, user.id)));

    if (!website) return NextResponse.json({ error: "Website not found" }, { status: 404 });

    // Calculate initial nextRunAt (roughly now)
    const nextRunAt = new Date();

    const [newJob] = await db
      .insert(cronJobs)
      .values({
        websiteId,
        frequency,
        engine,
        sourceMode,
        nextRunAt,
        enabled: true,
      })
      .returning();

    return NextResponse.json({ job: newJob });
  } catch (error) {
    console.error("[api/cron-jobs] POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
