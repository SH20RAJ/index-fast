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
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.9 : 0.95),
            borderRadius: { xs: "34px", md: "52px" },
            p: { xs: 6, md: 12 },
            textAlign: "center",
            color: "white",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(124, 58, 237, 0.3)",
            border: (theme) => `1px solid ${alpha(theme.palette.primary.light, 0.5)}`,
          }}
        >
              bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.18 : 0.04),
          <Box sx={{ position: "absolute", top: -100, right: -100, width: 300, height: 300, borderRadius: "50%", bgcolor: alpha("#ffffff", 0.1) }} />
          <Box sx={{ position: "absolute", bottom: -50, left: -50, width: 200, height: 200, borderRadius: "50%", bgcolor: alpha("#ffffff", 0.05) }} />

              color: "text.primary",
            <Typography variant="h2" sx={{ fontWeight: 900, mb: 1, color: "white" }}>
              Ready to make every publish
              boxShadow: (theme) => theme.palette.mode === "dark" ? "0 20px 60px rgba(0,0,0,0.24)" : "0 20px 60px rgba(15,23,42,0.06)",
              border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.8)}`,
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={() => stack.redirectToSignUp()}
                <Box component="span" sx={{ color: "secondary.main", display: "inline-block", mx: 1 }}>discoverable?</Box>
                py: 2.5,
                px: 6,
                fontSize: "1.2rem",
                bgcolor: "primary.main",
                color: "common.white",
                boxShadow: "0 20px 40px rgba(15, 23, 42, 0.12)",
                "&:hover": {
                  bgcolor: "primary.dark",
                  boxShadow: "0 25px 50px rgba(15, 23, 42, 0.16)",
                }
              }}
            >
              Start your free indexing workflow
            </Button>

            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              No credit card required. Setup usually takes under 5 minutes.
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
