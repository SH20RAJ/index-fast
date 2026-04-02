import type { Metadata } from "next";
import Link from "next/link";
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid2 as Grid,
  Stack,
  Typography,
} from "@/components/ui/mui";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
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
    <Box sx={{ minHeight: "100vh", bgcolor: "white", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Box component="main" sx={{ py: { xs: 8, md: 10 }, flex: 1 }}>
        <Container maxWidth="lg">
          <Stack spacing={2.5} sx={{ mb: 7 }}>
            <Typography
              variant="overline"
              sx={{
                color: "text.secondary",
                fontWeight: 700,
                letterSpacing: "0.1em",
                fontSize: "0.75rem",
              }}
            >
              Editorial Hub
            </Typography>
            <Typography
              variant="h2"
              sx={{
                maxWidth: 920,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              SEO playbooks for indexing and conversion-led growth
            </Typography>
            <Typography
              variant="h6"
              sx={{
                maxWidth: 800,
                color: "text.secondary",
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              Frameworks and operating models for teams shipping content weekly.
            </Typography>
          </Stack>

          <Grid container spacing={3}>
            {BLOG_POSTS.map((post) => (
              <Grid key={post.slug} size={{ xs: 12, md: 6 }}>
                <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
                  <Card
                    sx={{
                      height: "100%",
                      border: "1px solid #E5E7EB",
                      boxShadow: "none",
                      borderRadius: "12px",
                      transition: "border-color 0.2s ease",
                      "&:hover": {
                        borderColor: "#7C3AED",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Stack spacing={2}>
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
                              color: "text.primary",
                            }}
                          >
                            {post.primaryKeyword}
                          </Box>
                          <Box
                            sx={{
                              px: 1.5,
                              py: 0.5,
                              bgcolor: "transparent",
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
                        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
                          {post.title}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: "text.secondary",
                            lineHeight: 1.6,
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {post.description}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.disabled", fontWeight: 500 }}>
                          Published {post.publishedAt}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogCollectionJsonLd) }}
      />
    </Box>
  );
}
