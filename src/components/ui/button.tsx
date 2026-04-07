"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Button as RizzButton, type ButtonProps as RizzButtonProps } from "rizzui/button";
import { cn } from "@/lib/utils";

// Mapping shadcn variants to RizzUI variants
const variantMap = {
  default: "solid",
  outline: "outline",
  secondary: "flat",
  ghost: "text",
  link: "text",
  destructive: "solid",
  flat: "flat",
  text: "text",
  solid: "solid",
} as const;

const colorMap = {
  default: "primary",
  destructive: "danger",
  secondary: "secondary",
  outline: "primary",
  ghost: "primary",
  link: "primary",
  solid: "primary",
  flat: "secondary",
  text: "primary",
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
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", color, asChild = false, ...props }, ref) => {
    const rizzVariant = variantMap[variant] || "solid";
    const rizzColor = color || colorMap[variant] || "primary";
    const rizzSize = sizeMap[size] || "md";

    const Comp = asChild ? Slot : RizzButton;

    return (
      <Comp
        ref={ref}
        {...(asChild ? {} : { variant: rizzVariant, size: rizzSize, color: rizzColor })}
        className={cn(
          variant === "destructive" && "bg-destructive text-destructive-foreground hover:bg-destructive/90",
          size === "icon" && "px-2",
          // Add RizzUI-like base styles if asChild to ensure the child looks like a button
          asChild && "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50",
          asChild && rizzVariant === "solid" && "bg-primary text-primary-foreground hover:bg-primary/90",
          asChild && rizzVariant === "outline" && "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
          asChild && rizzVariant === "text" && "hover:bg-accent hover:text-accent-foreground",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
