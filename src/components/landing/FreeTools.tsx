"use client";
import { Box, Container, Grid, Typography, Stack, alpha } from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from "@mui/icons-material/Language";

const tools = [
  {
    title: "Sitemap Health",
    desc: "Scan for 404s and broken links that waste crawl budget.",
    icon: <LanguageIcon />,
    color: "#111827"
  },
  {
    title: "Key Verifier",
    desc: "Validate your IndexNow and Bing credentials instantly.",
    icon: <VerifiedUserIcon />,
    color: "#111827"
  },
  {
    title: "AI Analysis",
    desc: "Preview how AI crawlers parse and interpret your pages.",
    icon: <SearchIcon />,
    color: "#111827"
  }
];

export default function FreeTools() {
  return (
    <Box id="free-tools" sx={{ py: { xs: 8, md: 12 }, bgcolor: "white" }}>
      <Container maxWidth="lg">
        <Stack spacing={2} mb={8} textAlign="center">
          <Typography variant="h2" sx={{ fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>
            Free diagnostic tools
          </Typography>
          <Typography variant="body1" sx={{ color: "#6B7280", maxWidth: "600px", mx: "auto", fontSize: "1.1rem" }}>
            Uncover indexing blockers immediately with our free SEO utilities.
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          {tools.map((tool) => (
            <Grid size={{ xs: 12, md: 4 }} key={tool.title}>
              <Box
                sx={{
                  p: 4,
                  height: "100%",
                  bgcolor: "white",
                  borderRadius: "12px",
                  border: "1px solid #E5E7EB",
                  "&:hover": {
                    borderColor: "#111827",
                  }
                }}
              >
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: "8px", 
                  bgcolor: "#F3F4F6", 
                  color: "#111827",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2.5
                }}>
                  {tool.icon}
                </Box>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 1, color: "#111827" }}>{tool.title}</Typography>
                <Typography variant="body2" sx={{ color: "#6B7280", mb: 3, lineHeight: 1.6 }}>{tool.desc}</Typography>
                <Typography variant="button" sx={{ color: "#111827", fontWeight: 600, display: "flex", alignItems: "center", gap: 1, textTransform: "none" }}>
                  Run audit <span>→</span>
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
