"use client";

import Link from "next/link";
import { useStackApp, useUser } from "@stackframe/stack";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ToolCtaProps {
  primaryText: string;
  secondaryText: string;
}

export default function ToolCta({ primaryText, secondaryText }: ToolCtaProps) {
  const stack = useStackApp();
  const user = useUser();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{primaryText}</CardTitle>
        <CardDescription>{secondaryText}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {user ? (
          <Button asChild>
            <Link href="/dashboard">Open Dashboard</Link>
          </Button>
        ) : (
          <Button onClick={() => stack.redirectToSignUp()}>Create Free Account</Button>
        )}
        <Button variant="outline" asChild>
          <Link href="/#pricing">View Pro Plans</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
