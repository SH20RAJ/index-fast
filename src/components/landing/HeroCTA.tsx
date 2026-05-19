"use client";

import Link from "next/link";
import { useUser } from "@stackframe/stack";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroCTA() {
  const user = useUser();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.18 }}
      className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap lg:justify-start"
    >
      {user ? (
        <Button asChild size="lg" className="h-12 rounded-xl px-8 text-base font-semibold">
          <Link href="/dashboard">
            Go to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <div className="flex flex-col items-start gap-2">
          <Button asChild size="lg" className="h-12 rounded-xl px-8 text-base font-semibold w-full sm:w-auto">
            <Link href="/sign-up">
              Start Indexing Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <p className="text-[10px] text-muted-foreground ml-1 font-medium italic">Start with 500 URLs free today.</p>
        </div>
      )}
      <Button asChild variant="outline" size="lg" className="h-12 rounded-xl border-border px-8 text-base font-semibold">
        <Link href="/tools">Try free tools</Link>
      </Button>
    </motion.div>
  );
}
