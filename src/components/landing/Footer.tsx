"use client";
import {
  Box,
  Container,
  Typography,
  Stack,
  IconButton,
  Divider,
  alpha,
} from "@mui/material";
import Link from "next/link";
import BoltIcon from "@mui/icons-material/Bolt";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

export default function Footer() {
  return (
    <Box sx={{ bgcolor: "background.paper", pt: 10, pb: 6, borderTop: (theme) => `1px solid ${alpha(theme.palette.divider, 0.9)}` }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={4}>
          <Stack spacing={3}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                    bgcolor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BoltIcon sx={{ color: "white", fontSize: 20 }} />
              </Box>
              <Typography variant="h6" fontWeight="900" color="text.primary">
                IndexFast
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
              Built for teams that treat indexing as revenue infrastructure, not a side task.
            </Typography>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={4} sx={{ width: { xs: "100%", md: "auto" } }}>
            <Stack spacing={2}>
              <Typography variant="subtitle2" fontWeight="bold">Product</Typography>
              <Typography variant="body2" color="text.secondary" component={Link} href="/" sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}>Home</Typography>
              <Typography variant="body2" color="text.secondary" component={Link} href="/blog" sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}>Blog</Typography>
              <Typography variant="body2" color="text.secondary" component={Link} href="/tools" sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}>Tools</Typography>
              <Typography variant="body2" color="text.secondary" component={Link} href="/#features" sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}>Features</Typography>
              <Typography variant="body2" color="text.secondary" component={Link} href="/#pricing" sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}>Pricing</Typography>
              <Typography variant="body2" color="text.secondary" component={Link} href="/contact" sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}>Contact</Typography>
              <Typography variant="body2" color="text.secondary" component={Link} href="/#how-it-works" sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}>How it works</Typography>
              <Typography variant="body2" color="text.secondary" component={Link} href="/#faq" sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}>FAQ</Typography>
            </Stack>
            <Stack spacing={2}>
              <Typography variant="subtitle2" fontWeight="bold">Company</Typography>
              <Typography variant="body2" color="text.secondary" component={Link} href="/status" sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}>Status</Typography>
              <Typography variant="body2" color="text.secondary" component={Link} href="/privacy" sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}>Privacy</Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ alignSelf: { xs: "flex-start", md: "center" } }}>
            <IconButton size="small" sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05), "&:hover": { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) } }}>
              <TwitterIcon fontSize="small" sx={{ color: "text.primary" }} />
            </IconButton>
            <IconButton size="small" sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05), "&:hover": { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) } }}>
              <GitHubIcon fontSize="small" sx={{ color: "text.primary" }} />
            </IconButton>
            <IconButton size="small" sx={{ bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05), "&:hover": { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) } }}>
              <LinkedInIcon fontSize="small" sx={{ color: "text.primary" }} />
            </IconButton>
          </Stack>
        </Stack>

        <Divider sx={{ my: 6, borderColor: (theme) => alpha(theme.palette.divider, 0.9) }} />

        <Box textAlign="center">
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} IndexFast. Built for speed and visibility.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
