"use client";

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

export default function Hero() {
  const theme = useTheme();
  const stack = useStackApp();

  return (
    <Box sx={{ pt: { xs: 8, md: 12 }, pb: { xs: 10, md: 15 }, textAlign: "center", position: "relative", overflow: "hidden" }}>
      {/* Decorative blobs/icons (mockup) */}
      <Box sx={{ position: "absolute", top: "10%", left: "5%", width: 80, height: 80, borderRadius: "50%", bgcolor: alpha(theme.palette.secondary.main, 0.2), zLong: -1 }} />
      <Box sx={{ position: "absolute", top: "15%", right: "10%", width: 60, height: 60, borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%", bgcolor: alpha(theme.palette.primary.main, 0.1), zIndex: -1 }} />

      <Container maxWidth="md">
        <Stack spacing={4} alignItems="center">
          <Box sx={{ position: "relative" }}>
            {/* Small avatar image placeholder */}
            <Box sx={{ width: 60, height: 60, borderRadius: "12px", bgcolor: "#E2E8F0", mb: 2, mx: "auto", overflow: "hidden" }}>
              <Box sx={{ width: "100%", height: "100%", bgcolor: theme.palette.primary.light, opacity: 0.5 }} />
            </Box>

            <Typography variant="h1" sx={{ fontSize: { xs: "2.5rem", md: "4.5rem" }, fontWeight: 900, lineHeight: 1.1, color: "#1F2937" }}>
              The best place to <br />
              <Box component="span" sx={{ color: "primary.main", fontFamily: '"Patrick Hand", cursive', rotate: "-3deg", display: "inline-block", mx: 1 }}>learn</Box>
              and
              <Box component="span" sx={{ color: "secondary.main", fontFamily: '"Patrick Hand", cursive', rotate: "2deg", display: "inline-block", mx: 1 }}>play</Box>
              <br /> for kids
            </Typography>
          </Box>

          <Typography variant="body1" sx={{ color: "text.secondary", fontSize: "1.125rem", maxWidth: "540px", mx: "auto", lineHeight: 1.6 }}>
            Discover thousands of fun and interactive learning activities to support your child's growth and learning process.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => stack.signUp()}
            sx={{
              py: 2,
              px: 5,
              fontSize: "1.1rem",
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              boxShadow: "0 20px 40px rgba(124, 58, 237, 0.25)",
              "&:hover": {
                bgcolor: "primary.dark",
                boxShadow: "0 25px 50px rgba(124, 58, 237, 0.35)",
              }
            }}
          >
            Get started
            <Box sx={{ width: 22, height: 22, borderRadius: "50%", bgcolor: alpha("#ffffff", 0.3), display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>↗</Box>
          </Button>

          {/* Social Proof / Small Illustration mock */}
          <Box sx={{ mt: 6, display: "flex", alignItems: "center", gap: 2, opacity: 0.7 }}>
            <Box sx={{ display: "flex", gap: -1 }}>
              {[1, 2, 3].map(i => (
                <Box key={i} sx={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid white", bgcolor: alpha(theme.palette.primary.main, i * 0.2) }} />
              ))}
            </Box>
            <Typography variant="caption" fontWeight="bold">Joined by 10k+ parents</Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
