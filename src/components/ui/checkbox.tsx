"use client";

import * as React from "react";
import { Checkbox as RizzCheckbox, type CheckboxProps as RizzCheckboxProps } from "rizzui/checkbox";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends RizzCheckboxProps {
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onCheckedChange?.(e.target.checked);
    };

    return (
      <RizzCheckbox
        ref={ref}
        className={cn("peer", className)}
        onChange={handleChange}
        {...props}
      />
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
