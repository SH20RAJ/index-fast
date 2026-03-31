"use client";
import * as React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
  alpha,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SpeedIcon from "@mui/icons-material/Speed";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import SecurityIcon from "@mui/icons-material/Security";
import TimelineIcon from "@mui/icons-material/Timeline";

const FEATURES = [
  {
    title: "Instant Submission",
    description: "Submit your URLs directly to search engines. No more waiting.",
    icon: <SpeedIcon />,
  },
  {
    title: "Batch Indexing",
    description: "Bulk upload up to 10,000 URLs at once for large sites.",
    icon: <BackupTableIcon />,
  },
  {
    title: "Auto-Discovery",
    description: "Link your sitemap and let us handle new content automatically.",
    icon: <AutoFixHighIcon />,
  },
  {
    title: "Highly Secure",
    description: "End-to-end encryption for all your site data and API keys.",
    icon: <SecurityIcon />,
  },
  {
    title: "Real-time Analytics",
    description: "Detailed insights into your search engine performance.",
    icon: <TimelineIcon />,
  },
  {
    title: "Smart Retries",
    description: "Optimized retry logic to guarantee 100% indexing success.",
    icon: <SearchIcon />,
  },
];

export default function Features() {
  return (
    <Box id="features" sx={{ py: 16 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          textAlign="center"
          mb={10}
          fontWeight={800}
        >
          Everything you need <br /> to reach for the top.
        </Typography>

        <Grid container spacing={4}>
          {FEATURES.map((feature, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card
                sx={{
                  height: "100%",
                  bgcolor: "transparent",
                  boxShadow: "none",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: alpha("#ffffff", 0.02),
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      mb: 3,
                      bgcolor: "primary.main",
                      color: "white",
                      boxShadow: "0 8px 16px -4px rgba(99, 102, 241, 0.3)",
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
                    {feature.description}
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
