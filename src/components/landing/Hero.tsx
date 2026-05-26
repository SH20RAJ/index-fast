import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="mx-auto max-w-3xl px-6 pt-32 pb-20 sm:pt-40 sm:pb-28">
      <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
        Get your pages indexed, instantly.
      </h1>

      <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
        Tell your IDE to index new pages. IndexFast handles Google, Bing, and IndexNow APIs for you.
      </p>

      <div className="mt-10">
        <Button asChild size="lg" className="h-11 rounded-lg px-6 text-sm font-medium">
          <Link href="/sign-up">
            Start for free
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
