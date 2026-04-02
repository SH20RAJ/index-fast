"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import { useStackApp } from "@stackframe/stack";

export default function FinalCTA() {
  const stack = useStackApp();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box id="cta" sx={{ py: { xs: 10, md: 16 }, bgcolor: "background.default" }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            bgcolor: isDark ? "background.paper" : "black",
            borderRadius: "16px",
            p: { xs: 6, md: 10 },
            textAlign: "center",
            border: `1px solid ${isDark ? theme.palette.divider : "rgba(255,255,255,0.1)"}`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle background decoration */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <Stack spacing={5} alignItems="center" sx={{ position: "relative" }}>
            <Stack spacing={2}>
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 900, 
                  color: "white", 
                  letterSpacing: "-0.04em",
                  fontSize: { xs: "2.5rem", md: "3.5rem" }
                }}
              >
                Ready to index your content?
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: "rgba(255,255,255,0.6)", 
                  maxWidth: "600px", 
                  mx: "auto", 
                  fontSize: "1.2rem",
                  lineHeight: 1.6
                }}
              >
                Stop waiting for search engines to find your pages. Get discovered instantly with the world's most reliable indexing system.
              </Typography>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                variant="contained"
                size="large"
                onClick={() => stack.redirectToSignUp()}
                sx={{
                  py: 2,
                  px: 5,
                  fontSize: "1rem",
                  bgcolor: "white",
                  color: "black",
                  fontWeight: 800,
                  borderRadius: "8px",
                  textTransform: "none",
                  "&:hover": { 
                    bgcolor: "rgba(255,255,255,0.9)",
                  },
                }}
              >
                Get Started Free
              </Button>
              <Button
                variant="outlined"
                size="large"
                component="a"
                href="/pricing"
                sx={{
                  py: 2,
                  px: 5,
                  fontSize: "1rem",
                  borderColor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: 800,
                  borderRadius: "8px",
                  textTransform: "none",
                  "&:hover": { 
                    borderColor: "white", 
                    bgcolor: "rgba(255,255,255,0.05)" 
                  },
                }}
              >
                View Pricing
              </Button>
            </Stack>

            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.02em" }}>
              NO CREDIT CARD REQUIRED • SETUP IN 2 MINUTES • CANCEL ANYTIME
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
