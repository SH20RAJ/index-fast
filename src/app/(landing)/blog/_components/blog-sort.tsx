"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export function BlogSort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sortBy") || "newest";

  function handleSort(val: string) {
    const params = new URLSearchParams(searchParams);
    params.set("sortBy", val);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
        Sort By:
      </span>
      <Select value={currentSort} onValueChange={handleSort}>
        <SelectTrigger className="h-9 w-[160px] rounded-full border-border/60 bg-background/50 text-xs font-medium">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="reading_time">Reading Time</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
