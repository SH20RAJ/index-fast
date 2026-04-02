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

  return (
    <AppBar
      position="sticky"
      sx={{
        top: 0,
        bgcolor: mode === "dark" ? "background.default" : "white",
        backdropFilter: "blur(14px)",
        boxShadow: "none",
        borderBottom: `1px solid ${theme.palette.divider}`,
        zIndex: (theme) => theme.zIndex.appBar,
        transition: "all 0.2s ease",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            justifyContent: "space-between",
            height: 72,
          }}
        >
          {/* Logo */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.25}
            component={Link}
            href="/"
            sx={{
              textDecoration: "none",
              color: "inherit",
              "& svg": { color: "primary.main" },
              transition: "opacity 0.2s",
              "&:hover": { opacity: 0.8 },
            }}
          >
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
            <Typography
              variant="h6"
              sx={{
                fontSize: "1.1rem",
                fontWeight: 900,
                color: "text.primary",
                letterSpacing: "-0.02em",
                display: { xs: "none", sm: "block" }
              }}
            >
              IndexFast
            </Typography>
          </Stack>

          {/* Center Links */}
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              display: { xs: "none", md: "flex" },
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)"
            }}
          >
            {primaryLinks.map((item) => (
              <Button
                key={item.label}
                variant="text"
                component={Link}
                href={item.href}
                sx={{
                  borderRadius: "8px",
                  color: "text.secondary",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  px: 2,
                  "&:hover": {
                    bgcolor: alpha(theme.palette.text.primary, 0.04),
                    color: "text.primary",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>

          {/* Right Actions */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <IconButton
              aria-label="Toggle dark mode"
              onClick={toggleColorMode}
              size="small"
              sx={{
                width: 38,
                height: 38,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: "8px",
                color: mode === "dark" ? "secondary.main" : "text.secondary",
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
                sx={{
                  display: { xs: "none", sm: "inline-flex" },
                  bgcolor: "primary.main",
                  color: "white",
                  fontWeight: 700,
                }}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  component={Link}
                  href="/sign-in"
                  sx={{
                    color: "text.primary",
                    fontWeight: 700,
                    fontSize: "0.875rem",
                    display: { xs: "none", sm: "inline-flex" },
                    px: 2,
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="contained"
                  component={Link}
                  href="/sign-up"
                  sx={{
                    bgcolor: "primary.main",
                    color: mode === "dark" ? "black" : "white",
                    fontWeight: 800,
                    fontSize: "0.875rem",
                    px: 2.5,
                  }}
                >
                  Get Started
                </Button>
              </>
            )}

            <IconButton
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              sx={{ display: { xs: "inline-flex", md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
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
            width: "100%",
            maxWidth: 320,
            p: 3,
            bgcolor: "background.paper",
          },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight={900}>
            Navigation
          </Typography>
          <IconButton onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <CloseIcon />
          </IconButton>
        </Stack>

        <List sx={{ p: 0 }}>
          {primaryLinks.map((item) => (
            <ListItemButton
              key={item.label}
              component={Link}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              sx={{ borderRadius: "8px", mb: 0.5 }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: 700, fontSize: "1.1rem" }}
              />
            </ListItemButton>
          ))}
        </List>

        <Box sx={{ mt: "auto", pt: 4 }}>
          <Divider sx={{ mb: 3 }} />
          <Stack spacing={1.5}>
            {user ? (
              <Button
                variant="contained"
                fullWidth
                component={Link}
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  component={Link}
                  href="/sign-in"
                  variant="outlined"
                  fullWidth
                  sx={{ color: "text.primary", borderColor: "divider" }}
                >
                  Sign In
                </Button>
                <Button
                  component={Link}
                  href="/sign-up"
                  variant="contained"
                  fullWidth
                >
                  Get Started
                </Button>
              </>
            )}
          </Stack>
        </Box>
      </Drawer>
    </AppBar>
  );
}
