"use client";
import Link from "next/link";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { BLOG_POSTS } from "@/lib/blog-catalog";

const featuredPosts = BLOG_POSTS.slice(0, 3);

export default function BlogSection() {
  return (
    <Box id="blog" sx={{ py: { xs: 8, md: 12 }, bgcolor: "#F9FAFB" }}>
      <Container maxWidth="lg">
        <Stack spacing={2} mb={8} textAlign="center">
          <Typography variant="h2" sx={{ fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>
            SEO Insights
          </Typography>
          <Typography variant="body1" sx={{ color: "#6B7280", maxWidth: "600px", mx: "auto", fontSize: "1.1rem" }}>
            Actionable guides for operators who care about indexing velocity and discoverability.
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          {featuredPosts.map((post) => (
            <Grid key={post.slug} size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  border: "1px solid #E5E7EB",
                  bgcolor: "white",
                  boxShadow: "none",
                  borderRadius: "12px",
                  p: 1,
                }}
              >
                <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
                  <Stack direction="row" spacing={1}>
                    <Box sx={{
                      bgcolor: "#F3F4F6",
                      color: "#111827",
                      px: 1.25,
                      py: 0.5,
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                    }}>
                      {post.primaryKeyword}
                    </Box>
                    <Box sx={{
                      border: "1px solid #E5E7EB",
                      color: "#6B7280",
                      px: 1.25,
                      py: 0.5,
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                    }}>
                      {post.readingMinutes} min read
                    </Box>
                  </Stack>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#111827", lineHeight: 1.3 }}>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6B7280", flex: 1, lineHeight: 1.6 }}>
                    {post.description}
                  </Typography>
                  <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{
                        borderRadius: "8px",
                        py: 1,
                        textTransform: "none",
                        fontWeight: 600,
                        borderColor: "#E5E7EB",
                        color: "#111827",
                        "&:hover": { borderColor: "#111827", bgcolor: "transparent" }
                      }}
                    >
                      Read post →
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 6, textAlign: "center" }}>
          <Stack direction="row" justifyContent="center">
            <Link href="/blog" style={{ textDecoration: "none" }}>
              <Button
                variant="text"
                size="large"
                sx={{
                  color: "#111827",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "transparent", textDecoration: "underline" }
                }}
              >
                View all posts →
              </Button>
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
