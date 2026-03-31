"use client";

import { useActionState } from "react";
import { Alert, Box, Button, Card, CardContent, Chip, Stack, Typography, alpha } from "@mui/material";
import { PLAN_DEFINITIONS, PlanId } from "@/lib/billing/plans";
import { defaultActionState, updateSubscriptionPlanAction } from "@/app/(dashboard)/actions";

interface PlanSelectorFormProps {
  currentPlanId: PlanId;
}

export default function PlanSelectorForm({ currentPlanId }: PlanSelectorFormProps) {
  const [state, formAction, pending] = useActionState(updateSubscriptionPlanAction, defaultActionState);

  return (
    <Stack spacing={1.5}>
      {Object.values(PLAN_DEFINITIONS).map((plan) => {
        const isCurrent = currentPlanId === plan.id;
        return (
          <Card
            key={plan.id}
            sx={{
              borderRadius: "14px",
              border: "1px solid",
              borderColor: isCurrent ? alpha("#0F766E", 0.45) : "divider",
              bgcolor: isCurrent ? alpha("#0F766E", 0.05) : "background.paper",
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Stack spacing={1.25}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                      {plan.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {plan.tagline}
                    </Typography>
                  </Box>
                  <Chip
                    label={isCurrent ? "Current" : `$${plan.priceMonthly}/month`}
                    sx={{ borderRadius: "999px", fontWeight: 800 }}
                    color={isCurrent ? "success" : "default"}
                  />
                </Stack>

                <Typography variant="body2" color="text.secondary">
                  {plan.websiteLimit} sites · {plan.submissionLimitMonthly.toLocaleString()} submissions/month · {plan.includesPings ? "Includes ping network" : "No ping network"}
                </Typography>

                <Box component="form" action={formAction}>
                  <input type="hidden" name="plan" value={plan.id} />
                  <Button
                    type="submit"
                    variant={isCurrent ? "outlined" : "contained"}
                    disabled={pending || isCurrent}
                    sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 800 }}
                  >
                    {isCurrent ? "Active plan" : pending ? "Updating..." : plan.ctaLabel}
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        );
      })}

      {state.status !== "idle" ? (
        <Alert severity={state.status === "success" ? "success" : "error"}>{state.message}</Alert>
      ) : null}
    </Stack>
  );
}
