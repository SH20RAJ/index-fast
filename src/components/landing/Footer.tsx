"use client";
import * as React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  IconButton,
  Divider,
} from "@mui/material";
import Link from "next/link";
import BoltIcon from "@mui/icons-material/Bolt";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

export default function Footer() {
  return (
    <Box sx={{ bgcolor: "background.default", pt: 10, pb: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <BoltIcon sx={{ color: "white", fontSize: 20 }} />
                </Box>
                <Typography variant="h6" fontWeight="800">
                  IndexFast
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
                Accelerating the web one URL at a time. The world's fastest indexing solution for modern SEO.
              </Typography>
              <Stack direction="row" spacing={1}>
                <IconButton size="small" color="inherit">
                  <TwitterIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" color="inherit">
                  <GitHubIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" color="inherit">
                  <LinkedInIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
          </Grid>
          
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle2" fontWeight="bold" mb={3}>Product</Typography>
            <Stack spacing={2}>
              <Typography variant="body2" color="text.secondary" component={Link} href="#" sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}>Features</Typography>
              <Typography variant="body2" color="text.secondary" component={Link} href="#" sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}>Pricing</Typography>
              <Typography variant="body2" color="text.secondary" component={Link} href="#" sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}>API</Typography>
              <Typography variant="body2" color="text.secondary" component={Link} href="#" sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}>Changelog</Typography>
            </Stack>
          </Grid>

          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle2" fontWeight="bold" mb={3}>Company</Typography>
            <Stack spacing={2}>
              <Typography variant="body2" color="text.secondary" component={Link} href="#" sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}>About</Typography>
              <Typography variant="body2" color="text.secondary" component={Link} href="#" sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}>Careers</Typography>
              <Typography variant="body2" color="text.secondary" component={Link} href="#" sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}>Privacy</Typography>
              <Typography variant="body2" color="text.secondary" component={Link} href="#" sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}>Terms</Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={4} md={4}>
            <Typography variant="subtitle2" fontWeight="bold" mb={3}>Newsletter</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Get indexing tips and strategy updates directly to your inbox.
            </Typography>
            {/* Minimal newsletter mockup or simple text */}
            <Typography variant="caption" color="text.secondary">
              Coming soon.
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 6, borderColor: "rgba(255, 255, 255, 0.05)" }} />
        
        <Box textAlign="center">
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} IndexFast. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
