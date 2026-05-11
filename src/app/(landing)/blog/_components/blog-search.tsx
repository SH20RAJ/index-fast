"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useTransition } from "react";
import { Input } from "@/components/ui/input";

export function BlogSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        <Search className={`h-4 w-4 ${isPending ? 'animate-pulse text-primary' : ''}`} />
      </div>
      <Input
        defaultValue={searchParams.get("q")?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search guides, tips, and tutorials..."
        className="pl-10 h-12 rounded-full border-border/60 bg-background/50 backdrop-blur-sm focus-visible:ring-primary/20"
      />
    </div>
  );
}
