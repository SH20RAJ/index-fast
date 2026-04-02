"use client";
import { useState } from "react";
import {
  Alert,
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useStackApp, useUser } from "@stackframe/stack";

import { PLAN_DEFINITIONS } from "@/lib/billing/plans";

const plans = Object.values(PLAN_DEFINITIONS);

export default function Pricing() {
  const stack = useStackApp();
  const user = useUser();
  const theme = useTheme();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const isDark = theme.palette.mode === "dark";

  async function startCheckout(planName: string) {
    if (planName === "Starter") {
      if (user) {
        window.location.href = "/dashboard";
      } else {
        stack.redirectToSignUp();
      }
      return;
    }

    if (!user) {
      stack.redirectToSignUp();
      return;
    }

    const plan = planName === "Agency" ? "agency" : "pro";
    setLoadingPlan(planName);
    setCheckoutError(null);

    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = (await res.json()) as { checkoutUrl?: string; error?: string };
      if (!res.ok || !data.checkoutUrl) {
        throw new Error(data.error || "Unable to start checkout.");
      }

      window.location.href = data.checkoutUrl;
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "Unable to start checkout.");
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <Box id="pricing" sx={{ py: { xs: 10, md: 16 }, bgcolor: "background.default" }}>
      <Container maxWidth="lg">
        <Stack spacing={2} mb={10} alignItems="center" textAlign="center">
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: "99px",
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: alpha(theme.palette.text.primary, 0.02),
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", letterSpacing: "0.02em" }}>
              Pricing Plans
            </Typography>
          </Box>
          <Typography variant="h2" sx={{ fontWeight: 900, color: "text.primary", letterSpacing: "-0.03em" }}>
            Simple, predictable pricing
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: "600px", mx: "auto", fontSize: "1.1rem", lineHeight: 1.6 }}>
            Choose the level of execution your properties need. No hidden fees or complex seat-based tiers.
          </Typography>
        </Stack>

        <Grid container spacing={4} alignItems="stretch">
          {plans.map((p) => (
            <Grid size={{ xs: 12, md: 4 }} key={p.name}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  bgcolor: "background.paper",
                  borderRadius: "12px",
                  border: `1px solid ${p.popular ? "primary.main" : "divider"}`,
                  boxShadow: p.popular ? (isDark ? "0 20px 40px rgba(0,0,0,0.4)" : "0 20px 40px rgba(0,0,0,0.03)") : "none",
                  position: "relative",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: "primary.main",
                  }
                }}
              >
                {p.popular && (
                  <Box sx={{
                    position: "absolute",
                    top: 16,
                    right: 24,
                    bgcolor: "primary.main",
                    color: isDark ? "black" : "white",
                    px: 1.5,
                    py: 0.4,
                    borderRadius: "99px",
                    fontSize: "0.7rem",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}>
                    Popular
                  </Box>
                )}
                <CardContent sx={{ p: { xs: 4, md: 5 }, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  <Stack spacing={0.5} mb={4}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: p.popular ? "primary.main" : "text.secondary", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {p.name}
                    </Typography>
                    <Stack direction="row" alignItems="baseline" spacing={0.5}>
                      <Typography variant="h3" sx={{ fontWeight: 900, color: "text.primary", letterSpacing: "-0.04em" }}>
                        ${p.priceMonthly}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>/mo</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ color: "text.secondary", mt: 1, lineHeight: 1.5 }}>
                      {p.tagline}
                    </Typography>
                  </Stack>

                  <Stack spacing={2} sx={{ mb: 6, flexGrow: 1 }}>
                    {p.features.map((f, fidx) => (
                      <Stack key={fidx} direction="row" spacing={1.5} alignItems="center">
                        <CheckCircleIcon sx={{ fontSize: 16, color: p.popular ? "primary.main" : "text.secondary", opacity: 0.8 }} />
                        <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 500 }}>
                          {f}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>

                  <Button
                    variant={p.popular ? "contained" : "outlined"}
                    fullWidth
                    size="large"
                    onClick={() => void startCheckout(p.name)}
                    disabled={loadingPlan === p.name}
                    sx={{
                      borderRadius: "8px",
                      py: 1.5,
                      fontWeight: 800,
                      fontSize: "0.9rem",
                      bgcolor: p.popular ? "primary.main" : "transparent",
                      color: p.popular ? (isDark ? "black" : "white") : "text.primary",
                      borderColor: "divider",
                      "&:hover": {
                        bgcolor: p.popular ? "primary.main" : alpha(theme.palette.text.primary, 0.04),
                        borderColor: "primary.main",
                        opacity: p.popular ? 0.9 : 1,
                      }
                    }}
                  >
                    {loadingPlan === p.name ? "Redirecting..." : p.ctaLabel}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {checkoutError ? (
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Alert severity="error" sx={{ borderRadius: "8px", maxWidth: 600, width: "100%" }}>
              {checkoutError}
            </Alert>
          </Box>
        ) : null}
      </Container>
    </Box>
  );
}
