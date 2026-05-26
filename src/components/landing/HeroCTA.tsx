import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroCTA() {
  return (
    <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
      <div className="flex flex-col gap-1.5">
        <Button asChild size="lg" className="h-11 px-6 text-sm font-medium">
          <Link href="/sign-up">
            Get started
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
        <p className="text-xs text-muted-foreground">
          500 URLs free to start.
        </p>
      </div>
      <Button
        asChild
        variant="outline"
        size="lg"
        className="h-11 px-6 text-sm font-medium"
      >
        <Link href="/tools">Free tools</Link>
      </Button>
    </div>
  );
}
