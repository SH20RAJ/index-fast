"use client";

import { useActionState } from "react";
import { ArrowRight, LockKeyhole, Shield, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AdminUnlockState } from "../actions";

interface AdminAccessFormProps {
  unlockAction: (_: AdminUnlockState, formData: FormData) => Promise<AdminUnlockState>;
}

const initialState: AdminUnlockState = {
  status: "idle",
  message: "",
};

export default function AdminAccessForm({ unlockAction }: AdminAccessFormProps) {
  const [state, formAction, isPending] = useActionState(unlockAction, initialState);

  return (
    <div className="relative min-h-[calc(100vh-2rem)] overflow-hidden rounded-[36px] border border-white/10 bg-[#07111f] px-4 py-8 text-white shadow-[0_40px_120px_rgba(2,8,23,0.45)] sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.14),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:34px_34px] opacity-20" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center">
        <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <section className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70">
              <Shield className="h-3.5 w-3.5 text-amber-300" />
              Admin access gate
            </div>

            <div className="space-y-4">
              <h1 className="max-w-xl text-4xl font-light tracking-tight text-white sm:text-5xl lg:text-6xl">
                Private operations console for the whole platform.
              </h1>
              <p className="max-w-xl text-sm leading-6 text-white/65 sm:text-base">
                Unlock the admin panel with the server-side passcode to inspect platform-wide stats, submission health, indexed URLs, and system-wide site activity.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Scope", "All accounts"],
                ["Mode", "Server locked"],
                ["Passcode", "Hidden from client"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">{label}</p>
                  <p className="mt-1 text-sm font-medium text-white/80">{value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 text-xs text-white/55">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                Real-time aggregates
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <LockKeyhole className="h-3.5 w-3.5 text-emerald-300" />
                HTTP-only session cookie
              </span>
            </div>
          </section>

          <section className="rounded-[28px] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-7">
            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/40">Unlock panel</p>
              <h2 className="text-2xl font-light tracking-tight text-white">Enter passcode</h2>
              <p className="text-sm text-white/55">Use the server-validated passcode to open the admin dashboard.</p>
            </div>

            <form action={formAction} className="mt-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="passcode" className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                  Passcode
                </label>
                <Input
                  id="passcode"
                  name="passcode"
                  type="password"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="Enter admin passcode"
                  className="h-12 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/30 focus-visible:ring-amber-300/70"
                />
              </div>

              {state.status === "error" && state.message ? (
                <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                  {state.message}
                </div>
              ) : null}

              <Button
                type="submit"
                disabled={isPending}
                className="h-12 w-full rounded-2xl bg-amber-300 font-semibold text-slate-950 hover:bg-amber-200"
              >
                {isPending ? "Checking..." : "Unlock Admin"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-4 text-xs leading-6 text-white/50">
              This panel is intentionally isolated from the public dashboard and disallowed in robots.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}