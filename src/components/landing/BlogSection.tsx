"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BLOG_POSTS } from "@/lib/blog-catalog";

const featuredPosts = BLOG_POSTS.slice(0, 3);

export default function BlogSection() {
  return (
    <section id="blog" className="border-b border-border/70 py-14 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl space-y-3 sm:mb-12">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] tracking-[0.14em] uppercase">
            SEO Insights
          </Badge>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            Actionable guides
            <span className="block text-muted-foreground">for operators.</span>
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Tactical playbooks for teams that care about indexing velocity and discoverability.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {featuredPosts.map((post) => (
            <Card key={post.slug} className="border-border/70 bg-card/70">
              <CardContent className="flex h-full flex-col gap-4 p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-[11px] uppercase">{post.primaryKeyword}</Badge>
                  <Badge variant="outline" className="text-[11px]">{post.readingMinutes} min</Badge>
                </div>
                <h3 className="text-lg font-bold tracking-tight">{post.title}</h3>
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{post.description}</p>
                <Button variant="outline" asChild className="w-full">
                  <Link href={`/blog/${post.slug}`}>Read full post</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button variant="ghost" asChild>
            <Link href="/blog">View all insights</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
