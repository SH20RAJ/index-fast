"use client";
import {
  Box,
  Container,
  Typography,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

const steps = [
  {
    num: "01",
    title: "Connect Once",
    desc: "Import verified properties and sitemap endpoints in minutes. Your indexing stack is ready without custom setup.",
    punch: "No engineering bottleneck",
  },
  {
    num: "02",
    title: "Submit at Speed",
    desc: "Detect fresh URLs from sitemap updates and submit immediately to IndexNow and Bing from one workflow.",
    punch: "From publish to ping fast",
  },
  {
    num: "03",
    title: "Scale with Proof",
    desc: "Track accepted requests, failures, and trend lines so teams can double down on what actually improves discovery.",
    punch: "Execution with visibility",
  }
];

export default function HowItWorks() {
  const theme = useTheme();

  return (
    <Box id="how-it-works" sx={{ py: { xs: 10, md: 16 }, bgcolor: "background.paper" }}>
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
              Operational Workflow
            </Typography>
          </Box>
          <Typography variant="h2" sx={{ fontWeight: 900, color: "text.primary", letterSpacing: "-0.03em" }}>
            Stop publishing blind.
            <br />
            Start indexing with intent.
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: "640px", lineHeight: 1.6, fontSize: "1.1rem" }}>
            IndexFast gives you a daily operating system to push fresh pages, monitor outcomes, and compound discoverability.
          </Typography>
        </Stack>

        <Grid container spacing={4}>
          {steps.map((step) => (
            <Grid size={{ xs: 12, md: 4 }} key={step.title}>
              <Box
                sx={{
                  p: { xs: 4, md: 5 },
                  bgcolor: "background.default",
                  borderRadius: "12px",
                  border: `1px solid ${theme.palette.divider}`,
                  height: "100%",
                  position: "relative",
                  transition: "border-color 0.2s",
                  "&:hover": {
                    borderColor: "primary.main",
                  }
                }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    position: "absolute",
                    top: 24,
                    right: 40,
                    fontSize: "4rem",
                    fontWeight: 900,
                    opacity: 0.05,
                    color: "text.primary",
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                >
                  {step.num}
                </Typography>

                <Stack spacing={2} sx={{ position: "relative" }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: "primary.main", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    {step.punch}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary", letterSpacing: "-0.02em" }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.6, fontSize: "1rem" }}>
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
