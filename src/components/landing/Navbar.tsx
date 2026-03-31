"use client";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  Stack,
  alpha,
} from "@mui/material";
import { useStackApp, useUser } from "@stackframe/stack";
import Link from "next/link";
import BoltIcon from "@mui/icons-material/Bolt";

export default function Navbar() {
  const stack = useStackApp();
  const user = useUser();

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
        bgcolor: alpha("#ffffff", 0.85),
        backdropFilter: "blur(10px)",
        boxShadow: "none",
        borderBottom: "1px solid rgba(124, 58, 237, 0.08)",
        zIndex: (theme) => theme.zIndex.appBar,
        py: 1,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            justifyContent: "space-between",
            bgcolor: "white",
            borderRadius: "9999px",
            px: { xs: 2, sm: 4 },
            py: 1,
            border: "1px solid rgba(124, 58, 237, 0.1)",
            boxShadow: "0 8px 30px rgba(124, 58, 237, 0.05)"
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
                    border: "1px solid rgba(124, 58, 237, 0.2)",
                    bgcolor: "rgba(124, 58, 237, 0.05)",
                    color: "primary.main"
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>

          {/* Auth */}
          <Stack direction="row" spacing={2} alignItems="center">
            {user ? (
              <Button
                variant="contained"
                component={Link}
                href="/dashboard"
                size="small"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => stack.redirectToSignIn()}
                  sx={{ color: "text.primary", fontWeight: 700, fontSize: "0.875rem" }}
                >
                  Sign In
                </Button>
                <Button
                  variant="contained"
                  onClick={() => stack.redirectToSignUp()}
                  sx={{
                    bgcolor: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    gap: 1
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
    </AppBar>
  );
}
