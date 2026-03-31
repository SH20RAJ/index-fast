"use client";
import * as React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  alpha,
} from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import { useStackApp } from "@stackframe/stack";

export default function Hero() {
  const stack = useStackApp();

  return (
    <Box
      sx={{
        py: { xs: 12, md: 24 },
        textAlign: "center",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={4} alignItems="center">
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: "4px",
              bgcolor: alpha("#6366F1", 0.1),
              color: "#6366F1",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            v2.0 is now live
          </Box>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "3rem", md: "5rem" },
              letterSpacing: "-0.04em",
              lineHeight: 1,
              fontWeight: 800,
            }}
          >
            Index your site <br /> faster than ever.
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              fontWeight: 400,
              maxWidth: "600px",
              lineHeight: 1.6,
            }}
          >
            Automated search engine submission for modern content. Stop waiting weeks for crawlers. Get discovered instantly.
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ pt: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => stack.signUp()}
              sx={{ px: 4, py: 1.5, borderRadius: "6px", boxShadow: "none" }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ px: 4, py: 1.5, borderRadius: "6px", color: "text.primary", borderColor: "rgba(255, 255, 255, 0.2)" }}
            >
              View Documentation
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
