"use client";

import * as React from "react";
import { Checkbox as RizzCheckbox, type CheckboxProps as RizzCheckboxProps } from "rizzui/checkbox";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<HTMLInputElement, RizzCheckboxProps>(
  ({ className, ...props }, ref) => (
    <RizzCheckbox
      ref={ref}
      className={cn("peer", className)}
      {...props}
    />
  )
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
