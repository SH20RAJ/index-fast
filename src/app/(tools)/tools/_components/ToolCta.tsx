"use client";

import Link from "next/link";
import { useStackApp, useUser } from "@stackframe/stack";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

interface ToolCtaProps {
  primaryText: string;
  secondaryText: string;
}

export default function ToolCta({ primaryText, secondaryText }: ToolCtaProps) {
  const stack = useStackApp();
  const user = useUser();

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="space-y-1">
          <CardTitle className="text-xl">{primaryText}</CardTitle>
          <CardDescription className="text-sm">{secondaryText}</CardDescription>
        </div>

        <div className="flex flex-wrap gap-2">
          {user ? (
            <Button asChild>
              <Link href="/dashboard">Open dashboard</Link>
            </Button>
          ) : (
            <Button onClick={() => stack.redirectToSignUp()}>Create free account</Button>
          )}
          <Button variant="outline" asChild>
            <Link href="/#pricing">View pro plans</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
