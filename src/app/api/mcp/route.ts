import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, websites, submissions, urlInventory, blogPosts, cronJobs } from "@/lib/db/schema";
import { and, count, desc, eq, gte, sql } from "drizzle-orm";
import { getPlanDefinition, resolvePlanId } from "@/lib/billing/plans";
import { triggerSubmissions, processWebsiteIndexing } from "@/lib/services/indexing-service";
import { auditWebsite } from "@/lib/services/audit-service";
import { revalidatePath } from "next/cache";
import { parseSitemap } from "@/lib/utils/sitemap-parser";
import { submitBatchToGoogleIndexing, validateServiceAccountKey } from "@/lib/api/google-indexing";
import { pingService } from "@/lib/api/ping-services";
import axios from "axios";
import robotsParser from "robots-parser";

/**
 * MCP (Model Context Protocol) Endpoint
 * 
 * Supports list_tools and call_tool via JSON-RPC over HTTP.
 * Authentication: Authorization: Bearer <idx_key>
 */

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    status: "online",
    message: "IndexFast MCP Endpoint is active. Use POST with JSON-RPC 2.0 to call tools.",
    docs: "https://indexfast.co/docs/mcp"
  });
}

export async function POST(req: NextRequest) {
  let id: string | number | null = null;
  try {
    // Support both Authorization header and query param for mcp-remote
    let apiKey = req.nextUrl.searchParams.get("key");

    if (!apiKey) {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({
          jsonrpc: "2.0",
          error: { code: -32001, message: "Unauthorized. Missing or invalid Authorization header." },
          id
        }, { status: 401 });
      }
      apiKey = authHeader.replace("Bearer ", "");
    }
    
    // 1. Authenticate User
    const dbUser = await db.query.users.findFirst({
      where: eq(users.apiKey, apiKey),
    });

    if (!dbUser) {
      return NextResponse.json({ 
        jsonrpc: "2.0",
        error: { code: -32001, message: "Unauthorized. Invalid API key." },
        id 
      }, { status: 401 });
    }

    // 2. Parse JSON-RPC Request
    const body = await req.json().catch(() => ({}));
    const { method, params, id: requestId } = body;
    if (requestId !== undefined) id = requestId;

    // Handle MCP Lifecycle Methods
    if (method === "initialize") {
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: "IndexFast",
            version: "1.0.0"
          }
        }
      });
    }

    if (method === "notifications/initialized") {
      return new Response(null, { status: 204 });
    }

    if (method === "list_tools" || method === "tools/list") {
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: {
          tools: [
            {
              name: "list_websites",
              description: "List all websites connected to your IndexFast account.",
              inputSchema: { type: "object", properties: {} }
            },
            {
              name: "get_usage",
              description: "Get your current indexing usage, limits, and plan details.",
              inputSchema: { type: "object", properties: {} }
            },
            {
              name: "submit_url",
              description: "Submit a URL for indexing across all connected engines (Google, Bing, IndexNow).",
              inputSchema: {
                type: "object",
                properties: {
                  url: { type: "string", description: "The full URL to index (must belong to one of your connected sites)." }
                },
                required: ["url"]
              }
            },
            {
              name: "submit_sitemap",
              description: "Submit all URLs from a sitemap for indexing. Fetches, parses, and pushes to all engines.",
              inputSchema: {
                type: "object",
                properties: {
                  sitemapUrl: { type: "string", description: "The full URL of the XML sitemap." }
                },
                required: ["sitemapUrl"]
              }
            },
            {
              name: "submit_urllist",
              description: "Submit a list of URLs for indexing across all connected engines.",
              inputSchema: {
                type: "object",
                properties: {
                  urls: { type: "array", items: { type: "string" }, description: "Array of full URLs to index." }
                },
                required: ["urls"]
              }
            },
            {
              name: "seo_audit",
              description: "Run a comprehensive SEO audit on a specific URL to find issues and get fix prompts.",
              inputSchema: {
                type: "object",
                properties: {
                  url: { type: "string", description: "The full URL to audit." }
                },
                required: ["url"]
              }
            },
            {
              name: "list_recent_submissions",
              description: "List the most recent indexing submissions and their status.",
              inputSchema: {
                type: "object",
                properties: {
                  limit: { type: "number", description: "Number of submissions to return (default 10).", default: 10 }
                }
              }
            },
            {
              name: "get_site_details",
              description: "Get detailed configuration for a specific connected site.",
              inputSchema: {
                type: "object",
                properties: {
                  siteId: { type: "string", description: "The unique ID of the website." }
                },
                required: ["siteId"]
              }
            },
            {
              name: "get_site_health",
              description: "Get the current health and configuration status of a connected website.",
              inputSchema: {
                type: "object",
                properties: {
                  siteId: { type: "string", description: "The unique ID of the website." }
                },
                required: ["siteId"]
              }
            },
            {
              name: "trigger_sitemap_sync",
              description: "Manually trigger a sitemap crawl and sync to detect new URLs and submit them.",
              inputSchema: {
                type: "object",
                properties: {
                  siteId: { type: "string", description: "The unique ID of the website." }
                },
                required: ["siteId"]
              }
            },
            {
              name: "list_url_inventory",
              description: "List URLs in the inventory for a specific website, including their indexing status.",
              inputSchema: {
                type: "object",
                properties: {
                  siteId: { type: "string", description: "The unique ID of the website." },
                  limit: { type: "number", description: "Number of URLs to return (default 50).", default: 50 }
                },
                required: ["siteId"]
              }
            },
            {
              name: "index_page",
              description: "The 'One-Prompt' indexing tool. Audits a URL and submits it to all connected search engines instantly. Best for newly coded pages.",
              inputSchema: {
                type: "object",
                properties: {
                  url: { type: "string", description: "The full URL to audit and index." }
                },
                required: ["url"]
              }
            },
            {
              name: "list_cron_jobs",
              description: "List all scheduled cron jobs / auto-indexing tasks for a specific website.",
              inputSchema: {
                type: "object",
                properties: {
                  siteId: { type: "string", description: "The unique ID of the website." }
                },
                required: ["siteId"]
              }
            },
            {
              name: "save_cron_job",
              description: "Create or update an auto-indexing cron job for a website.",
              inputSchema: {
                type: "object",
                properties: {
                  siteId: { type: "string", description: "The unique ID of the website." },
                  engine: { type: "string", description: "The search engine / submit protocol: 'indexnow', 'bing', 'google', or 'all'." },
                  frequency: { type: "string", description: "How often to run: 'hourly', 'daily', 'weekly', 'monthly'.", default: "daily" },
                  sourceMode: { type: "string", description: "Where to discover URLs: 'sitemap' (default sitemap), 'inventory' (autodetect new URLs, Pro only), or 'urls' (defined URL list).", default: "sitemap" },
                  urls: { type: "string", description: "Comma-separated list of URLs to index (only if sourceMode is 'urls')." },
                  enabled: { type: "boolean", description: "Whether the cron job is active.", default: true }
                },
                required: ["siteId", "engine"]
              }
            },
            {
              name: "delete_cron_job",
              description: "Remove a scheduled cron job / auto-run task.",
              inputSchema: {
                type: "object",
                properties: {
                  jobId: { type: "string", description: "The unique ID of the cron job to delete." },
                  siteId: { type: "string", description: "The unique ID of the website (for ownership verification)." }
                },
                required: ["jobId", "siteId"]
              }
            },
            {
              name: "gsc_submit_url",
              description: "Submit a URL to Google via the Indexing API using a service account. Requires GSC service account key configured on the website.",
              inputSchema: {
                type: "object",
                properties: {
                  url: { type: "string", description: "The full URL to submit to Google." },
                  siteId: { type: "string", description: "The unique ID of the website (optional, auto-detected from URL)." }
                },
                required: ["url"]
              }
            },
            {
              name: "ping_url",
              description: "Ping search engine update services (Ping-o-Matic XML-RPC) about a URL to trigger re-crawl.",
              inputSchema: {
                type: "object",
                properties: {
                  url: { type: "string", description: "The full URL to ping about." },
                  blogName: { type: "string", description: "Blog/site name for the ping.", default: "IndexFast Site" }
                },
                required: ["url"]
              }
            },
            {
              name: "check_redirects",
              description: "Trace the redirect chain for a URL and detect loops or broken redirects.",
              inputSchema: {
                type: "object",
                properties: {
                  url: { type: "string", description: "The URL to trace redirects for." }
                },
                required: ["url"]
              }
            },
            {
              name: "test_robots_txt",
              description: "Fetch and test a robots.txt file against one or more URLs to check if they are allowed or disallowed.",
              inputSchema: {
                type: "object",
                properties: {
                  robotsTxtUrl: { type: "string", description: "The URL of the robots.txt file." },
                  urls: { type: "array", items: { type: "string" }, description: "URLs to test against the robots.txt." },
                  userAgent: { type: "string", description: "User agent to test with (default: *).", default: "*" }
                },
                required: ["robotsTxtUrl", "urls"]
              }
            },
            {
              name: "extract_sitemap_urls",
              description: "Extract all URLs from an XML sitemap, including nested sitemap indexes.",
              inputSchema: {
                type: "object",
                properties: {
                  sitemapUrl: { type: "string", description: "The full URL of the XML sitemap." }
                },
                required: ["sitemapUrl"]
              }
            },
            {
              name: "echo",
              description: "Echo back the input for testing connectivity.",
              inputSchema: {
                type: "object",
                properties: {
                  message: { type: "string" }
                }
              }
            }
          ]
        }
      });
    }

    if (method === "call_tool" || method === "tools/call") {
      const { name, arguments: args } = params || {};

      switch (name) {
        case "list_websites": {
          const userWebsites = await db.select().from(websites).where(eq(websites.userId, dbUser.id));
          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            result: {
              content: [{ type: "text", text: JSON.stringify(userWebsites.map(w => ({ id: w.id, url: w.url, lastSyncAt: w.lastSyncAt })), null, 2) }]
            }
          });
        }

        case "get_site_details": {
          const { siteId } = args || {};
          if (!siteId) {
            return NextResponse.json({ id, error: { message: "siteId is required." } }, { status: 400 });
          }

          const [site] = await db.select().from(websites).where(and(eq(websites.id, siteId), eq(websites.userId, dbUser.id))).limit(1);

          if (!site) {
            return NextResponse.json({ id, result: { content: [{ type: "text", text: "Error: Site not found or access denied." }] } });
          }

          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            result: {
              content: [{ type: "text", text: JSON.stringify(site, null, 2) }]
            }
          });
        }

        case "get_site_health": {
          const { siteId } = args || {};
          if (!siteId) {
            return NextResponse.json({ id, error: { message: "siteId is required." } }, { status: 400 });
          }

          const [site] = await db.select().from(websites).where(and(eq(websites.id, siteId), eq(websites.userId, dbUser.id))).limit(1);

          if (!site) {
            return NextResponse.json({ id, result: { content: [{ type: "text", text: "Error: Site not found or access denied." }] } });
          }

          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            result: {
              content: [{ type: "text", text: JSON.stringify(site.siteHealth, null, 2) }]
            }
          });
        }

        case "trigger_sitemap_sync": {
          const { siteId } = args || {};
          if (!siteId) {
            return NextResponse.json({ id, error: { message: "siteId is required." } }, { status: 400 });
          }

          // Verify ownership
          const [site] = await db.select().from(websites).where(and(eq(websites.id, siteId), eq(websites.userId, dbUser.id))).limit(1);
          if (!site) {
            return NextResponse.json({ id, result: { content: [{ type: "text", text: "Error: Site not found or access denied." }] } });
          }

          const result = await processWebsiteIndexing(siteId);
          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            result: {
              content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
            }
          });
        }

        case "list_url_inventory": {
          const { siteId, limit = 50 } = args || {};
          if (!siteId) {
            return NextResponse.json({ id, error: { message: "siteId is required." } }, { status: 400 });
          }

          // Verify ownership
          const [site] = await db.select().from(websites).where(and(eq(websites.id, siteId), eq(websites.userId, dbUser.id))).limit(1);
          if (!site) {
            return NextResponse.json({ id, result: { content: [{ type: "text", text: "Error: Site not found or access denied." }] } });
          }

          const inventory = await db.select().from(urlInventory)
            .where(eq(urlInventory.websiteId, siteId))
            .orderBy(desc(urlInventory.lastDetectedAt))
            .limit(Math.min(limit, 200));

          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            result: {
              content: [{ type: "text", text: JSON.stringify(inventory, null, 2) }]
            }
          });
        }

        case "index_page": {
          const { url } = args || {};
          if (!url || !url.startsWith("http")) {
            return NextResponse.json({ id, error: { message: "Invalid URL provided." } }, { status: 400 });
          }

          const targetHost = new URL(url).hostname;
          const allWebsites = await db.select().from(websites).where(eq(websites.userId, dbUser.id));
          const matchedWebsite = allWebsites.find(w => {
            try { return new URL(w.url).hostname === targetHost; } catch { return false; }
          });

          if (!matchedWebsite) {
            return NextResponse.json({
              id,
              result: {
                content: [{ type: "text", text: `Error: Website not found in your dashboard for hostname: ${targetHost}. Please add it first.` }]
              }
            });
          }

          // Run Audit and Submissions in parallel
          const [audit, submissionResults] = await Promise.all([
            auditWebsite(url),
            triggerSubmissions(matchedWebsite, [url], dbUser.isPro ?? false)
          ]);

          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            result: {
              content: [{ type: "text", text: JSON.stringify({
                auditScore: audit.score,
                auditIssues: audit.issues?.length || 0,
                submissions: submissionResults.map(r => ({ engine: r.engine, status: r.status, error: r.errorMessage })),
                auditDetails: audit
              }, null, 2) }]
            }
          });
        }

        case "get_usage": {
          const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
          const planId = resolvePlanId(dbUser.subscriptionStatus, dbUser.isPro ?? false);
          const plan = getPlanDefinition(planId);

          const [websiteResult, submissionsResult] = await Promise.all([
            db.select({ count: count() }).from(websites).where(eq(websites.userId, dbUser.id)),
            db.select({ count: count() }).from(submissions)
              .innerJoin(websites, eq(submissions.websiteId, websites.id))
              .where(and(eq(websites.userId, dbUser.id), gte(submissions.createdAt, monthStart)))
          ]);

          const usage = {
            plan: plan.name,
            websitesUsed: websiteResult[0]?.count ?? 0,
            websitesLimit: plan.websiteLimit,
            submissionsUsedThisMonth: submissionsResult[0]?.count ?? 0,
            submissionsLimitMonthly: plan.submissionLimitMonthly
          };

          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            result: {
              content: [{ type: "text", text: JSON.stringify(usage, null, 2) }]
            }
          });
        }

        case "submit_url": {
          const { url } = args || {};
          if (!url || !url.startsWith("http")) {
            return NextResponse.json({ id, error: { message: "Invalid URL provided." } }, { status: 400 });
          }

          const targetHost = new URL(url).hostname;
          const allWebsites = await db.select().from(websites).where(eq(websites.userId, dbUser.id));
          const matchedWebsite = allWebsites.find(w => {
            try { return new URL(w.url).hostname === targetHost; } catch { return false; }
          });

          if (!matchedWebsite) {
            return NextResponse.json({
              id,
              result: {
                content: [{ type: "text", text: `Error: Website not found in your dashboard for hostname: ${targetHost}. Please add it first.` }]
              }
            });
          }

          const results = await triggerSubmissions(matchedWebsite, [url], dbUser.isPro ?? false);
          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            result: {
              content: [{ type: "text", text: JSON.stringify(results.map(r => ({ engine: r.engine, status: r.status, error: r.errorMessage })), null, 2) }]
            }
          });
        }

        case "submit_sitemap": {
          const { sitemapUrl } = args || {};
          if (!sitemapUrl || !sitemapUrl.startsWith("http")) {
            return NextResponse.json({ id, error: { message: "Invalid sitemapUrl provided." } }, { status: 400 });
          }

          const urls = await parseSitemap(sitemapUrl);
          if (urls.length === 0) {
            return NextResponse.json({
              id,
              result: { content: [{ type: "text", text: "No URLs found in the provided sitemap." }] }
            });
          }

          // Match website
          const targetHost = new URL(urls[0]).hostname;
          const allWebsites = await db.select().from(websites).where(eq(websites.userId, dbUser.id));
          const matchedWebsite = allWebsites.find(w => {
            try { return new URL(w.url).hostname === targetHost; } catch { return false; }
          });

          if (!matchedWebsite) {
            return NextResponse.json({
              id,
              result: {
                content: [{ type: "text", text: `Error: Website not found in your dashboard for hostname: ${targetHost}. Please add it first.` }]
              }
            });
          }

          const results = await triggerSubmissions(matchedWebsite, urls, dbUser.isPro ?? false);
          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            result: {
              content: [{ type: "text", text: JSON.stringify({
                urlsFound: urls.length,
                submissions: results.map(r => ({ engine: r.engine, status: r.status, error: r.errorMessage }))
              }, null, 2) }]
            }
          });
        }

        case "submit_urllist": {
          const { urls } = args || {};
          if (!urls || !Array.isArray(urls) || urls.length === 0) {
            return NextResponse.json({ id, error: { message: "urls array is required and must not be empty." } }, { status: 400 });
          }

          // Validate first URL
          const firstUrl = urls[0];
          if (!firstUrl.startsWith("http")) {
            return NextResponse.json({ id, error: { message: `Invalid URL: ${firstUrl}` } }, { status: 400 });
          }

          // Match website
          const targetHost = new URL(firstUrl).hostname;
          const allWebsites = await db.select().from(websites).where(eq(websites.userId, dbUser.id));
          const matchedWebsite = allWebsites.find(w => {
            try { return new URL(w.url).hostname === targetHost; } catch { return false; }
          });

          if (!matchedWebsite) {
            return NextResponse.json({
              id,
              result: {
                content: [{ type: "text", text: `Error: Website not found in your dashboard for hostname: ${targetHost}. Please add it first.` }]
              }
            });
          }

          const results = await triggerSubmissions(matchedWebsite, urls, dbUser.isPro ?? false);
          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            result: {
              content: [{ type: "text", text: JSON.stringify({
                urlsSubmitted: urls.length,
                submissions: results.map(r => ({ engine: r.engine, status: r.status, error: r.errorMessage }))
              }, null, 2) }]
            }
          });
        }

        case "seo_audit": {
          const { url } = args || {};
          if (!url || !url.startsWith("http")) {
            return NextResponse.json({ id, error: { message: "Invalid URL provided." } }, { status: 400 });
          }

          const audit = await auditWebsite(url);
          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            result: {
              content: [{ type: "text", text: JSON.stringify(audit, null, 2) }]
            }
          });
        }

        case "list_recent_submissions": {
          const limit = Math.min(Number(args?.limit || 10), 50);
          const recent = await db.select({
            id: submissions.id,
            url: submissions.url,
            engine: submissions.engine,
            status: submissions.status,
            createdAt: submissions.createdAt,
            websiteUrl: websites.url
          }).from(submissions)
            .innerJoin(websites, eq(submissions.websiteId, websites.id))
            .where(eq(websites.userId, dbUser.id))
            .orderBy(desc(submissions.createdAt))
            .limit(limit);

          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            result: {
              content: [{ type: "text", text: JSON.stringify(recent, null, 2) }]
            }
          });
        }
        
        case "list_cron_jobs": {
          const { siteId } = args || {};
          if (!siteId) {
            return NextResponse.json({ id, error: { message: "siteId is required." } }, { status: 400 });
          }

          // Verify ownership
          const [site] = await db.select().from(websites).where(and(eq(websites.id, siteId), eq(websites.userId, dbUser.id))).limit(1);
          if (!site) {
            return NextResponse.json({ id, result: { content: [{ type: "text", text: "Error: Site not found or access denied." }] } });
          }

          const jobs = await db.select().from(cronJobs).where(eq(cronJobs.websiteId, siteId));
          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            result: {
              content: [{ type: "text", text: JSON.stringify(jobs, null, 2) }]
            }
          });
        }

        case "save_cron_job": {
          const { siteId, engine, frequency = "daily", sourceMode = "sitemap", urls = "", enabled = true } = args || {};
          if (!siteId || !engine) {
            return NextResponse.json({ id, error: { message: "siteId and engine are required." } }, { status: 400 });
          }

          // Verify ownership
          const [site] = await db.select().from(websites).where(and(eq(websites.id, siteId), eq(websites.userId, dbUser.id))).limit(1);
          if (!site) {
            return NextResponse.json({ id, result: { content: [{ type: "text", text: "Error: Site not found or access denied." }] } });
          }

          if (sourceMode === "inventory" && !dbUser.isPro) {
            return NextResponse.json({
              jsonrpc: "2.0",
              id,
              result: { content: [{ type: "text", text: "Error: Auto-detecting new URLs (inventory mode) is only available for Pro users." }] }
            });
          }

          // Check if a cron job already exists for this engine
          const existing = await db.query.cronJobs.findFirst({
            where: and(eq(cronJobs.websiteId, siteId), eq(cronJobs.engine, engine as any))
          });

          if (existing) {
            await db.update(cronJobs).set({
              frequency,
              sourceMode,
              urls,
              enabled,
              updatedAt: new Date(),
            }).where(eq(cronJobs.id, existing.id));
          } else {
            await db.insert(cronJobs).values({
              websiteId: siteId,
              engine: engine as any,
              frequency,
              sourceMode,
              urls,
              enabled,
              nextRunAt: new Date(),
            });
          }

          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            result: {
              content: [{ type: "text", text: `Success: Scheduler task for engine '${engine}' saved.` }]
            }
          });
        }

        case "delete_cron_job": {
          const { jobId, siteId } = args || {};
          if (!jobId || !siteId) {
            return NextResponse.json({ id, error: { message: "jobId and siteId are required." } }, { status: 400 });
          }

          // Verify ownership of the site first
          const [site] = await db.select().from(websites).where(and(eq(websites.id, siteId), eq(websites.userId, dbUser.id))).limit(1);
          if (!site) {
            return NextResponse.json({ id, result: { content: [{ type: "text", text: "Error: Site not found or access denied." }] } });
          }

          await db.delete(cronJobs).where(and(eq(cronJobs.id, jobId), eq(cronJobs.websiteId, siteId)));
          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            result: {
              content: [{ type: "text", text: `Success: Cron job '${jobId}' deleted.` }]
            }
          });
        }

        case "gsc_submit_url": {
          const { url: gscUrl, siteId: gscSiteId } = args || {};
          if (!gscUrl || !gscUrl.startsWith("http")) {
            return NextResponse.json({ id, error: { message: "Invalid URL provided." } }, { status: 400 });
          }

          // Find website
          let targetWebsite;
          if (gscSiteId) {
            const [site] = await db.select().from(websites).where(and(eq(websites.id, gscSiteId), eq(websites.userId, dbUser.id))).limit(1);
            targetWebsite = site;
          } else {
            const targetHost = new URL(gscUrl).hostname;
            const allWebsites = await db.select().from(websites).where(eq(websites.userId, dbUser.id));
            targetWebsite = allWebsites.find(w => {
              try { return new URL(w.url).hostname === targetHost; } catch { return false; }
            });
          }

          if (!targetWebsite) {
            return NextResponse.json({
              id,
              result: { content: [{ type: "text", text: "Error: Website not found in your dashboard. Please add it first." }] }
            });
          }

          if (!targetWebsite.gscServiceAccountKey) {
            return NextResponse.json({
              id,
              result: { content: [{ type: "text", text: "Error: No Google service account key configured for this website. Add your GSC service account JSON key in site settings." }] }
            });
          }

          const gscResult = await submitBatchToGoogleIndexing([gscUrl], targetWebsite.gscServiceAccountKey);
          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            result: {
              content: [{ type: "text", text: JSON.stringify(gscResult, null, 2) }]
            }
          });
        }

        case "ping_url": {
          const { url: pingUrl, blogName = "IndexFast Site" } = args || {};
          if (!pingUrl || !pingUrl.startsWith("http")) {
            return NextResponse.json({ id, error: { message: "Invalid URL provided." } }, { status: 400 });
          }

          const pingResult = await pingService("pingomatic", blogName, pingUrl);
          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            result: {
              content: [{ type: "text", text: JSON.stringify(pingResult, null, 2) }]
            }
          });
        }

        case "check_redirects": {
          const { url: redirectUrl } = args || {};
          if (!redirectUrl || !redirectUrl.startsWith("http")) {
            return NextResponse.json({ id, error: { message: "Invalid URL provided." } }, { status: 400 });
          }

          const chain: Array<{ url: string; status: number | string; statusText: string }> = [];
          let currentUrl = redirectUrl;
          let redirects = 0;
          const maxRedirects = 10;

          while (redirects < maxRedirects) {
            try {
              const response = await axios.get(currentUrl, {
                maxRedirects: 0,
                validateStatus: (status: number) => status >= 200 && status < 400,
              });
              chain.push({ url: currentUrl, status: response.status, statusText: response.statusText });
              if (response.status >= 300 && response.status < 400 && response.headers.location) {
                const nextUrl = new URL(response.headers.location, currentUrl).toString();
                if (nextUrl === currentUrl) break;
                currentUrl = nextUrl;
                redirects++;
              } else {
                break;
              }
            } catch (error: unknown) {
              const err = error as { response?: { status: number; statusText: string }; message?: string };
              if (err.response) {
                chain.push({ url: currentUrl, status: err.response.status, statusText: err.response.statusText });
              } else {
                chain.push({ url: currentUrl, status: "Error", statusText: err.message || "Unknown error" });
              }
              break;
            }
          }

          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            result: {
              content: [{ type: "text", text: JSON.stringify({ chain, totalRedirects: redirects }, null, 2) }]
            }
          });
        }

        case "test_robots_txt": {
          const { robotsTxtUrl, urls: testUrls = [], userAgent = "*" } = args || {};
          if (!robotsTxtUrl) {
            return NextResponse.json({ id, error: { message: "robotsTxtUrl is required." } }, { status: 400 });
          }

          try {
            const response = await axios.get(robotsTxtUrl);
            const content = response.data;
            const robots = robotsParser(robotsTxtUrl, content);
            const results = testUrls.map((url: string) => ({
              url,
              allowed: robots.isAllowed(url, userAgent),
              reason: robots.isAllowed(url, userAgent) ? "Allowed" : "Disallowed",
            }));

            return NextResponse.json({
              jsonrpc: "2.0",
              id,
              result: {
                content: [{ type: "text", text: JSON.stringify({ results, robotsTxt: content }, null, 2) }]
              }
            });
          } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to fetch robots.txt";
            return NextResponse.json({
              id,
              result: { content: [{ type: "text", text: `Error: ${message}` }] }
            });
          }
        }

        case "extract_sitemap_urls": {
          const { sitemapUrl: extractSitemapUrl } = args || {};
          if (!extractSitemapUrl || !extractSitemapUrl.startsWith("http")) {
            return NextResponse.json({ id, error: { message: "Invalid sitemapUrl provided." } }, { status: 400 });
          }

          try {
            const extractedUrls = await parseSitemap(extractSitemapUrl);
            return NextResponse.json({
              jsonrpc: "2.0",
              id,
              result: {
                content: [{ type: "text", text: JSON.stringify({ urlCount: extractedUrls.length, urls: extractedUrls }, null, 2) }]
              }
            });
          } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to parse sitemap";
            return NextResponse.json({
              id,
              result: { content: [{ type: "text", text: `Error: ${message}` }] }
            });
          }
        }

        case "echo": {
          return NextResponse.json({
            jsonrpc: "2.0",
            id,
            result: {
              content: [{ type: "text", text: JSON.stringify(args, null, 2) }]
            }
          });
        }

        default:
          return NextResponse.json({ id, error: { message: `Unknown tool: ${name}` } }, { status: 404 });
      }
    }

    return NextResponse.json({ 
      jsonrpc: "2.0",
      error: { code: -32600, message: "Invalid request. Method should be list_tools or call_tool." },
      id 
    }, { status: 400 });

  } catch (error) {
    console.error("[MCP ERROR]", error);
    return NextResponse.json({ 
      jsonrpc: "2.0",
      error: { code: -32603, message: "Internal Server Error" },
      id 
    }, { status: 500 });
  }
}
