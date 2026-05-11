import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getPaginatedBlogPosts, getUniqueKeywords, type BlogFilterOptions } from "@/lib/blog-catalog";
import { ArrowRight, Clock, Calendar, SearchX } from "lucide-react";
import { BlogSearch } from "./_components/blog-search";
import { BlogKeywords } from "./_components/blog-keywords";
import { BlogPagination } from "./_components/blog-pagination";
import { BlogSort } from "./_components/blog-sort";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Blog - Indexing & SEO Guides",
  description:
    "Practical guides to help you get indexed faster and grow your website traffic.",
  alternates: {
    canonical: "/blog",
  },
};

export default async function BlogIndexPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  
  const options: BlogFilterOptions = {
    query: typeof searchParams.q === "string" ? searchParams.q : undefined,
    category: typeof searchParams.category === "string" ? searchParams.category : undefined,
    sortBy: (searchParams.sortBy as any) || "newest",
    page: searchParams.page ? parseInt(searchParams.page as string) : 1,
    limit: 10,
  };

  const [{ posts, totalPages, currentPage, total }, keywords] = await Promise.all([
    getPaginatedBlogPosts(options),
    getUniqueKeywords()
  ]);

  // Featured post is the first one on the first page when no search is active
  const isDefaultView = !options.query && (!options.category || options.category === "all") && options.page === 1;
  const featuredPost = isDefaultView ? posts[0] : null;
  const displayPosts = featuredPost ? posts.slice(1) : posts;

  return (
    <main className="min-h-screen bg-background">
      {/* Header & Search */}
      <div className="border-b border-border/40 bg-zinc-50/50 dark:bg-zinc-950/50">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20 text-center">
          <div className="space-y-4 mb-10">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
              The Knowledge Base
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mx-auto max-w-3xl">
              SEO and indexing <br />
              <span className="text-muted-foreground">guides for growth.</span>
            </h1>
          </div>
          
          <Suspense fallback={<div className="h-12 w-full max-w-xl bg-muted animate-pulse rounded-full mx-auto" />}>
            <BlogSearch />
          </Suspense>
          
          <Suspense fallback={<div className="h-10 w-full max-w-2xl bg-muted animate-pulse rounded-full mx-auto mt-6" />}>
            <BlogKeywords keywords={keywords} />
          </Suspense>
        </div>
      </div>

      {/* Toolbar */}
      <div className="sticky top-0 z-10 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
          <div className="text-xs font-medium text-muted-foreground">
            Showing <span className="text-foreground font-bold">{total}</span> guides
          </div>
          <Suspense>
            <BlogSort />
          </Suspense>
        </div>
      </div>

      {/* Blog Feed */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Featured Post */}
        {featuredPost && (
          <Link href={`/blog/${featuredPost.slug}`} className="group mb-12 block">
            <Card className="overflow-hidden border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 rounded-3xl">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="aspect-[16/10] md:aspect-auto bg-primary/5 relative overflow-hidden flex items-center justify-center p-12">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                    <div className="relative z-10 text-8xl">📑</div>
                  </div>
                  <div className="p-8 sm:p-12 space-y-6 flex flex-col justify-center">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full">
                        Featured Guide
                      </Badge>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                        <Clock className="h-3.5 w-3.5" />
                        {featuredPost.readingMinutes} min read
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight group-hover:text-primary transition-colors leading-tight">
                        {featuredPost.title}
                      </h2>
                      <p className="text-base sm:text-lg leading-relaxed text-muted-foreground line-clamp-3">
                        {featuredPost.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
                        <Calendar className="h-4 w-4" />
                        {new Date(featuredPost.publishedAt).toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-base font-bold text-primary group-hover:gap-3 transition-all">
                        Read Full Guide
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )}

        {displayPosts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {displayPosts.map((post) => (
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
        ) : (
          <div className="text-center py-24 space-y-4">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
              <SearchX className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold">No results found</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              We couldn't find any guides matching your search. Try adjusting your filters or search terms.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/blog">Clear all filters</Link>
            </Button>
          </div>
        )}

        <Suspense>
          <BlogPagination totalPages={totalPages} currentPage={currentPage} />
        </Suspense>
      </div>
    </main>
  );
}

// Add Button import that was missing in the empty state
import { Button } from "@/components/ui/button";
