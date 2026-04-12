import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, websites } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { triggerSubmissions } from "@/lib/services/indexing-service";

/**
 * POST /api/v1/submit
 * 
 * Programmatically submit a URL to all connected search engines.
 * 
 * Headers: 
 *   Authorization: Bearer <idx_key>
 * 
 * Body:
 *   {
 *     "url": "https://example.com/page"
 *   }
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized. Missing or invalid Authorization header." }, { status: 401 });
    }

    const apiKey = authHeader.replace("Bearer ", "");
    
    // 1. Authenticate User
    const dbUser = await db.query.users.findFirst({
      where: eq(users.apiKey, apiKey),
    });

    if (!dbUser) {
      return NextResponse.json({ error: "Unauthorized. Invalid API key." }, { status: 401 });
    }

    // 2. Parse Request
    const body = await req.json().catch(() => ({}));
    const { url } = body;

    if (!url || !url.startsWith("http")) {
      return NextResponse.json({ error: "Invalid URL provided." }, { status: 400 });
    }

    // 3. Find Matching Website (by hostname)
    const targetHost = new URL(url).hostname;
    const allWebsites = await db.select().from(websites).where(eq(websites.userId, dbUser.id));
    
    const matchedWebsite = allWebsites.find(w => {
        try {
            return new URL(w.url).hostname === targetHost;
        } catch {
            return false;
        }
    });

    if (!matchedWebsite) {
      return NextResponse.json({ 
        error: "Website not found in your dashboard. Please add the site to IndexFast before using the API.",
        hint: `No website found matching hostname: ${targetHost}`
      }, { status: 404 });
    }

    // 4. Trigger Submission
    // We pass isPro based on user's subscription status
    const results = await triggerSubmissions(matchedWebsite, [url], dbUser.isPro ?? false);

    return NextResponse.json({
      success: true,
      results: results.map(r => ({
        engine: r.engine,
        status: r.status,
        error: r.errorMessage
      }))
    });

  } catch (error) {
    console.error("[API V1 SUBMIT ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
