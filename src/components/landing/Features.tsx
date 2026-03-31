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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SpeedIcon from "@mui/icons-material/Speed";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import PsychologyIcon from "@mui/icons-material/Psychology";
import StorageIcon from "@mui/icons-material/Storage";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import BoltIcon from "@mui/icons-material/Bolt";

const features = [
  {
    title: "AI SEO Auditor",
    desc: "Get instant technical SEO audits with ready-to-use Cursor prompts powered by Llama 3 70B.",
    icon: <AutoFixHighIcon />,
    bg: "#E0E7FF",
    color: "#4338CA"
  },
  {
    title: "Universal Pings",
    desc: "Automatically notify Ping-o-Matic and Pingler networks for maximum search engine discovery.",
    icon: <BoltIcon />,
    bg: "#ECFDF5",
    color: "#059669"
  },
  {
    title: "AI Visibility",
    desc: "Ensure your content is indexed in Bing to appear in ChatGPT, Copilot, and Perplexity answers.",
    icon: <PsychologyIcon />,
    bg: "#FEF9C3",
    color: "#FACC15"
  },
  {
    title: "Instant Submission",
    desc: "Direct integration with IndexNow and Bing Batch APIs for sub-24 hour content discovery.",
    icon: <SpeedIcon />,
    bg: "#F3E8FF",
    color: "#7C3AED"
  },
  {
    title: "Sitemap Auto-Sync",
    desc: "We monitor your sitemaps every 6 hours and automatically push new URLs to search engines.",
    icon: <StorageIcon />,
    bg: "#FFF1F2",
    color: "#E11D48"
  },
  {
    title: "GSC Integration",
    desc: "One-click import from Google Search Console to track and manage all your properties in one place.",
    icon: <SearchIcon />,
    bg: "#F0F9FF",
    color: "#0284C7"
  }
];

export default function Features() {

  return (
    <Box id="features" sx={{ py: 15, bgcolor: "white" }}>
      <Container maxWidth="lg">
        <Stack spacing={2} mb={10} textAlign="center">
          <Typography variant="h2" sx={{ fontWeight: 900, color: "#1F2937", mb: 2 }}>
            Powerful
            <Box component="span" sx={{ color: "primary.main", fontFamily: '"Patrick Hand", cursive', rotate: "-3deg", display: "inline-block", ml: 1 }}>indexing</Box>
            <br /> for every site
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: "600px", mx: "auto" }}>
            Our enterprise-grade engine handles the complexities of search console quotas, sitemap syncing, and error handling so you don&apos;t have to.
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          {features.map((f, idx) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
              <Card
                sx={{
                  height: "100%",
                  bgcolor: f.bg,
                  borderRadius: "32px",
                  border: "none",
                  boxShadow: "none",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-8px)"
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: "12px", bgcolor: alpha(f.color as string, 0.1), display: "flex", alignItems: "center", justifyContent: "center", mb: 3 }}>
                    {React.cloneElement(f.icon, { sx: { color: f.color } })}
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, fontFamily: '"Patrick Hand", cursive', color: "#1F2937" }}>{f.title}</Typography>
                  <Typography variant="body2" sx={{ color: alpha("#1F2937", 0.7), lineHeight: 1.6 }}>
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
