import Link from "next/link";
import {
  Box,
  Button,
  Container,
  Divider,
  Grid2 as Grid,
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
    <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "white" }}>
      <Container maxWidth="lg">
        <Stack spacing={5}>
          {/* Header */}
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
                width: "fit-content",
              }}
            >
              {badge}
            </Box>

            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
                maxWidth: 900,
              }}
            >
              {title}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: "text.secondary",
                fontWeight: 400,
                lineHeight: 1.6,
                maxWidth: 800,
              }}
            >
              {description}
            </Typography>

            {categoryTitle && (
              <Typography variant="body2" sx={{ color: "text.disabled", fontWeight: 500 }}>
                Track: {categoryTitle}
              </Typography>
            )}
          </Stack>

          {/* Stats/Info Grid */}
          <Grid container spacing={2}>
            {[
              { label: "Tool Type", val: "Free SEO Utility", desc: "Built for practical pre-campaign validation." },
              { label: "Ideal For", val: "Growth Operators", desc: "Rapid checks before publishing or scaling." },
              { label: "Next Step", val: "Save + Automate", desc: "Move from one-off checks to recurring logs." },
            ].map((stat) => (
              <Grid key={stat.label} size={{ xs: 12, md: 4 }}>
                <Box sx={{ p: 3, border: "1px solid #E5E7EB", borderRadius: "12px", height: "100%" }}>
                  <Typography
                    variant="overline"
                    sx={{ color: "text.secondary", fontWeight: 700, letterSpacing: "0.05em" }}
                  >
                    {stat.label}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {stat.val}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {stat.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ borderColor: "#E5E7EB" }} />

          {/* Keywords */}
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            {intentKeywords.map((keyword) => (
              <Box
                key={keyword}
                sx={{
                  px: 1.2,
                  py: 0.4,
                  border: "1px solid #E5E7EB",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: "text.secondary",
                }}
              >
                {keyword}
              </Box>
            ))}
          </Stack>

          {/* Steps */}
          <Stack spacing={3}>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
              How it works
            </Typography>
            <Grid container spacing={2}>
              {steps.map((step, index) => (
                <Grid key={step} size={{ xs: 12, md: 4 }}>
                  <Box sx={{ p: 3, border: "1px solid #E5E7EB", borderRadius: "12px", height: "100%" }}>
                    <Typography variant="overline" sx={{ color: "#7C3AED", fontWeight: 800 }}>
                      Step {index + 1}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1, color: "text.primary", fontWeight: 500 }}>
                      {step}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Stack>

          <ToolCta
            primaryText="Run this free tool, then scale it"
            secondaryText="Use free checks to find issues in minutes. Create an account to automate daily submissions with IndexFast Pro."
          />

          {/* FAQ */}
          <Stack spacing={3}>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
              Frequently asked questions
            </Typography>
            <Stack spacing={0}>
              {faqs.map((faq) => (
                <Box key={faq.question} sx={{ py: 3, borderBottom: "1px solid #E5E7EB" }}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {faq.question}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1, color: "text.secondary", lineHeight: 1.6 }}>
                    {faq.answer}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Stack>

          {/* Related Tools */}
          {relatedTools && relatedTools.length > 0 && (
            <Stack spacing={3}>
              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
                Related tools
              </Typography>
              <Grid container spacing={2}>
                {relatedTools.map((tool) => (
                  <Grid key={tool.slug} size={{ xs: 12, sm: 4 }}>
                    <Link href={`/tools/${tool.slug}`} style={{ textDecoration: "none" }}>
                      <Box
                        sx={{
                          p: 2,
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                          textAlign: "center",
                          transition: "border-color 0.2s ease",
                          "&:hover": { borderColor: "#7C3AED" },
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
                          {tool.title}
                        </Typography>
                      </Box>
                    </Link>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          )}

          {/* Actions */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Link href="/tools" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                sx={{
                  px: 4,
                  py: 1.2,
                  borderRadius: "8px",
                }}
              >
                Explore all tools
              </Button>
            </Link>
            <Link href="/" style={{ textDecoration: "none" }}>
              <Button
                variant="outlined"
                sx={{
                  px: 4,
                  py: 1.2,
                  borderRadius: "8px",
                  borderColor: "#E5E7EB",
                  color: "text.primary",
                }}
              >
                View platform
              </Button>
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}