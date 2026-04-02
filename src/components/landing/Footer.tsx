"use client";
import {
  Box,
  Container,
  Typography,
  Stack,
  alpha,
} from "@mui/material";
import Link from "next/link";
import BoltIcon from "@mui/icons-material/Bolt";

export default function Footer() {
  return (
    <Box sx={{ bgcolor: "white", pt: 8, pb: 6, borderTop: "1px solid #E5E7EB" }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={4}
        >
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "4px",
                  bgcolor: "#111827",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BoltIcon sx={{ color: "white", fontSize: 16 }} />
              </Box>
              <Typography variant="body1" fontWeight="700" color="#111827">
                IndexFast
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: "#6B7280", maxWidth: 300 }}>
              Industrial-grade indexing infrastructure for modern search visibility.
            </Typography>
          </Stack>

          <Stack direction="row" spacing={3} sx={{ flexWrap: "wrap", rowGap: 1 }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <Typography variant="body2" sx={{ color: "#6B7280", "&:hover": { color: "#111827" } }}>Home</Typography>
            </Link>
            <Link href="/blog" style={{ textDecoration: "none" }}>
              <Typography variant="body2" sx={{ color: "#6B7280", "&:hover": { color: "#111827" } }}>Blog</Typography>
            </Link>
            <Link href="/pricing" style={{ textDecoration: "none" }}>
              <Typography variant="body2" sx={{ color: "#6B7280", "&:hover": { color: "#111827" } }}>Pricing</Typography>
            </Link>
            <Link href="/privacy" style={{ textDecoration: "none" }}>
              <Typography variant="body2" sx={{ color: "#6B7280", "&:hover": { color: "#111827" } }}>Privacy</Typography>
            </Link>
            <Link href="/contact" style={{ textDecoration: "none" }}>
              <Typography variant="body2" sx={{ color: "#6B7280", "&:hover": { color: "#111827" } }}>Contact</Typography>
            </Link>
          </Stack>
        </Stack>

        <Box sx={{ mt: 6, pt: 4, borderTop: "1px solid #F3F4F6", textAlign: "center" }}>
          <Typography variant="caption" sx={{ color: "#9CA3AF" }}>
            © {new Date().getFullYear()} IndexFast. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
