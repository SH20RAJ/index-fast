import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BLOG_POSTS } from "@/lib/blog-catalog";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://indexfast.net";

export const metadata: Metadata = {
  title: "SEO & GEO Blog",
  description:
    "Long-form SEO and GEO playbooks for faster indexing, Bing visibility, AI assistant citations, and product-led growth with free tools.",
  keywords: [
    "indexnow blog",
    "seo geo blog",
    "bing indexing guides",
    "ai visibility seo",
    "programmatic seo indexing",
    "seo saas growth blog",
  ],
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "SEO & GEO Blog | IndexFast",
    description:
      "Practical long-form guides on indexing, technical SEO, GEO, and conversion-led tool strategy.",
    url: "/blog",
    type: "website",
  },
};

const blogCollectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "IndexFast SEO and GEO Blog",
  description:
    "Long-form guides about indexing automation, technical SEO workflows, and generative engine optimization.",
  url: `${siteUrl}/blog`,
  blogPost: BLOG_POSTS.map((post) => ({
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
  })),
};

export default function BlogIndexPage() {
  return (
    <>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mb-8 space-y-3 sm:mb-10">
          <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">Editorial Hub</p>
          <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-5xl">
            SEO playbooks for indexing and conversion-led growth
          </h1>
          <p className="max-w-3xl text-lg text-muted-foreground">
            Frameworks and operating models for teams shipping content weekly.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {BLOG_POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block h-full">
              <Card className="h-full border-border/70 bg-card/70 transition-colors hover:border-primary/40">
                <CardContent className="space-y-3 p-5 sm:p-6">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-[11px] uppercase">
                      {post.primaryKeyword}
                    </Badge>
                    <Badge variant="outline" className="text-[11px]">
                      {post.readingMinutes} min read
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">{post.title}</h2>
                  <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{post.description}</p>
                  <p className="text-xs text-muted-foreground">Published {post.publishedAt}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogCollectionJsonLd) }} />
    </>
  );
}
