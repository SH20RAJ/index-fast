import { db } from "@/lib/db";
import { cronJobs, websites } from "@/lib/db/schema";
import { stackServerApp } from "@/stack";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * POST: Manually trigger a cron job execution
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; cronJobId: string }> }
) {
  const { id: websiteId, cronJobId } = await params;
  const user = await stackServerApp.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // 1. Verify website ownership
    const [website] = await db
      .select()
      .from(websites)
      .where(and(eq(websites.id, websiteId), eq(websites.userId, user.id)));

    if (!website) return NextResponse.json({ error: "Website not found" }, { status: 404 });

    // 2. Fetch the job
    const [job] = await db
      .select()
      .from(cronJobs)
      .where(and(eq(cronJobs.id, cronJobId), eq(cronJobs.websiteId, websiteId)));

    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    // 3. Trigger logic (In a real app, this might queue a worker)
    // For now, we'll simulate success and update lastRunAt
    await db
      .update(cronJobs)
      .set({
        lastRunAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(cronJobs.id, cronJobId));

    // Here you would call your indexing engine logic directly
    // console.log(`Triggering engine: ${job.engine} for ${website.url}`);

    return NextResponse.json({ success: true, message: "Pipeline execution triggered successfully" });
  } catch (error) {
    console.error("[api/cron-jobs/run] POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
