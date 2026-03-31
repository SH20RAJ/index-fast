"use client";
import * as React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
  Chip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useStackApp } from "@stackframe/stack";

const PLANS = [
  {
    name: "Starter",
    price: "$29",
    description: "Perfect for individuals and side projects.",
    features: ["Up to 500 URLs/mo", "Basic Analytics", "eMail Support", "Sitemap Sync"],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    price: "$79",
    description: "For serious SEO experts and small agencies.",
    features: [
      "Up to 5,000 URLs/mo",
      "Real-time Dashboards",
      "Priority Support",
      "API Access",
      "Bulk CSV Upload",
    ],
    cta: "Get Pro Now",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$249",
    description: "Custom solutions for large scale operations.",
    features: [
      "Unlimited URLs",
      "Dedicated Account Manager",
      "SLA Guarantees",
      "Custom Integrations",
      "Advanced Security",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function Pricing() {
  const theme = useTheme();
  const stack = useStackApp();

  return (
    <Box id="pricing" sx={{ py: 15, bgcolor: alpha(theme.palette.background.paper, 0.2) }}>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={10}>
          <Typography variant="overline" color="primary" fontWeight="bold">
            Pricing Plans
          </Typography>
          <Typography variant="h2" mt={2}>
            Scale Your SEO Growth
          </Typography>
          <Typography variant="body1" color="text.secondary" mt={2}>
            Choose the plan that fits your business needs. No hidden fees.
          </Typography>
        </Box>

        <Grid container spacing={4} alignItems="center">
          {PLANS.map((plan, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Card
                sx={{
                  position: "relative",
                  p: 2,
                  height: "100%",
                  bgcolor: plan.popular ? "background.paper" : "transparent",
                  border: plan.popular
                    ? `2px solid ${theme.palette.primary.main}`
                    : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  boxShadow: plan.popular
                    ? `0 20px 40px -20px ${alpha(theme.palette.primary.main, 0.3)}`
                    : "none",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: `0 20px 40px -20px ${alpha(theme.palette.primary.main, 0.2)}`,
                  },
                }}
              >
                {plan.popular && (
                  <Chip
                    label="MOST POPULAR"
                    color="primary"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: -12,
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontWeight: "bold",
                    }}
                  />
                )}
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h5" fontWeight="bold">
                    {plan.name}
                  </Typography>
                  <Box sx={{ my: 3 }}>
                    <Typography variant="h3" component="span" fontWeight="800">
                      {plan.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" component="span">
                      /mo
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={4}>
                    {plan.description}
                  </Typography>
                  <List sx={{ textAlign: "left", mb: 4 }}>
                    {plan.features.map((feature, fIdx) => (
                      <ListItem key={fIdx} disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon sx={{ fontSize: 20, color: "primary.main" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature}
                          primaryTypographyProps={{ variant: "body2", fontWeight: 500 }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                <CardActions sx={{ pb: 3, px: 3 }}>
                  <Button
                    fullWidth
                    variant={plan.popular ? "contained" : "outlined"}
                    size="large"
                    onClick={() => stack.signUp()}
                  >
                    {plan.cta}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
