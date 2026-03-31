"use client";
import { Box, Stack, Container, useTheme, alpha, Typography, Button } from "@mui/material";
import { useUser, useStackApp } from "@stackframe/stack";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BoltIcon from "@mui/icons-material/Bolt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LanguageIcon from "@mui/icons-material/Language";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

const SIDEBAR_WIDTH = 280;

const navItems = [
  { label: "Overview", icon: <DashboardIcon />, href: "/dashboard" },
  { label: "Websites", icon: <LanguageIcon />, href: "/sites" },
  { label: "Submissions", icon: <HistoryIcon />, href: "/submissions" },
  { label: "Settings", icon: <SettingsIcon />, href: "/settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const pathname = usePathname();
  const user = useUser();
  const stack = useStackApp();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F9FAFB" }}>
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          borderRight: "1px solid",
          borderColor: alpha(theme.palette.divider, 0.08),
          bgcolor: "white",
          display: { xs: "none", md: "block" },
          position: "fixed",
          height: "100vh",
        }}
      >
        <Stack spacing={4} sx={{ p: 4, height: "100%" }}>
          {/* Logo */}
          <Stack direction="row" alignItems="center" spacing={1.5} component={Link} href="/" sx={{ textDecoration: "none", color: "inherit" }}>
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
              <BoltIcon sx={{ color: "white", fontSize: 18 }} />
            </Box>
            <Typography variant="h6" fontWeight={900}>IndexFast</Typography>
          </Stack>

          {/* Navigation */}
          <Stack spacing={1} sx={{ flexGrow: 1 }}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.label}
                  component={Link}
                  href={item.href}
                  startIcon={item.icon}
                  fullWidth
                  sx={{
                    justifyContent: "flex-start",
                    py: 1.5,
                    px: 2,
                    borderRadius: "12px",
                    color: isActive ? "primary.main" : "text.secondary",
                    bgcolor: isActive ? alpha(theme.palette.primary.main, 0.05) : "transparent",
                    "&:hover": {
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      color: "primary.main",
                    },
                    fontWeight: isActive ? 700 : 500,
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Stack>

          {/* User Section */}
          <Stack
            spacing={2}
            sx={{
              pt: 2,
              borderTop: "1px solid",
              borderColor: alpha(theme.palette.divider, 0.08),
            }}
          >
            {user && (
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ px: 1 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.875rem"
                  }}
                >
                  {user.displayName?.[0] || user.primaryEmail?.[0] || "U"}
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={700} noWrap>
                    {user.displayName || "User"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>
                    {user.primaryEmail}
                  </Typography>
                </Box>
              </Stack>
            )}
            <Button
              onClick={() => stack.signOut()}
              startIcon={<LogoutIcon />}
              fullWidth
              sx={{
                justifyContent: "flex-start",
                color: "error.main",
                "&:hover": { bgcolor: alpha(theme.palette.error.main, 0.05) },
              }}
            >
              Sign Out
            </Button>
          </Stack>
        </Stack>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { md: `${SIDEBAR_WIDTH}px` },
          p: { xs: 2, md: 4 },
          minHeight: "100vh",
        }}
      >
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>
    </Box>
  );
}
