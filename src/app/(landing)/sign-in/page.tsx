import type { Metadata } from "next";
import { SignIn } from "@stackframe/stack";

export const metadata: Metadata = {
  title: "Sign In | IndexFast",
  description:
    "Sign in to IndexFast and continue managing URL submissions, indexing workflows, and visibility tracking from your dashboard.",
  alternates: {
    canonical: "/sign-in",
  },
};

export default function SignInPage() {
  return <SignIn fullPage firstTab="password" automaticRedirect={false} />;
}
