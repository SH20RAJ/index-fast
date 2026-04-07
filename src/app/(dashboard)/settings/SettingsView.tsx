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
    <div className="space-y-10 pb-12 max-w-5xl">
      <PageHeader
        title="Settings"
        description="Manage your identity, billing, and workspace limits."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Account Email */}
        <div className="space-y-4 px-1">
          <div className="space-y-1">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Account</h3>
            <p className="text-xs text-zinc-500 font-light">Your primary identity for billing and security.</p>
          </div>
          <Card className="rounded-[32px] border-zinc-100 dark:border-white/5 bg-white dark:bg-zinc-900/40">
            <CardContent className="p-6">
              <AccountEmailForm initialEmail={initialSettings.email} />
            </CardContent>
          </Card>
        </div>

        {/* Subscription Snapshot */}
        <div className="space-y-4 px-1">
          <div className="space-y-1">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Subscription</h3>
            <p className="text-xs text-zinc-500 font-light">Status and active entitlements.</p>
          </div>
          <Card className="rounded-[32px] border-zinc-100 dark:border-white/5 bg-white dark:bg-zinc-900/40">
            <CardContent className="p-6 space-y-6">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-zinc-100 text-zinc-900 dark:bg-white/5 dark:text-zinc-100 border-none font-bold text-[10px] uppercase tracking-widest px-2 py-1">
                  {planId}
                </Badge>
                <Badge variant="outline" className="text-[10px] uppercase tracking-widest px-2 py-1 font-bold border-zinc-200">
                  {initialSettings.subscriptionStatus || "Inactive"}
                </Badge>
              </div>

              {initialSettings.dodoCustomerId ? (
                <form action={openBillingPortalAction}>
                  <Button type="submit" variant="secondary" className="w-full rounded-full font-bold text-xs uppercase tracking-widest h-11">
                    Open Billing Portal
                  </Button>
                </form>
              ) : (
                <p className="text-[10px] text-zinc-400 italic">
                  Billing portal unlocks after your first paid checkout.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="space-y-4 px-1">
        <div className="space-y-1">
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Change Plan</h3>
          <p className="text-xs text-zinc-500 font-light">Upgrade or downgrade your indexing capacity.</p>
        </div>
        <Card className="rounded-[32px] border-zinc-100 dark:border-white/5 bg-white dark:bg-zinc-900/40">
          <CardContent className="p-6">
            <PlanSelectorForm currentPlanId={planId} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
