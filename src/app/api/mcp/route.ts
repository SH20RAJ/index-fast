import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, websites, submissions } from "@/lib/db/schema";
import { and, count, desc, eq, gte, sql } from "drizzle-orm";
import { getPlanDefinition, resolvePlanId } from "@/lib/billing/plans";
import { triggerSubmissions } from "@/lib/services/indexing-service";
import { auditWebsite } from "@/lib/services/audit-service";

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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ 
        jsonrpc: "2.0",
        error: { code: -32001, message: "Unauthorized. Missing or invalid Authorization header." },
        id 
      }, { status: 401 });
    }

    const apiKey = authHeader.replace("Bearer ", "");
    
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

    if (method === "list_tools") {
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

    if (method === "call_tool") {
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
