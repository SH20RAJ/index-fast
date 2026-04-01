import { NextResponse } from "next/server";
import { processDueCronJobs } from "@/lib/services/cron-job-runner";

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return false;
  }

  const headerSecret = request.headers.get("x-cron-secret") || "";
  return headerSecret === secret;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const limitParam = Number(url.searchParams.get("limit") || "20");
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 100) : 20;

  try {
    const result = await processDueCronJobs(limit);
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("Cron processing failed:", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Failed to process cron jobs",
      },
      { status: 500 }
    );
  }
}
