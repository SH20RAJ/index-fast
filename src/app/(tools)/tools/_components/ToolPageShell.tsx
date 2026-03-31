import Link from "next/link";
import {
  alpha,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ToolCta from "./ToolCta";

interface ToolPageShellProps {
  badge: string;
  title: string;
  description: string;
  intentKeywords: string[];
  steps: string[];
  faqs: Array<{ question: string; answer: string }>;
  categoryTitle?: string;
  relatedTools?: Array<{ slug: string; title: string }>;
}

export default function ToolPageShell({
  badge,
  title,
  description,
  intentKeywords,
  steps,
  faqs,
  categoryTitle,
  relatedTools,
}: ToolPageShellProps) {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background:
          "radial-gradient(960px 440px at 10% -8%, rgba(14,165,233,0.15), transparent 60%), radial-gradient(760px 420px at 90% -6%, rgba(34,197,94,0.11), transparent 64%)",
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3.2}>
          <Chip
            label={badge}
            sx={{
              alignSelf: "flex-start",
              border: "1px solid rgba(14,165,233,0.32)",
              bgcolor: "rgba(14,165,233,0.1)",
              color: "info.main",
              fontWeight: 800,
            }}
          />

          <Typography variant="h2" sx={{ maxWidth: 920 }}>
            {title}
          </Typography>

          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 860, fontWeight: 500 }}>
            {description}
          </Typography>

          {categoryTitle ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: -1 }}>
              Category: {categoryTitle}
            </Typography>
          ) : null}

          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                sx={{
                  p: 2.3,
                  height: "100%",
                  border: "1px solid rgba(15,23,42,0.08)",
                  bgcolor: alpha("#ffffff", 0.82),
                }}
              >
                <Typography variant="overline" fontWeight={700} color="text.secondary">
                  Tool Type
                </Typography>
                <Typography variant="h6" fontWeight={900}>
                  Free SEO utility
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Built for practical checks before you run large SEO campaigns.
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                sx={{
                  p: 2.3,
                  height: "100%",
                  border: "1px solid rgba(15,23,42,0.08)",
                  bgcolor: alpha("#ffffff", 0.82),
                }}
              >
                <Typography variant="overline" fontWeight={700} color="text.secondary">
                  Ideal For
                </Typography>
                <Typography variant="h6" fontWeight={900}>
                  Operators and growth teams
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Use as a rapid validation layer before publishing or scaling.
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                sx={{
                  p: 2.3,
                  height: "100%",
                  border: "1px solid rgba(15,23,42,0.08)",
                  bgcolor: alpha("#ffffff", 0.82),
                }}
              >
                <Typography variant="overline" fontWeight={700} color="text.secondary">
                  Upgrade Path
                </Typography>
                <Typography variant="h6" fontWeight={900}>
                  Save + automate
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Move from one-off checks into recurring monitored workflows.
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Divider />

          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {intentKeywords.map((keyword) => (
              <Chip key={keyword} label={keyword} size="small" />
            ))}
          </Stack>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            {steps.map((step, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={step}>
                <Paper
                  sx={{
                    p: 2.5,
                    height: "100%",
                    border: "1px solid rgba(15,23,42,0.08)",
                    bgcolor: alpha("#ffffff", 0.78),
                  }}
                >
                  <Typography variant="overline" color="info.main" fontWeight={800}>
                    Step {index + 1}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, color: "text.primary" }}>
                    {step}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <ToolCta
            primaryText="Run this free tool, then unlock automation"
            secondaryText="Use free checks to find issues in minutes. Create an account to save results, track changes, and automate daily submissions with IndexFast Pro."
          />

          <Paper
            sx={{
              p: { xs: 3, md: 4 },
              border: "1px solid rgba(15,23,42,0.08)",
              bgcolor: alpha("#ffffff", 0.84),
            }}
          >
            <Typography variant="h4" fontWeight={800}>
              Frequently Asked Questions
            </Typography>
            <Stack spacing={2.5} sx={{ mt: 3 }}>
              {faqs.map((faq) => (
                <Box key={faq.question}>
                  <Typography variant="h6" fontWeight={700}>
                    {faq.question}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                    {faq.answer}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>

          {relatedTools && relatedTools.length > 0 ? (
            <Paper
              sx={{
                p: { xs: 3, md: 4 },
                border: "1px solid rgba(15,23,42,0.08)",
                bgcolor: alpha("#ffffff", 0.84),
              }}
            >
              <Typography variant="h5" fontWeight={800}>
                Related Tools
              </Typography>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 2 }}>
                {relatedTools.map((tool) => (
                  <Link key={tool.slug} href={`/tools/${tool.slug}`} style={{ textDecoration: "none" }}>
                    <Chip clickable label={tool.title} />
                  </Link>
                ))}
              </Stack>
            </Paper>
          ) : null}

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Link href="/tools" style={{ textDecoration: "none" }}>
              <Button variant="contained">Explore More Free SEO Tools</Button>
            </Link>
            <Link href="/contact" style={{ textDecoration: "none" }}>
              <Button variant="outlined">Request A New Tool</Button>
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}