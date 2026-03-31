"use client";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  Stack,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  IconButton,
  alpha,
  useTheme,
} from "@mui/material";
import { useUser } from "@stackframe/stack";
import Link from "next/link";
import BoltIcon from "@mui/icons-material/Bolt";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useColorMode } from "@/components/ThemeRegistry";
import { useState } from "react";

export default function Navbar() {
  const user = useUser();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mode, toggleColorMode } = useColorMode();

  const primaryLinks = [
    { label: "Tools", href: "/tools" },
    { label: "Blog", href: "/blog" },
    { label: "Pricing", href: "/#pricing" },
  ];

  const secondaryLinks = [
    { label: "Contact", href: "/contact" },
    { label: "Status", href: "/status" },
    { label: "Privacy", href: "/privacy" },
  ];

  return (
    <AppBar
      position="sticky"
      sx={{
        top: 0,
        bgcolor: alpha(theme.palette.background.default, mode === "dark" ? 0.82 : 0.85),
        backdropFilter: "blur(10px)",
        boxShadow: "none",
        borderBottom: `1px solid ${theme.palette.divider}`,
        zIndex: (theme) => theme.zIndex.appBar,
        py: 1,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            justifyContent: "space-between",
            bgcolor: "background.paper",
            px: { xs: 2, sm: 4 },
            py: 1,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow:
              mode === "dark"
                ? "0 8px 30px rgba(0, 0, 0, 0.45)"
                : "0 8px 30px rgba(124, 58, 237, 0.05)",
          }}
        >
          {/* Logo */}
          <Stack direction="row" alignItems="center" spacing={1.5} component={Link} href="/" sx={{ textDecoration: "none", color: "inherit" }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: "10px",
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BoltIcon sx={{ color: "white", fontSize: 20 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                color: "text.primary",
                display: { xs: "none", sm: "block" }
              }}
            >
              IndexFast
            </Typography>
          </Stack>

          {/* Links */}
          <Stack direction="row" sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            {primaryLinks.map((item) => (
              <Button
                key={item.label}
                variant="text"
                component={Link}
                href={item.href}
                sx={{
                  borderRadius: "9999px",
                  color: "text.secondary",
                  border: "1px solid transparent",
                  px: 2,
                  "&:hover": {
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: "primary.main",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>

          {/* Auth */}
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              sx={{ display: { xs: "inline-flex", md: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            <IconButton
              aria-label="Toggle dark mode"
              onClick={toggleColorMode}
              size="small"
              sx={{
                width: 34,
                height: 34,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: alpha(theme.palette.background.default, 0.6),
                color: mode === "dark" ? "secondary.main" : "primary.main",
              }}
            >
              {mode === "dark" ? (
                <LightModeRoundedIcon sx={{ fontSize: 18 }} />
              ) : (
                <DarkModeRoundedIcon sx={{ fontSize: 18 }} />
              )}
            </IconButton>

            {user ? (
              <Button
                variant="contained"
                component={Link}
                href="/dashboard"
                size="small"
                sx={{ display: { xs: "none", sm: "inline-flex" } }}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  component={Link}
                  href="/sign-in"
                  sx={{ color: "text.primary", fontWeight: 700, fontSize: "0.875rem", display: { xs: "none", sm: "inline-flex" } }}
                >
                  Sign In
                </Button>
                <Button
                  variant="contained"
                  component={Link}
                  href="/sign-up"
                  sx={{
                    bgcolor: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: { xs: 1.75, sm: 2.25 },
                  }}
                >
                  Get Started
                  <Box sx={{ width: 18, height: 18, borderRadius: "50%", bgcolor: alpha("#ffffff", 0.2), display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px" }}>↗</Box>
                </Button>
              </>
            )}
          </Stack>
        </Toolbar>
      </Container>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: 290,
            p: 2,
            bgcolor: "background.paper",
          },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="subtitle1" fontWeight={900}>
            Menu
          </Typography>
          <IconButton onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <CloseIcon />
          </IconButton>
        </Stack>
        <Divider sx={{ mb: 1.5 }} />
        <List sx={{ p: 0 }}>
          {primaryLinks.concat(secondaryLinks).map((item) => (
            <ListItemButton
              key={item.label}
              component={Link}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              sx={{ borderRadius: "10px" }}
            >
              <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 700 }} />
            </ListItemButton>
          ))}
        </List>
        <Divider sx={{ my: 1.5 }} />
        <Stack spacing={1.2}>
          {user ? (
            <Button variant="contained" component={Link} href="/dashboard" onClick={() => setMobileOpen(false)}>
              Open Dashboard
            </Button>
          ) : (
            <>
              <Button component={Link} href="/sign-in" variant="outlined">
                Sign In
              </Button>
              <Button component={Link} href="/sign-up" variant="contained">
                Get Started
              </Button>
            </>
          )}
        </Stack>
      </Drawer>
    </AppBar>
  );
}
