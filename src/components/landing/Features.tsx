import {
  Globe,
  Code2,
  Zap,
  Layers,
  BarChart3,
  Bot,
} from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "120+ Search Engines",
    description: "Submit to Google, Bing, Yandex, and dozens more in a single click.",
  },
  {
    icon: Code2,
    title: "One-Click IDE Install",
    description: "Connect Cursor or VS Code with our deep-link MCP installer instantly.",
  },
  {
    icon: Zap,
    title: "Indexed in Minutes",
    description: "New pages hit search engines immediately — no more waiting weeks.",
  },
  {
    icon: Layers,
    title: "Bulk Submission",
    description: "Push 1 or 1,000,000 URLs at once. Built for sites that move fast.",
  },
  {
    icon: BarChart3,
    title: "Indexing Status",
    description: "See exactly which pages got indexed and which didn't. Full transparency.",
  },
  {
    icon: Bot,
    title: "AI Command Center",
    description: "Manage audits, indexing, and meta tags with natural language commands.",
  },
];

export default function Features() {
  return (
    <section className="bg-background py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-3">
            Why IndexFast
          </p>
          <h2 className="text-3xl font-serif font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to get indexed
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
            Automated, multi-engine indexing built for teams that can't afford
            to wait weeks for Google to notice them.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-border">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group flex flex-col gap-4 p-8 border-r border-b border-border transition-opacity hover:opacity-80"
            >
              <feature.icon
                className="text-primary"
                size={20}
                strokeWidth={1.5}
              />
              <div className="space-y-1.5">
                <h3 className="text-sm font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
