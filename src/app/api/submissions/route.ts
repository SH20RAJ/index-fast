import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { stackServerApp } from "@/stack";
import { db } from "@/lib/db";
import { submissions, websites } from "@/lib/db/schema";
import { ensureUserRecord } from "@/lib/db/user-sync";

export async function GET() {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureUserRecord({ id: user.id, primaryEmail: user.primaryEmail });

  const rows = await db
    .select({
      id: submissions.id,
      url: submissions.url,
      engine: submissions.engine,
      status: submissions.status,
      errorMessage: submissions.errorMessage,
      createdAt: submissions.createdAt,
      websiteId: websites.id,
      websiteUrl: websites.url,
    })
    .from(submissions)
    .innerJoin(websites, eq(submissions.websiteId, websites.id))
    .where(eq(websites.userId, user.id))
    .orderBy(desc(submissions.createdAt));

  return NextResponse.json(rows);
}
