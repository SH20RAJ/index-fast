import type { Metadata } from "next";
import Link from "next/link";
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
      <article className="mx-auto w-full max-w-[680px] px-6 pb-24 pt-16 sm:px-8">
        {/* Breadcrumb */}
        <nav className="mb-10">
          <Link
            href="/blog"
            className="text-sm text-muted-foreground/70 transition-colors hover:text-foreground"
          >
            Blog
          </Link>
          <span className="mx-2 text-muted-foreground/40">/</span>
          <span className="text-sm text-muted-foreground/70">{post.primaryKeyword}</span>
        </nav>

        {/* Title */}
        <h1 className="mb-4 text-4xl font-semibold leading-[1.15] tracking-tight text-foreground sm:text-[42px]">
          {post.title}
        </h1>

        {/* Metadata */}
        <div className="mb-3 flex items-center gap-3 text-sm text-muted-foreground/60">
          <span>{post.author}</span>
          <span className="text-muted-foreground/30">-</span>
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span className="text-muted-foreground/30">-</span>
          <span>{post.readingMinutes} min read</span>
        </div>

        {/* Divider */}
        <div className="mb-10 h-px bg-border/60" />

        {/* Hero / Intro */}
        <p className="mb-12 text-lg leading-[1.8] text-foreground/80">
          {post.hero}
        </p>

        {/* Sections */}
        <div className="space-y-12">
          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="mb-4 text-2xl font-semibold leading-snug tracking-tight text-foreground">
                {section.heading}
              </h2>
              <div className="space-y-4">
                {section.paragraphs.map((paragraph, index) => (
                  <p
                    key={`${section.heading}-${index}`}
                    className="text-base leading-[1.8] text-foreground/75"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              {section.bullets && section.bullets.length > 0 ? (
                <ul className="mt-4 space-y-2.5 pl-5 text-base leading-[1.8] text-foreground/75">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="list-disc marker:text-foreground/25">
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        {/* FAQ */}
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-semibold leading-snug tracking-tight text-foreground">
            Frequently asked questions
          </h2>
          <div className="space-y-0 divide-y divide-border/50">
            {post.faqs.map((faq) => (
              <div key={faq.question} className="py-5 first:pt-0 last:pb-0">
                <h3 className="mb-2 text-base font-medium text-foreground">
                  {faq.question}
                </h3>
                <p className="text-sm leading-[1.75] text-foreground/60">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 rounded-lg border border-border/50 bg-muted/30 px-6 py-8">
          <h3 className="mb-2 text-lg font-medium text-foreground">
            Want this as a repeatable workflow?
          </h3>
          <p className="mb-5 text-sm leading-relaxed text-foreground/60">
            Use IndexFast to run these indexing patterns automatically: monitor sitemaps,
            submit new URLs, and track discovery progress from one dashboard.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/sign-up"
              className="inline-flex h-9 items-center rounded-md bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Get started free
            </Link>
            <Link
              href="/"
              className="inline-flex h-9 items-center rounded-md border border-border/60 px-4 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted/50"
            >
              Learn more
            </Link>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-5 text-sm font-medium uppercase tracking-wider text-foreground/40">
              Related guides
            </h2>
            <div className="space-y-1 divide-y divide-border/40">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group flex items-baseline justify-between gap-6 py-3.5 transition-colors"
                >
                  <span className="text-base text-foreground/70 group-hover:text-foreground">
                    {related.title}
                  </span>
                  <span className="shrink-0 text-xs text-foreground/30 group-hover:text-foreground/50">
                    {related.readingMinutes} min
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back link */}
        <div className="mt-12">
          <Link
            href="/blog"
            className="text-sm text-muted-foreground/50 transition-colors hover:text-foreground/70"
          >
            Back to all posts
          </Link>
        </div>
      </article>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}
