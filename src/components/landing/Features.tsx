"use client";

import React from "react";

import {
  Box,
  Chip,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  alpha,
  Stack,
  useTheme,
} from "@mui/material";
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
    micro: "Find blockers fast",
    icon: <AutoFixHighIcon />,
    color: "#0F172A"
  },
  {
    title: "Universal URL Pings",
    desc: "Push URL updates to IndexNow and submission endpoints with retries, logs, and clean operational control.",
    micro: "Reliable delivery",
    icon: <BoltIcon />,
    color: "#0F172A"
  },
  {
    title: "AI Visibility Signals",
    desc: "Measure discoverability across AI assistants and close visibility gaps before demand shifts to competitors.",
    micro: "Stay discoverable",
    icon: <PsychologyIcon />,
    color: "#2563EB"
  },
  {
    title: "Instant Batch Submission",
    desc: "Launch high-priority URL batches in one action with direct Bing and IndexNow integrations.",
    micro: "Ship now",
    icon: <SpeedIcon />,
    color: "#0F172A"
  },
  {
    title: "Sitemap Auto-Sync",
    desc: "Watch sitemap changes continuously and auto-submit fresh pages before competitor refresh cycles catch up.",
    micro: "Always current",
    icon: <StorageIcon />,
    color: "#0F172A"
  },
  {
    title: "GSC Property Sync",
    desc: "Import verified sites from Google Search Console and run indexing operations from one focused dashboard.",
    micro: "Unified operations",
    icon: <SearchIcon />,
    color: "#0F172A"
  }
];

export default function Features() {
  const theme = useTheme();

  return (
    <Box id="features" sx={{ py: { xs: 10, md: 14 }, bgcolor: "background.default" }}>
      <Container maxWidth="lg">
        <Stack spacing={2} mb={8} textAlign="center">
          <Stack direction="row" justifyContent="center" mb={1.5}>
            <Chip label="Built for operators" sx={{ fontWeight: 700, bgcolor: alpha(theme.palette.primary.main, 0.05) }} />
          </Stack>
          <Typography variant="h2" sx={{ fontWeight: 900, color: "text.primary", mb: 2 }}>
            Feature set built to win the indexing race
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: "700px", mx: "auto", lineHeight: 1.75 }}>
            Publish velocity alone does not win. You need submission speed, indexing feedback loops, and reliable execution. IndexFast is the system teams use when discoverability matters every day.
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          {features.map((f) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={f.title}>
              <Card
                sx={{
                  height: "100%",
                  bgcolor: alpha(theme.palette.background.paper, theme.palette.mode === "dark" ? 0.76 : 0.9),
                  borderRadius: "24px",
                  border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 18px 36px rgba(0,0,0,0.28)"
                      : "0 18px 36px rgba(17, 24, 39, 0.06)",
                  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0 24px 44px rgba(0,0,0,0.38)"
                        : "0 24px 44px rgba(17, 24, 39, 0.1)",
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ width: 46, height: 46, borderRadius: "12px", bgcolor: alpha(f.color, 0.08), display: "flex", alignItems: "center", justifyContent: "center", mb: 3 }}>
                    {React.cloneElement(f.icon, { sx: { color: f.color } })}
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, color: "text.primary" }}>{f.title}</Typography>
                  <Typography variant="caption" sx={{ color: f.color, fontWeight: 800, letterSpacing: "0.04em", display: "block", mb: 1 }}>
                    {f.micro}
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
