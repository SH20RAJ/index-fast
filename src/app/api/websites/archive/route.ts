import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack";
import { db } from "@/lib/db";
import { websites } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { submitToArchiveOrg } from "@/lib/api/archive";

interface ArchiveRequest {
  websiteId: string;
  includeSubpaths?: boolean;
}

interface ArchiveResult {
  success: boolean;
  attempted: number;
  succeeded: number;
  failed: number;
  failures: string[];
  message?: string;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ArchiveResult>> {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, attempted: 0, succeeded: 0, failed: 0, failures: [], error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = (await request.json()) as ArchiveRequest;
    const { websiteId, includeSubpaths = false } = body;

    if (!websiteId) {
      return NextResponse.json(
        { success: false, attempted: 0, succeeded: 0, failed: 0, failures: [], error: "websiteId is required" },
        { status: 400 }
      );
    }

    // Verify website belongs to user
    const website = await db
      .select()
      .from(websites)
      .where(eq(websites.id, websiteId))
      .limit(1);

    if (!website || website.length === 0 || website[0].userId !== user.id) {
      return NextResponse.json(
        { success: false, attempted: 0, succeeded: 0, failed: 0, failures: [], error: "Website not found" },
        { status: 404 }
      );
    }

    const siteUrl = website[0].url;
    let urlsToArchive = [siteUrl];

    // If includeSubpaths, submit homepage variants
    if (includeSubpaths) {
      urlsToArchive = [
        siteUrl,
        `${siteUrl}/`,
        `${siteUrl}/blog`,
        `${siteUrl}/pricing`,
        `${siteUrl}/contact`,
      ];
    }

    let succeeded = 0;
    let failed = 0;
    const failures: string[] = [];

    // Submit each URL with delay to avoid rate limits
    for (const url of urlsToArchive) {
      try {
        const result = await submitToArchiveOrg(url);
        if (result.success) {
          succeeded++;
        } else {
          failed++;
          failures.push(`${url}: ${result.error}`);
        }
        // 300ms delay between requests
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (error) {
        failed++;
        failures.push(`${url}: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }

    return NextResponse.json({
      success: failed === 0,
      attempted: urlsToArchive.length,
      succeeded,
      failed,
      failures,
      message: `Submitted ${succeeded} URLs to Wayback Machine${failed > 0 ? ` (${failed} failed)` : ""}`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        attempted: 0,
        succeeded: 0,
        failed: 0,
        failures: [],
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
