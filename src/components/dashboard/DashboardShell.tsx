"use client";

import { useState } from "react";
import { AppBar, Box, Container, IconButton, Stack, Toolbar, Typography, alpha, useTheme } from "@/components/ui/mui";
import { MenuIcon } from "@/components/icons/mui-icons";
import { LightModeRoundedIcon } from "@/components/icons/mui-icons";
import { DarkModeRoundedIcon } from "@/components/icons/mui-icons";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useColorMode } from "@/components/ThemeRegistry";

const SIDEBAR_WIDTH = 280;

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { mode, toggleColorMode } = useColorMode();

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: isDark
          ? "radial-gradient(circle at 100% 0%, rgba(14,165,233,0.08) 0%, rgba(14,165,233,0) 38%), #0B1220"
          : "radial-gradient(circle at 100% 0%, rgba(14,165,233,0.06) 0%, rgba(14,165,233,0) 34%), #F4F7FB",
      }}
    >
      <DashboardSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            display: { xs: "block", md: "none" },
            zIndex: (theme) => theme.zIndex.drawer + 1,
            bgcolor: alpha(theme.palette.background.paper, isDark ? 0.92 : 0.9),
            backdropFilter: "blur(8px)",
            borderBottom: "1px solid",
            borderColor: alpha(theme.palette.divider, isDark ? 0.42 : 0.6),
          }}
        >
          <Toolbar sx={{ minHeight: 64 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: "100%" }}>
              <Stack direction="row" spacing={1.25} alignItems="center">
                <IconButton edge="start" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
                  <MenuIcon />
                </IconButton>
                <Typography variant="subtitle1" fontWeight={800} color="text.primary">
                  IndexFast Command Center
                </Typography>
              </Stack>
              <IconButton
                onClick={toggleColorMode}
                aria-label="Toggle color mode"
                size="small"
                sx={{
                  width: 34,
                  height: 34,
                  border: "1px solid",
                  borderColor: alpha(theme.palette.divider, isDark ? 0.8 : 1),
                  color: mode === "dark" ? "secondary.main" : "primary.main",
                }}
              >
                {mode === "dark" ? <LightModeRoundedIcon sx={{ fontSize: 18 }} /> : <DarkModeRoundedIcon sx={{ fontSize: 18 }} />}
              </IconButton>
            </Stack>
          </Toolbar>
        </AppBar>

        <Container
          maxWidth={false}
          sx={{
            width: "100%",
            maxWidth: 1360,
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 3, md: 4 },
            pt: { xs: 3, md: 4 },
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
}
