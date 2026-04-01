import { NextResponse } from "next/server";
import { stackServerApp } from "@/stack";
import { db } from "@/lib/db";
import { cronJobs, websites } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

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
