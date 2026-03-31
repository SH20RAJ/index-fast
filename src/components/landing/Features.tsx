"use client";

import React from "react";

import {
  Box,
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
    title: "AI SEO Auditor",
    desc: "Run instant technical audits and generate prioritized fixes your team can ship the same day.",
    icon: <AutoFixHighIcon />,
    color: "#4338CA"
  },
  {
    title: "Universal Pings",
    desc: "Broadcast URL updates across IndexNow and discovery networks with retry logic and delivery logs.",
    icon: <BoltIcon />,
    color: "#059669"
  },
  {
    title: "AI Visibility Signals",
    desc: "Track which content is discoverable by AI assistants and close gaps before traffic is lost.",
    icon: <PsychologyIcon />,
    color: "#FACC15"
  },
  {
    title: "Instant Submission",
    desc: "Trigger high-priority URL batches in one click using direct Bing and IndexNow API integrations.",
    icon: <SpeedIcon />,
    color: "#7C3AED"
  },
  {
    title: "Sitemap Auto-Sync",
    desc: "Monitor sitemaps continuously and auto-submit new pages before competitors are even discovered.",
    icon: <StorageIcon />,
    color: "#E11D48"
  },
  {
    title: "GSC Sync",
    desc: "Import sites from Google Search Console and manage indexing ops from one focused workspace.",
    icon: <SearchIcon />,
    color: "#0284C7"
  }
];

export default function Features() {
  const theme = useTheme();

  return (
    <Box id="features" sx={{ py: { xs: 10, md: 14 }, bgcolor: "background.default" }}>
      <Container maxWidth="lg">
        <Stack spacing={2} mb={8} textAlign="center">
          <Typography variant="h2" sx={{ fontWeight: 900, color: "text.primary", mb: 2 }}>
            Built to remove indexing bottlenecks at scale
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: "700px", mx: "auto", lineHeight: 1.75 }}>
            Every feature is focused on a single outcome: more discoverable pages with less manual work. Ship content, let IndexFast handle the operational burden.
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          {features.map((f) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={f.title}>
              <Card
                sx={{
                  height: "100%",
                  bgcolor: alpha(theme.palette.background.paper, theme.palette.mode === "dark" ? 0.76 : 0.9),
                  borderRadius: "28px",
                  border: `1px solid ${alpha(f.color, theme.palette.mode === "dark" ? 0.35 : 0.2)}`,
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 18px 36px rgba(0,0,0,0.34)"
                      : "0 18px 36px rgba(17, 24, 39, 0.07)",
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
                  <Box sx={{ width: 46, height: 46, borderRadius: "12px", bgcolor: alpha(f.color, 0.14), display: "flex", alignItems: "center", justifyContent: "center", mb: 3 }}>
                    {React.cloneElement(f.icon, { sx: { color: f.color } })}
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, color: "text.primary" }}>{f.title}</Typography>
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
