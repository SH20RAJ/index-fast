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
  alpha,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useStackApp, useUser } from "@stackframe/stack";

const plans = [
  {
    name: "Starter",
    price: "$0",
    desc: "Perfect for secondary projects and validation.",
    features: ["50 URLs / month", "Google Search Console", "Basic stats"],
    button: "Get Started",
    popular: false
  },
  {
    name: "Pro",
    price: "$49",
    desc: "For growth teams scaling traffic and AI reach.",
    features: ["Unlimited URLs", "Auto sitemap sync", "AI visibility index", "Universal pinging"],
    button: "Start Free Trial",
    popular: true
  },
  {
    name: "Agency",
    price: "$149",
    desc: "For multi-site indexing at scale.",
    features: ["White-label reports", "API access", "Priority support", "Multi-workspace"],
    button: "Book Demo",
    popular: false
  }
];

export default function Pricing() {
  const stack = useStackApp();
  const user = useUser();
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
    <Box id="pricing" sx={{ py: { xs: 8, md: 12 }, bgcolor: "white" }}>
      <Container maxWidth="lg">
        <Stack spacing={2} mb={8} textAlign="center">
          <Typography variant="h2" sx={{ fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>
            Simple pricing
          </Typography>
          <Typography variant="body1" sx={{ color: "#6B7280", maxWidth: "600px", mx: "auto", fontSize: "1.1rem" }}>
            Choose the plan that fits your execution volume. No hidden fees or complex tiers.
          </Typography>
        </Stack>

        <Grid container spacing={3} alignItems="stretch">
          {plans.map((p) => (
            <Grid size={{ xs: 12, md: 4 }} key={p.name}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  bgcolor: "white",
                  borderRadius: "12px",
                  border: p.popular ? "2px solid #111827" : "1px solid #E5E7EB",
                  boxShadow: "none",
                  position: "relative",
                  p: 1,
                }}
              >
                {p.popular && (
                  <Box sx={{
                    position: "absolute",
                    top: 0,
                    right: 24,
                    transform: "translateY(-50%)",
                    bgcolor: "#111827",
                    color: "white",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: "999px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                  }}>
                    Popular
                  </Box>
                )}
                <CardContent sx={{ p: 4, flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  <Stack spacing={1} mb={4}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#111827" }}>{p.name}</Typography>
                    <Stack direction="row" alignItems="baseline" spacing={0.5}>
                      <Typography variant="h3" sx={{ fontWeight: 800, color: "#111827" }}>{p.price}</Typography>
                      <Typography variant="body2" color="text.secondary">/mo</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ color: "#6B7280" }}>{p.desc}</Typography>
                  </Stack>

                  <Stack spacing={1.5} sx={{ mb: 4, flexGrow: 1 }}>
                    {p.features.map((f, fidx) => (
                      <Stack key={fidx} direction="row" spacing={1.5} alignItems="center">
                        <CheckCircleIcon sx={{ fontSize: 16, color: "#111827" }} />
                        <Typography variant="body2" sx={{ color: "#374151" }}>{f}</Typography>
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
                      py: 1.25,
                      fontWeight: 600,
                      bgcolor: p.popular ? "#111827" : "transparent",
                      color: p.popular ? "white" : "#111827",
                      borderColor: "#111827",
                      "&:hover": {
                        bgcolor: p.popular ? "#1F2937" : alpha("#111827", 0.04),
                        borderColor: "#111827",
                      }
                    }}
                  >
                    {loadingPlan === p.name ? "Redirecting..." : p.button}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {checkoutError ? (
          <Alert severity="error" sx={{ mt: 3, borderRadius: "8px" }}>
            {checkoutError}
          </Alert>
        ) : null}
      </Container>
    </Box>
  );
}
