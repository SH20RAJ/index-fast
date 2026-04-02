"use client";
import Link from "next/link";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { BLOG_POSTS } from "@/lib/blog-catalog";

const featuredPosts = BLOG_POSTS.slice(0, 3);

export default function BlogSection() {
  const theme = useTheme();

  return (
    <Box id="blog" sx={{ py: { xs: 10, md: 16 }, bgcolor: "background.default" }}>
      <Container maxWidth="lg">
        <Stack spacing={2} mb={10} alignItems="flex-start" sx={{ maxWidth: 800 }}>
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: "99px",
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: alpha(theme.palette.text.primary, 0.02),
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", letterSpacing: "0.02em" }}>
              SEO Insights
            </Typography>
          </Box>
          <Typography variant="h2" sx={{ fontWeight: 900, color: "text.primary", letterSpacing: "-0.03em" }}>
            Actionable guides
            <br />
            for operators
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: "640px", lineHeight: 1.6, fontSize: "1.1rem" }}>
            Guides for teams who care about indexing velocity and discoverability.
          </Typography>
        </Stack>

        <Grid container spacing={4}>
          {featuredPosts.map((post) => (
            <Grid key={post.slug} size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: "background.paper",
                  boxShadow: "none",
                  borderRadius: "12px",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "primary.main",
                  }
                }}
              >
                <CardContent sx={{ p: 4, display: "flex", flexDirection: "column", gap: 3 }}>
                  <Stack direction="row" spacing={1.5}>
                    <Box sx={{
                      bgcolor: alpha(theme.palette.text.primary, 0.04),
                      color: "text.primary",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "6px",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}>
                      {post.primaryKeyword}
                    </Box>
                    <Box sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      color: "text.secondary",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "6px",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                    }}>
                      {post.readingMinutes} min read
                    </Box>
                  </Stack>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "text.primary", lineHeight: 1.3, letterSpacing: "-0.01em" }}>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", flex: 1, lineHeight: 1.6 }}>
                    {post.description}
                  </Typography>
                  <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{
                        borderRadius: "8px",
                        py: 1.5,
                        textTransform: "none",
                        fontWeight: 800,
                        fontSize: "0.85rem",
                        borderColor: "divider",
                        color: "text.primary",
                        "&:hover": { 
                          borderColor: "primary.main", 
                          bgcolor: alpha(theme.palette.text.primary, 0.02) 
                        }
                      }}
                    >
                      Read full post →
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 8, pt: 6, borderTop: `1px solid ${theme.palette.divider}`, textAlign: "center" }}>
          <Stack direction="row" justifyContent="center">
            <Link href="/blog" style={{ textDecoration: "none" }}>
              <Button
                variant="text"
                size="large"
                sx={{
                  color: "text.primary",
                  fontWeight: 800,
                  fontSize: "1rem",
                  "&:hover": { bgcolor: "transparent", opacity: 0.7 }
                }}
              >
                View all insights <span>→</span>
              </Button>
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
