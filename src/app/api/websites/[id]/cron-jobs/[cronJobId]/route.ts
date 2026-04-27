import { db } from "@/lib/db";
import { cronJobs, websites } from "@/lib/db/schema";
import { stackServerApp } from "@/stack";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * PATCH: Update a specific cron job (toggle enabled status, change frequency, etc.)
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; cronJobId: string }> }
) {
  const { id: websiteId, cronJobId } = await params;
  const user = await stackServerApp.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    
    // Verify website ownership first
    const [website] = await db
      .select()
      .from(websites)
      .where(and(eq(websites.id, websiteId), eq(websites.userId, user.id)));

    if (!website) return NextResponse.json({ error: "Website not found" }, { status: 404 });

    // Update job
    const [updatedJob] = await db
      .update(cronJobs)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(and(eq(cronJobs.id, cronJobId), eq(cronJobs.websiteId, websiteId)))
      .returning();

    if (!updatedJob) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    return NextResponse.json({ job: updatedJob });
  } catch (error) {
    console.error("[api/cron-jobs/[id]] PATCH error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * DELETE: Remove a cron job
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; cronJobId: string }> }
) {
  const { id: websiteId, cronJobId } = await params;
  const user = await stackServerApp.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Verify website ownership
    const [website] = await db
      .select()
      .from(websites)
      .where(and(eq(websites.id, websiteId), eq(websites.userId, user.id)));

    if (!website) return NextResponse.json({ error: "Website not found" }, { status: 404 });

    const [deletedJob] = await db
      .delete(cronJobs)
      .where(and(eq(cronJobs.id, cronJobId), eq(cronJobs.websiteId, websiteId)))
      .returning();

    if (!deletedJob) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/cron-jobs/[id]] DELETE error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
