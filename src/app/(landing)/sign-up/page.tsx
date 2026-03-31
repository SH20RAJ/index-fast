import type { Metadata } from "next";
import { SignUp } from "@stackframe/stack";

export const metadata: Metadata = {
  title: "Sign Up | IndexFast",
  description:
    "Create your IndexFast account to automate indexing workflows, monitor submissions, and scale SEO operations faster.",
  alternates: {
    canonical: "/sign-up",
  },
};

export default function SignUpPage() {
  return <SignUp fullPage firstTab="password" automaticRedirect={false} />;
}
