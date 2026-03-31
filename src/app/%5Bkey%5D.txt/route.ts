import { NextRequest } from "next/server";
import { db } from "@/db";
import { sites } from "@/db/schema/sites";
import { eq } from "drizzle-orm";

/**
 * Route handler to serve the IndexNow verification key file at the root.
 * Documentation: https://www.indexnow.org/documentation
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  const { key } = params;

  // We check if this key exists in our database for ANY site.
  // This allows us to serve the verification key dynamically without manual file uploads.
  try {
    const site = await db.query.sites.findFirst({
      where: eq(sites.indexNowKey, key),
    });

    if (!site) {
      return new Response("Key not found in database", { status: 404 });
    }

    // Serve as plain text with Cache-Control (optimized for Edge)
    return new Response(key, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error: any) {
    console.error("Verification Key error:", error.message);
    return new Response("Internal Server Error", { status: 500 });
  }
}
