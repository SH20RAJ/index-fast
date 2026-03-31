"use client";

import { useState } from "react";
import { AppBar, Box, Container, IconButton, Stack, Toolbar, Typography, alpha } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const SIDEBAR_WIDTH = 280;

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F9FAFB" }}>
      <DashboardSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { md: `${SIDEBAR_WIDTH}px` },
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            display: { xs: "block", md: "none" },
            bgcolor: alpha("#ffffff", 0.9),
            backdropFilter: "blur(8px)",
            borderBottom: "1px solid",
            borderColor: alpha("#111827", 0.08),
          }}
        >
          <Toolbar sx={{ minHeight: 64 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: "100%" }}>
              <Stack direction="row" spacing={1.25} alignItems="center">
                <IconButton edge="start" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
                  <MenuIcon />
                </IconButton>
                <Typography variant="subtitle1" fontWeight={800} color="#111827">
                  IndexFast Dashboard
                </Typography>
              </Stack>
            </Stack>
          </Toolbar>
        </AppBar>

        <Container
          maxWidth="lg"
          sx={{
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 3, md: 4 },
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
}
