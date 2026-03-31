import * as cheerio from "cheerio";

export interface AuditIssue {
  type: "error" | "warning" | "info";
  title: string;
  description: string;
  recommendation: string;
  cursorPrompt: string;
}

export interface AuditResult {
  score: number;
  issues: AuditIssue[];
  aiView: string;
}

/**
 * Generate high-quality Cursor prompts using NVIDIA's Llama 3 70B
 */
async function generateAiPrompt(issueTitle: string, description: string, recommendation: string, context: string) {
  try {
    const response = await fetch(process.env.NVIDIA_API_URL!, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.NVIDIA_MODEL || "meta/llama3-70b-instruct",
        messages: [
          {
            role: "system",
            content: "You are an expert SEO engineer. Your task is to write a concise, one-sentence instruction for an AI code editor (like Cursor) to fix a specific SEO issue. Be direct and technical."
          },
          {
            role: "user",
            content: `Issue: ${issueTitle}. Description: ${description}. Recommendation: ${recommendation}. Page Context Snippet: ${context.substring(0, 500)}`
          }
        ]
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("AI Prompt generation failed:", error);
    return recommendation; // Fallback to basic recommendation
  }
}

export async function auditWebsite(url: string): Promise<AuditResult> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "IndexFast-SEO-Auditor/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch page for audit: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    
    const issues: AuditIssue[] = [];
    let score = 100;

    // Helper to add issues and trigger AI prompt generation
    const addIssue = async (
      type: "error" | "warning" | "info",
      title: string,
      description: string,
      recommendation: string,
      defaultPrompt: string,
      deduction: number
    ) => {
      score -= deduction;
      // We'll generate the AI prompt if keys are available, otherwise use default
      const cursorPrompt = process.env.NVIDIA_API_KEY 
        ? await generateAiPrompt(title, description, recommendation, html)
        : defaultPrompt;

      issues.push({ type, title, description, recommendation, cursorPrompt });
    };

    // 1. Title Check
    const title = $("title").text().trim();
    if (!title) {
      await addIssue(
        "error",
        "Missing Title Tag",
        "The page does not have a <title> tag, which is critical for SEO.",
        "Add a descriptive <title> tag between 50-60 characters.",
        "Add a relevant <title> tag to the head of this page. It should include primary keywords and be under 60 characters.",
        15
      );
    } else if (title.length > 60) {
      await addIssue(
        "warning",
        "Title Tag Too Long",
        `Current title length is ${title.length} chars. Long titles are truncated in search results.`,
        "Shorten the title to under 60 characters.",
        `The current title "${title}" is too long. Shorten it to be under 60 characters while keeping the main keywords.`,
        5
      );
    }

    // 2. Meta Description Check
    const metaDescription = $('meta[name="description"]').attr("content")?.trim();
    if (!metaDescription) {
      await addIssue(
        "error",
        "Missing Meta Description",
        "Meta descriptions influence click-through rates from search results.",
        "Add a unique meta description between 150-160 characters.",
        "Create and add a meta description tag to the head of this page. Make it compelling for users and include target keywords.",
        10
      );
    }

    // 3. H1 Check
    const h1s = $("h1");
    if (h1s.length === 0) {
      await addIssue(
        "error",
        "Missing H1 Header",
        "H1 tags are the most important on-page SEO signals for topics.",
        "Ensure every page has exactly one H1 tag.",
        "Identify the main topic of this page and wrap it in an <h1> tag. Ensure it's the only H1 on the page.",
        10
      );
    } else if (h1s.length > 1) {
      await addIssue(
        "warning",
        "Multiple H1 Headers",
        `Found ${h1s.length} H1 tags. Using multiple H1s can confuse search engines.`,
        "Consolidate into a single H1 and use H2-H4 for subheadings.",
        "Found multiple <h1> tags. Change all but the primary one to <h2> or <h3> tags to maintain proper document structure.",
        5
      );
    }

    // 4. Image Alt Tags
    const imagesWithoutAlt = $("img:not([alt])");
    if (imagesWithoutAlt.length > 0) {
      await addIssue(
        "warning",
        "Images Missing Alt Text",
        `Found ${imagesWithoutAlt.length} images without alt attributes.`,
        "Add descriptive alt text to all images for accessibility and SEO.",
        "Add descriptive 'alt' attributes to all <img> tags in this file to improve accessibility and image SEO.",
        Math.min(10, imagesWithoutAlt.length * 2)
      );
    }

    // 5. Canonical Check
    const canonical = $('link[rel="canonical"]').attr("href");
    if (!canonical) {
      await addIssue(
        "info",
        "Missing Canonical Tag",
        "Canonical tags prevent duplicate content issues.",
        "Add a self-referencing canonical tag.",
        `Add a <link rel="canonical" href="${url}" /> tag to the head section.`,
        5
      );
    }

    // AI View Generation (Simplified Markdown for LLMs)
    $("script, style, nav, footer, header").remove();
    const aiView = $("body").text().replace(/\s+/g, " ").trim();

    return {
      score: Math.max(0, score),
      issues,
      aiView: aiView.substring(0, 2000), // Limit size
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error during audit";
    throw new Error(message);
  }
}

