import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SitesEmptyState() {
  return (
    <div className="py-20 flex flex-col items-center justify-center gap-4 text-muted-foreground">
      <Globe className="h-5 w-5" />
      <p className="text-sm">No websites yet.</p>
      <Button asChild size="sm">
        <Link href="/sites/new">Add website</Link>
      </Button>
    </div>
  );
}