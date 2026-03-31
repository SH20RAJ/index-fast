import Link from "next/link";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import { BLOG_POSTS } from "@/lib/blog-catalog";

const featuredPosts = BLOG_POSTS.slice(0, 3);

export default function BlogSection() {
  return (
    <Box id="blog" sx={{ py: { xs: 8, md: 12 }, position: "relative", overflow: "hidden" }}>
      <Container maxWidth="lg">
        <Stack spacing={2.2} sx={{ mb: 5 }}>
          <Chip
            label="From the Blog"
            sx={{
              alignSelf: "flex-start",
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
              color: "primary.main",
              border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.28)}`,
              fontWeight: 800,
            }}
          />
          <Typography variant="h2" sx={{ maxWidth: 860 }}>
            Practical SEO and GEO playbooks for indexing teams that move fast
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 760, fontWeight: 500 }}>
            Tactics, workflows, and systems you can deploy this week to improve discovery speed and AI assistant citation visibility.
          </Typography>
        </Stack>

        <Grid container spacing={2.5}>
          {featuredPosts.map((post) => (
            <Grid key={post.slug} size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
                  bgcolor: (theme) => alpha(theme.palette.background.paper, 0.84),
                  backdropFilter: "blur(8px)",
                }}
              >
                <CardContent sx={{ p: 3, display: "flex", flexDirection: "column", gap: 1.4 }}>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip label={post.primaryKeyword} size="small" />
                    <Chip label={`${post.readingMinutes} min`} size="small" variant="outlined" />
                  </Stack>
                  <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1.2 }}>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                    {post.description}
                  </Typography>
                  <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                    <Button variant="contained" sx={{ mt: 1 }}>
                      Read guide
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Link href="/blog" style={{ textDecoration: "none" }}>
            <Button variant="outlined" size="large">
              Explore all articles
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}
