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
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LaunchIcon from "@mui/icons-material/Launch";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import BoltIcon from "@mui/icons-material/Bolt";
import PublicIcon from "@mui/icons-material/Public";
import PageHeader from "@/components/dashboard/PageHeader";

type DirectoryItem = {
  name: string;
  url: string;
  category: "Launch" | "Community" | "Directory";
  difficulty: "Easy" | "Medium" | "Hard";
  impact: "Low" | "Medium" | "High" | "Very High";
  description: string;
};

const directories: DirectoryItem[] = [
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
  {
    name: "AlternativeTo",
    url: "https://alternativeto.net/",
    category: "Directory",
    difficulty: "Easy",
    impact: "Medium",
    description: "List your product in software alternatives pages for intent-driven traffic.",
  },
  {
    name: "G2",
    url: "https://www.g2.com/",
    category: "Directory",
    difficulty: "Hard",
    impact: "Very High",
    description: "High-intent software comparison traffic and review visibility.",
  },
  {
    name: "Capterra",
    url: "https://www.capterra.com/",
    category: "Directory",
    difficulty: "Hard",
    impact: "High",
    description: "SaaS marketplace with strong B2B conversion potential.",
  },
  {
    name: "GetApp",
    url: "https://www.getapp.com/",
    category: "Directory",
    difficulty: "Medium",
    impact: "Medium",
    description: "Reach buyers searching category pages and software roundups.",
  },
  {
    name: "Peerlist",
    url: "https://peerlist.io/",
    category: "Community",
    difficulty: "Easy",
    impact: "Medium",
    description: "Builder-focused platform to launch products and collect feedback.",
  },
  {
    name: "HackerNoon",
    url: "https://hackernoon.com/",
    category: "Community",
    difficulty: "Medium",
    impact: "Medium",
    description: "Publish technical stories and link your product in relevant context.",
  },
  {
    name: "Dev.to",
    url: "https://dev.to/",
    category: "Community",
    difficulty: "Easy",
    impact: "Medium",
    description: "Share engineering-focused launch stories and tutorials.",
  },
  {
    name: "Twitter / X Build In Public",
    url: "https://x.com/",
    category: "Community",
    difficulty: "Medium",
    impact: "High",
    description: "Ship updates and launch threads to collect early beta users.",
  },
  {
    name: "LinkedIn Founder Posts",
    url: "https://www.linkedin.com/",
    category: "Community",
    difficulty: "Medium",
    impact: "High",
    description: "Distribute B2B launch stories and attract agency/SMB customers.",
  },
  {
    name: "Fazier",
    url: "https://fazier.com/",
    category: "Launch",
    difficulty: "Easy",
    impact: "Medium",
    description: "Quick launch portal for startup discovery and backlink acquisition.",
  },
  {
    name: "Uneed",
    url: "https://www.uneed.best/",
    category: "Launch",
    difficulty: "Easy",
    impact: "Medium",
    description: "Submit your product to reach startup-curious audiences.",
  },
  {
    name: "Launching Next",
    url: "https://www.launchingnext.com/",
    category: "Launch",
    difficulty: "Easy",
    impact: "Low",
    description: "Straightforward directory launch with basic referral traffic.",
  },
  {
    name: "Startup Stash",
    url: "https://startupstash.com/",
    category: "Directory",
    difficulty: "Medium",
    impact: "Medium",
    description: "Useful for evergreen category placement and long-tail discovery.",
  },
  {
    name: "Futurepedia",
    url: "https://www.futurepedia.io/",
    category: "Directory",
    difficulty: "Medium",
    impact: "High",
    description: "Relevant listing source for AI-adjacent products and workflows.",
  },
  {
    name: "Toolify",
    url: "https://www.toolify.ai/",
    category: "Directory",
    difficulty: "Easy",
    impact: "Medium",
    description: "AI tool listing traffic with strong long-tail discovery potential.",
  },
];

export default function ToolboxView() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"All" | DirectoryItem["category"]>("All");

  const categories: Array<"All" | DirectoryItem["category"]> = ["All", "Launch", "Community", "Directory"];

  const filtered = directories.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || d.category === category;
    return matchesSearch && matchesCategory;
  });

  const grouped = filtered.reduce<Record<DirectoryItem["category"], DirectoryItem[]>>(
    (acc, item) => {
      acc[item.category].push(item);
      return acc;
    },
    { Launch: [], Community: [], Directory: [] }
  );

  const highImpact = directories.filter((d) => d.impact === "High" || d.impact === "Very High").length;
  const easyWins = directories.filter((d) => d.difficulty === "Easy").length;

  const categoryTone: Record<DirectoryItem["category"], string> = {
    Launch: theme.palette.primary.main,
    Community: theme.palette.secondary.main,
    Directory: "#F59E0B",
  };

  return (
    <Box sx={{ pt: 2, pb: 8 }}>
      <Stack spacing={3.5}>
        <PageHeader
          title="SEO Toolbox"
          description="Find launch platforms, communities, and directories to earn backlinks, drive traffic, and get early users."
        />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                borderRadius: "18px",
                border: "1px solid",
                borderColor: alpha(theme.palette.divider, isDark ? 0.65 : 1),
                boxShadow: "none",
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <PublicIcon sx={{ color: "primary.main" }} />
                  <Box>
                    <Typography variant="h5" fontWeight={900}>
                      {directories.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total platforms
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                borderRadius: "18px",
                border: "1px solid",
                borderColor: alpha(theme.palette.divider, isDark ? 0.65 : 1),
                boxShadow: "none",
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <TrendingUpIcon sx={{ color: "secondary.main" }} />
                  <Box>
                    <Typography variant="h5" fontWeight={900}>
                      {highImpact}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      High-impact options
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                borderRadius: "18px",
                border: "1px solid",
                borderColor: alpha(theme.palette.divider, isDark ? 0.65 : 1),
                boxShadow: "none",
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <BoltIcon sx={{ color: "warning.main" }} />
                  <Box>
                    <Typography variant="h5" fontWeight={900}>
                      {easyWins}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Easy wins first
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card
          sx={{
            borderRadius: "22px",
            border: "1px solid",
            borderColor: alpha(theme.palette.divider, isDark ? 0.65 : 1),
            boxShadow: "none",
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                placeholder="Search by platform, category, or use case..."
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
                    borderRadius: "14px",
                    bgcolor: alpha(theme.palette.background.paper, isDark ? 0.7 : 0.95),
                    "& fieldset": {
                      borderColor: alpha(theme.palette.divider, isDark ? 0.8 : 1),
                    },
                    "&:hover fieldset": {
                      borderColor: alpha(theme.palette.primary.main, 0.45),
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />

              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {categories.map((item) => (
                  <Chip
                    key={item}
                    label={item}
                    clickable
                    onClick={() => setCategory(item)}
                    sx={{
                      borderRadius: "10px",
                      fontWeight: 700,
                      px: 0.5,
                      bgcolor:
                        category === item
                          ? alpha(theme.palette.primary.main, isDark ? 0.32 : 0.16)
                          : alpha(theme.palette.text.primary, isDark ? 0.14 : 0.06),
                      color: category === item ? "text.primary" : "text.secondary",
                      "&:hover": {
                        bgcolor:
                          category === item
                            ? alpha(theme.palette.primary.main, isDark ? 0.4 : 0.22)
                            : alpha(theme.palette.text.primary, isDark ? 0.2 : 0.1),
                      },
                    }}
                  />
                ))}
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {filtered.length === 0 ? (
          <Card sx={{ borderRadius: "20px", border: "1px dashed", borderColor: "divider", boxShadow: "none" }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={800} gutterBottom>
                No matches found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try a broader keyword or switch back to All categories.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={3}>
            {(Object.keys(grouped) as DirectoryItem["category"][])
              .filter((group) => grouped[group].length > 0)
              .map((group) => (
                <Box key={group}>
                  <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 1.5 }}>
                    <Chip
                      label={group}
                      size="small"
                      sx={{
                        borderRadius: "8px",
                        bgcolor: alpha(categoryTone[group], 0.12),
                        color: categoryTone[group],
                        fontWeight: 800,
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {grouped[group].length} platform{grouped[group].length > 1 ? "s" : ""}
                    </Typography>
                  </Stack>

                  <Grid container spacing={2}>
                    {grouped[group].map((item) => (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.name}>
                        <Card
                          sx={{
                            height: "100%",
                            borderRadius: "16px",
                            border: "1px solid",
                            borderColor: "divider",
                            boxShadow: "none",
                            "&:hover": {
                              borderColor: alpha(theme.palette.primary.main, isDark ? 0.4 : 0.3),
                            },
                          }}
                        >
                          <CardContent sx={{ p: 2.25, display: "flex", flexDirection: "column", height: "100%" }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                              <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.25 }}>
                                {item.name}
                              </Typography>
                              <MuiLink href={item.url} target="_blank" rel="noopener noreferrer" color="inherit">
                                <LaunchIcon sx={{ fontSize: 18, opacity: 0.55, "&:hover": { opacity: 1 } }} />
                              </MuiLink>
                            </Stack>

                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                              {item.description}
                            </Typography>

                            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mb: 1.5 }}>
                              <Chip
                                label={`Impact: ${item.impact}`}
                                size="small"
                                sx={{
                                  borderRadius: "8px",
                                  fontWeight: 700,
                                  bgcolor: alpha(theme.palette.text.primary, isDark ? 0.14 : 0.06),
                                  color: "text.secondary",
                                }}
                              />
                              <Chip
                                label={`Difficulty: ${item.difficulty}`}
                                size="small"
                                sx={{
                                  borderRadius: "8px",
                                  fontWeight: 700,
                                  bgcolor: alpha(theme.palette.text.primary, isDark ? 0.14 : 0.06),
                                  color: "text.secondary",
                                }}
                              />
                            </Stack>

                            <Button
                              variant="contained"
                              component="a"
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              endIcon={<LaunchIcon />}
                              sx={{ borderRadius: "11px", textTransform: "none", fontWeight: 800 }}
                            >
                              Open Platform
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
          </Stack>
        )}

        <Card
          sx={{
            borderRadius: "22px",
            border: "1px solid",
            borderColor: alpha(theme.palette.divider, isDark ? 0.75 : 1),
            background: alpha(theme.palette.background.paper, isDark ? 0.9 : 1),
            color: "text.primary",
            boxShadow: "none",
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }}>
              <Box>
                <Typography variant="h5" fontWeight={900} sx={{ mb: 0.75 }}>
                  Want this as a weekly action plan?
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", maxWidth: 680 }}>
                  Upgrade to auto-track launches, monitor backlink gains, and get a prioritized outreach checklist each week.
                </Typography>
              </Box>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ width: { xs: "100%", md: "auto" } }}>
                <Button href="/dashboard" variant="contained" sx={{ borderRadius: "10px", fontWeight: 800, textTransform: "none" }}>
                  Open Dashboard
                </Button>
                <Button
                  href="/#pricing"
                  variant="outlined"
                  sx={{
                    borderRadius: "10px",
                    fontWeight: 800,
                    textTransform: "none",
                    color: "text.primary",
                    borderColor: alpha(theme.palette.divider, isDark ? 0.9 : 1),
                    "&:hover": {
                      borderColor: alpha(theme.palette.primary.main, 0.55),
                      bgcolor: alpha(theme.palette.primary.main, isDark ? 0.14 : 0.08),
                    },
                  }}
                >
                  View Plans
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
