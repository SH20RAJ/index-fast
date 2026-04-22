import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BLOG_POSTS, getBlogPostBySlug } from "@/lib/blog-catalog";
import { 
  ArrowRight, 
  ChevronLeft, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Sparkles,
  TrendingUp,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.indexfast.co";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Blog Not Found",
      description: "The requested blog guide could not be found.",
    };
  }

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      url: `/blog/${post.slug}`,
      title: `${post.title} | IndexFast`,
      description: post.description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = BLOG_POSTS.filter((item) => item.slug !== post.slug).slice(0, 3);

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "IndexFast",
    },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    keywords: post.keywords.join(", "),
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <div className="min-h-screen bg-background pt-24 pb-20">
        <div className="mx-auto max-w-6xl px-6">
          {/* Breadcrumb / Back */}
          <div className="mb-8">
            <Link 
              href="/blog" 
              className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors gap-1 group"
            >
              <ChevronLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
              Back to all guides
            </Link>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
            {/* Main Content */}
            <article className="space-y-12">
              <header className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5">
                    {post.primaryKeyword}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <Clock className="h-3.5 w-3.5" />
                    {post.readingMinutes} min read
                  </div>
                </div>

                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl leading-[1.1]">
                  {post.title}
                </h1>

                <div className="flex items-center gap-3 pt-2">
                   <div className="h-10 w-10 rounded-full bg-muted border border-border/50 flex items-center justify-center font-bold text-sm">
                     {post.author[0]}
                   </div>
                   <div>
                     <p className="text-sm font-bold text-foreground">{post.author}</p>
                     <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{post.publishedAt}</p>
                   </div>
                </div>
              </header>

              <div className="prose prose-zinc dark:prose-invert max-w-none">
                <p className="text-xl leading-relaxed text-foreground/90 font-medium border-l-4 border-primary/20 pl-6 py-2 bg-primary/[0.02]">
                  {post.hero}
                </p>

                <div className="space-y-10 mt-12">
                  {post.sections.map((section) => (
                    <section key={section.heading} className="space-y-4">
                      <h2 className="text-2xl font-bold tracking-tight pt-4">{section.heading}</h2>
                      {section.paragraphs.map((paragraph, index) => (
                        <p key={`${section.heading}-${index}`} className="text-base leading-relaxed text-muted-foreground">
                          {paragraph}
                        </p>
                      ))}
                      {section.bullets ? (
                        <ul className="grid gap-3 list-none pl-0">
                          {section.bullets.map((bullet) => (
                            <li key={bullet} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                               <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                               {bullet}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </section>
                  ))}
                </div>
              </div>

              {/* FAQ */}
              <section className="pt-12 border-t border-border/50">
                <h2 className="text-2xl font-bold tracking-tight mb-8">Frequently Asked Questions</h2>
                <div className="grid gap-4">
                  {post.faqs.map((faq) => (
                    <div key={faq.question} className="p-6 rounded-2xl bg-muted/20 border border-border/50 space-y-2">
                      <h3 className="font-bold text-foreground flex items-start gap-3">
                         <Zap className="h-4 w-4 mt-1 text-primary shrink-0" />
                         {faq.question}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground pl-7">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Footer CTA */}
              <div className="p-8 rounded-[2.5rem] bg-zinc-950 text-white relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(244,63,94,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-3 text-center md:text-left">
                    <h4 className="text-2xl font-bold tracking-tight">Ready to apply these guides?</h4>
                    <p className="text-sm text-zinc-400 max-w-md">
                      IndexFast automates everything you just read. Connect your site once and let us handle the indexing.
                    </p>
                  </div>
                  <Button asChild className="rounded-xl bg-white text-black hover:bg-zinc-200 font-bold px-8 h-12 w-full md:w-auto">
                    <Link href="/sign-up">Get Started Free</Link>
                  </Button>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-8">
              <div className="sticky top-32 space-y-8">
                {/* Safe Badge Card */}
                <Card className="rounded-3xl border-primary/20 bg-primary/[0.02] shadow-2xl shadow-primary/5 overflow-hidden">
                  <CardContent className="p-6 space-y-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                       <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-sm font-bold">100% API Safe</h3>
                       <p className="text-xs text-muted-foreground leading-relaxed">
                         IndexFast uses official search engine APIs to ensure your site is never penalized.
                       </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Benefits List */}
                <div className="space-y-4 px-1">
                   <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Why IndexFast?</h4>
                   <div className="space-y-4">
                      {[
                        { icon: Zap, text: "Index pages in 4-24 hours" },
                        { icon: TrendingUp, text: "Boost search visibility" },
                        { icon: Target, text: "Automated site monitoring" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                           <div className="h-7 w-7 rounded-lg bg-muted border border-border/50 flex items-center justify-center text-muted-foreground">
                              <item.icon className="h-3.5 w-3.5" />
                           </div>
                           <span className="text-[11px] font-bold text-foreground/80">{item.text}</span>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Tools Link */}
                <Card className="rounded-3xl border-border/60 bg-muted/10 p-6 space-y-4 group cursor-pointer hover:bg-muted/20 transition-all active:scale-[0.98]">
                   <h3 className="text-sm font-bold flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Free Tools
                   </h3>
                   <p className="text-xs text-muted-foreground leading-relaxed">
                      Check your indexability and site health with our suite of 30+ SEO tools.
                   </p>
                   <Button asChild variant="outline" size="sm" className="w-full rounded-xl text-[10px] font-bold uppercase border-border/80 group-hover:border-primary/30 group-hover:text-primary transition-all">
                      <Link href="/tools">Explore all tools</Link>
                   </Button>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </>
  );
}
