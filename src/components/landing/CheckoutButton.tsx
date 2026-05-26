"use client";

import { useState } from "react";
import { useStackApp, useUser } from "@stackframe/stack";

interface CheckoutButtonProps {
  planName: string;
  ctaLabel: string;
  isRecommended?: boolean;
}

export function CheckoutButton({ planName, ctaLabel, isRecommended }: CheckoutButtonProps) {
  const stack = useStackApp();
  const user = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (planName === "Free") {
      if (user) {
        window.location.href = "/dashboard";
      } else {
        stack.redirectToSignUp();
      }
      return;
    }

    if (!user) {
      stack.redirectToSignUp();
      return;
    }

    const plan = planName === "Agency" ? "agency" : "pro";
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = (await res.json()) as { checkoutUrl?: string; error?: string };
      if (!res.ok || !data.checkoutUrl) {
        throw new Error(data.error || "Unable to start checkout.");
      }

      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start checkout.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={[
          "w-full rounded-md px-4 py-2 text-sm font-medium transition-opacity",
          isRecommended
            ? "bg-foreground text-background hover:opacity-90"
            : "border border-border text-foreground hover:opacity-80",
          loading ? "opacity-50 cursor-not-allowed" : "",
        ].join(" ")}
      >
        {loading ? "Processing..." : ctaLabel}
      </button>
      {error && (
        <p className="mt-1 text-xs text-destructive text-center">{error}</p>
      )}
    </div>
  );
}
