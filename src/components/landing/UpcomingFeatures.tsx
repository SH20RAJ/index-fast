const upcomingFeatures = [
  {
    title: "GEO Testing",
    desc: "Test how AI crawlers see your pages — optimize for ChatGPT, Perplexity, Claude, and Gemini visibility.",
    status: "Beta",
  },
  {
    title: "Lighthouse Integration",
    desc: "Automated performance audits with actionable fixes for Core Web Vitals and accessibility.",
    status: "Coming Soon",
  },
  {
    title: "PageSpeed Insights (In-House)",
    desc: "Real-time speed testing from multiple regions with optimization recommendations.",
    status: "Coming Soon",
  },
  {
    title: "AI Content Analyzer",
    desc: "Measure how discoverable your content is to generative AI models and close visibility gaps.",
    status: "Coming Soon",
  },
  {
    title: "Multi-Region Testing",
    desc: "Test indexing speed and visibility across different geographic regions and search engines.",
    status: "Coming Soon",
  },
  {
    title: "Wayback Machine Dashboard",
    desc: "View and manage all archived versions of your site with submission history and success rates.",
    status: "Beta",
  },
];

export default function UpcomingFeatures() {
  return (
    <section className="border-t border-border bg-card py-24 sm:py-32">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Product Roadmap
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            What's coming next
          </h2>
          <p className="text-base text-muted-foreground">
            We're building tools for SEO, generative engine optimization, and
            performance testing. Here's what's on the roadmap.
          </p>
        </div>

        <div className="divide-y divide-border rounded-lg border border-border">
          {upcomingFeatures.map((feature) => (
            <div
              key={feature.title}
              className="flex items-start justify-between gap-4 px-5 py-4"
            >
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
              <span
                className={
                  feature.status === "Beta"
                    ? "shrink-0 rounded-full bg-background px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-foreground border border-border"
                    : "shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
                }
              >
                {feature.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
