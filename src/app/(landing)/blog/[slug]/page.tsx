import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid2 as Grid,
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
    <Box sx={{ minHeight: "100vh", bgcolor: "white", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Box component="main" sx={{ py: { xs: 8, md: 10 }, flex: 1 }}>
        <Container maxWidth="md">
          <Stack spacing={4}>
            {/* Header */}
            <Stack spacing={2.5}>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    bgcolor: "#F9FAFB",
                    border: "1px solid #E5E7EB",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  {post.primaryKeyword}
                </Box>
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    border: "1px solid #E5E7EB",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    color: "text.secondary",
                  }}
                >
                  {post.readingMinutes} min read
                </Box>
              </Stack>

              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.1,
                }}
              >
                {post.title}
              </Typography>

              <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }}>
                By {post.author} · {post.publishedAt}
              </Typography>
            </Stack>

            <Divider sx={{ borderColor: "#E5E7EB" }} />

            {/* Hero Text */}
            <Typography
              variant="body1"
              sx={{
                fontSize: "1.25rem",
                lineHeight: 1.6,
                color: "text.primary",
                fontWeight: 500,
              }}
            >
              {post.hero}
            </Typography>

            {/* Sections */}
            {post.sections.map((section) => (
              <Stack key={section.heading} spacing={2}>
                <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.02em", mt: 2 }}>
                  {section.heading}
                </Typography>
                {section.paragraphs.map((paragraph, index) => (
                  <Typography
                    key={`${section.heading}-${index}`}
                    variant="body1"
                    sx={{
                      lineHeight: 1.8,
                      color: "text.secondary",
                      fontSize: "1.125rem",
                    }}
                  >
                    {paragraph}
                  </Typography>
                ))}
                {section.bullets ? (
                  <Box component="ul" sx={{ pl: 3, my: 1 }}>
                    {section.bullets.map((bullet) => (
                      <Box component="li" key={bullet} sx={{ mb: 1.5 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            lineHeight: 1.7,
                            color: "text.secondary",
                            fontSize: "1.125rem",
                          }}
                        >
                          {bullet}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ) : null}
              </Stack>
            ))}

            {/* FAQ */}
            <Stack spacing={3} sx={{ pt: 4, pb: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
                Frequently asked questions
              </Typography>
              <Stack spacing={0}>
                {post.faqs.map((faq) => (
                  <Box key={faq.question} sx={{ py: 3, borderBottom: "1px solid #E5E7EB" }}>
                    <Stack spacing={1.5}>
                      <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: "-0.01em" }}>
                        {faq.question}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "text.secondary",
                          lineHeight: 1.7,
                          fontSize: "1.05rem",
                        }}
                      >
                        {faq.answer}
                      </Typography>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Stack>

            {/* CTA */}
            <Box
              sx={{
                p: 5,
                border: "1px solid #E5E7EB",
                borderRadius: "16px",
                bgcolor: "#F9FAFB",
                my: 4,
              }}
            >
              <Stack spacing={2.5}>
                <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
                  Want this as a repeatable workflow?
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                  Use IndexFast to run these indexing patterns automatically: monitor sitemaps, submit new URLs, and
                  track discovery progress from one dashboard.
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Link href="/sign-up" style={{ textDecoration: "none" }}>
                    <Button
                      variant="contained"
                      sx={{
                        px: 3,
                        py: 1.2,
                        borderRadius: "8px",
                      }}
                    >
                      Get Started Free
                    </Button>
                  </Link>
                  <Link href="/" style={{ textDecoration: "none" }}>
                    <Button
                      variant="outlined"
                      sx={{
                        px: 3,
                        py: 1.2,
                        borderRadius: "8px",
                        borderColor: "#E5E7EB",
                        color: "text.primary",
                        "&:hover": { borderColor: "#7C3AED", bgcolor: "transparent" },
                      }}
                    >
                      See platform overview
                    </Button>
                  </Link>
                </Stack>
              </Stack>
            </Box>

            {/* Related */}
            <Stack spacing={3} sx={{ pt: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
                Related guides
              </Typography>
              <Grid container spacing={3}>
                {relatedPosts.map((related) => (
                  <Grid key={related.slug} size={{ xs: 12, sm: 4 }}>
                    <Link href={`/blog/${related.slug}`} style={{ textDecoration: "none" }}>
                      <Card
                        sx={{
                          height: "100%",
                          border: "1px solid #E5E7EB",
                          boxShadow: "none",
                          borderRadius: "12px",
                          transition: "border-color 0.2s ease",
                          "&:hover": { borderColor: "#7C3AED" },
                        }}
                      >
                        <CardContent sx={{ p: 2.5 }}>
                          <Stack spacing={1}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.3 }}>
                              {related.title}
                            </Typography>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Link>
                  </Grid>
                ))}
              </Grid>
            </Stack>

            <Box sx={{ pt: 4 }}>
              <Link href="/blog" style={{ textDecoration: "none" }}>
                <Button sx={{ color: "text.secondary", fontWeight: 600 }}>← Back to blog index</Button>
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </Box>
  );
}
