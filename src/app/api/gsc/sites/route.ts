import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { stackServerApp } from "@/stack";
import { db } from "@/lib/db";
import { websites } from "@/lib/db/schema";
import { listSearchConsoleSites } from "@/lib/api/google";
import { normalizeWebsiteOrigin } from "@/lib/services/gsc-service";

export async function GET() {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("gsc_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ connected: false, sites: [] });
  }

  try {
    const [existingSites, gscSites] = await Promise.all([
      db.select({ url: websites.url }).from(websites).where(eq(websites.userId, user.id)),
      listSearchConsoleSites(accessToken),
    ]);

    const existingUrlSet = new Set(existingSites.map((row) => row.url));

    const sites = await Promise.all(
      gscSites.map(async (site) => {
        const normalizedUrl = normalizeWebsiteOrigin(site.siteUrl);
        const supported = Boolean(normalizedUrl);
        const alreadyImported = normalizedUrl ? existingUrlSet.has(normalizedUrl) : false;

        return {
          propertyUrl: site.siteUrl,
          permissionLevel: site.permissionLevel,
          normalizedUrl,
          supported,
          alreadyImported,
        };
      })
    );

    return NextResponse.json({ connected: true, sites });
  } catch {
    const response = NextResponse.json(
      { connected: false, sites: [], error: "Failed to fetch GSC sites. Reconnect Google and try again." },
      { status: 400 }
    );
    response.cookies.delete("gsc_access_token");
    return response;
  }
}
