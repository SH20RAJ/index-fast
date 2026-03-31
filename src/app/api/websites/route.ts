import { db } from "@/lib/db";
import { websites } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { stackServerApp } from "@/stack";
import { ensureUserRecord } from "@/lib/db/user-sync";

/**
 * List or Add Websites
 */
export async function GET(request: Request) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureUserRecord({ id: user.id, primaryEmail: user.primaryEmail });

  const userWebsites = await db
    .select()
    .from(websites)
    .where(eq(websites.userId, user.id));

  return NextResponse.json(userWebsites);
}

export async function POST(request: Request) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureUserRecord({ id: user.id, primaryEmail: user.primaryEmail });

  try {
    const { url, sitemapUrl, indexNowKey, bingApiKey } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const [newWebsite] = await db
      .insert(websites)
      .values({
        userId: user.id,
        url,
        sitemapUrl,
        indexNowKey,
        bingApiKey,
      })
      .returning();

    return NextResponse.json(newWebsite);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
