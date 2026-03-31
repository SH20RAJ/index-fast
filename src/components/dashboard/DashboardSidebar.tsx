"use client";
import { Box, Stack, useTheme, alpha, Typography, Button, Drawer } from "@mui/material";
import { useUser, useStackApp } from "@stackframe/stack";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BoltIcon from "@mui/icons-material/Bolt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LanguageIcon from "@mui/icons-material/Language";
import HistoryIcon from "@mui/icons-material/History";
import BuildIcon from "@mui/icons-material/Build";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

const SIDEBAR_WIDTH = 280;

const navItems = [
  { label: "Command Center", icon: <DashboardIcon />, href: "/dashboard" },
  { label: "Websites", icon: <LanguageIcon />, href: "/sites" },
  { label: "Submission Stream", icon: <HistoryIcon />, href: "/submissions" },
  { label: "SEO Toolbox", icon: <BuildIcon />, href: "/toolbox" },
  { label: "Billing & Settings", icon: <SettingsIcon />, href: "/settings" },
];

interface DashboardSidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function DashboardSidebar({ mobileOpen, onMobileClose }: DashboardSidebarProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const pathname = usePathname();
  const user = useUser();
  const stack = useStackApp();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const sidebarContent = (
    <Stack
      spacing={4}
      sx={{
        p: 3,
        height: "100%",
        color: "text.primary",
        bgcolor: theme.palette.background.paper,
        background: isDark
          ? "linear-gradient(180deg, rgba(14,165,233,0.06) 0%, rgba(14,165,233,0) 28%), linear-gradient(180deg, #151B2C 0%, #0F1627 100%)"
          : "linear-gradient(180deg, rgba(14,165,233,0.04) 0%, rgba(14,165,233,0) 28%), #F8FBFF",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        component={Link}
        href="/"
        sx={{ textDecoration: "none", color: "inherit" }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "8px",
            background: "linear-gradient(135deg, #0F766E 0%, #0EA5E9 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BoltIcon sx={{ color: "white", fontSize: 18 }} />
        </Box>
        <Typography variant="h6" fontWeight={900} color="text.primary">
          IndexFast
        </Typography>
      </Stack>

      <Stack spacing={1} sx={{ flexGrow: 1 }}>
        <Typography variant="overline" sx={{ px: 1.5, color: "text.secondary", letterSpacing: "0.08em" }}>
          Workspace
        </Typography>
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Button
              key={item.label}
              component={Link}
              href={item.href}
              startIcon={item.icon}
              fullWidth
              onClick={onMobileClose}
              sx={{
                justifyContent: "flex-start",
                py: 1.4,
                px: 2,
                borderRadius: "12px",
                color: active ? "text.primary" : "text.secondary",
                bgcolor: active ? alpha(theme.palette.primary.main, isDark ? 0.25 : 0.14) : "transparent",
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, isDark ? 0.35 : 0.18),
                  color: "text.primary",
                },
                fontWeight: active ? 700 : 500,
              }}
            >
              {item.label}
            </Button>
          );
        })}
      </Stack>

      <Stack
        spacing={2}
        sx={{
          pt: 2,
          borderTop: "1px solid",
          borderColor: alpha(theme.palette.divider, isDark ? 0.35 : 0.45),
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
                fontSize: "0.875rem",
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
            "&:hover": { bgcolor: alpha(theme.palette.error.main, isDark ? 0.2 : 0.08) },
          }}
        >
          Sign Out
        </Button>
      </Stack>
    </Stack>
  );

  return (
    <Box component="nav" sx={{ width: { md: SIDEBAR_WIDTH }, flexShrink: { md: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: "84vw",
            maxWidth: SIDEBAR_WIDTH,
            boxSizing: "border-box",
            borderRight: "1px solid",
            borderColor: alpha(theme.palette.divider, isDark ? 0.35 : 0.45),
            bgcolor: theme.palette.background.paper,
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: SIDEBAR_WIDTH,
            boxSizing: "border-box",
            borderRight: "1px solid",
            borderColor: alpha(theme.palette.divider, isDark ? 0.35 : 0.45),
            bgcolor: theme.palette.background.paper,
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    </Box>
  );
}
