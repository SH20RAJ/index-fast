"use client";

import { useActionState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PLAN_DEFINITIONS, PlanId } from "@/lib/billing/plans";
import { updateSubscriptionPlanAction } from "@/app/(dashboard)/actions";
import { defaultActionState } from "@/app/(dashboard)/action-state";
import { CheckCircle2, Sparkles, Loader2, AlertCircle, Zap, ShieldCheck, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanSelectorFormProps {
  currentPlanId: PlanId;
}

export default function PlanSelectorForm({ currentPlanId }: PlanSelectorFormProps) {
  const [state, formAction, pending] = useActionState(updateSubscriptionPlanAction, defaultActionState);

  return (
    <div className="space-y-4">
      {Object.values(PLAN_DEFINITIONS).map((plan) => {
        const isCurrent = currentPlanId === plan.id;
        return (
          <Card
            key={plan.id}
            className={cn(
              "relative overflow-hidden border-border bg-card",
              isCurrent
                ? "ring-1 ring-primary border-primary/20 bg-primary/5"
                : "hover:border-border"
            )}
          >
            <CardContent className="p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl",
                      isCurrent ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    )}>
                      {plan.id === "free" ? <Activity className="h-5 w-5" /> : plan.id === "pro" ? <Zap className="h-5 w-5 fill-current" /> : <ShieldCheck className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-semibold tracking-tighter leading-none">{plan.name}</h4>
                        {isCurrent && (
                          <Badge variant="secondary" className="h-5 px-1.5 text-[9px] font-semibold uppercase tracking-widest bg-primary text-primary-foreground border-none">
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs font-medium text-muted-foreground mt-1 opacity-70">
                        {plan.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-pink-500" /> {plan.websiteLimit} sites</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3 w-3 text-pink-500" /> {plan.submissionLimitMonthly.toLocaleString()} submissions</span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className={cn("h-3 w-3", plan.features.includes("Universal pinging") ? "text-pink-500" : "text-muted-foreground/30")} /> 
                      Ping Network
                    </span>
                  </div>

                  {plan.trialDays && (
                    <div className="flex items-center gap-2 text-[10px] font-semibold text-pink-600 dark:text-pink-400 bg-pink-500/10 px-2.5 py-1 rounded-full w-fit">
                      <Sparkles className="h-3 w-3" />
                      {plan.trialDays} DAY FREE TRIAL
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-center md:items-end gap-3 min-w-[140px]">
                  <div className="text-center md:text-right">
                    <span className="text-2xl font-semibold tracking-tighter leading-none">
                      {plan.priceMonthly === 0 ? "Free" : `$${plan.priceMonthly}`}
                    </span>
                    {plan.priceMonthly > 0 && <span className="text-[10px] font-bold text-muted-foreground ml-1">/mo</span>}
                  </div>
                  
                  <form action={formAction} className="w-full">
                    <input type="hidden" name="plan" value={plan.id} />
                    <Button
                      type="submit"
                      variant={isCurrent ? "outline" : "default"}
                      disabled={pending || isCurrent}
                      className={cn(
                        "w-full h-10 font-medium text-[11px] rounded-md transition-colors active:scale-[0.98]",
                        isCurrent && "border-primary/20 text-primary opacity-100 hover:bg-transparent"
                      )}
                    >
                      {isCurrent ? "Active Plan" : pending ? <Loader2 className="h-4 w-4 animate-spin" /> : plan.ctaLabel}
                    </Button>
                  </form>
                </div>
              </div>
            </CardContent>
            {isCurrent && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
            )}
          </Card>
        );
      })}

      {state.status !== "idle" && (
        <Alert variant={state.status === "success" ? "default" : "destructive"} className={state.status === "success" ? "border-pink-500/50 bg-pink-500/5 text-pink-600 dark:text-pink-400" : "mt-6"}>
          {state.status === "success" ? <CheckCircle2 className="h-4 w-4 text-pink-500" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle className="font-bold capitalize">{state.status}</AlertTitle>
          <AlertDescription className="font-medium">{state.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
