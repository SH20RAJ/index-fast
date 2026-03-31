"use client";
import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  alpha,
} from "@mui/material";
import { useStackApp } from "@stackframe/stack";

export default function FinalCTA() {
  const stack = useStackApp();

  return (
    <Box id="cta" sx={{ py: 15, bgcolor: "white" }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            bgcolor: "primary.main",
            borderRadius: { xs: "40px", md: "64px" },
            p: { xs: 6, md: 12 },
            textAlign: "center",
            color: "white",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(124, 58, 237, 0.25)"
          }}
        >
          {/* Abstract background shapes */}
          <Box sx={{ position: "absolute", top: -100, right: -100, width: 300, height: 300, borderRadius: "50%", bgcolor: alpha("#ffffff", 0.1) }} />
          <Box sx={{ position: "absolute", bottom: -50, left: -50, width: 200, height: 200, borderRadius: "50%", bgcolor: alpha("#ffffff", 0.05) }} />

          <Stack spacing={4} alignItems="center" sx={{ position: "relative" }}>
            <Typography variant="h2" sx={{ fontWeight: 900, mb: 1, color: "white" }}>
              Ready to get your site
              <br />
              <Box component="span" sx={{ color: "secondary.main", fontFamily: '"Patrick Hand", cursive', rotate: "2deg", display: "inline-block", mx: 1 }}>indexed?</Box>
            </Typography>

            <Typography variant="body1" sx={{ maxWidth: 500, opacity: 0.9, fontSize: "1.1rem" }}>
              Join thousands of experts already using IndexFast to automate their SEO growth. Start your trial today.
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={() => stack.redirectToSignUp()}
              sx={{
                py: 2.5,
                px: 6,
                fontSize: "1.2rem",
                bgcolor: "secondary.main",
                color: "text.primary",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                "&:hover": {
                  bgcolor: "secondary.light",
                  transform: "scale(1.05)",
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
                }
              }}
            >
              Start Indexing Now
            </Button>

            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              No credit card required. Cancel any time.
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
