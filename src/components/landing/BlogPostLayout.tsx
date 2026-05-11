import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BLOG_POSTS, BlogPost } from "@/lib/blog-catalog";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://indexfast.co";

interface BlogPostLayoutProps {
  post: BlogPost;
}

export function BlogPostLayout({ post }: BlogPostLayoutProps) {
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
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-[11px] uppercase">{post.primaryKeyword}</Badge>
            <Badge variant="outline" className="text-[11px]">{post.readingMinutes} min read</Badge>
          </div>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">{post.title}</h1>
          <p className="text-sm text-muted-foreground">By {post.author} • {post.publishedAt}</p>
          <Separator />
          <p className="text-xl leading-relaxed">{post.hero}</p>

          {post.sections.map((section) => (
            <section key={section.heading} className="space-y-3 pt-4">
              <h2 className="text-2xl font-bold tracking-tight">{section.heading}</h2>
              {section.paragraphs.map((paragraph, index) => (
                <p key={`${section.heading}-${index}`} className="text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {paragraph}
                </p>
              ))}
              {section.bullets ? (
                <ul className="list-disc space-y-2 pl-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          <section className="space-y-4 pt-6">
            <h2 className="text-2xl font-bold tracking-tight">Frequently asked questions</h2>
            <div className="divide-y divide-border rounded-xl border border-border/70 bg-card/70">
              {post.faqs.map((faq) => (
                <div key={faq.question} className="space-y-2 p-4">
                  <h3 className="font-semibold">{faq.question}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <Card className="my-6 border-border/70 bg-card/70">
            <CardContent className="space-y-3 p-5">
              <h3 className="text-xl font-bold tracking-tight">Want this as a repeatable workflow?</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Use IndexFast to run these indexing patterns automatically: monitor sitemaps, submit new URLs, and track discovery progress from one dashboard.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button asChild>
                  <Link href="/sign-up">Get Started Free</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">See platform overview</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <section className="space-y-3 pt-2">
            <h2 className="text-xl font-bold tracking-tight">Related guides</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {relatedPosts.map((related) => (
                <Link key={related.slug} href={`/blog/${related.slug}`}>
                  <Card className="h-full border-border/70 bg-card/70 transition-colors hover:border-primary/40">
                    <CardContent className="p-4">
                      <p className="text-sm font-semibold leading-snug">{related.title}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          <div className="pt-4">
            <Button variant="ghost" asChild>
              <Link href="/blog">Back to all posts</Link>
            </Button>
          </div>
        </div>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </>
  );
}
