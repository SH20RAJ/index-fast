"use client";

import * as React from "react";
import { Input as RizzInput, type InputProps as RizzInputProps } from "rizzui/input";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, RizzInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <RizzInput
        ref={ref}
        className={cn(className)}
        inputClassName="h-9 px-3 py-1 text-sm shadow-sm"
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
