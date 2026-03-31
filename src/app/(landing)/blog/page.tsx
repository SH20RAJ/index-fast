import type { Metadata } from "next";
import Link from "next/link";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
  Button,
} from "@mui/material";
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
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Box component="main" sx={{ py: { xs: 8, md: 12 }, flex: 1 }}>
        <Container maxWidth="lg">
          <Stack spacing={3} sx={{ mb: 6 }}>
            <Chip
              label="SEO + GEO Editorial Hub"
              sx={{
                alignSelf: "flex-start",
                border: "1px solid rgba(124,58,237,0.2)",
                bgcolor: "rgba(124,58,237,0.07)",
                color: "primary.main",
                fontWeight: 800,
              }}
            />
            <Typography variant="h2" sx={{ maxWidth: 920 }}>
              Long-form SEO playbooks for indexing, AI visibility, and conversion-led growth
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 860, fontWeight: 500 }}>
              Every guide is written to be actionable for operators shipping content weekly. Use these frameworks to improve discovery speed, reduce indexing waste, and build a stronger SEO to signup funnel.
            </Typography>
          </Stack>

          <Grid container spacing={3}>
            {BLOG_POSTS.map((post) => (
              <Grid key={post.slug} size={{ xs: 12, md: 6 }}>
                <Card sx={{ height: "100%", border: "1px solid rgba(124,58,237,0.1)" }}>
                  <CardContent sx={{ p: 3.5 }}>
                    <Stack spacing={1.5}>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                        <Chip label={post.primaryKeyword} size="small" />
                        <Chip label={`${post.readingMinutes} min read`} size="small" variant="outlined" />
                      </Stack>
                      <Typography variant="h4" fontWeight={900}>
                        {post.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {post.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Published {post.publishedAt} · Updated {post.updatedAt}
                      </Typography>
                      <Box>
                        <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                          <Button variant="contained">Read full guide</Button>
                        </Link>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
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
