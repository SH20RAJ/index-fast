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
    title: "Connect Account",
    desc: "Securely link your Google Search Console via OAuth. We only need limited access.",
    bg: "#F5F3FF"
  },
  {
    num: "02",
    title: "Upload Sitemap",
    desc: "Paste your sitemap URL. We'll automatically identify every single page on your site.",
    bg: "#EFF6FF"
  },
  {
    num: "03",
    title: "Complete Sync",
    desc: "Hit &apos;Index&apos; and watch your URLs get crawled by search engines within 24 hours.",
    bg: "#FFFBEB"
  }
];

export default function HowItWorks() {
  const theme = useTheme();

  return (
    <Box id="how-it-works" sx={{ py: 15, bgcolor: "#FAF9FF" }}>
      <Container maxWidth="lg">
        <Stack spacing={2} mb={10} textAlign="center">
          <Typography variant="h2" sx={{ fontWeight: 900, color: "#1F2937", mb: 2 }}>
            How it
            <Box component="span" sx={{ color: "primary.main", fontFamily: '"Patrick Hand", cursive', rotate: "-3deg", display: "inline-block", ml: 1 }}>works</Box>
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: "600px", mx: "auto" }}>
            Go from unknown to ranked in three simple, automated steps. No technical skills required.
          </Typography>
        </Stack>

        <Grid container spacing={4}>
          {steps.map((step, idx) => (
            <Grid size={{ xs: 12, md: 4 }} key={idx}>
              <Box
                sx={{
                  p: 6,
                  bgcolor: "white",
                  borderRadius: "32px",
                  border: "1px solid rgba(124, 58, 237, 0.05)",
                  boxShadow: "0 10px 40px rgba(124, 58, 237, 0.03)",
                  position: "relative",
                  height: "100%"
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: "6rem",
                    fontWeight: 900,
                    color: alpha(theme.palette.primary.main, 0.05),
                    position: "absolute",
                    top: 0,
                    right: 40,
                    lineHeight: 1
                  }}
                >
                  {step.num}
                </Typography>

                <Stack spacing={2} sx={{ position: "relative" }}>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: "primary.main", fontFamily: '"Patrick Hand", cursive' }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
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
