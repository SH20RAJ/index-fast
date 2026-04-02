import type { Metadata } from "next";
import Link from "next/link";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid2 as Grid,
  Stack,
  Typography,
} from "@/components/ui/mui";
import ToolCta from "./_components/ToolCta";
import {
  SEO_TOOLS,
  TOOL_CATEGORIES,
  getToolsByCategory,
} from "@/lib/tools-catalog";

export const metadata: Metadata = {
  title: "Free SEO Tools Directory",
  description:
    "Browse a complete free SEO tools directory organized by category: indexing, crawl diagnostics, keyword research, backlinks, domain authority, and metadata optimization.",
  keywords: [
    "free seo tools directory",
    "seo tools for indexing",
    "keyword research tools free",
    "backlink checker tools",
    "domain authority tools",
    "meta tags tools",
  ],
  alternates: {
    canonical: "/tools",
  },
  openGraph: {
    title: "Free SEO Tools Directory | IndexFast",
    description:
      "Find practical SEO tools by category and convert free checks into recurring automation.",
    url: "/tools",
    type: "website",
  },
};

export default function ToolsHomePage() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "white" }}>
      <Container maxWidth="lg">
        <Stack spacing={6}>
          <Stack spacing={2.5}>
            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                bgcolor: "#F9FAFB",
                border: "1px solid #E5E7EB",
                borderRadius: "6px",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "text.primary",
                display: "inline-block",
                width: "fit-content",
              }}
            >
              Free SEO Tool Stack
            </Box>

            <Typography
              variant="h2"
              sx={{
                maxWidth: 900,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
              }}
            >
              Free SEO tools directory for practical workflows
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
              Browse every tool by function, run diagnostics in minutes, and transition to automated projects when you
              are ready to scale.
            </Typography>
          </Stack>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ border: "1px solid #E5E7EB", boxShadow: "none", borderRadius: "12px" }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="overline"
                    sx={{ color: "text.secondary", fontWeight: 700, letterSpacing: "0.05em" }}
                  >
                    Directory Coverage
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    {SEO_TOOLS.length} tools
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ border: "1px solid #E5E7EB", boxShadow: "none", borderRadius: "12px" }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="overline"
                    sx={{ color: "text.secondary", fontWeight: 700, letterSpacing: "0.05em" }}
                  >
                    Category Track
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    {TOOL_CATEGORIES.length} tracks
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ border: "1px solid #E5E7EB", boxShadow: "none", borderRadius: "12px" }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="overline"
                    sx={{ color: "text.secondary", fontWeight: 700, letterSpacing: "0.05em" }}
                  >
                    SEO Intent
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    Targeted
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {TOOL_CATEGORIES.map((category) => {
            const categoryTools = getToolsByCategory(category.id);
            return (
              <Stack key={category.id} spacing={3} sx={{ pt: 4 }}>
                <Stack spacing={1}>
                  <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
                    {category.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 800 }}>
                    {category.description}
                  </Typography>
                </Stack>

                <Grid container spacing={3}>
                  {categoryTools.map((tool) => (
                    <Grid size={{ xs: 12, md: 6 }} key={tool.slug}>
                      <Card
                        sx={{
                          border: "1px solid #E5E7EB",
                          boxShadow: "none",
                          borderRadius: "12px",
                          height: "100%",
                          transition: "border-color 0.2s ease",
                          "&:hover": { borderColor: "#7C3AED" },
                        }}
                      >
                        <CardContent sx={{ p: 4 }}>
                          <Stack spacing={2.5}>
                            <Stack direction="row" spacing={1}>
                              <Box
                                sx={{
                                  px: 1.2,
                                  py: 0.4,
                                  bgcolor: "#F9FAFB",
                                  border: "1px solid #E5E7EB",
                                  borderRadius: "4px",
                                  fontSize: "0.7rem",
                                  fontWeight: 600,
                                }}
                              >
                                {tool.primaryKeyword}
                              </Box>
                            </Stack>
                            <Typography variant="h5" sx={{ fontWeight: 800 }}>
                              {tool.title}
                            </Typography>
                            <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                              {tool.description}
                            </Typography>
                            <Box sx={{ pt: 1 }}>
                              <Link href={`/tools/${tool.slug}`} style={{ textDecoration: "none" }}>
                                <Button
                                  variant="contained"
                                  sx={{
                                    px: 3,
                                    borderRadius: "8px",
                                  }}
                                >
                                  Open tool
                                </Button>
                              </Link>
                            </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            );
          })}

          <ToolCta
            primaryText="Turn free checks into recurring growth"
            secondaryText="Create an account to save scans, add projects, and automate daily indexing workflows from sitemap updates."
          />
        </Stack>
      </Container>
    </Box>
  );
}