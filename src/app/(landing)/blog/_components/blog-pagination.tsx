"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogPaginationProps {
  totalPages: number;
  currentPage: number;
}

export function BlogPagination({ totalPages, currentPage }: BlogPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handlePage(page: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  // Show max 5 page buttons
  let visiblePages = pages;
  if (totalPages > 5) {
    const start = Math.max(0, Math.min(currentPage - 3, totalPages - 5));
    visiblePages = pages.slice(start, start + 5);
  }

  return (
    <div className="flex items-center justify-center gap-1 py-10">
      <Button
        variant="outline"
        size="icon"
        className="hidden sm:flex"
        disabled={currentPage === 1}
        onClick={() => handlePage(1)}
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        onClick={() => handlePage(currentPage - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {visiblePages.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="icon"
          className={currentPage === page ? "bg-primary text-primary-foreground" : ""}
          onClick={() => handlePage(page)}
        >
          {page}
        </Button>
      ))}

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === totalPages}
        onClick={() => handlePage(currentPage + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="hidden sm:flex"
        disabled={currentPage === totalPages}
        onClick={() => handlePage(totalPages)}
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
