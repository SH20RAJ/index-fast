"use client";
import { useState } from "react";
import { Box, Stack, useTheme, alpha, Typography, Button, Drawer, IconButton, Avatar, Collapse } from "@mui/material";
import { useUser, useStackApp } from "@stackframe/stack";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BoltIcon from "@mui/icons-material/Bolt";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LanguageIcon from "@mui/icons-material/Language";
import HistoryIcon from "@mui/icons-material/History";
import BuildIcon from "@mui/icons-material/Build";
import SettingsIcon from "@mui/icons-material/Settings";
import LinkIcon from "@mui/icons-material/Link";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useColorMode } from "@/components/ThemeRegistry";

const SIDEBAR_WIDTH = 280;

interface NavItem {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  children?: NavItem[];
  section?: string;
}

const navItems: NavItem[] = [
  { label: "Command Center", icon: <DashboardIcon />, href: "/dashboard", section: "Main" },
  {
    label: "Websites",
    icon: <LanguageIcon />,
    href: "/sites",
    section: "Main",
    children: [
      { label: "URLs & Submissions", icon: <LinkIcon />, href: "/sites/url" },
    ],
  },
  { label: "Submission Stream", icon: <HistoryIcon />, href: "/submissions", section: "Monitor" },
  { label: "SEO Toolbox", icon: <BuildIcon />, href: "/toolbox", section: "Tools" },
  { label: "Billing & Settings", icon: <SettingsIcon />, href: "/settings", section: "Account" },
];

interface DashboardSidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function DashboardSidebar({ mobileOpen, onMobileClose }: DashboardSidebarProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { mode, toggleColorMode } = useColorMode();
  const pathname = usePathname();
  const user = useUser();
  const stack = useStackApp();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(["Websites"]));

  const displayName = user?.displayName?.trim() || "User";
  const primaryEmail = user?.primaryEmail || "No email";
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const sidebarContent = (
    <Stack
      spacing={4}
      sx={{
        p: 2.25,
        height: "100%",
        color: "text.primary",
        bgcolor: theme.palette.background.paper,
        background: isDark
          ? "linear-gradient(180deg, rgba(14,165,233,0.06) 0%, rgba(14,165,233,0) 18%), #0F1627"
          : "linear-gradient(180deg, rgba(14,165,233,0.03) 0%, rgba(14,165,233,0) 16%), #F8FBFF",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
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
        <IconButton
          onClick={toggleColorMode}
          aria-label="Toggle color mode"
          size="small"
          sx={{
            width: 34,
            height: 34,
            border: "1px solid",
            borderColor: alpha(theme.palette.divider, isDark ? 0.8 : 1),
            bgcolor: alpha(theme.palette.background.paper, isDark ? 0.8 : 0.7),
            color: mode === "dark" ? "secondary.main" : "primary.main",
          }}
        >
          {mode === "dark" ? <LightModeRoundedIcon sx={{ fontSize: 18 }} /> : <DarkModeRoundedIcon sx={{ fontSize: 18 }} />}
        </IconButton>
      </Stack>

      <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
        {/* Group navigation items by section */}
        {Array.from(new Set(navItems.map(item => item.section))).map((section) => {
          const sectionItems = navItems.filter(item => item.section === section);
          return (
            <Box key={section}>
              {section !== navItems[0].section && (
                <Typography 
                  variant="overline" 
                  sx={{ 
                    px: 1.25,
                    color: "text.secondary", 
                    letterSpacing: "0.12em",
                    fontSize: "0.66rem",
                    mt: 0.75,
                    display: "block"
                  }}
                >
                  {section}
                </Typography>
              )}
              {section === navItems[0].section && (
                <Typography 
                  variant="overline" 
                  sx={{ 
                    px: 1.25,
                    color: "text.secondary", 
                    letterSpacing: "0.12em",
                    fontSize: "0.66rem",
                    mb: 0.35,
                    display: "block"
                  }}
                >
                  Workspace
                </Typography>
              )}
              <Stack spacing={0.5}>
                {sectionItems.map((item) => {
                  const hasChildren = item.children && item.children.length > 0;
                  const isExpanded = expandedItems.has(item.label);
                  const active = item.href ? (pathname === item.href || pathname.startsWith(`${item.href}/`)) : false;

                  return (
                    <Box key={item.label}>
                      <Button
                        component={hasChildren ? "button" : Link}
                        href={hasChildren ? undefined : item.href}
                        onClick={() => {
                          if (hasChildren) {
                            const newExpanded = new Set(expandedItems);
                            if (isExpanded) {
                              newExpanded.delete(item.label);
                            } else {
                              newExpanded.add(item.label);
                            }
                            setExpandedItems(newExpanded);
                          } else {
                            onMobileClose();
                          }
                        }}
                        startIcon={item.icon}
                        endIcon={hasChildren ? <ExpandMoreIcon sx={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} /> : undefined}
                        fullWidth
                        sx={{
                          justifyContent: "flex-start",
                          py: 1.1,
                          px: 1.25,
                          borderRadius: "10px",
                          color: active ? "text.primary" : "text.secondary",
                          bgcolor: active ? alpha(theme.palette.primary.main, isDark ? 0.2 : 0.12) : "transparent",
                          border: "1px solid",
                          borderColor: active ? alpha(theme.palette.primary.main, isDark ? 0.45 : 0.3) : "transparent",
                          textAlign: "left",
                          "& .MuiButton-startIcon": {
                            minWidth: 18,
                            marginLeft: 0,
                            marginRight: 1.15,
                          },
                          "& .MuiButton-endIcon": {
                            marginLeft: "auto",
                            marginRight: 0,
                          },
                          "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, isDark ? 0.28 : 0.16),
                            color: "text.primary",
                            borderColor: alpha(theme.palette.primary.main, isDark ? 0.6 : 0.38),
                          },
                          fontWeight: active ? 700 : 600,
                        }}
                      >
                        <Box component="span" sx={{ flexGrow: 1, textAlign: "left", lineHeight: 1.1 }}>
                          {item.label}
                        </Box>
                      </Button>
                      {hasChildren && (
                        <Collapse in={isExpanded} timeout="auto">
                          <Stack spacing={0.35} sx={{ pl: 3.1, pt: 0.35 }}>
                            {item.children!.map((child) => {
                              const childActive = child.href ? (pathname === child.href || pathname.startsWith(`${child.href}/`)) : false;
                              return (
                                <Button
                                  key={child.label}
                                  component={Link}
                                  href={child.href || "#"}
                                  startIcon={child.icon}
                                  onClick={onMobileClose}
                                  fullWidth
                                  sx={{
                                    justifyContent: "flex-start",
                                    py: 0.9,
                                    px: 1.15,
                                    borderRadius: "8px",
                                    color: childActive ? "text.primary" : "text.secondary",
                                    bgcolor: childActive ? alpha(theme.palette.primary.main, isDark ? 0.15 : 0.1) : "transparent",
                                    textAlign: "left",
                                    "& .MuiButton-startIcon": {
                                      minWidth: 16,
                                      marginLeft: 0,
                                      marginRight: 1,
                                    },
                                    "&:hover": {
                                      bgcolor: alpha(theme.palette.primary.main, isDark ? 0.22 : 0.14),
                                      color: "text.primary",
                                    },
                                    fontWeight: childActive ? 600 : 400,
                                    fontSize: "0.86rem",
                                  }}
                                >
                                  <Box component="span" sx={{ textAlign: "left", width: "100%" }}>
                                    {child.label}
                                  </Box>
                                </Button>
                              );
                            })}
                          </Stack>
                        </Collapse>
                      )}
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          );
        })}
      </Stack>

      <Stack
        spacing={1.25}
        sx={{
          pt: 2,
          borderTop: "1px solid",
          borderColor: alpha(theme.palette.divider, isDark ? 0.35 : 0.45),
        }}
      >
        <Box
          sx={{
            px: 1,
            py: 1,
            borderRadius: "12px",
            border: "1px solid",
            borderColor: alpha(theme.palette.divider, isDark ? 0.55 : 0.9),
            bgcolor: alpha(theme.palette.background.paper, isDark ? 0.55 : 0.8),
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.25}>
            <Avatar
              sx={{
                width: 38,
                height: 38,
                fontSize: 14,
                fontWeight: 800,
                bgcolor: alpha(theme.palette.primary.main, isDark ? 0.35 : 0.18),
                color: isDark ? "primary.light" : "primary.dark",
              }}
            >
              {initials}
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="body2" fontWeight={700} noWrap title={displayName}>
                {displayName}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
                title={primaryEmail}
                sx={{ display: "block", lineHeight: 1.3 }}
              >
                {primaryEmail}
              </Typography>
            </Box>
          </Stack>
        </Box>
        <Button
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={() => stack.signOut()}
          sx={{
            justifyContent: "flex-start",
            py: 1.2,
            px: 2,
            borderRadius: "12px",
            color: "text.secondary",
            bgcolor: alpha(theme.palette.error.main, isDark ? 0.08 : 0.05),
            border: "1px solid",
            borderColor: alpha(theme.palette.error.main, isDark ? 0.25 : 0.2),
            "&:hover": {
              bgcolor: alpha(theme.palette.error.main, isDark ? 0.15 : 0.1),
              color: theme.palette.error.main,
              borderColor: alpha(theme.palette.error.main, isDark ? 0.35 : 0.3),
            },
            fontWeight: 500,
            textTransform: "none",
          }}
        >
          Logout
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
