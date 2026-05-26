import Link from "next/link";

const steps = [
  {
    num: "1",
    title: "Connect your site",
    desc: "Paste your sitemap URL or any page link. IndexFast discovers every page that needs indexing.",
  },
  {
    num: "2",
    title: "Push indexing signals",
    desc: "We send high-priority indexing requests to Google, Bing, and other search engines via official APIs.",
  },
  {
    num: "3",
    title: "Track your results",
    desc: "See which pages are indexed, which need attention, and monitor your search visibility growth.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">
            How it works
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Three steps to better indexing
          </h2>
          <p className="mt-4 text-muted-foreground">
            No manual work, no waiting weeks.
          </p>
        </div>

        {/* Steps — vertical on mobile, horizontal on desktop */}
        <div className="flex flex-col gap-12 md:flex-row md:gap-8">
          {steps.map((step) => (
            <div key={step.num} className="flex-1 flex flex-col items-center text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-sm font-semibold text-foreground mb-5">
                {step.num}
              </span>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 flex justify-center">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-90 transition-opacity"
          >
            Get started for free
          </Link>
        </div>
      </div>
    </section>
  );
}
