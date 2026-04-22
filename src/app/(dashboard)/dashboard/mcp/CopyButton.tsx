"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  size?: "default" | "sm" | "icon";
}

export default function CopyButton({ text, size = "default" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant={size === "icon" ? "ghost" : "secondary"}
      size={size === "icon" ? "icon" : "sm"}
      className={cn(
        "rounded-lg font-bold transition-all active:scale-95",
        size === "default" && "h-10 px-4",
        copied ? "text-green-500" : "text-primary"
      )}
      onClick={handleCopy}
    >
      {copied ? (
        <Check className={cn("h-4 w-4", size !== "icon" && "mr-2")} />
      ) : (
        <Copy className={cn("h-4 w-4", size !== "icon" && "mr-2")} />
      )}
      {size !== "icon" && (copied ? "Copied" : "Copy")}
    </Button>
  );
}
