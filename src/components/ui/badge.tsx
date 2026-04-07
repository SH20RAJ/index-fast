"use client";

import * as React from "react";
import { Badge as RizzBadge, type BadgeProps as RizzBadgeProps } from "rizzui/badge";
import { cn } from "@/lib/utils";

const variantMap = {
  default: "solid",
  secondary: "flat",
  destructive: "solid",
  outline: "outline",
} as const;

const colorMap = {
  default: "primary",
  secondary: "secondary",
  destructive: "danger",
  outline: "primary",
} as const;

export interface BadgeProps extends Omit<RizzBadgeProps, "variant"> {
  variant?: keyof typeof variantMap;
}

function Badge({ className, variant = "default", color, ...props }: BadgeProps) {
  const rizzVariant = variantMap[variant] || "solid";
  const rizzColor = color || colorMap[variant] || "primary";

  return (
    <RizzBadge
      variant={rizzVariant}
      color={rizzColor}
      className={cn(className)}
      {...props}
    />
  );
}

export { Badge };
