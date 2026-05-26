"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-foreground text-background hover:bg-foreground/90",
        default:
          "bg-foreground text-background hover:bg-foreground/90",
        secondary:
          "bg-transparent text-foreground border border-border hover:bg-muted",
        outline:
          "bg-transparent text-foreground border border-border hover:bg-muted",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20",
        ghost:
          "bg-transparent text-foreground hover:bg-muted",
        link:
          "text-foreground underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 rounded-[6px]",
        sm: "h-8 px-3 text-xs rounded-[6px]",
        lg: "h-10 px-6 rounded-[6px]",
        icon: "h-9 w-9 rounded-[6px]",
        "icon-sm": "h-8 w-8 rounded-[6px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
