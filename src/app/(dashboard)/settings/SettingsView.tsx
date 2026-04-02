import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/lib/db/schema";
import type { PlanId } from "@/lib/billing/plans";
import PageHeader from "@/components/dashboard/PageHeader";
import AccountEmailForm from "@/components/dashboard/settings/AccountEmailForm";
import PlanSelectorForm from "@/components/dashboard/settings/PlanSelectorForm";
import { openBillingPortalAction } from "@/app/(dashboard)/actions";

interface SettingsViewProps {
  initialSettings: User;
  planId: PlanId;
}

export default function SettingsView({ initialSettings, planId }: SettingsViewProps) {
  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Settings & Billing"
        description="Control account identity, subscription tier, and monetization limits from one console."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Email */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account Email</CardTitle>
            <CardDescription>
              Used for billing receipts, quota notices, and incident updates.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AccountEmailForm initialEmail={initialSettings.email} />
          </CardContent>
        </Card>

        {/* Subscription Snapshot */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Subscription Status</CardTitle>
            <CardDescription>Your current plan and billing information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="default" className="text-xs font-semibold">
                {planId.toUpperCase()}
              </Badge>
              <Badge
                variant="outline"
                className="text-xs font-semibold"
              >
                {initialSettings.subscriptionStatus || "Inactive"}
              </Badge>
              <Badge
                variant={initialSettings.isPro ? "default" : "secondary"}
                className="text-xs font-semibold"
              >
                {initialSettings.isPro ? "Pings Enabled" : "Pings Disabled"}
              </Badge>
            </div>

            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">Customer ID:</span>{" "}
                <code className="bg-muted px-2 py-1 rounded text-xs">
                  {initialSettings.dodoCustomerId || "Not linked"}
                </code>
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">Subscription ID:</span>{" "}
                <code className="bg-muted px-2 py-1 rounded text-xs">
                  {initialSettings.dodoSubscriptionId || "Not linked"}
                </code>
              </p>
            </div>

            {initialSettings.dodoCustomerId ? (
              <form action={openBillingPortalAction}>
                <Button type="submit" variant="outline" className="w-full">
                  Open Billing Portal
                </Button>
              </form>
            ) : (
              <p className="text-xs text-muted-foreground">
                Billing portal unlocks after your first paid checkout.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Subscription Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Subscription Plans</CardTitle>
          <CardDescription>
            Free plan changes are instant. Paid plans redirect to secure checkout and sync back via webhooks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PlanSelectorForm currentPlanId={planId} />
        </CardContent>
      </Card>
    </div>
  );
}
