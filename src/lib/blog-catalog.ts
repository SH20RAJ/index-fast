import { db } from "@/lib/db";
import { blogPosts, type BlogPost as DbBlogPost, type BlogSection, type BlogFaq } from "@/lib/db/schema";
import { desc, eq, ilike, or, asc, and, count, sql } from "drizzle-orm";

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

  return {
    posts: posts.map(mapDbPostToBlogPost),
    total: totalResult[0].value,
    totalPages: Math.ceil(totalResult[0].value / limit),
    currentPage: page
  };
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const posts = await db.query.blogPosts.findMany({
    orderBy: [desc(blogPosts.publishedAt)],
  });

  return posts.map(mapDbPostToBlogPost);
}

export async function getUniqueKeywords(): Promise<string[]> {
  const results = await db
    .select({ keyword: blogPosts.primaryKeyword })
    .from(blogPosts)
    .groupBy(blogPosts.primaryKeyword);
  
  return results
    .map(r => r.keyword)
    .filter((k): k is string => !!k && k.trim() !== "");
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const post = await db.query.blogPosts.findFirst({
    where: eq(blogPosts.slug, slug),
  });

  if (!post) return undefined;

  return mapDbPostToBlogPost(post);
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
export const BLOG_POSTS: BlogPost[] = [];
