"use client";
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
  alpha,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useStackApp } from "@stackframe/stack";

const PLANS = [
  {
    name: "Starter",
    price: "$29",
    description: "Perfect for individuals and side projects.",
    features: ["Up to 500 URLs/mo", "Basic Analytics", "Mail Support", "Sitemap Sync"],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Professional",
    price: "$79",
    description: "For serious SEO experts and teams.",
    features: ["Up to 5,000 URLs/mo", "Real-time Dashboards", "Priority Support", "API Access", "Bulk CSV Upload"],
    cta: "Go Pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$249",
    description: "Custom solutions for large scale operations.",
    features: ["Unlimited URLs", "Dedicated Manager", "SLA Guarantees", "Custom Integrations", "Advanced Security"],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function Pricing() {
  const stack = useStackApp();

  return (
    <Box id="pricing" sx={{ py: 16 }}>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={10}>
          <Typography variant="h3" fontWeight={800} mb={2}>
            Fair, Transparent Pricing
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Choose the plan that's right for your growth.
          </Typography>
        </Box>

        <Grid container spacing={4} alignItems="stretch">
          {PLANS.map((plan, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  p: 3,
                  bgcolor: plan.popular ? alpha("#ffffff", 0.03) : "transparent",
                  borderColor: plan.popular ? "primary.main" : "rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  position: "relative",
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                  },
                }}
              >
                {plan.popular && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "4px",
                      bgcolor: "primary.main",
                      color: "white",
                      fontSize: "0.625rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                    }}
                  >
                    Popular
                  </Box>
                )}
                <CardContent sx={{ flexGrow: 1, p: 0 }}>
                  <Typography variant="subtitle1" fontWeight={700} color="text.secondary" gutterBottom>
                    {plan.name}
                  </Typography>
                  <Box sx={{ my: 4 }}>
                    <Typography variant="h3" component="span" fontWeight={800}>
                      {plan.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" component="span">
                      /mo
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={4} sx={{ minHeight: "3rem" }}>
                    {plan.description}
                  </Typography>
                  <List sx={{ mb: 4 }}>
                    {plan.features.map((feature, fIdx) => (
                      <ListItem key={fIdx} disableGutters sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          <CheckCircleIcon sx={{ fontSize: 18, color: "primary.main" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature}
                          primaryTypographyProps={{ variant: "body2", fontWeight: 500 }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                <CardActions sx={{ p: 0 }}>
                  <Button
                    fullWidth
                    variant={plan.popular ? "contained" : "outlined"}
                    size="large"
                    onClick={() => stack.signUp()}
                    sx={{
                      py: 1.5,
                      borderRadius: "6px",
                      boxShadow: "none",
                      borderColor: "rgba(255, 255, 255, 0.2)",
                      "&:hover": { bgcolor: plan.popular ? "primary.dark" : alpha("#ffffff", 0.05) },
                    }}
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
