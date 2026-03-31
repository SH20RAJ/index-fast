"use client";
import * as React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useStackApp } from "@stackframe/stack";

const plans = [
  {
    name: "Starter",
    price: "$0",
    desc: "Perfect for personal blogs and landing pages",
    features: ["up to 50 URLs / month", "Google Search Console Sync", "Basic Support"],
    button: "Get Started",
    popular: false
  },
  {
    name: "Pro",
    price: "$49",
    desc: "Best for growing businesses and SEO agencies",
    features: ["Unlimited URLs", "Batch Processing", "Auto Sync Sitemaps", "Priority Support"],
    button: "Start Free Trial",
    popular: true
  },
  {
    name: "Agency",
    price: "$149",
    desc: "For large enterprise teams and SEO fleets",
    features: ["White-labeled Reports", "API Access", "Custom Quota Limits", "Account Manager"],
    button: "Contact Us",
    popular: false
  }
];

export default function Pricing() {
  const theme = useTheme();
  const stack = useStackApp();

  return (
    <Box id="pricing" sx={{ py: 15, bgcolor: "white" }}>
      <Container maxWidth="lg">
        <Stack spacing={2} mb={10} textAlign="center">
           <Typography variant="h2" sx={{ fontWeight: 900, color: "#1F2937", mb: 2 }}>
             Flexible 
             <Box component="span" sx={{ color: "primary.main", fontFamily: '"Patrick Hand", cursive', rotate: "-3deg", display: "inline-block", ml: 1 }}>pricing</Box>
           </Typography>
           <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: "600px", mx: "auto" }}>
             Choose the plan that fits your growth and start getting indexed today. No hidden fees.
           </Typography>
        </Stack>

        <Grid container spacing={4} alignItems="center">
          {plans.map((p, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Card 
                sx={{ 
                  p: 2,
                  bgcolor: p.popular ? "primary.main" : "white", 
                  color: p.popular ? "white" : "text.primary",
                  borderRadius: "40px", 
                  border: p.popular ? "none" : "1px solid rgba(124, 58, 237, 0.1)",
                  boxShadow: p.popular 
                    ? "0 20px 50px rgba(124, 58, 237, 0.25)" 
                    : "0 10px 40px rgba(124, 58, 237, 0.05)",
                  transform: p.popular ? "scale(1.05)" : "scale(1)",
                  position: "relative",
                  "&:hover": {
                    transform: p.popular ? "scale(1.08)" : "translateY(-10px)",
                    boxShadow: "0 25px 60px rgba(124, 58, 237, 0.15)"
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Stack spacing={3}>
                    <Box>
                       <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, fontFamily: '"Patrick Hand", cursive' }}>{p.name}</Typography>
                       <Typography variant="h2" sx={{ fontWeight: 900 }}>{p.price}</Typography>
                       <Typography variant="caption" sx={{ opacity: 0.8 }}>per month</Typography>
                    </Box>

                    <Typography variant="body2" sx={{ opacity: 0.8, minHeight: "40px" }}>{p.desc}</Typography>

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
                      onClick={() => stack.signUp()}
                      sx={{ 
                        bgcolor: p.popular ? "secondary.main" : "transparent",
                        borderColor: "primary.main",
                        color: p.popular ? "text.primary" : "primary.main",
                        "&:hover": {
                          bgcolor: p.popular ? "secondary.light" : "rgba(124, 58, 237, 0.05)",
                          borderColor: "primary.main"
                        }
                      }}
                    >
                      {p.button}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
