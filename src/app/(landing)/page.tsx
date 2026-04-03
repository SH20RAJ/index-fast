import { Metadata } from "next";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import FreeTools from "@/components/landing/FreeTools";
import BlogSection from "@/components/landing/BlogSection";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import FinalCTA from "@/components/landing/FinalCTA";
import ChatBot from "@/components/landing/ChatBot";
import { LogoCloud } from "@/components/ui/logo-cloud-2";

export const metadata: Metadata = {
  title: "IndexFast - Automated SEO Indexing & URL Submission",
  description: "Stop waiting for Google to crawl your site. IndexFast submits your URLs to Google, Bing, and IndexNow instantly for faster ranking and better SEO.",
  alternates: {
    canonical: "/",
  },
};

export default function LandingPage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-3 pb-6">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Search Engine Reach</p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Popular search engines impacted by your indexing workflow
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
            This cloud includes globally popular search engines and regional leaders. Direct engines can receive IndexNow signals, while others are influenced by stronger crawl and freshness signals.
          </p>
        </div>
        <LogoCloud />
      </section>
      <Features />
      <FreeTools />
      <BlogSection />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <ChatBot />
    </>
  );
}
