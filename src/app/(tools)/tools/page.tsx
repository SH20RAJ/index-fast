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

const toolCards = [
  {
    title: "URL Indexability Checker",
    href: "/tools/indexability-checker",
    keyword: "free url indexability checker",
    description: "Check if a page can be crawled and indexed. Find noindex, canonical, and robots issues quickly.",
  },
  {
    title: "Sitemap Health Checker",
    href: "/tools/sitemap-health-checker",
    keyword: "free sitemap health checker",
    description: "Validate sitemap URLs, detect status code issues, and spot thin sitemap quality before submission.",
  },
  {
    title: "Robots.txt Tester",
    href: "/tools/robots-txt-tester",
    keyword: "free robots txt tester for seo",
    description: "Test if important URLs are blocked by robots rules. Prevent crawl blocks on money pages.",
  },
  {
    title: "IndexNow Key Validator",
    href: "/tools/indexnow-key-validator",
    keyword: "indexnow key validator free",
    description: "Verify key file placement and protocol readiness before pushing batches to IndexNow endpoints.",
  },
  {
    title: "Bing Batch Request Builder",
    href: "/tools/bing-batch-request-builder",
    keyword: "bing submiturlbatch request builder",
    description: "Generate ready-to-use request payloads for Bing SubmitUrlBatch API in seconds.",
  },
];

export const metadata: Metadata = {
  title: "Free SEO Tools For Indexing | IndexFast",
  description:
    "Use free SEO tools for indexing: indexability checker, sitemap health checker, robots.txt tester, IndexNow key validator, and Bing batch payload builder.",
  keywords: [
    "free seo indexing tools",
    "free indexability checker",
    "free sitemap checker",
    "free robots txt tester",
    "indexnow tools free",
    "bing url batch submission tool",
  ],
  alternates: {
    canonical: "/tools",
  },
  openGraph: {
    title: "Free SEO Tools For Indexing | IndexFast",
    description:
      "Find indexing issues fast and convert checks into automation with IndexFast tools.",
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
            Free SEO tools built for vibe coders, bloggers, and small teams
          </Typography>

          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 860, fontWeight: 500 }}>
            Start with simple free checks that solve indexing bottlenecks fast, then unlock automation when you are ready to scale URL submission.
          </Typography>

          <Grid container spacing={2}>
            {toolCards.map((tool) => (
              <Grid size={{ xs: 12, md: 6 }} key={tool.href}>
                <Card sx={{ border: "1px solid rgba(124,58,237,0.1)", height: "100%" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={1.5}>
                      <Chip label={tool.keyword} size="small" sx={{ alignSelf: "flex-start" }} />
                      <Typography variant="h5" fontWeight={800}>
                        {tool.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {tool.description}
                      </Typography>
                      <Box>
                        <Button variant="contained" component={Link} href={tool.href}>
                          Open Tool Page
                        </Button>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <ToolCta
            primaryText="Turn free checks into recurring growth"
            secondaryText="Create an account to save scans, add projects, and automate daily IndexNow plus Bing submissions from sitemap updates."
          />
        </Stack>
      </Container>
    </Box>
  );
}