import { db } from "@/lib/db";
import { blogPosts, type BlogPost as DbBlogPost, type BlogSection, type BlogFaq } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

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

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const posts = await db.query.blogPosts.findMany({
    orderBy: [desc(blogPosts.publishedAt)],
  });

  return posts.map(mapDbPostToBlogPost);
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
