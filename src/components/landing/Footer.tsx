"use client";
import {
  Box,
  Container,
  Typography,
  Stack,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import BoltIcon from "@mui/icons-material/Bolt";

export default function Footer() {
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: "background.default", pt: 10, pb: 8, borderTop: `1px solid ${theme.palette.divider}` }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "flex-start" }}
          spacing={6}
        >
          <Stack spacing={3} sx={{ maxWidth: 400 }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "6px",
                  bgcolor: "text.primary",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BoltIcon sx={{ color: "background.default", fontSize: 20 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: "text.primary", letterSpacing: "-0.02em" }}>
                IndexFast
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6, fontSize: "1rem" }}>
              The high-velocity URL submission system built for SEO operators and growth teams. Ship faster, rank earlier.
            </Typography>
          </Stack>

          <Stack direction="row" spacing={{ xs: 3, md: 6 }} sx={{ flexWrap: "wrap", rowGap: 4 }}>
            <Stack spacing={2}>
              <Typography variant="caption" sx={{ fontWeight: 900, color: "text.primary", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Platform
              </Typography>
              <Stack spacing={1.5}>
                <Link href="/" style={{ textDecoration: "none" }}>
                  <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500, "&:hover": { color: "primary.main" } }}>Home</Typography>
                </Link>
                <Link href="/pricing" style={{ textDecoration: "none" }}>
                  <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500, "&:hover": { color: "primary.main" } }}>Pricing</Typography>
                </Link>
                <Link href="/blog" style={{ textDecoration: "none" }}>
                  <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500, "&:hover": { color: "primary.main" } }}>Insights</Typography>
                </Link>
              </Stack>
            </Stack>

            <Stack spacing={2}>
              <Typography variant="caption" sx={{ fontWeight: 900, color: "text.primary", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Legal
              </Typography>
              <Stack spacing={1.5}>
                <Link href="/privacy" style={{ textDecoration: "none" }}>
                  <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500, "&:hover": { color: "primary.main" } }}>Privacy Policy</Typography>
                </Link>
                <Link href="/terms" style={{ textDecoration: "none" }}>
                  <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500, "&:hover": { color: "primary.main" } }}>Terms of Service</Typography>
                </Link>
              </Stack>
            </Stack>

            <Stack spacing={2}>
              <Typography variant="caption" sx={{ fontWeight: 900, color: "text.primary", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Support
              </Typography>
              <Stack spacing={1.5}>
                <Link href="/contact" style={{ textDecoration: "none" }}>
                  <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500, "&:hover": { color: "primary.main" } }}>Contact Us</Typography>
                </Link>
              </Stack>
            </Stack>
          </Stack>
        </Stack>

        <Box sx={{ mt: 10, pt: 4, borderTop: `1px solid ${theme.palette.divider}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>
            © {new Date().getFullYear()} IndexFast Inc.
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500 }}>
            Crafted for search visibility.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
