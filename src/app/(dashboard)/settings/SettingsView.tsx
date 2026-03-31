import { Box, Card, CardContent, Chip, Grid, Stack, Typography, alpha } from "@mui/material";
import type { User } from "@/lib/db/schema";
import type { PlanId } from "@/lib/billing/plans";
import PageHeader from "@/components/dashboard/PageHeader";
import AccountEmailForm from "@/components/dashboard/settings/AccountEmailForm";
import PlanSelectorForm from "@/components/dashboard/settings/PlanSelectorForm";

interface SettingsViewProps {
  initialSettings: User;
  planId: PlanId;
}

export default function SettingsView({ initialSettings, planId }: SettingsViewProps) {
  return (
    <Box sx={{ pt: 1, pb: 8 }}>
      <Stack spacing={3}>
        <PageHeader
          title="Settings & Billing"
          description="Control account identity, subscription tier, and monetization limits from one console."
        />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Card sx={{ borderRadius: "16px", border: "1px solid", borderColor: "divider", boxShadow: "none", height: "100%" }}>
              <CardContent sx={{ p: { xs: 2.25, md: 3 } }}>
                <Stack spacing={2}>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>
                    Account Email
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This email is used for billing receipts, quota notices, and indexing incident updates.
                  </Typography>
                  <AccountEmailForm initialEmail={initialSettings.email} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Card
              sx={{
                borderRadius: "16px",
                border: "1px solid",
                borderColor: alpha("#0F172A", 0.08),
                boxShadow: "none",
                background: "linear-gradient(150deg, rgba(15,23,42,0.04) 0%, rgba(12,74,110,0.04) 100%)",
                height: "100%",
              }}
            >
              <CardContent sx={{ p: { xs: 2.25, md: 3 } }}>
                <Stack spacing={1.5}>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>
                    Current Subscription Snapshot
                  </Typography>
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    <Chip label={`Plan: ${planId.toUpperCase()}`} sx={{ borderRadius: "8px", fontWeight: 800 }} color="primary" />
                    <Chip label={`Status: ${initialSettings.subscriptionStatus || "inactive"}`} sx={{ borderRadius: "8px", fontWeight: 800 }} />
                    <Chip label={initialSettings.isPro ? "Pings Enabled" : "Pings Disabled"} sx={{ borderRadius: "8px", fontWeight: 800 }} color={initialSettings.isPro ? "success" : "default"} />
                  </Stack>

                  <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-word" }}>
                    Customer ID: {initialSettings.dodoCustomerId || "Not linked"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-word" }}>
                    Subscription ID: {initialSettings.dodoSubscriptionId || "Not linked"}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ borderRadius: "16px", border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
          <CardContent sx={{ p: { xs: 2.25, md: 3 } }}>
            <Stack spacing={2}>
              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                Subscription Plans
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Plan switches run through secure server actions and revalidate your dashboard usage model automatically.
              </Typography>
              <PlanSelectorForm currentPlanId={planId} />
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
