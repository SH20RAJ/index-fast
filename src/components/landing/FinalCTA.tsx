"use client";

import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { useStackApp } from "@stackframe/stack";

export default function FinalCTA() {
  const stack = useStackApp();

  return (
    <Box id="cta" sx={{ py: { xs: 8, md: 12 }, bgcolor: "white" }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            bgcolor: "#F9FAFB",
            borderRadius: "12px",
            p: { xs: 6, md: 8 },
            textAlign: "center",
            border: "1px solid #E5E7EB",
          }}
        >
          <Stack spacing={4} alignItems="center">
            <Stack spacing={1}>
              <Typography variant="h2" sx={{ fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>
                Ready to index your content?
              </Typography>
              <Typography variant="body1" sx={{ color: "#6B7280", maxWidth: "600px", mx: "auto", fontSize: "1.1rem" }}>
                Stop waiting for search engines to find your pages. Get discovered instantly.
              </Typography>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                variant="contained"
                size="large"
                onClick={() => stack.redirectToSignUp()}
                sx={{
                  py: 1.5,
                  px: 4,
                  fontSize: "1rem",
                  bgcolor: "#111827",
                  color: "white",
                  fontWeight: 600,
                  borderRadius: "8px",
                  "&:hover": { bgcolor: "#1F2937" },
                }}
              >
                Join now for free
              </Button>
              <Button
                variant="outlined"
                size="large"
                component="a"
                href="/pricing"
                sx={{
                  py: 1.5,
                  px: 4,
                  fontSize: "1rem",
                  borderColor: "#E5E7EB",
                  color: "#111827",
                  fontWeight: 600,
                  borderRadius: "8px",
                  "&:hover": { borderColor: "#111827", bgcolor: "transparent" },
                }}
              >
                View pricing
              </Button>
            </Stack>

            <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 500 }}>
              No credit card required. Setup takes under 2 minutes.
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
