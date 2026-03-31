"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  TextField,
  InputAdornment,
  alpha,
  Link as MuiLink,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LaunchIcon from "@mui/icons-material/Launch";
import PageHeader from "@/components/dashboard/PageHeader";

const directories = [
  {
    name: "Product Hunt",
    url: "https://www.producthunt.com/",
    category: "Launch",
    difficulty: "Medium",
    impact: "High",
    description: "The best place to launch new products and get initial traction.",
  },
  {
    name: "Indie Hackers",
    url: "https://www.indiehackers.com/",
    category: "Community",
    difficulty: "Easy",
    impact: "Medium",
    description: "Share your journey and get feedback from other builders.",
  },
  {
    name: "Reddit (r/sideproject)",
    url: "https://www.reddit.com/r/sideproject/",
    category: "Community",
    difficulty: "Medium",
    impact: "High",
    description: "A great subreddit to showcase what you're building.",
  },
  {
    name: "Reddit (r/saas)",
    url: "https://www.reddit.com/r/saas/",
    category: "Community",
    difficulty: "Hard",
    impact: "High",
    description: "Discuss SaaS building, marketing, and scaling.",
  },
  {
    name: "Hacker News",
    url: "https://news.ycombinator.com/",
    category: "Launch",
    difficulty: "Hard",
    impact: "Very High",
    description: "If you hit the front page, expect massive traffic.",
  },
  {
    name: "Microlaunch",
    url: "https://microlaunch.net/",
    category: "Launch",
    difficulty: "Easy",
    impact: "Medium",
    description: "A platform for launching small projects and micro-SaaS.",
  },
  {
    name: "Betalist",
    url: "https://betalist.com/",
    category: "Directory",
    difficulty: "Medium",
    impact: "Medium",
    description: "Get early adopters for your upcoming startup.",
  },
  {
    name: "StartupBase",
    url: "https://startupbase.io/",
    category: "Directory",
    difficulty: "Easy",
    impact: "Low",
    description: "A community of makers and early adopters.",
  },
  {
    name: "1000 Tools",
    url: "https://1000.tools/",
    category: "Directory",
    difficulty: "Easy",
    impact: "Low",
    description: "A curated list of tools for makers and developers.",
  },
  {
    name: "SaasHub",
    url: "https://www.saashub.com/",
    category: "Directory",
    difficulty: "Easy",
    impact: "Medium",
    description: "The independent software marketplace.",
  },
];

export default function ToolboxView() {
  const [search, setSearch] = useState("");

  const filtered = directories.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ pt: 2, pb: 8 }}>
      <Stack spacing={4}>
        <PageHeader
          title="SEO Toolbox"
          description="A curated list of directories and communities to get traction, backlinks, and go viral."
        />

        <TextField
          fullWidth
          placeholder="Search directories, categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "16px",
              bgcolor: "white",
            },
          }}
        />

        <Grid container spacing={3}>
          {filtered.map((item, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: "24px",
                  border: "1px solid rgba(0,0,0,0.05)",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.04)",
                    borderColor: "primary.main",
                  },
                }}
              >
                <CardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Chip
                      label={item.category}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        fontSize: "10px",
                        bgcolor: alpha("#7C3AED", 0.1),
                        color: "primary.main",
                        borderRadius: "8px",
                      }}
                    />
                    <MuiLink href={item.url} target="_blank" color="inherit">
                      <LaunchIcon sx={{ fontSize: 18, opacity: 0.5, "&:hover": { opacity: 1 } }} />
                    </MuiLink>
                  </Stack>

                  <Typography variant="h6" fontWeight={800} mb={1}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={3} sx={{ flexGrow: 1 }}>
                    {item.description}
                  </Typography>

                  <Stack direction="row" spacing={1}>
                    <Chip
                      label={`Impact: ${item.impact}`}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: "10px", fontWeight: 600, borderRadius: "6px" }}
                    />
                    <Chip
                      label={`Diff: ${item.difficulty}`}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: "10px", fontWeight: 600, borderRadius: "6px" }}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Box>
  );
}
