import { NextResponse } from "next/server";
import { processDueCronJobs } from "@/lib/services/cron-job-runner";

/**
 * Vercel Cron Job Handler
 * This endpoint should be called by Vercel Cron at a regular interval.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  
  // Security check: Only allow Vercel Cron or authorized calls
  if (
    process.env.NODE_ENV === "production" && 
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("[CRON] Starting submission processing...");
    const results = await processDueCronJobs(20); // Process up to 20 due jobs per run
    
    return NextResponse.json({
      message: "Cron processing completed",
      ...results
    });
  } catch (error: any) {
    console.error("[CRON] Execution failed:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" }, 
      { status: 500 }
    );
  }
}

// Support POST as well just in case, though crons are usually GET
export async function POST(request: Request) {
  return GET(request);
}
