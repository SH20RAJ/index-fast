"use client";
import * as React from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  IconButton,
  Divider,
} from "@mui/material";
import Link from "next/link";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

export default function Footer() {
  return (
    <Box sx={{ bgcolor: "white", pt: 10, pb: 6, borderTop: "1px solid rgba(124, 58, 237, 0.05)" }}>
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
                <Typography variant="body2" sx={{ color: "white", fontWeight: 900 }}>W</Typography>
              </Box>
              <Typography variant="h6" fontWeight="900" color="#1F2937">
                WonderKids
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
              The best place to learn and play for kids. Helping children grow into well-rounded individuals.
            </Typography>
          </Stack>
          
          <Stack direction="row" spacing={4}>
            <Stack spacing={2}>
              <Typography variant="subtitle2" fontWeight="bold">Product</Typography>
              <Typography variant="body2" color="text.secondary" component={Link} href="#" sx={{ textDecoration: "none" }}>Shop</Typography>
              <Typography variant="body2" color="text.secondary" component={Link} href="#" sx={{ textDecoration: "none" }}>Features</Typography>
            </Stack>
            <Stack spacing={2}>
              <Typography variant="subtitle2" fontWeight="bold">Company</Typography>
              <Typography variant="body2" color="text.secondary" component={Link} href="#" sx={{ textDecoration: "none" }}>About Us</Typography>
              <Typography variant="body2" color="text.secondary" component={Link} href="#" sx={{ textDecoration: "none" }}>Contact</Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1}>
            <IconButton size="small" sx={{ bgcolor: "rgba(124, 58, 237, 0.05)", "&:hover": { bgcolor: "rgba(124, 58, 237, 0.1)" } }}>
              <TwitterIcon fontSize="small" sx={{ color: "primary.main" }} />
            </IconButton>
            <IconButton size="small" sx={{ bgcolor: "rgba(124, 58, 237, 0.05)", "&:hover": { bgcolor: "rgba(124, 58, 237, 0.1)" } }}>
              <GitHubIcon fontSize="small" sx={{ color: "primary.main" }} />
            </IconButton>
            <IconButton size="small" sx={{ bgcolor: "rgba(124, 58, 237, 0.05)", "&:hover": { bgcolor: "rgba(124, 58, 237, 0.1)" } }}>
              <LinkedInIcon fontSize="small" sx={{ color: "primary.main" }} />
            </IconButton>
          </Stack>
        </Stack>
        
        <Divider sx={{ my: 6, borderColor: "rgba(124, 58, 237, 0.05)" }} />
        
        <Box textAlign="center">
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} WonderKids. Created for learning and fun.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
