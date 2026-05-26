import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section id="cta" className="py-20 bg-background">
      <div className="mx-auto max-w-2xl px-6 text-center space-y-6">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Ready to rank?
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Stop wasting hours on manual indexing. Connect IndexFast and get your pages indexed instantly.
        </p>
        <div className="pt-2">
          <Button
            asChild
            className="h-12 px-8 rounded-xl font-semibold bg-primary text-primary-foreground hover:opacity-90"
          >
            <Link href="/signup">
              Start Indexing Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
