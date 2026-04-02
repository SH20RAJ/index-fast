"use client";

import Link from "next/link";
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
  alpha,
} from "@/components/ui/mui";
import { LockRoundedIcon } from "@/components/icons/mui-icons";
import { RocketLaunchRoundedIcon } from "@/components/icons/mui-icons";
import { ShieldRoundedIcon } from "@/components/icons/mui-icons";
import { QueryStatsRoundedIcon } from "@/components/icons/mui-icons";
import { AutoGraphRoundedIcon } from "@/components/icons/mui-icons";
import { CheckCircleRoundedIcon } from "@/components/icons/mui-icons";
import { useStackApp } from "@stackframe/stack";

type AuthMode = "sign-in" | "sign-up";

interface AuthPageProps {
  mode: AuthMode;
}

export default function AuthPage({ mode }: AuthPageProps) {
  const stack = useStackApp();
  const isSignIn = mode === "sign-in";

  const pageTitle = isSignIn ? "Welcome back to IndexFast" : "Create your IndexFast workspace";
  const pageDescription = isSignIn
    ? "Sign in to run submissions, monitor indexation signals, and keep your content discoverable every day."
    : "Start free in under two minutes. Connect your properties, launch indexing workflows, and track visibility from one dashboard.";

  const bullets = isSignIn
    ? [
        "Open your dashboard and continue where you left off",
        "Review submission logs and indexing trends instantly",
        "Manage plans, team access, and automation in one place",
      ]
    : [
        "Import verified properties and sitemaps quickly",
        "Submit fresh URLs to Bing and IndexNow in one workflow",
        "Unlock recurring monitoring, alerts, and team operations",
      ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(1200px 600px at 10% -10%, rgba(34,197,94,0.16), transparent 50%), radial-gradient(1000px 500px at 100% 0%, rgba(14,165,233,0.18), transparent 55%), #f7fafc",
        py: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3} alignItems="stretch">
          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: "28px",
                border: "1px solid rgba(2,6,23,0.08)",
                background:
                  "linear-gradient(160deg, rgba(255,255,255,0.95) 0%, rgba(241,245,249,0.96) 100%)",
                boxShadow: "0 30px 80px rgba(2,6,23,0.09)",
                height: "100%",
              }}
            >
              <Stack direction="row" spacing={1} mb={2.5} flexWrap="wrap">
                <Chip icon={<ShieldRoundedIcon />} label="Secure auth" size="small" />
                <Chip icon={<QueryStatsRoundedIcon />} label="Realtime visibility" size="small" />
                <Chip icon={<AutoGraphRoundedIcon />} label="Operational SEO" size="small" />
              </Stack>

              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  color: "#0f172a",
                  lineHeight: 1.08,
                  fontSize: { xs: "2rem", md: "3.1rem" },
                  mb: 1.6,
                }}
              >
                {pageTitle}
              </Typography>

              <Typography sx={{ color: "#334155", fontSize: { xs: "1rem", md: "1.07rem" }, lineHeight: 1.75, mb: 3.5 }}>
                {pageDescription}
              </Typography>

              <Stack spacing={1.2} mb={4}>
                {bullets.map((item) => (
                  <Stack key={item} direction="row" spacing={1.2} alignItems="center">
                    <CheckCircleRoundedIcon sx={{ color: "#059669", fontSize: 20 }} />
                    <Typography sx={{ color: "#1e293b", fontWeight: 600 }}>{item}</Typography>
                  </Stack>
                ))}
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.4}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={isSignIn ? <LockRoundedIcon /> : <RocketLaunchRoundedIcon />}
                  onClick={() => (isSignIn ? stack.redirectToSignIn() : stack.redirectToSignUp())}
                  sx={{
                    px: 3,
                    py: 1.25,
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #0ea5e9, #22c55e)",
                    boxShadow: "0 12px 24px rgba(14,165,233,0.28)",
                    color: "#fff",
                  }}
                >
                  {isSignIn ? "Continue to Sign In" : "Continue to Sign Up"}
                </Button>

                <Button
                  component={Link}
                  href={isSignIn ? "/sign-up" : "/sign-in"}
                  size="large"
                  variant="outlined"
                  sx={{ px: 3, py: 1.25, borderRadius: "12px", borderColor: alpha("#0f172a", 0.2), color: "#0f172a" }}
                >
                  {isSignIn ? "New here? Create account" : "Already have an account? Sign in"}
                </Button>
              </Stack>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: "28px",
                background:
                  "linear-gradient(145deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.98) 100%)",
                color: "#f8fafc",
                border: "1px solid rgba(148,163,184,0.24)",
                boxShadow: "0 28px 70px rgba(2,6,23,0.35)",
                height: "100%",
              }}
            >
              <Typography variant="overline" sx={{ color: "#67e8f9", letterSpacing: "0.12em" }}>
                Performance Snapshot
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, mb: 1.2 }}>
                Faster indexing, cleaner operations
              </Typography>
              <Typography sx={{ color: "#cbd5e1", lineHeight: 1.75, mb: 3 }}>
                Teams use IndexFast to reduce manual indexing tasks, push new URLs quickly, and keep discovery workflows consistent across every project.
              </Typography>

              <Grid container spacing={1.2}>
                {[
                  { k: "Workflow setup", v: "< 2 min" },
                  { k: "Submission speed", v: "Near-instant" },
                  { k: "Ops visibility", v: "Realtime" },
                  { k: "Manual workload", v: "Lower" },
                ].map((item) => (
                  <Grid size={{ xs: 6 }} key={item.k}>
                    <Box sx={{ p: 1.5, borderRadius: "14px", bgcolor: "rgba(15,23,42,0.55)", border: "1px solid rgba(148,163,184,0.2)" }}>
                      <Typography sx={{ color: "#67e8f9", fontWeight: 800, fontSize: "0.95rem" }}>{item.v}</Typography>
                      <Typography sx={{ color: "#cbd5e1", fontSize: "0.82rem" }}>{item.k}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}