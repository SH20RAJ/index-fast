"use client";

import { Loader, type LoaderTypes } from "rizzui/loader";
import { cn } from "@/lib/utils";

const Spinner = ({ className, ...props }: LoaderTypes) => {
  return (
    <Loader
      variant="spinner"
      className={cn("h-4 w-4 animate-spin", className)}
      {...props}
    />
  );
};

export { Spinner };
export { Loader };
