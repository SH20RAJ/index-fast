import type { Metadata } from "next";
import Link from "next/link";
import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import ToolCta from "./_components/ToolCta";
import {
  SEO_TOOLS,
  TOOL_CATEGORIES,
  getCategoryKeywordTargets,
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
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background:
          "radial-gradient(960px 460px at 12% -8%, rgba(14,165,233,0.18), transparent 60%), radial-gradient(820px 420px at 88% -15%, rgba(34,197,94,0.14), transparent 64%)",
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={4.5}>
          <Stack spacing={2.2}>
            <Chip
              label="Free SEO Tool Stack"
              sx={{
                alignSelf: "flex-start",
                border: "1px solid rgba(14,165,233,0.35)",
                bgcolor: "rgba(14,165,233,0.08)",
                color: "info.main",
                fontWeight: 800,
              }}
            />

            <Typography variant="h2" sx={{ maxWidth: 980 }}>
              Free SEO tools directory with category-based workflows, quick checks, and scale-ready automation paths
            </Typography>

            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 920, fontWeight: 500 }}>
              Browse every tool by SEO function, run a focused diagnostic in minutes, and move into repeatable project workflows when your growth loop is ready.
            </Typography>
          </Stack>

          <Grid container spacing={1.4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ border: "1px solid rgba(15,23,42,0.08)", bgcolor: alpha("#ffffff", 0.78) }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="overline" color="text.secondary" fontWeight={700}>
                    Directory Coverage
                  </Typography>
                  <Typography variant="h4" fontWeight={900}>
                    {SEO_TOOLS.length} tools
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active across crawl, keywords, links, authority, and metadata.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ border: "1px solid rgba(15,23,42,0.08)", bgcolor: alpha("#ffffff", 0.78) }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="overline" color="text.secondary" fontWeight={700}>
                    Category Architecture
                  </Typography>
                  <Typography variant="h4" fontWeight={900}>
                    {TOOL_CATEGORIES.length} tracks
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Organized to match SEO execution order, from crawl to snippets.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ border: "1px solid rgba(15,23,42,0.08)", bgcolor: alpha("#ffffff", 0.78) }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="overline" color="text.secondary" fontWeight={700}>
                    SEO Intent Model
                  </Typography>
                  <Typography variant="h4" fontWeight={900}>
                    Researched keywords
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Keyword targets reflect live market query patterns for discovery pages.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {TOOL_CATEGORIES.map((category) => (
              <Chip key={category.id} label={category.title} sx={{ fontWeight: 700 }} />
            ))}
          </Stack>

          {TOOL_CATEGORIES.map((category) => {
            const categoryTools = getToolsByCategory(category.id);
            const categoryKeywordTargets = getCategoryKeywordTargets(category.id).slice(0, 6);

            return (
              <Stack key={category.id} spacing={2.2} sx={{ pt: 2.5 }}>
                <Stack spacing={1}>
                  <Typography variant="h4" fontWeight={900}>
                    {category.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 900 }}>
                    {category.description}
                  </Typography>
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ pt: 0.4 }}>
                    {categoryKeywordTargets.map((keyword) => (
                      <Chip
                        key={keyword}
                        size="small"
                        label={keyword}
                        sx={{
                          border: "1px solid rgba(2,6,23,0.1)",
                          bgcolor: "rgba(255,255,255,0.7)",
                        }}
                      />
                    ))}
                  </Stack>
                </Stack>

                <Grid container spacing={2}>
                  {categoryTools.map((tool) => (
                    <Grid size={{ xs: 12, md: 6 }} key={tool.slug}>
                      <Card
                        sx={{
                          border: "1px solid rgba(15,23,42,0.08)",
                          bgcolor: alpha("#ffffff", 0.84),
                          height: "100%",
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Stack spacing={1.8}>
                            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                              <Chip
                                label={tool.primaryKeyword}
                                size="small"
                                sx={{ alignSelf: "flex-start", fontWeight: 700, bgcolor: "rgba(34,197,94,0.12)" }}
                              />
                              <Chip
                                label={category.badge}
                                size="small"
                                sx={{ alignSelf: "flex-start", bgcolor: "rgba(14,165,233,0.12)" }}
                              />
                            </Stack>
                            <Typography variant="h5" fontWeight={800}>
                              {tool.title}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                              {tool.description}
                            </Typography>
                            <Divider />
                            <Box>
                              <Link href={`/tools/${tool.slug}`} style={{ textDecoration: "none" }}>
                                <Button variant="contained">Open {tool.title}</Button>
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
            secondaryText="Create an account to save scans, add projects, and automate daily IndexNow plus Bing submissions from sitemap updates."
          />
        </Stack>
      </Container>
    </Box>
  );
}