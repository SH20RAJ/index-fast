"use client";
import { useState } from "react";
import {
  Alert,
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  alpha,
  useTheme,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useStackApp, useUser } from "@stackframe/stack";

const plans = [
  {
    name: "Starter",
    price: "$0",
    desc: "For solo builders validating indexing workflows",
    features: ["Up to 50 URLs / month", "Google Search Console sync", "Basic submission analytics"],
    button: "Get Started",
    popular: false
  },
  {
    name: "Pro",
    price: "$49",
    desc: "For growth teams scaling traffic and AI reach",
    features: ["Unlimited URLs", "Auto sitemap sync (6h)", "AI visibility insights", "Universal ping network"],
    button: "Start Free Trial",
    popular: true
  },
  {
    name: "Agency",
    price: "$149",
    desc: "For agencies running multi-site indexing operations",
    features: ["White-label reporting", "API access", "Priority support", "Multi-workspace controls"],
    button: "Book Demo",
    popular: false
  }
];

export default function Pricing() {
  const stack = useStackApp();
  const user = useUser();
  const theme = useTheme();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

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
    <Box id="pricing" sx={{ py: { xs: 10, md: 14 }, bgcolor: "background.default" }}>
      <Container maxWidth="lg">
        <Stack spacing={2} mb={8} textAlign="center">
          <Typography variant="h2" sx={{ fontWeight: 900, color: "text.primary", mb: 1 }}>
            Plans that pay back in saved hours and faster rankings
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: "700px", mx: "auto", lineHeight: 1.75 }}>
            Choose based on execution volume, not feature gates. Upgrade when your team is ready, not before.
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap>
            <Chip label="No setup fee" variant="outlined" />
            <Chip label="Cancel anytime" variant="outlined" />
            <Chip label="Priority onboarding" variant="outlined" />
          </Stack>
        </Stack>

        <Grid container spacing={4} alignItems="center">
          {plans.map((p) => (
            <Grid size={{ xs: 12, md: 4 }} key={p.name}>
              <Card
                sx={{
                  p: 2,
                  bgcolor: p.popular ? alpha(theme.palette.primary.main, 0.04) : alpha(theme.palette.background.paper, 0.9),
                  color: "text.primary",
                  borderRadius: "30px",
                  border: p.popular
                    ? `1px solid ${alpha(theme.palette.primary.main, 0.18)}`
                    : `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                  boxShadow: theme.palette.mode === "dark"
                    ? "0 14px 30px rgba(0, 0, 0, 0.28)"
                    : "0 14px 30px rgba(17, 24, 39, 0.05)",
                  transform: "scale(1)",
                  position: "relative",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 20px 50px rgba(15, 23, 42, 0.08)"
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>{p.name}</Typography>
                      <Typography variant="h2" sx={{ fontWeight: 900 }}>{p.price}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>per month</Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ minHeight: "40px" }}>{p.desc}</Typography>

                    <Stack spacing={1.5} sx={{ my: 3 }}>
                      {p.features.map((f, fidx) => (
                        <Stack key={fidx} direction="row" spacing={1.5} alignItems="center">
                          <CheckCircleIcon sx={{ fontSize: 18, color: p.popular ? "white" : "primary.main" }} />
                          <Typography variant="body2">{f}</Typography>
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
                        bgcolor: p.popular ? "primary.main" : "transparent",
                        borderColor: "primary.main",
                        color: p.popular ? "common.white" : "primary.main",
                        "&:hover": {
                          bgcolor: p.popular ? "primary.dark" : "rgba(15, 23, 42, 0.03)",
                          borderColor: "primary.main"
                        }
                      }}
                    >
                      {loadingPlan === p.name ? "Redirecting..." : p.button}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {checkoutError ? (
          <Alert severity="error" sx={{ mt: 3 }}>
            {checkoutError}
          </Alert>
        ) : null}
      </Container>
    </Box>
  );
}
