import { streamText, ToolSet } from "ai";
import { stackServerApp } from "@/stack";
import { aiAssistantTools } from "@/lib/services/ai-assistant";
import { z } from "zod";
import { NextResponse } from "next/server";

const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages }: { messages: any[] } = await req.json();
  const apiKey = process.env.NVIDIA_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
  }

  const systemMessage = `You are the IndexFast AI Assistant. You help users manage their SEO indexing and analyze their websites.

NOTE: Google Search Console (GSC) import is currently deprecated. Focus on SEO features instead.

Guidelines:
- Be technical yet helpful.
- If a user asks to index a URL, use the submit_url tool.
- If a user wants to know about their sites, use list_websites.
- You can perform technical audits using run_seo_audit.
- You can generate optimized content and meta tags using the generation tools.
- User ID: ${user.id}.

Proactively suggest running a technical audit if the user is looking to improve their SEO.
When a user asks about "my sites" or "websites", always start by listing them if you haven't already.`;

  // Convert to NVIDIA format
  const fullMessages = [
    { role: "system", content: systemMessage },
    ...messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.content || "",
    })),
  ];

  const result = streamText({
    model: {
      provider: "nvidia",
      id: process.env.NVIDIA_MODEL || "qwen/qwen3-coder-480b-a35b-instruct",
    },
    messages: fullMessages as any,
    tools: {
      list_websites: {
        description: "List all websites connected by the current user.",
        execute: async () => {
          const res = await aiAssistantTools.list_websites(user.id);
          return JSON.stringify(res);
        },
      },
      submit_url: {
        description: "Submit a specific URL for instant indexing to all supported search engines.",
        inputSchema: z.object({
          url: z.string().url(),
          websiteId: z.string().optional(),
        }),
        execute: async ({ url, websiteId }: any) => {
          const res = await aiAssistantTools.submit_url(user.id, url, websiteId);
          return JSON.stringify(res);
        },
      },
      run_seo_audit: {
        description: "Perform a technical SEO audit on a given URL.",
        inputSchema: z.object({
          url: z.string().url(),
        }),
        execute: async ({ url }: any) => {
          const res = await aiAssistantTools.run_seo_audit(url);
          return JSON.stringify(res);
        },
      },
      generate_meta_tags: {
        description: "Generate SEO-optimized title tags and meta descriptions.",
        inputSchema: z.object({
          url: z.string().url(),
          keywords: z.array(z.string()),
        }),
        execute: async ({ url, keywords }: any) => {
          const res = await aiAssistantTools.generate_meta_tags(url, keywords);
          return JSON.stringify(res);
        },
      },
      generate_blog_post: {
        description: "Generate an SEO-optimized blog post outline or introduction.",
        inputSchema: z.object({
          topic: z.string(),
          keywords: z.array(z.string()),
        }),
        execute: async ({ topic, keywords }: any) => {
          const res = await aiAssistantTools.generate_blog_post(topic, keywords);
          return res;
        },
      },
      get_stats: {
        description: "Get recent indexing activity and dashboard reports.",
        execute: async () => {
          const res = await aiAssistantTools.get_dashboard_stats(user.id);
          return JSON.stringify(res);
        },
      },
      manage_automation: {
        description: "Enable or disable automated sitemap indexing (cron jobs) for a website.",
        inputSchema: z.object({
          websiteId: z.string(),
          action: z.enum(["enable", "disable"]),
        }),
        execute: async ({ websiteId, action }: any) => {
          const res = await aiAssistantTools.manage_automation(user.id, websiteId, action);
          return JSON.stringify(res);
        },
      },
    } as ToolSet,
    maxTokens: 1024,
    temperature: 0.7,
  });

  return result.toTextStreamResponse();
}