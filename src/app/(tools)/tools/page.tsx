import type { Metadata } from "next";
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
} from "@mui/material";
import ToolCta from "./_components/ToolCta";
import { SEO_TOOLS, TOOL_CATEGORIES, getToolsByCategory } from "@/lib/tools-catalog";

export const metadata: Metadata = {
  title: "Free SEO Tools Directory | IndexFast",
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
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Chip
            label="Free SEO Tool Stack"
            sx={{
              alignSelf: "flex-start",
              border: "1px solid rgba(124,58,237,0.2)",
              bgcolor: "rgba(124,58,237,0.07)",
              color: "primary.main",
              fontWeight: 700,
            }}
          />

          <Typography variant="h2" sx={{ maxWidth: 900 }}>
            Free SEO tools organized for fast wins and scalable indexing workflows
          </Typography>

          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 860, fontWeight: 500 }}>
            Start with no-login checks for crawl, keywords, links, domains, and metadata. Move to account-based automation when you are ready to scale.
          </Typography>

          <Chip
            label={`${SEO_TOOLS.length} tools across ${TOOL_CATEGORIES.length} categories`}
            sx={{ alignSelf: "flex-start" }}
          />

          {TOOL_CATEGORIES.map((category) => {
            const categoryTools = getToolsByCategory(category.id);

            return (
              <Stack key={category.id} spacing={2} sx={{ pt: 2 }}>
                <Stack spacing={1}>
                  <Typography variant="h4" fontWeight={900}>
                    {category.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 900 }}>
                    {category.description}
                  </Typography>
                </Stack>

                <Grid container spacing={2}>
                  {categoryTools.map((tool) => (
                    <Grid size={{ xs: 12, md: 6 }} key={tool.slug}>
                      <Card sx={{ border: "1px solid rgba(124,58,237,0.1)", height: "100%" }}>
                        <CardContent sx={{ p: 3 }}>
                          <Stack spacing={1.5}>
                            <Chip label={tool.primaryKeyword} size="small" sx={{ alignSelf: "flex-start" }} />
                            <Typography variant="h5" fontWeight={800}>
                              {tool.title}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                              {tool.description}
                            </Typography>
                            <Box>
                              <Link href={`/tools/${tool.slug}`} style={{ textDecoration: "none" }}>
                                <Button variant="contained">Open Tool Page</Button>
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