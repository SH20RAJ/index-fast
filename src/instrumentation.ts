/**
 * Next.js server instrumentation hook.
 *
 * Runs once per Node.js server instance before any request is handled.
 * We use it to run the idempotent DB schema bootstrap so that newly added
 * columns/enum values are always present in production before the first
 * query hits Postgres.
 *
 * Docs: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/instrumentation.md
 */
export async function register() {
  // Only run on the Node.js runtime — the Edge runtime cannot load `postgres`.
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  if (!process.env.DATABASE_URL) {
    return;
  }

  try {
    const { ensureDbSchema } = await import("@/lib/db/bootstrap");
    await ensureDbSchema();
    console.log("[instrumentation] DB schema bootstrap complete");
  } catch (err) {
    // Do not crash the server if bootstrap fails — requests that touch
    // missing columns will still surface the real error, and the next cold
    // start will retry the migration.
    console.error("[instrumentation] DB schema bootstrap failed:", err);
  }
}
