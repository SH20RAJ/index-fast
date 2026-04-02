"use client";
import React from "react";
import { Box, Container, Typography, Stack, alpha, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid2";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from "@mui/icons-material/Language";

const tools = [
  {
    title: "Sitemap Health",
    desc: "Scan for 404s and broken links that waste crawl budget.",
    icon: <LanguageIcon />,
    color: "#111111"
  },
  {
    title: "Key Verifier",
    desc: "Validate your IndexNow and Bing credentials instantly.",
    icon: <VerifiedUserIcon />,
    color: "#111111"
  },
  {
    title: "AI Analysis",
    desc: "Preview how AI crawlers parse and interpret your pages.",
    icon: <SearchIcon />,
    color: "#111111"
  }
];

export default function FreeTools() {
  const theme = useTheme();
  
  return (
    <Box id="free-tools" sx={{ py: { xs: 10, md: 16 }, bgcolor: "background.paper" }}>
      <Container maxWidth="lg">
        <Stack spacing={2} mb={10} alignItems="center" textAlign="center">
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
              Public Utilities
            </Typography>
          </Box>
          <Typography variant="h2" sx={{ fontWeight: 900, color: "text.primary", letterSpacing: "-0.03em" }}>
            Free diagnostic tools
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: "600px", mx: "auto", fontSize: "1.1rem", lineHeight: 1.6 }}>
            Uncover indexing blockers immediately with our focused SEO diagnostic utilities.
          </Typography>
        </Stack>

        <Grid container spacing={4}>
          {tools.map((tool) => (
            <Grid size={{ xs: 12, md: 4 }} key={tool.title}>
              <Box
                sx={{
                  p: { xs: 4, md: 5 },
                  height: "100%",
                  bgcolor: "background.default",
                  borderRadius: "12px",
                  border: `1px solid ${theme.palette.divider}`,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "primary.main",
                  }
                }}
              >
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: "8px", 
                  border: `1px solid ${theme.palette.divider}`,
                  color: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 4
                }}>
                  {React.cloneElement(tool.icon as React.ReactElement<any>, { sx: { fontSize: 20 } })}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5, color: "text.primary", letterSpacing: "-0.01em" }}>
                  {tool.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", mb: 4, lineHeight: 1.6 }}>
                  {tool.desc}
                </Typography>
                <Typography 
                  variant="button" 
                  sx={{ 
                    color: "text.primary", 
                    fontWeight: 800, 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 1, 
                    textTransform: "none",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    "&:hover": {
                      opacity: 0.7
                    }
                  }}
                >
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
