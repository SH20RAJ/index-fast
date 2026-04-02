import { cn } from "@/lib/utils";
import type { User } from "@/lib/db/schema";
import type { PlanId } from "@/lib/billing/plans";
import PageHeader from "@/components/dashboard/PageHeader";
import AccountEmailForm from "@/components/dashboard/settings/AccountEmailForm";
import PlanSelectorForm from "@/components/dashboard/settings/PlanSelectorForm";
import { openBillingPortalAction } from "@/app/(dashboard)/actions";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Mail, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Activity,
  Zap,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface SettingsViewProps {
  initialSettings: User;
  planId: PlanId;
}

export default function SettingsView({ initialSettings, planId }: SettingsViewProps) {
  return (
    <div className="space-y-12 pb-16">
      <PageHeader
        title="Settings & Billing"
        description="Control account identity, subscription tier, and monetization limits from one console."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-5">
          <Card className="h-full border-border/40 bg-card/30 backdrop-blur-sm shadow-xl shadow-primary/5 rounded-[32px] overflow-hidden group transition-all hover:bg-card/40">
            <CardHeader className="p-8 pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/5 text-primary mb-4 border border-primary/10 shadow-inner group-hover:scale-110 transition-transform duration-500">
                <Mail className="h-6 w-6 stroke-[1.5px]" />
              </div>
              <CardTitle className="text-2xl font-black tracking-tighter">Account Identity</CardTitle>
              <CardDescription className="font-medium text-muted-foreground/60">
                Managed account email for billing and quota notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4">
              <AccountEmailForm initialEmail={initialSettings.email} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7">
          <Card className="h-full border-border/40 bg-background/40 backdrop-blur-sm shadow-xl shadow-primary/5 rounded-[32px] overflow-hidden relative transition-all hover:bg-background/60">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <CreditCard className="h-24 w-24 text-primary" />
            </div>
            <CardHeader className="p-8 pb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/5 text-emerald-600 mb-4 border border-emerald-500/10 shadow-inner">
                <ShieldCheck className="h-6 w-6 stroke-[1.5px]" />
              </div>
              <CardTitle className="text-2xl font-black tracking-tighter">Subscription Snapshot</CardTitle>
              <CardDescription className="font-medium text-muted-foreground/60">
                Current active plan and metadata synchronization.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6">
              <div className="flex flex-wrap gap-2">
                <Badge variant="default" className="h-7 px-3 text-[10px] font-black uppercase tracking-widest bg-primary text-primary-foreground border-none">
                  Plan: {planId.toUpperCase()}
                </Badge>
                <Badge variant="secondary" className="h-7 px-3 text-[10px] font-black uppercase tracking-widest bg-muted border-none">
                  Status: {initialSettings.subscriptionStatus || "Inactive"}
                </Badge>
                <Badge variant="outline" className={cn(
                  "h-7 px-3 text-[10px] font-black uppercase tracking-widest border-none px-4",
                  initialSettings.isPro ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
                )}>
                  {initialSettings.isPro ? "PRO ENABLED" : "FREE TIER"}
                </Badge>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/20">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Customer ID</p>
                    <p className="text-xs font-bold font-mono tracking-tighter break-all">
                      {initialSettings.dodoCustomerId || "NOT LINKED"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Subscription ID</p>
                    <p className="text-xs font-bold font-mono tracking-tighter break-all">
                      {initialSettings.dodoSubscriptionId || "NOT LINKED"}
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  {initialSettings.dodoCustomerId ? (
                    <form action={openBillingPortalAction}>
                      <Button variant="outline" className="h-11 rounded-2xl gap-2 font-black tracking-tight border-border/40 hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-all active:scale-95">
                        <CreditCard className="h-4 w-4" />
                        Open Stripe Portal
                        <ExternalLink className="h-3 w-3 opacity-50" />
                      </Button>
                    </form>
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-muted/20 rounded-2xl border border-border/10">
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      <p className="text-[10px] font-bold text-muted-foreground">
                        Billing portal unlocks after your first paid checkout.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-border/40 bg-card/30 backdrop-blur-sm shadow-xl shadow-primary/5 rounded-[40px] overflow-hidden transition-all hover:bg-card/40">
        <CardHeader className="p-8 pb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/5 text-amber-600 mb-4 border border-amber-500/10 shadow-inner">
            <Activity className="h-6 w-6 stroke-[1.5px]" />
          </div>
          <CardTitle className="text-3xl font-black tracking-tighter">Choose Your Upgrade Path</CardTitle>
          <CardDescription className="text-base font-medium text-muted-foreground/60">
            Free plan changes are instant. Paid upgrades redirect to secure Dodo checkout.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <PlanSelectorForm currentPlanId={planId} />
        </CardContent>
      </Card>
    </div>
  );
}
