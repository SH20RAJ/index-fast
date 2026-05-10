import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { stackServerApp } from "@/stack";
import { aiAssistantTools } from "@/lib/services/ai-assistant";
import { z } from "zod";

const nvidia = createOpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages }: { messages: any[] } = await req.json();

  const result = streamText({
    model: nvidia(process.env.NVIDIA_MODEL || "meta/llama3-70b-instruct"),
    system: `You are the IndexFast AI Assistant. You help users manage their SEO indexing and analyze their websites.

    NOTE: Google Search Console (GSC) import is currently deprecated. Focus on SEO features instead.

    Guidelines:
    - Be technical yet helpful.
    - If a user asks to index a URL, use the submit_url tool.
    - If a user wants to know about their sites, use list_websites.
    - You can perform technical audits using run_seo_audit.
    - You can generate optimized content and meta tags using the generation tools.
    - User ID: ${user.id}.

    Proactively suggest running a technical audit if the user is looking to improve their SEO.
    When a user asks about "my sites" or "websites", always start by listing them if you haven't already.`,
    messages,
    tools: {
      list_websites: {
        description: "List all websites connected by the current user.",
        execute: async () => {
          const res = await aiAssistantTools.list_websites(user.id);
          return JSON.stringify(res);
        },
      } as any,
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
      } as any,
      run_seo_audit: {
        description: "Perform a technical SEO audit on a given URL.",
        inputSchema: z.object({
          url: z.string().url(),
        }),
        execute: async ({ url }: any) => {
          const res = await aiAssistantTools.run_seo_audit(url);
          return JSON.stringify(res);
        },
      } as any,
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
      } as any,
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
      } as any,
      get_stats: {
        description: "Get recent indexing activity and dashboard reports.",
        execute: async () => {
          const res = await aiAssistantTools.get_dashboard_stats(user.id);
          return JSON.stringify(res);
        },
      } as any,
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
      } as any,
    },
  });

  return result.toTextStreamResponse();
}