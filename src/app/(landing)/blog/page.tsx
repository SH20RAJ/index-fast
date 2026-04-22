import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BLOG_POSTS } from "@/lib/blog-catalog";
import { ArrowRight, Clock, Calendar } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.indexfast.co";

export const metadata: Metadata = {
  title: "Blog - Indexing & SEO Guides",
  description:
    "Practical guides to help you get indexed faster and grow your website traffic.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogIndexPage() {
  // Sort posts by date (newest first)
  const sortedPosts = [...BLOG_POSTS].sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-zinc-50/50 dark:bg-zinc-950/50">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
              Guides
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl max-w-3xl">
              SEO and indexing <br />
              <span className="text-muted-foreground">guides for growth.</span>
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
              Step-by-step playbooks to help you get your website noticed by search engines and AI assistants.
            </p>
          </div>
        </div>
      </div>

      {/* Blog Feed */}
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {sortedPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <Card className="h-full overflow-hidden border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 rounded-2xl">
                <CardContent className="p-0">
                  <div className="p-6 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 hover:bg-primary/10 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5">
                        {post.primaryKeyword}
                      </Badge>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                        <Clock className="h-3.5 w-3.5" />
                        {post.readingMinutes} min read
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h2 className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                        {post.title}
                      </h2>
                      <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {post.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center gap-1 text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                        Read Guide
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
