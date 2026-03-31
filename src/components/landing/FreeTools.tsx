"use client";
import { Box, Container, Grid, Typography, Stack, alpha, useTheme } from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from "@mui/icons-material/Language";

const tools = [
  {
    title: "IndexNow Key Verifier",
    desc: "Instantly check if your IndexNow key file is correctly served and reachable.",
    icon: <VerifiedUserIcon />,
    color: "#7C3AED"
  },
  {
    title: "Sitemap Health Audit",
    desc: "Scan your sitemap for 404s and noindex tags that waste your crawl budget.",
    icon: <LanguageIcon />,
    color: "#10B981"
  },
  {
    title: "AI Visibility Test",
    desc: "See exactly how LLMs (ChatGPT, Claude) read your page content.",
    icon: <SearchIcon />,
    color: "#3B82F6"
  }
];

export default function FreeTools() {
  const theme = useTheme();

  return (
    <Box id="free-tools" sx={{ py: 15, bgcolor: "background.paper" }}>
      <Container maxWidth="lg">
        <Stack spacing={2} mb={8} textAlign="center">
          <Typography variant="overline" color="primary.main" fontWeight={800} sx={{ letterSpacing: "0.1em" }}>
            Lead Magnets
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: 900, color: "text.primary" }}>
            Free SEO <Box component="span" sx={{ color: "primary.main" }}>Tools</Box>
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: "600px", mx: "auto" }}>
            No account required. Try our lightweight tools to diagnose your indexing issues in seconds.
          </Typography>
        </Stack>

        <Grid container spacing={4}>
          {tools.map((tool, idx) => (
            <Grid size={{ xs: 12, md: 4 }} key={idx}>
              <Box
                sx={{
                  p: 4,
                  height: "100%",
                  bgcolor: "background.default",
                  borderRadius: "32px",
                  border: `1px solid ${theme.palette.divider}`,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0 20px 40px rgba(0,0,0,0.35)"
                        : "0 20px 40px rgba(0,0,0,0.05)",
                    borderColor: alpha(tool.color, 0.2)
                  }
                }}
              >
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: "14px", 
                  bgcolor: alpha(tool.color, 0.1), 
                  color: tool.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3
                }}>
                  {tool.icon}
                </Box>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>{tool.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{tool.desc}</Typography>
                <Typography variant="button" color="primary.main" fontWeight={700} sx={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 1 }}>
                  Try Tool <span>→</span>
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
