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

    // 1. Title Check
    const title = $("title").text().trim();
    if (!title) {
      score -= 15;
      issues.push({
        type: "error",
        title: "Missing Title Tag",
        description: "The page does not have a <title> tag, which is critical for SEO.",
        recommendation: "Add a descriptive <title> tag between 50-60 characters.",
        cursorPrompt: "Add a relevant <title> tag to the head of this page. It should include primary keywords and be under 60 characters.",
      });
    } else if (title.length > 60) {
      score -= 5;
      issues.push({
        type: "warning",
        title: "Title Tag Too Long",
        description: `Current title length is ${title.length} chars. Long titles are truncated in search results.`,
        recommendation: "Shorten the title to under 60 characters.",
        cursorPrompt: `The current title "${title}" is too long. Shorten it to be under 60 characters while keeping the main keywords.`,
      });
    }

    // 2. Meta Description Check
    const metaDescription = $('meta[name="description"]').attr("content")?.trim();
    if (!metaDescription) {
      score -= 10;
      issues.push({
        type: "error",
        title: "Missing Meta Description",
        description: "Meta descriptions influence click-through rates from search results.",
        recommendation: "Add a unique meta description between 150-160 characters.",
        cursorPrompt: "Create and add a meta description tag to the head of this page. Make it compelling for users and include target keywords.",
      });
    }

    // 3. H1 Check
    const h1s = $("h1");
    if (h1s.length === 0) {
      score -= 10;
      issues.push({
        type: "error",
        title: "Missing H1 Header",
        description: "H1 tags are the most important on-page SEO signals for topics.",
        recommendation: "Ensure every page has exactly one H1 tag.",
        cursorPrompt: "Identify the main topic of this page and wrap it in an <h1> tag. Ensure it's the only H1 on the page.",
      });
    } else if (h1s.length > 1) {
      score -= 5;
      issues.push({
        type: "warning",
        title: "Multiple H1 Headers",
        description: `Found ${h1s.length} H1 tags. Using multiple H1s can confuse search engines.`,
        recommendation: "Consolidate into a single H1 and use H2-H4 for subheadings.",
        cursorPrompt: "Found multiple <h1> tags. Change all but the primary one to <h2> or <h3> tags to maintain proper document structure.",
      });
    }

    // 4. Image Alt Tags
    const imagesWithoutAlt = $("img:not([alt])");
    if (imagesWithoutAlt.length > 0) {
      score -= Math.min(10, imagesWithoutAlt.length * 2);
      issues.push({
        type: "warning",
        title: "Images Missing Alt Text",
        description: `Found ${imagesWithoutAlt.length} images without alt attributes.`,
        recommendation: "Add descriptive alt text to all images for accessibility and SEO.",
        cursorPrompt: "Add descriptive 'alt' attributes to all <img> tags in this file to improve accessibility and image SEO.",
      });
    }

    // 5. Canonical Check
    const canonical = $('link[rel="canonical"]').attr("href");
    if (!canonical) {
      score -= 5;
      issues.push({
        type: "info",
        title: "Missing Canonical Tag",
        description: "Canonical tags prevent duplicate content issues.",
        recommendation: "Add a self-referencing canonical tag.",
        cursorPrompt: `Add a <link rel="canonical" href="${url}" /> tag to the head section.`,
      });
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
