"use client";

import {
  Box,
  Button,
  Chip,
  Container,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import TrackChangesRoundedIcon from "@mui/icons-material/TrackChangesRounded";
import { useStackApp } from "@stackframe/stack";

const feedItems = [
  { source: "Sitemap", url: "/sitemap.xml", status: "Queued" },
  { source: "Collection", url: "/blog/geo-checklist", status: "Pinged" },
  { source: "Product", url: "/features/indexnow-sync", status: "Accepted" },
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
              ? "radial-gradient(circle at 10% 20%, rgba(124,58,237,0.24), transparent 42%), radial-gradient(circle at 84% 18%, rgba(250,204,21,0.16), transparent 38%), linear-gradient(135deg, rgba(15,11,26,0.95), rgba(24,16,38,0.95))"
              : "radial-gradient(circle at 12% 24%, rgba(124,58,237,0.16), transparent 44%), radial-gradient(circle at 80% 20%, rgba(250,204,21,0.18), transparent 36%), linear-gradient(135deg, #FFFFFF 20%, #F7F4FF 100%)",
          zIndex: -3,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "16%",
          right: "8%",
          width: { xs: 110, md: 180 },
          height: { xs: 110, md: 180 },
          borderRadius: "50%",
          border: `1px solid ${alpha(theme.palette.secondary.main, 0.5)}`,
          zIndex: -2,
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            border: `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
            animation: "pulseRing 2.8s ease-out infinite",
          },
        }}
      />

      <Container maxWidth="lg">
        <Stack direction={{ xs: "column", lg: "row" }} spacing={{ xs: 5, lg: 8 }} alignItems="center">
          <Stack spacing={3.5} sx={{ maxWidth: 700, flex: 1 }}>
            <Chip
              icon={<AutoAwesomeRoundedIcon />}
              label="Built for growth teams that publish every day"
              sx={{
                width: "fit-content",
                bgcolor: alpha(theme.palette.primary.main, 0.12),
                color: "primary.main",
                border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                fontWeight: 700,
              }}
            />

            <Typography
              variant="h1"
              sx={{
                lineHeight: 1.03,
                fontSize: { xs: "2.5rem", md: "4.2rem" },
                color: "text.primary",
              }}
            >
              Get new pages
              <Box component="span" sx={{ color: "primary.main" }}> crawled faster, </Box>
              ranked sooner, and seen in
              <Box component="span" sx={{ color: "secondary.main" }}> AI answers </Box>
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
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 22px 45px rgba(124,58,237,0.34)"
                      : "0 22px 45px rgba(124,58,237,0.25)",
                }}
              >
                Start free and submit URLs
              </Button>
              <Button
                variant="outlined"
                component="a"
                href="#pricing"
                size="large"
                sx={{
                  px: 4,
                  py: 1.8,
                  borderWidth: 1.5,
                  borderColor: alpha(theme.palette.primary.main, 0.38),
                  color: "text.primary",
                }}
              >
                See plans
              </Button>
            </Stack>

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
              borderRadius: "28px",
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              bgcolor: alpha(theme.palette.background.paper, 0.82),
              backdropFilter: "blur(10px)",
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 30px 60px rgba(0,0,0,0.5)"
                  : "0 30px 60px rgba(124,58,237,0.14)",
            }}
          >
            <Stack spacing={2.2}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" spacing={1} alignItems="center">
                  <TrackChangesRoundedIcon sx={{ color: "primary.main" }} />
                  <Typography fontWeight={800}>Indexing Command Center</Typography>
                </Stack>
                <Chip size="small" label="Sync Active" color="success" />
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
                      bgcolor: alpha(theme.palette.primary.main, 0.07),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.18)}`,
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
                    <Chip
                      size="small"
                      label={item.status}
                      sx={{
                        bgcolor: alpha(theme.palette.secondary.main, 0.26),
                        color: "text.primary",
                        fontWeight: 700,
                      }}
                    />
                  </Stack>
                ))}
              </Stack>

              <Box
                sx={{
                  p: 2,
                  borderRadius: "16px",
                  bgcolor: alpha(theme.palette.background.default, 0.8),
                  border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
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
