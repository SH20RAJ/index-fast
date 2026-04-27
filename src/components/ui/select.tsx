"use client";

import * as React from "react";
import { Select as RizzSelect, type SelectProps as RizzSelectProps } from "rizzui/select";
import { cn } from "@/lib/utils";

// The main Select component from RizzUI
const Select = ({ onValueChange, onChange, options, children, ...props }: any) => {
  const finalOptions = options || React.Children.map(children, (child: any) => {
    if (child && child.type === 'option') {
      return { label: child.props.children, value: child.props.value };
    }
    return null;
  })?.filter(Boolean) || [];

  const handleChange = (value: any) => {
    // RizzUI Select's onChange passes the value (or the full option object depending on usage)
    onChange?.(value);
    onValueChange?.(value);
  };
  return <RizzSelect onChange={handleChange} options={finalOptions} {...props} />;
};

// Shim components to prevent immediate breakage in existing code
// These will eventually be removed as we migrate to the single-component RizzUI pattern
const SelectTrigger = ({ children, className, ...props }: any) => <div className={cn("hidden", className)} {...props}>{children}</div>;
const SelectContent = ({ children, className, ...props }: any) => <div className={cn("hidden", className)} {...props}>{children}</div>;
const SelectItem = ({ children, className, ...props }: any) => <div className={cn("hidden", className)} {...props}>{children}</div>;
const SelectValue = ({ children, className, ...props }: any) => <span className={cn("hidden", className)} {...props}>{children}</span>;
const SelectGroup = ({ children, className, ...props }: any) => <div className={cn("hidden", className)} {...props}>{children}</div>;
const SelectLabel = ({ children, className, ...props }: any) => <div className={cn("hidden", className)} {...props}>{children}</div>;
const SelectSeparator = ({ children, className, ...props }: any) => <div className={cn("hidden", className)} {...props}>{children}</div>;
const SelectScrollUpButton = ({ children, className, ...props }: any) => <div className={cn("hidden", className)} {...props}>{children}</div>;
const SelectScrollDownButton = ({ children, className, ...props }: any) => <div className={cn("hidden", className)} {...props}>{children}</div>;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
