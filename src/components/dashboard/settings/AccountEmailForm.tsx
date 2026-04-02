"use client";

import { useActionState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateAccountEmailAction } from "@/app/(dashboard)/actions";
import { defaultActionState } from "@/app/(dashboard)/action-state";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface AccountEmailFormProps {
  initialEmail: string;
}

export default function AccountEmailForm({ initialEmail }: AccountEmailFormProps) {
  const [state, formAction, pending] = useActionState(updateAccountEmailAction, defaultActionState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
          Account Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          spellCheck={false}
          defaultValue={initialEmail}
          required
          className="h-11 bg-muted/30 border-border/40 focus-visible:ring-primary/20"
        />
      </div>
      
      <Button
        type="submit"
        disabled={pending}
        className="gap-2 font-black shadow-lg shadow-primary/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {pending ? "Saving..." : "Save Email"}
      </Button>

      {state.status !== "idle" && (
        <Alert variant={state.status === "success" ? "default" : "destructive"} className={state.status === "success" ? "border-emerald-500/50 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400" : ""}>
          {state.status === "success" ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <AlertCircle className="h-4 w-4" />}
          <AlertTitle className="font-bold capitalize">{state.status}</AlertTitle>
          <AlertDescription className="font-medium">{state.message}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
