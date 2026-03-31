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
    <Box id="blog" sx={{ py: { xs: 10, md: 14 }, position: "relative", overflow: "hidden" }}>
      <Container maxWidth="lg">
        <Stack spacing={2.2} sx={{ mb: 6 }}>
          <Chip
            label="Operator Playbooks"
            sx={{
              alignSelf: "flex-start",
              bgcolor: alpha("#2563eb", 0.1),
              color: "primary.main",
              border: `1px solid ${alpha("#2563eb", 0.28)}`,
              fontWeight: 800,
            }}
          />
          <Typography variant="h2" sx={{ maxWidth: 860 }}>
            Proven workflows your team can apply this week
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 760, fontWeight: 500 }}>
            Actionable guides for SEO operators who care about measurable results: faster discovery, cleaner indexing pipelines, and stronger AI visibility.
          </Typography>
        </Stack>

        <Grid container spacing={2.5}>
          {featuredPosts.map((post) => (
            <Grid key={post.slug} size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  border: `1px solid ${alpha("#2563eb", 0.18)}`,
                  bgcolor: "background.paper",
                  backdropFilter: "blur(8px)",
                  borderRadius: "24px",
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
                      Read playbook
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
              Explore all playbooks
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}
