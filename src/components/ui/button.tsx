"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Button as RizzButton, type ButtonProps as RizzButtonProps } from "rizzui/button";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        flat: "bg-secondary/50 text-secondary-foreground hover:bg-secondary/80",
        text: "hover:bg-accent hover:text-accent-foreground",
        solid: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        "icon-sm": "h-8 w-8",
        "icon-xs": "h-7 w-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

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

export interface ButtonProps
  extends Omit<RizzButtonProps, "variant" | "size">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", color, asChild = false, ...props }, ref) => {
    const rizzVariant = variantMap[variant as keyof typeof variantMap] || "solid";
    const rizzColor = color || colorMap[variant as keyof typeof colorMap] || "primary";
    const rizzSize = sizeMap[size as keyof typeof sizeMap] || "md";

    const Comp = asChild ? Slot : RizzButton;

    return (
      <Comp
        ref={ref}
        {...(asChild ? {} : { variant: rizzVariant as any, size: rizzSize as any, color: rizzColor as any })}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };