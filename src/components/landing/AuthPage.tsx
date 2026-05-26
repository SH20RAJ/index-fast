"use client";

import Link from "next/link";
import { Lock, Rocket, ArrowRight } from "lucide-react";
import { useStackApp } from "@stackframe/stack";
import { Button } from "@/components/ui/button";

type AuthMode = "sign-in" | "sign-up";

interface AuthPageProps {
  mode: AuthMode;
}

export default function AuthPage({ mode }: AuthPageProps) {
  const stack = useStackApp();
  const isSignIn = mode === "sign-in";

  const pageTitle = isSignIn
    ? "Welcome back"
    : "Create your workspace";

  const pageDescription = isSignIn
    ? "Sign in to run submissions, monitor indexation, and keep your content discoverable."
    : "Start free in under two minutes. Connect your properties and launch indexing workflows.";

  const bullets = isSignIn
    ? [
        "Open your dashboard and continue where you left off",
        "Review submission logs and indexing trends",
        "Manage plans, team access, and automation",
      ]
    : [
        "Import verified properties and sitemaps quickly",
        "Submit fresh URLs to Bing and IndexNow in one workflow",
        "Unlock recurring monitoring, alerts, and team operations",
      ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {pageTitle}
          </h1>
          <p className="text-base text-muted-foreground">
            {pageDescription}
          </p>
        </div>

        <ul className="space-y-3">
          {bullets.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-primary" />
              {item}
            </li>
          ))}
        </ul>

        <div className="space-y-3">
          <Button
            size="lg"
            onClick={() =>
              isSignIn ? stack.redirectToSignIn() : stack.redirectToSignUp()
            }
            className="h-10 w-full gap-2"
          >
            {isSignIn ? (
              <Lock className="h-4 w-4" />
            ) : (
              <Rocket className="h-4 w-4" />
            )}
            {isSignIn ? "Sign in" : "Sign up"}
            <ArrowRight className="h-4 w-4" />
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-10 w-full"
          >
            <Link href={isSignIn ? "/sign-up" : "/sign-in"}>
              {isSignIn ? "Create an account" : "Already have an account?"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
