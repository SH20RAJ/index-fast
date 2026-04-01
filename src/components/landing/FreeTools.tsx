"use client";
import { Box, Container, Grid, Typography, Stack, alpha, useTheme } from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from "@mui/icons-material/Language";

const tools = [
  {
    title: "IndexNow Key Verifier",
    desc: "Validate your key endpoint in seconds and catch delivery failures before they block submissions.",
    icon: <VerifiedUserIcon />,
    color: "#0F172A"
  },
  {
    title: "Sitemap Health Audit",
    desc: "Scan for 404s, redirects, and noindex leaks that silently drain crawl budget.",
    icon: <LanguageIcon />,
    color: "#0F172A"
  },
  {
    title: "AI Visibility Test",
    desc: "Preview how AI systems parse your pages and spot missing context before launch.",
    icon: <SearchIcon />,
    color: "#2563EB"
  }
];

export default function FreeTools() {
  const theme = useTheme();

  return (
    <Box id="free-tools" sx={{ py: { xs: 10, md: 14 }, bgcolor: "background.paper" }}>
      <Container maxWidth="lg">
        <Stack spacing={2} mb={7} textAlign="center">
          <Typography variant="overline" color="primary.main" fontWeight={800} sx={{ letterSpacing: "0.1em" }}>
            Free Conversion Tools
          </Typography>
          <Typography variant="h2" sx={{ fontWeight: 900, color: "text.primary" }}>
            Get quick wins before you even create an account
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: "680px", mx: "auto", lineHeight: 1.75 }}>
            Use these diagnostics to uncover indexing blockers immediately. Teams that run these checks first usually see cleaner submission acceptance on day one.
          </Typography>
        </Stack>

        <Grid container spacing={4}>
          {tools.map((tool) => (
            <Grid size={{ xs: 12, md: 4 }} key={tool.title}>
              <Box
                sx={{
                  p: 4,
                  height: "100%",
                  bgcolor: alpha(theme.palette.background.default, theme.palette.mode === "dark" ? 0.8 : 0.74),
                  borderRadius: "24px",
                  border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow:
                      theme.palette.mode === "dark"
                          ? "0 20px 40px rgba(0,0,0,0.28)"
                          : "0 20px 40px rgba(15,23,42,0.06)",
                      borderColor: alpha(theme.palette.primary.main, 0.12)
                  }
                }}
              >
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: "14px", 
                    bgcolor: alpha(tool.color, 0.06), 
                  color: tool.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3
                }}>
                  {tool.icon}
                </Box>
                <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>{tool.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>{tool.desc}</Typography>
                <Typography variant="button" color="primary.main" fontWeight={800} sx={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 1, opacity: 0.9 }}>
                  Run free audit <span>→</span>
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
