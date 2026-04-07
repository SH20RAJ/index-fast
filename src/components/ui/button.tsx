"use client";

import * as React from "react";
import { Button as RizzButton, type ButtonProps as RizzButtonProps } from "rizzui/button";
import { cn } from "@/lib/utils";

// Mapping shadcn variants to RizzUI variants
const variantMap = {
  default: "solid",
  destructive: "solid",
  outline: "outline",
  secondary: "flat",
  ghost: "text",
  link: "text",
} as const;

const colorMap = {
  default: "primary",
  destructive: "danger",
  secondary: "secondary",
  outline: "primary",
  ghost: "primary",
  link: "primary",
} as const;

const sizeMap = {
  default: "md",
  sm: "sm",
  lg: "lg",
  icon: "md",
  "icon-sm": "sm",
  "icon-xs": "sm",
} as const;

export interface ButtonProps extends Omit<RizzButtonProps, "variant" | "size"> {
  variant?: keyof typeof variantMap;
  size?: keyof typeof sizeMap;
  asChild?: boolean; // RizzUI doesn't natively support Slot, but we can handle basic cases
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", color, ...props }, ref) => {
    const rizzVariant = variantMap[variant] || "solid";
    const rizzColor = color || colorMap[variant] || "primary";
    const rizzSize = sizeMap[size] || "md";

    return (
      <RizzButton
        ref={ref}
        variant={rizzVariant}
        size={rizzSize}
        color={rizzColor}
        className={cn(
          variant === "destructive" && "bg-destructive text-destructive-foreground hover:bg-destructive/90",
          size === "icon" && "px-2",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
