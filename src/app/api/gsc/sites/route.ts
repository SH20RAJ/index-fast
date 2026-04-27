import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { stackServerApp } from "@/stack";
import { db } from "@/lib/db";
import { websites, gscProperties } from "@/lib/db/schema";
import { listSearchConsoleSites } from "@/lib/api/google";
import { GSC_READONLY_SCOPE } from "@/lib/google/constants";
import { normalizeWebsiteOrigin, syncGscProperties } from "@/lib/services/gsc-service";

export async function GET() {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cookieStore = await cookies();
  let accessToken = cookieStore.get("gsc_access_token")?.value;

  if (!accessToken) {
    const connectedAccounts = await user.listConnectedAccounts();
    const googleAccount = connectedAccounts.find((account) => account.provider === "google");

    if (googleAccount) {
      const tokenResult = await googleAccount.getAccessToken({ scopes: [GSC_READONLY_SCOPE] });
      if (tokenResult.status === "ok" && tokenResult.data.accessToken) {
        accessToken = tokenResult.data.accessToken;
      }
    }
  }

  if (!accessToken) {
    return NextResponse.json(
      { connected: false, sites: [], error: "Google Search Console is not connected. Reconnect Google to import sites." },
      { status: 401 }
    );
  }
  try {
    const sites = await syncGscProperties(user.id, accessToken);
    
    // Fetch from DB to return structured data
    const dbProperties = await db
      .select()
      .from(gscProperties)
      .where(eq(gscProperties.userId, user.id));

    const responseSites = dbProperties.map(prop => {
      const normalizedUrl = normalizeWebsiteOrigin(prop.siteUrl);
      return {
        propertyUrl: prop.siteUrl,
        permissionLevel: prop.permissionLevel,
        normalizedUrl,
        supported: Boolean(normalizedUrl),
        alreadyImported: prop.alreadyImported,
      };
    });

    return NextResponse.json({ connected: true, sites: responseSites });
  } catch {
    const response = NextResponse.json(
      { connected: false, sites: [], error: "Failed to fetch GSC sites. Reconnect Google and try again." },
      { status: 400 }
    );
    response.cookies.delete("gsc_access_token");
    return response;
  }
}
