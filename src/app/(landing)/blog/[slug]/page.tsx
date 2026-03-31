import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { BLOG_POSTS, getBlogPostBySlug } from "@/lib/blog-catalog";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://indexfast.net";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Blog Not Found | IndexFast",
      description: "The requested blog guide could not be found.",
    };
  }

  return {
    title: `${post.title} | IndexFast`,
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
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Box component="main" sx={{ py: { xs: 7, md: 10 }, flex: 1 }}>
        <Container maxWidth="md">
          <Stack spacing={3}>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              <Chip label={post.primaryKeyword} />
              <Chip label={`${post.readingMinutes} min read`} variant="outlined" />
            </Stack>

            <Typography variant="h2">{post.title}</Typography>

            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
              {post.description}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              By {post.author} · Published {post.publishedAt} · Updated {post.updatedAt}
            </Typography>

            <Divider />

            <Typography variant="body1" sx={{ lineHeight: 1.9 }}>
              {post.hero}
            </Typography>

            {post.sections.map((section) => (
              <Stack key={section.heading} spacing={1.5}>
                <Typography variant="h4" fontWeight={900}>
                  {section.heading}
                </Typography>
                {section.paragraphs.map((paragraph, index) => (
                  <Typography key={`${section.heading}-${index}`} variant="body1" sx={{ lineHeight: 1.9 }}>
                    {paragraph}
                  </Typography>
                ))}
                {section.bullets ? (
                  <Box component="ul" sx={{ pl: 3, my: 0 }}>
                    {section.bullets.map((bullet) => (
                      <Box component="li" key={bullet} sx={{ mb: 1 }}>
                        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                          {bullet}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ) : null}
              </Stack>
            ))}

            <Stack spacing={2} sx={{ pt: 2 }}>
              <Typography variant="h4" fontWeight={900}>
                Frequently asked questions
              </Typography>
              {post.faqs.map((faq) => (
                <Card key={faq.question} sx={{ border: "1px solid rgba(124,58,237,0.12)" }}>
                  <CardContent>
                    <Stack spacing={1}>
                      <Typography variant="h6" fontWeight={800}>
                        {faq.question}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                        {faq.answer}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>

            <Card sx={{ mt: 1, border: "1px solid rgba(124,58,237,0.15)", bgcolor: "rgba(124,58,237,0.03)" }}>
              <CardContent>
                <Stack spacing={1.5}>
                  <Typography variant="h5" fontWeight={900}>
                    Want this as a repeatable workflow?
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Use IndexFast to run these indexing patterns automatically: monitor sitemap changes, submit new URLs, and track discovery progress from one dashboard.
                  </Typography>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                    <Link href="/tools" style={{ textDecoration: "none" }}>
                      <Button variant="contained">Try free tools</Button>
                    </Link>
                    <Link href="/" style={{ textDecoration: "none" }}>
                      <Button variant="outlined">See platform overview</Button>
                    </Link>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            <Stack spacing={1} sx={{ pt: 1 }}>
              <Typography variant="h5" fontWeight={900}>
                Related guides
              </Typography>
              {relatedPosts.map((related) => (
                <Link key={related.slug} href={`/blog/${related.slug}`} style={{ textDecoration: "none" }}>
                  <Card sx={{ border: "1px solid rgba(124,58,237,0.1)", mb: 1 }}>
                    <CardContent>
                      <Stack spacing={0.75}>
                        <Typography variant="h6" fontWeight={800} color="text.primary">
                          {related.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {related.description}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </Stack>

            <Box>
              <Link href="/blog" style={{ textDecoration: "none" }}>
                <Button variant="text">Back to blog index</Button>
              </Link>
            </Box>
          </Stack>
        </Container>
      </Box>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </Box>
  );
}
