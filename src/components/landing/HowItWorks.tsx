"use client";
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";

const steps = [
  {
    num: "01",
    title: "Connect Properties",
    desc: "Sign in with Google and import verified properties in seconds. No manual setup, no developer help.",
  },
  {
    num: "02",
    title: "Launch Submission Flows",
    desc: "Add your sitemap once. IndexFast continuously detects fresh URLs and submits them to priority endpoints.",
  },
  {
    num: "03",
    title: "Track Outcomes",
    desc: "Monitor acceptance rates, failures, and trend lines so your team knows exactly what improved visibility.",
  }
];

export default function HowItWorks() {
  const theme = useTheme();

  return (
    <Box id="how-it-works" sx={{ py: { xs: 10, md: 14 }, bgcolor: "background.paper" }}>
      <Container maxWidth="lg">
        <Stack spacing={2} mb={8} textAlign="center">
          <Typography variant="h2" sx={{ fontWeight: 900, color: "text.primary", mb: 2 }}>
            A three-step system your team can run every day
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: "720px", mx: "auto", lineHeight: 1.75 }}>
            Move from manual indexing work to an automated routine: connect, submit, and optimize. The flow is built for execution, not theory.
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          {steps.map((step) => (
            <Grid size={{ xs: 12, md: 4 }} key={step.title}>
              <Box
                sx={{
                  p: { xs: 3.5, md: 4.5 },
                  bgcolor: alpha(theme.palette.background.default, theme.palette.mode === "dark" ? 0.8 : 0.72),
                  borderRadius: "28px",
                  border: `1px solid ${alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.24 : 0.14)}`,
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 20px 40px rgba(0, 0, 0, 0.35)"
                      : "0 20px 40px rgba(124, 58, 237, 0.08)",
                  position: "relative",
                  height: "100%",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 18,
                    right: 18,
                    width: 56,
                    height: 56,
                    borderRadius: "16px",
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
                    display: "grid",
                    placeItems: "center",
                    color: "primary.main",
                    fontWeight: 900,
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  }}
                >
                  {step.num}
                </Box>

                <Stack spacing={1.8} sx={{ position: "relative", pr: 6 }}>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: "text.primary" }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.75 }}>
                    {step.desc}
                  </Typography>
                </Stack>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
