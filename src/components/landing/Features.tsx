"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  alpha,
  Stack,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import SearchIcon from "@mui/icons-material/Search";
import SpeedIcon from "@mui/icons-material/Speed";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import PsychologyIcon from "@mui/icons-material/Psychology";
import StorageIcon from "@mui/icons-material/Storage";
import BoltIcon from "@mui/icons-material/Bolt";

const features = [
  {
    title: "Technical SEO Auditor",
    desc: "Surface crawl and index blockers instantly, then ship prioritized fixes before rankings are impacted.",
    icon: <AutoFixHighIcon />,
    color: "#111111"
  },
  {
    title: "Universal URL Pings",
    desc: "Push URL updates to IndexNow and submission endpoints with retries, logs, and clean operational control.",
    icon: <BoltIcon />,
    color: "#111111"
  },
  {
    title: "AI Visibility Signals",
    desc: "Measure discoverability across AI assistants and close visibility gaps before demand shifts to competitors.",
    icon: <PsychologyIcon />,
    color: "#2563EB"
  },
  {
    title: "Instant Batch Submission",
    desc: "Launch high-priority URL batches in one action with direct Bing and IndexNow integrations.",
    icon: <SpeedIcon />,
    color: "#111111"
  },
  {
    title: "Sitemap Auto-Sync",
    desc: "Watch sitemap changes continuously and auto-submit fresh pages before competitor refresh cycles catch up.",
    icon: <StorageIcon />,
    color: "#111111"
  },
  {
    title: "GSC Property Sync",
    desc: "Import verified sites from Google Search Console and run indexing operations from one focused dashboard.",
    icon: <SearchIcon />,
    color: "#111111"
  }
];

export default function Features() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box id="features" sx={{ py: { xs: 10, md: 16 }, bgcolor: "background.default" }}>
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
              Enterprise Infrastructure
            </Typography>
          </Box>
          <Typography variant="h2" sx={{ fontWeight: 900, color: "text.primary", letterSpacing: "-0.03em" }}>
            Feature set built to win
            <br />
            the indexing race
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: "640px", lineHeight: 1.6, fontSize: "1.1rem" }}>
            IndexFast is the system teams use when discoverability matters every day. Publish velocity alone doesn't win; submission speed and reliable execution do.
          </Typography>
        </Stack>

        <Grid container spacing={4}>
          {features.map((f) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={f.title}>
              <Card
                sx={{
                  height: "100%",
                  bgcolor: "background.paper",
                  borderRadius: "12px",
                  border: `1px solid ${theme.palette.divider}`,
                  transition: "border-color 0.2s ease",
                  "&:hover": {
                    borderColor: "primary.main",
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "8px",
                      border: `1px solid ${theme.palette.divider}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 4,
                      color: f.color === "#111111" ? "primary.main" : f.color,
                    }}
                  >
                    {React.cloneElement(f.icon as React.ReactElement, { sx: { fontSize: 20 } })}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5, color: "text.primary", letterSpacing: "-0.01em" }}>
                    {f.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                    {f.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
