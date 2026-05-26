import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function MinimalHero() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Index instantly.
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground sm:text-lg">
          Push your URLs to Google and Bing the moment you publish.
          No more waiting for crawlers.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Button size="lg" className="h-11 px-6 text-sm font-medium" asChild>
            <Link href="/sign-up">
              Get started
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-11 px-6 text-sm font-medium" asChild>
            <Link href="/tools">Free tools</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
