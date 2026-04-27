import { db } from "@/lib/db";
import { websites } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { stackServerApp } from "@/stack";

/**
 * PATCH: Update website details (e.g., sitemapUrl)
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await stackServerApp.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    
    // Only allow updating specific fields for safety
    const { sitemapUrl, indexNowKey, bingApiKey, gscConnected } = body;
    
    const updateData: any = {};
    if (sitemapUrl !== undefined) updateData.sitemapUrl = sitemapUrl;
    if (indexNowKey !== undefined) updateData.indexNowKey = indexNowKey;
    if (bingApiKey !== undefined) updateData.bingApiKey = bingApiKey;
    if (gscConnected !== undefined) updateData.gscConnected = gscConnected;

    const [updatedWebsite] = await db
      .update(websites)
      .set(updateData)
      .where(and(eq(websites.id, id), eq(websites.userId, user.id)))
      .returning();

    if (!updatedWebsite) {
      return NextResponse.json({ error: "Website not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json(updatedWebsite);
  } catch (error) {
    console.error("[api/websites/[id]] PATCH error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * DELETE: Remove a website
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await stackServerApp.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [deletedWebsite] = await db
      .delete(websites)
      .where(and(eq(websites.id, id), eq(websites.userId, user.id)))
      .returning();

    if (!deletedWebsite) {
      return NextResponse.json({ error: "Website not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[api/websites/[id]] DELETE error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
