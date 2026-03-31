"use client";
import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  Stack as MuiStack,
  alpha,
} from "@mui/material";
import { useStackApp, useUser } from "@stackframe/stack";
import Link from "next/link";
import BoltIcon from "@mui/icons-material/Bolt";

export default function Navbar() {
  const stack = useStackApp();
  const user = useUser();

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        bgcolor: alpha("#000000", 0.7), 
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "none"
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <MuiStack direction="row" alignItems="center" spacing={1.5} component={Link} href="/" sx={{ textDecoration: "none", color: "inherit" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: "6px",
                bgcolor: "primary.main",
              }}
            >
              <BoltIcon sx={{ color: "white", fontSize: 20 }} />
            </Box>
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: "text.primary",
              }}
            >
              IndexFast
            </Typography>
          </MuiStack>

          <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 3 }}>
            <Button component={Link} href="#features" sx={{ color: "text.secondary", fontSize: "0.875rem" }}>Features</Button>
            <Button component={Link} href="#pricing" sx={{ color: "text.secondary", fontSize: "0.875rem" }}>Pricing</Button>
          </Box>

          <MuiStack direction="row" spacing={2} alignItems="center">
            {user ? (
              <Button
                variant="contained"
                component={Link}
                href="/dashboard"
                size="small"
                sx={{ borderRadius: "20px" }}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => stack.signIn()}
                  sx={{ color: "text.secondary", display: { xs: "none", sm: "block" }, fontSize: "0.875rem" }}
                >
                  Log In
                </Button>
                <Button
                  variant="contained"
                  onClick={() => stack.signUp()}
                  size="small"
                  sx={{ borderRadius: "20px" }}
                >
                  Join
                </Button>
              </>
            )}
          </MuiStack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
