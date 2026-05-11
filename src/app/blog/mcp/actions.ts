"use server";

import { db } from "@/lib/db";
import { blogPosts, type NewBlogPost } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getBlogPosts() {
  return await db.query.blogPosts.findMany({
    orderBy: [desc(blogPosts.publishedAt)],
  });
}

export async function getBlogPostBySlug(slug: string) {
  return await db.query.blogPosts.findFirst({
    where: eq(blogPosts.slug, slug),
  });
}

export async function upsertBlogPost(data: NewBlogPost) {
  const existing = await db.query.blogPosts.findFirst({
    where: eq(blogPosts.slug, data.slug),
  });

  if (existing) {
    await db.update(blogPosts).set({
      ...data,
      updatedAt: new Date(),
    }).where(eq(blogPosts.slug, data.slug));
  } else {
    await db.insert(blogPosts).values({
      ...data,
      publishedAt: data.publishedAt || new Date(),
      updatedAt: new Date(),
    });
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${data.slug}`);
  revalidatePath("/blog/mcp");
}

export async function deleteBlogPost(slug: string) {
  await db.delete(blogPosts).where(eq(blogPosts.slug, slug));
  revalidatePath("/blog");
  revalidatePath("/blog/mcp");
}
