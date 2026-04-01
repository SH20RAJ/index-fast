"use client";

import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import { useStackApp } from "@stackframe/stack";

const feedItems = [
  { source: "Sitemap", url: "/sitemap.xml", status: "Queued" },
  { source: "Blog", url: "/blog/geo-checklist", status: "Pinged" },
  { source: "Feature", url: "/features/indexnow-sync", status: "Accepted" },
];

const trustMetrics = [
  { value: "4-24h", label: "Typical discovery window" },
  { value: "99.95%", label: "Webhook delivery" },
  { value: "10,000+", label: "URLs processed per run" },
];

export default function Hero() {
  const theme = useTheme();
  const stack = useStackApp();

  return (
    <Box
      id="home"
      sx={{
        position: "relative",
        overflow: "hidden",
        pt: { xs: 8, md: 12 },
        pb: { xs: 10, md: 14 },
        "@keyframes pulseRing": {
          "0%": { transform: "scale(0.9)", opacity: 0.5 },
          "100%": { transform: "scale(1.2)", opacity: 0 },
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            theme.palette.mode === "dark"
              ? "radial-gradient(circle at 10% 20%, rgba(37,99,235,0.16), transparent 42%), radial-gradient(circle at 84% 18%, rgba(15,23,42,0.24), transparent 38%), linear-gradient(135deg, rgba(5,8,22,0.98), rgba(11,16,32,0.98))"
              : "radial-gradient(circle at 12% 24%, rgba(37,99,235,0.08), transparent 44%), radial-gradient(circle at 80% 20%, rgba(15,23,42,0.05), transparent 36%), linear-gradient(135deg, #FFFFFF 10%, #F8FAFC 100%)",
          zIndex: -3,
        }}
      />

      <Container maxWidth="lg">
        <Stack direction={{ xs: "column", lg: "row" }} spacing={{ xs: 5, lg: 8 }} alignItems="center">
          <Stack spacing={3.5} sx={{ maxWidth: 700, flex: 1 }}>
            <Typography variant="overline" sx={{ letterSpacing: "0.18em", color: "text.secondary", fontWeight: 800 }}>
              Indexing infrastructure for teams that ship daily
            </Typography>

            <Typography
              variant="h1"
              sx={{
                lineHeight: 1.03,
                fontSize: { xs: "2.7rem", md: "4.5rem" },
                color: "text.primary",
                maxWidth: 820,
              }}
            >
              Get new pages
              <Box component="span" sx={{ color: "secondary.main" }}> crawled faster, </Box>
              ranked sooner, and seen in
              <Box component="span" sx={{ color: "primary.main" }}> AI answers </Box>
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: "text.secondary",
                fontWeight: 500,
                lineHeight: 1.6,
                maxWidth: 620,
              }}
            >
              IndexFast turns indexing into a reliable pipeline: automatic sitemap sync, Bing and IndexNow submissions, endpoint health checks, and a live status feed your team can trust.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Button
                variant="contained"
                size="large"
                onClick={() => stack.redirectToSignUp()}
                endIcon={<KeyboardArrowRightRoundedIcon />}
                sx={{
                  px: 4,
                  py: 1.8,
                  bgcolor: "primary.main",
                }}
              >
                Start free and submit URLs
              </Button>
              <Button
                variant="outlined"
                component="a"
                href="/sign-in"
                size="large"
                sx={{
                  px: 4,
                  py: 1.8,
                  borderWidth: 1.5,
                  borderColor: alpha(theme.palette.primary.main, 0.38),
                  color: "text.primary",
                }}
              >
                Sign in
              </Button>
            </Stack>

            <Button
              component="a"
              href="#pricing"
              variant="text"
              sx={{
                width: "fit-content",
                color: "text.secondary",
                fontWeight: 700,
                px: 0.5,
                "&:hover": { color: "text.primary", bgcolor: "transparent" },
              }}
            >
              See plans
            </Button>

            <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap>
              {trustMetrics.map((stat) => (
                <Box key={stat.label}>
                  <Typography variant="h5" fontWeight={900} color="text.primary">
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Stack>

          <Box
            sx={{
              flex: 1,
              width: "100%",
              maxWidth: 500,
              p: { xs: 2.5, md: 3.5 },
              borderRadius: "26px",
              border: `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
              bgcolor: alpha(theme.palette.background.paper, theme.palette.mode === "dark" ? 0.9 : 0.86),
              backdropFilter: "blur(10px)",
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 30px 60px rgba(0,0,0,0.48)"
                  : "0 30px 60px rgba(15,23,42,0.08)",
            }}
          >
            <Stack spacing={2.2}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle2" sx={{ letterSpacing: "0.14em", fontWeight: 800, color: "text.secondary" }}>
                    Live pipeline
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
                  Sync active
                </Typography>
              </Stack>

              <Stack spacing={1.2}>
                {feedItems.map((item) => (
                  <Stack
                    key={item.url}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                      px: 1.5,
                      py: 1,
                      borderRadius: "14px",
                      bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.08 : 0.04),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    }}
                  >
                    <Box>
                      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
                        {item.source}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 700 }}>
                        {item.url}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
                      {item.status}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              <Box
                sx={{
                  p: 2,
                  borderRadius: "16px",
                  bgcolor: alpha(theme.palette.background.default, 0.8),
                  border: `1px dashed ${alpha(theme.palette.primary.main, 0.14)}`,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Last run: 342 URLs across 6 properties, 97.8% accepted by API validators, median response 2.1s.
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
