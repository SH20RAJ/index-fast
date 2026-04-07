"use client";

import * as React from "react";
import { Box } from "rizzui/box";
import { cn } from "@/lib/utils";

function Card({
  className,
  ...props
}: React.ComponentProps<typeof Box>) {
  return (
    <Box
      className={cn(
        "rounded-xl border border-muted bg-card shadow-sm transition-all",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<typeof Box>) {
  return (
    <Box
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<typeof Box>) {
  return (
    <Box
      as="h3"
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<typeof Box>) {
  return (
    <Box
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<typeof Box>) {
  return (
    <Box className={cn("p-6 pt-0", className)} {...props} />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<typeof Box>) {
  return (
    <Box
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
