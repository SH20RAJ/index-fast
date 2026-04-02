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
  { value: "4-24h", label: "Discovery window" },
  { value: "99.95%", label: "Uptime" },
  { value: "10M+", label: "URLs/run" },
];

export default function Hero() {
  const theme = useTheme();
  const stack = useStackApp();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      id="home"
      sx={{
        position: "relative",
        pt: { xs: 8, md: 16 },
        pb: { xs: 10, md: 20 },
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth="lg">
        <Stack direction={{ xs: "column", lg: "row" }} spacing={{ xs: 8, lg: 12 }} alignItems="center">
          <Stack spacing={4} sx={{ flex: 1, textAlign: { xs: "center", lg: "left" }, alignItems: { xs: "center", lg: "flex-start" } }}>
            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: "99px",
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: alpha(theme.palette.text.primary, 0.02),
                width: "fit-content",
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", letterSpacing: "0.02em" }}>
                Indexing infrastructure for modern teams
              </Typography>
            </Box>

            <Typography
              variant="h1"
              sx={{
                lineHeight: 1,
                fontSize: { xs: "3rem", md: "5.5rem" },
                color: "text.primary",
                fontWeight: 900,
                letterSpacing: "-0.04em",
              }}
            >
              Index your site
              <br />
              <Box component="span" sx={{ color: "text.secondary" }}>at light speed.</Box>
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: "text.secondary",
                fontWeight: 500,
                lineHeight: 1.6,
                maxWidth: 580,
                fontSize: "1.125rem",
              }}
            >
              Stop waiting weeks for search engines. IndexFast automates your sitemap sync, Bing submissions, and IndexNow pings in one unified pipeline.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ width: { xs: "100%", sm: "auto" } }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => stack.redirectToSignUp()}
                sx={{
                  px: 4,
                  py: 1.5,
                  bgcolor: "primary.main",
                  color: isDark ? "black" : "white",
                  fontSize: "1rem",
                  fontWeight: 800,
                }}
              >
                Get Started Free
              </Button>
              <Button
                variant="outlined"
                component="a"
                href="/sign-in"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderColor: "divider",
                  color: "text.primary",
                  fontSize: "1rem",
                  fontWeight: 700,
                  "&:hover": {
                    borderColor: "text.primary",
                    bgcolor: alpha(theme.palette.text.primary, 0.04),
                  },
                }}
              >
                Sign In
              </Button>
            </Stack>

            <Stack direction="row" spacing={4} sx={{ pt: 2 }}>
              {trustMetrics.map((stat) => (
                <Box key={stat.label}>
                  <Typography variant="h6" fontWeight={800} color="text.primary" sx={{ lineHeight: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
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
              maxWidth: 540,
              position: "relative",
            }}
          >
            {/* Minimal Dashboard Preview */}
            <Box
              sx={{
                p: { xs: 2.5, md: 4 },
                borderRadius: "16px",
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: "background.paper",
                boxShadow: isDark ? "0 20px 40px rgba(0,0,0,0.4)" : "0 20px 40px rgba(0,0,0,0.03)",
              }}
            >
              <Stack spacing={3}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "success.main" }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "text.primary", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                      Pipeline Status
                    </Typography>
                  </Stack>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
                    Live
                  </Typography>
                </Stack>

                <Stack spacing={1.5}>
                  {feedItems.map((item) => (
                    <Stack
                      key={item.url}
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{
                        p: 2,
                        borderRadius: "12px",
                        border: `1px solid ${theme.palette.divider}`,
                        bgcolor: alpha(theme.palette.text.primary, 0.01),
                        transition: "all 0.2s",
                        "&:hover": {
                          borderColor: "primary.main",
                          bgcolor: alpha(theme.palette.primary.main, 0.02),
                        }
                      }}
                    >
                      <Box>
                        <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 0.2, fontWeight: 700 }}>
                          {item.source}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 700, fontFamily: "monospace" }}>
                          {item.url}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          px: 1.25,
                          py: 0.5,
                          borderRadius: "6px",
                          bgcolor: item.status === "Accepted" ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.primary.main, 0.05),
                          color: item.status === "Accepted" ? "success.main" : "primary.main",
                        }}
                      >
                        <Typography variant="caption" sx={{ fontWeight: 800 }}>
                          {item.status}
                        </Typography>
                      </Box>
                    </Stack>
                  ))}
                </Stack>

                <Box
                  sx={{
                    p: 2,
                    borderRadius: "12px",
                    bgcolor: alpha(theme.palette.text.primary, 0.03),
                    border: `1px dashed ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem", lineHeight: 1.5 }}>
                    <strong>Latest Scan:</strong> 1,204 URLs synced from XML sitemaps. 98.2% validation rate. Median submission latency: 840ms.
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Decorative Element */}
            <Box
              sx={{
                position: "absolute",
                top: -20,
                right: -20,
                width: 100,
                height: 100,
                bgcolor: "primary.main",
                filter: "blur(80px)",
                opacity: isDark ? 0.2 : 0.1,
                zIndex: -1,
              }}
            />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
