"use client";

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
    <Box id="cta" sx={{ py: { xs: 10, md: 14 }, bgcolor: "background.default" }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.14 : 0.04),
            borderRadius: { xs: "28px", md: "40px" },
            p: { xs: 6, md: 12 },
            textAlign: "center",
            color: "text.primary",
            position: "relative",
            overflow: "hidden",
            boxShadow: (theme) => theme.palette.mode === "dark" ? "0 20px 60px rgba(0,0,0,0.22)" : "0 20px 60px rgba(15,23,42,0.06)",
            border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.8)}`,
          }}
        >
          <Stack spacing={3} alignItems="center" sx={{ position: "relative" }}>
            <Typography variant="h2" sx={{ fontWeight: 900, mb: 1, color: "text.primary", maxWidth: 880 }}>
              Ready to make every publish discoverable?
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={() => stack.redirectToSignUp()}
              sx={{
                py: 2.2,
                px: 5,
                fontSize: "1.05rem",
                bgcolor: "primary.main",
                color: "common.white",
                boxShadow: "0 16px 40px rgba(15, 23, 42, 0.12)",
                "&:hover": {
                  bgcolor: "primary.dark",
                  boxShadow: "0 20px 44px rgba(15, 23, 42, 0.16)",
                },
              }}
            >
              Start your free indexing workflow
            </Button>

            <Typography variant="caption" color="text.secondary">
              No credit card required. Setup usually takes under 5 minutes.
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
