import { db } from "@/lib/db";
import { websites } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { stackServerApp } from "@/stack";
import { auditWebsite } from "@/lib/services/audit-service";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // 1. Check if the website belongs to the user
  const [website] = await db
    .select()
    .from(websites)
    .where(and(eq(websites.id, id), eq(websites.userId, user.id)));

  if (!website) {
    return NextResponse.json({ error: "Website not found or access denied" }, { status: 404 });
  }

  try {
    // 2. Perform the audit on the homepage
    const auditResult = await auditWebsite(website.url);

    // 3. Save results to the database (using the siteHealth JSONB column)
    await db
      .update(websites)
      .set({
        siteHealth: auditResult, // Drizzle will handle serializing this to JSON
      })
      .where(eq(websites.id, id));

    return NextResponse.json(auditResult);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Audit failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
