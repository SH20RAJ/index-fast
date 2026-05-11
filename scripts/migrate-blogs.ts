import { db } from "../src/lib/db";
import { blogPosts } from "../src/lib/db/schema";
import { BLOG_POSTS } from "../src/lib/blog-catalog";

async function main() {
  console.log("Seeding blog posts...");

  for (const post of BLOG_POSTS) {
    try {
      await db.insert(blogPosts).values({
        slug: post.slug,
        title: post.title,
        description: post.description,
        primaryKeyword: post.primaryKeyword,
        keywords: post.keywords,
        publishedAt: new Date(post.publishedAt),
        updatedAt: new Date(post.updatedAt),
        readingMinutes: post.readingMinutes,
        author: post.author,
        hero: post.hero,
        sections: post.sections,
        faqs: post.faqs,
      }).onConflictDoUpdate({
        target: blogPosts.slug,
        set: {
          title: post.title,
          description: post.description,
          primaryKeyword: post.primaryKeyword,
          keywords: post.keywords,
          publishedAt: new Date(post.publishedAt),
          updatedAt: new Date(post.updatedAt),
          readingMinutes: post.readingMinutes,
          author: post.author,
          hero: post.hero,
          sections: post.sections,
          faqs: post.faqs,
        }
      });
      console.log(`- Seeded: ${post.slug}`);
    } catch (error) {
      console.error(`- Error seeding ${post.slug}:`, error);
    }
  }

  console.log("Seeding complete!");
  process.exit(0);
}

main();
