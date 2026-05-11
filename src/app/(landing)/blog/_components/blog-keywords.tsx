"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BlogKeywordsProps {
  keywords: string[];
}

export function BlogKeywords({ keywords }: BlogKeywordsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "all";

  function handleCategory(category: string) {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto py-6">
      <Badge
        variant={currentCategory === "all" ? "default" : "outline"}
        className={cn(
          "cursor-pointer px-4 py-1 text-xs font-bold uppercase tracking-wider rounded-full transition-all",
          currentCategory === "all" ? "bg-primary text-primary-foreground" : "hover:bg-primary/5 hover:border-primary/30"
        )}
        onClick={() => handleCategory("all")}
      >
        All Guides
      </Badge>
      {keywords.map((kw) => (
        <Badge
          key={kw}
          variant={currentCategory === kw ? "default" : "outline"}
          className={cn(
            "cursor-pointer px-4 py-1 text-xs font-bold uppercase tracking-wider rounded-full transition-all",
            currentCategory === kw ? "bg-primary text-primary-foreground" : "hover:bg-primary/5 hover:border-primary/30"
          )}
          onClick={() => handleCategory(kw)}
        >
          {kw}
        </Badge>
      ))}
    </div>
  );
}
