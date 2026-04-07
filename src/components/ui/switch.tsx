"use client";

import * as React from "react";
import { Switch as RizzSwitch, type SwitchProps as RizzSwitchProps } from "rizzui/switch";
import { cn } from "@/lib/utils";

export interface SwitchProps extends RizzSwitchProps {
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, onCheckedChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onCheckedChange?.(e.target.checked);
    };

    return (
      <RizzSwitch
        ref={ref}
        className={cn("peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className)}
        onChange={handleChange}
        {...props}
      />
    );
  }
);
Switch.displayName = "Switch";

export { Switch };
