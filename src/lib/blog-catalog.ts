import { db } from "@/lib/db";
import { blogPosts, type BlogPost as DbBlogPost, type BlogSection, type BlogFaq } from "@/lib/db/schema";
import { desc, eq, ilike, or, asc, and, count } from "drizzle-orm";

export type { BlogSection, BlogFaq };

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  primaryKeyword: string;
  keywords: string[];
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  author: string;
  hero: string;
  sections: BlogSection[];
  faqs: BlogFaq[];
}

export interface BlogFilterOptions {
  query?: string;
  category?: string;
  sortBy?: "newest" | "oldest" | "reading_time";
  page?: number;
  limit?: number;
}

export async function getPaginatedBlogPosts(options: BlogFilterOptions = {}) {
  const { 
    query, 
    category, 
    sortBy = "newest", 
    page = 1, 
    limit = 10 
  } = options;

  const offset = (page - 1) * limit;

  // Build where clause
  const conditions = [];
  if (query) {
    conditions.push(
      or(
        ilike(blogPosts.title, `%${query}%`),
        ilike(blogPosts.description, `%${query}%`),
        ilike(blogPosts.primaryKeyword, `%${query}%`)
      )
    );
  }
  if (category && category !== "all") {
    conditions.push(eq(blogPosts.primaryKeyword, category));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Sorting
  let orderBy;
  switch (sortBy) {
    case "oldest":
      orderBy = asc(blogPosts.publishedAt);
      break;
    case "reading_time":
      orderBy = desc(blogPosts.readingMinutes);
      break;
    case "newest":
    default:
      orderBy = desc(blogPosts.publishedAt);
      break;
  }

  try {
    // Execute queries
    const [posts, totalResult] = await Promise.all([
      db.query.blogPosts.findMany({
        where: whereClause,
        orderBy: [orderBy],
        limit,
        offset,
      }),
      db.select({ value: count() }).from(blogPosts).where(whereClause)
    ]);

    let finalPosts = posts.map(mapDbPostToBlogPost);
    let finalTotal = totalResult[0].value;

    // Fallback to static posts if DB is empty and no search is active
    if (finalPosts.length === 0 && !query && (!category || category === "all")) {
      finalPosts = BLOG_POSTS.slice(offset, offset + limit);
      finalTotal = BLOG_POSTS.length;
    }

    return {
      posts: finalPosts,
      total: finalTotal,
      totalPages: Math.ceil(finalTotal / limit),
      currentPage: page
    };
  } catch (error) {
    console.error("[getPaginatedBlogPosts] Failed to fetch blog posts from database:", error);
    return {
      posts: BLOG_POSTS.slice(0, 10),
      total: BLOG_POSTS.length,
      totalPages: Math.ceil(BLOG_POSTS.length / 10),
      currentPage: page
    };
  }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const posts = await db.query.blogPosts.findMany({
      orderBy: [desc(blogPosts.publishedAt)],
    });

    if (posts.length === 0) return BLOG_POSTS;
    return posts.map(mapDbPostToBlogPost);
  } catch (error) {
    console.error("[getAllBlogPosts] Failed to fetch all blog posts from database:", error);
    return BLOG_POSTS;
  }
}

export async function getUniqueKeywords(): Promise<string[]> {
  try {
    const results = await db
      .select({ keyword: blogPosts.primaryKeyword })
      .from(blogPosts)
      .groupBy(blogPosts.primaryKeyword);
    
    const keywords = results
      .map(r => r.keyword)
      .filter((k): k is string => !!k && k.trim() !== "");

    if (keywords.length === 0) {
      return Array.from(new Set(BLOG_POSTS.map(p => p.primaryKeyword)));
    }
    return keywords;
  } catch (error) {
    console.error("[getUniqueKeywords] Failed to fetch unique keywords from database:", error);
    return Array.from(new Set(BLOG_POSTS.map(p => p.primaryKeyword)));
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    const post = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.slug, slug),
    });

    if (!post) {
      return BLOG_POSTS.find(p => p.slug === slug);
    }

    return mapDbPostToBlogPost(post);
  } catch (error) {
    console.error(`[getBlogPostBySlug] Failed to fetch blog post by slug ${slug} from database:`, error);
    return BLOG_POSTS.find(p => p.slug === slug);
  }
}

function mapDbPostToBlogPost(post: DbBlogPost): BlogPost {
  return {
    ...post,
    primaryKeyword: post.primaryKeyword || "",
    keywords: post.keywords || [],
    publishedAt: post.publishedAt.toISOString().split('T')[0],
    updatedAt: post.updatedAt.toISOString().split('T')[0],
    readingMinutes: post.readingMinutes || 5,
    author: post.author || "IndexFast Editorial Team",
    hero: post.hero || "",
    sections: (post.sections as any) || [],
    faqs: (post.faqs as any) || [],
  };
}

// Fallback for types or legacy code that might still import BLOG_POSTS
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-index-google-instantly",
    title: "How to Index Your Website on Google Instantly (2024)",
    description: "Stop waiting weeks for Googlebot. Learn the exact methods to get your new pages indexed in minutes using the Google Indexing API and IndexFast.",
    primaryKeyword: "Google Indexing",
    keywords: ["google indexing api", "instant indexing", "seo tips", "google search console"],
    publishedAt: "2024-05-15",
    updatedAt: "2024-05-15",
    readingMinutes: 8,
    author: "Shaswat Raj",
    hero: "Getting indexed shouldn't be a waiting game. With the right tools, you can push your content to Google's primary index the moment you hit publish.",
    sections: [
      {
        heading: "The Problem with Traditional Crawling",
        paragraphs: [
          "Traditionally, Google relies on crawl bots to discover new content. While this works for established sites, new pages on smaller sites can take weeks to appear in search results.",
          "This delay costs you traffic, revenue, and momentum. If you're running a news site or a product launch, you need instant visibility."
        ],
        bullets: [
          "Discovery vs. Indexing: Just because Google knows your page exists doesn't mean it's indexed.",
          "Crawl Budget: Google allocates limited resources to crawling your site.",
          "The 'Discovered - currently not indexed' trap."
        ]
      },
      {
        heading: "Enter the Google Indexing API",
        paragraphs: [
          "Google provides a high-priority API specifically for Job Postings and Broadcast Events, but in practice, it works for any URL that needs rapid updates.",
          "By using IndexFast, you can bypass the standard crawl queue and notify Google directly of your new content."
        ]
      }
    ],
    faqs: [
      {
        question: "Is using the Indexing API safe?",
        answer: "Yes, it is an official Google API. While originally intended for specific content types, thousands of SEOs use it for general content with great success."
      },
      {
        question: "How long does it take to get indexed?",
        answer: "Typically between 5 minutes and 24 hours, compared to several days or weeks via standard methods."
      }
    ]
  },
  {
    slug: "mcp-server-for-seo",
    title: "Using MCP Servers to Automate Your SEO Workflow",
    description: "Discover how Model Context Protocol (MCP) is revolutionizing technical SEO by bringing indexing tools directly into your AI IDE.",
    primaryKeyword: "MCP",
    keywords: ["mcp server", "cursor ai", "vscode extension", "seo automation"],
    publishedAt: "2024-05-20",
    updatedAt: "2024-05-20",
    readingMinutes: 6,
    author: "IndexFast Team",
    hero: "The gap between code and SEO is closing. MCP allows your AI assistant to handle technical tasks like sitemap validation and URL submission without you ever leaving Cursor.",
    sections: [
      {
        heading: "What is MCP?",
        paragraphs: [
          "Model Context Protocol (MCP) is an open standard that enables AI models to interact with local tools and data safely.",
          "For SEOs, this means your AI can now 'see' your site's health and take actions like submitting URLs to Bing or Google via a simple command."
        ]
      }
    ],
    faqs: [
      {
        question: "Do I need to be a developer to use MCP?",
        answer: "While it helps, tools like IndexFast make it easy to install and run MCP servers with a single command."
      }
    ]
  },
  {
    slug: "bing-webmaster-tools-guide",
    title: "The Ultimate Guide to Bing Webmaster Tools",
    description: "Don't ignore 15% of your search traffic. Learn how to optimize for Bing and use IndexNow for real-time indexing.",
    primaryKeyword: "Bing SEO",
    keywords: ["bing webmaster tools", "indexnow", "microsoft bing", "search engine optimization"],
    publishedAt: "2024-05-25",
    updatedAt: "2024-05-25",
    readingMinutes: 10,
    author: "Growth Expert",
    hero: "Bing is often overlooked, but its integration with OpenAI and growing market share make it a critical channel for any serious growth strategy.",
    sections: [
      {
        heading: "Why Bing Matters in 2024",
        paragraphs: [
          "With the rise of Bing Chat and AI-powered search, Bing is seeing its highest engagement in years.",
          "Bing is also much more aggressive with real-time indexing via the IndexNow protocol, which IndexFast supports out of the box."
        ]
      }
    ],
    faqs: [
      {
        question: "What is IndexNow?",
        answer: "IndexNow is a protocol that allows website owners to instantly inform search engines about recent content changes on their website."
      }
    ]
  }
];
