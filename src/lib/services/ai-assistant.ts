import { db } from "@/lib/db";
import { websites, urlInventory, submissions, cronJobs, users } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { triggerSubmissions } from "./indexing-service";
import { auditWebsite } from "./audit-service";
import { 
  listSearchConsoleSites, 
  getSearchAnalytics, 
  inspectUrl 
} from "@/lib/api/google";
import axios from "axios";

const NVIDIA_API_URL = process.env.NVIDIA_API_URL || "https://integrate.api.nvidia.com/v1/chat/completions";
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;

async function callNvidiaAI(prompt: string, json: boolean = false) {
  const response = await axios.post(NVIDIA_API_URL, {
    model: process.env.NVIDIA_MODEL || "meta/llama3-70b-instruct",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 1024,
    response_format: json ? { type: "json_object" } : undefined
  }, {
    headers: {
      "Authorization": `Bearer ${NVIDIA_API_KEY}`,
      "Content-Type": "application/json"
    }
  });
  return response.data.choices[0].message.content;
}

export const aiAssistantTools = {
  /**
   * List all websites connected by the user
   */
  list_websites: async (userId: string) => {
    const sites = await db.select().from(websites).where(eq(websites.userId, userId));
    return sites.map(s => ({ id: s.id, url: s.url, lastSyncAt: s.lastSyncAt }));
  },

  /**
   * Submit a specific URL for indexing
   */
  submit_url: async (userId: string, url: string, websiteId?: string) => {
    // Find the matching website for this URL or use provided websiteId
    let site;
    if (websiteId) {
      [site] = await db.select().from(websites).where(and(eq(websites.id, websiteId), eq(websites.userId, userId)));
    } else {
      const allSites = await db.select().from(websites).where(eq(websites.userId, userId));
      site = allSites.find(s => url.startsWith(s.url));
    }

    if (!site) return { error: "No matching website found for this URL. Please add the website first." };

    const [user] = await db.select().from(users).where(eq(users.id, userId));
    const results = await triggerSubmissions(site, [url], user?.isPro ?? false);
    return { message: "Submission triggered", results };
  },

  /**
   * Run a technical SEO audit
   */
  run_seo_audit: async (url: string) => {
    try {
      const audit = await auditWebsite(url);
      return audit;
    } catch (error) {
      return { error: "Failed to audit website. Make sure the URL is accessible." };
    }
  },

  /**
   * Generate SEO meta tags using Gemini
   */
  generate_meta_tags: async (url: string, keywords: string[]) => {
    try {
      const prompt = `Generate highly optimized SEO meta tags for the following URL: ${url}. 
      Target Keywords: ${keywords.join(", ")}.
      Please provide:
      1. A compelling Title Tag (50-60 chars)
      2. A descriptive Meta Description (150-160 chars)
      3. Open Graph Title and Description for social sharing.
      Follow best practices for click-through rate and keyword density. Respond in JSON format.`;

      const content = await callNvidiaAI(prompt, true);
      return JSON.parse(content);
    } catch (error) {
      return { error: "Failed to generate meta tags with AI." };
    }
  },

  /**
   * Generate an SEO-optimized blog post outline or content
   */
  generate_blog_post: async (topic: string, targetKeywords: string[]) => {
    try {
      const prompt = `Write a high-quality, SEO-optimized blog post outline and introduction for the topic: "${topic}".
      Target Keywords: ${targetKeywords.join(", ")}.
      Include H1, H2, and H3 structures. Ensure the content is designed to rank for GEO-specific intent if applicable.`;

      const content = await callNvidiaAI(prompt);
      return content;
    } catch (error) {
      return { error: "Failed to generate blog content." };
    }
  },

  /**
   * Get stats and reports for the user
   */
  get_dashboard_stats: async (userId: string) => {
    const userWebsites = await db.select().from(websites).where(eq(websites.userId, userId));
    const siteIds = userWebsites.map(s => s.id);
    
    if (siteIds.length === 0) return { message: "No websites found." };

    const recentSubmissions = await db.select()
      .from(submissions)
      .where(desc(submissions.createdAt))
      .limit(10);

    return {
      connectedSites: userWebsites.length,
      recentActivity: recentSubmissions.map(s => ({
        url: s.url,
        engine: s.engine,
        status: s.status,
        time: s.createdAt
      }))
    };
  },

  /**
   * Manage automation (Crons)
   */
  manage_automation: async (userId: string, websiteId: string, action: "enable" | "disable") => {
    const [site] = await db.select().from(websites).where(and(eq(websites.id, websiteId), eq(websites.userId, userId)));
    if (!site) return { error: "Website not found." };

    await db.update(cronJobs)
      .set({ enabled: action === "enable" })
      .where(eq(cronJobs.websiteId, websiteId));

    return { message: `Automation successfully ${action}d for ${site.url}.` };
  },

  /**
   * List verified GSC properties
   */
  gsc_list_properties: async (accessToken?: string) => {
    if (!accessToken) return { error: "Google Search Console is not connected. Please connect it in the settings or via the GSC OAuth button." };
    try {
      const sites = await listSearchConsoleSites(accessToken);
      return sites;
    } catch (error) {
      return { error: "Failed to fetch GSC properties." };
    }
  },

  /**
   * Get search performance insights
   */
  gsc_get_performance: async (accessToken: string | undefined, siteUrl: string, days: number = 28, dimensions: string[] = ['query']) => {
    if (!accessToken) return { error: "Google Search Console is not connected." };
    try {
      const data = await getSearchAnalytics(accessToken, siteUrl, days, dimensions);
      return data;
    } catch (error) {
      return { error: "Failed to fetch search performance data." };
    }
  },

  /**
   * Inspect a URL's status in Google Search
   */
  gsc_inspect_url: async (accessToken: string | undefined, url: string, siteUrl: string) => {
    if (!accessToken) return { error: "Google Search Console is not connected." };
    try {
      const result = await inspectUrl(accessToken, url, siteUrl);
      return result;
    } catch (error) {
      return { error: "Failed to inspect URL in GSC." };
    }
  }
};
