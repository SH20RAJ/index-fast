import Link from "next/link";

const features = [
  {
    title: "Pure Indexing Speed",
    description:
      "Bypass the slow crawl queue. Signals hit Google and Bing APIs in milliseconds — your content ranked before competitors even refresh.",
  },
  {
    title: "10x Faster than Manual",
    description:
      "Stop pasting URLs into Search Console. IndexFast submits thousands of pages automatically while you focus on building.",
  },
  {
    title: "Bulk & Automation",
    description:
      "Programmatic SEO. Ecommerce catalogs. News feeds. We handle unlimited URL discovery and timed auto-pings — no code required.",
  },
  {
    title: "100% White-Hat Safe",
    description:
      "Official Google & Bing Indexing API endpoints. No sketchy bots, no grey-hat tactics. Your domain reputation stays pristine.",
  },
];

const agents = ["Cursor", "Claude Code", "Windsurf", "Kilocode"];

const mcpTools = [
  { name: "submit_url", desc: "Index any page from your AI chat" },
  { name: "bulk_submit", desc: "Push an array of URLs in one call" },
  { name: "seo_audit", desc: "Run an instant SEO check on a page" },
  { name: "list_websites", desc: "View all connected sites & status" },
  { name: "get_usage", desc: "Check submission limits & quota" },
];

const workflow = [
  "You write and publish a new page",
  "Your AI agent detects the change",
  "IndexFast MCP submits it instantly",
  "Google indexes it within hours",
];

export default function DifferentiationSection() {
  return (
    <>
      {/* Edge features */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Why IndexFast
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Built for indexing speed
            </h2>
            <p className="max-w-xl text-base text-muted-foreground">
              Built for indexing, not vanity metrics. Here's why high-velocity
              teams switch to us.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((item) => (
              <div
                key={item.title}
                className="space-y-2 rounded-lg border border-border bg-card p-5"
              >
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MCP integration */}
      <section className="border-t border-border bg-card py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              MCP — Model Context Protocol
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Let your AI agent index while you code
            </h2>
            <p className="max-w-xl text-base text-muted-foreground">
              Connect IndexFast to Cursor, Claude Code, Windsurf, or Kilocode.
              Your agent auto-indexes every new page the moment you ship — zero
              manual work.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left — supported agents + setup */}
            <div className="space-y-6">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Supported agents
                </p>
                <div className="flex flex-wrap gap-2">
                  {agents.map((a) => (
                    <span
                      key={a}
                      className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-border bg-background p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Setup
                </p>
                <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-muted-foreground">
{`URL:  https://indexfast.co/api/mcp
Auth: Bearer idx_YOUR_KEY`}
                </pre>
              </div>

              <p className="text-sm text-muted-foreground">
                Say{" "}
                <span className="font-medium text-foreground">
                  &ldquo;Index this page for me&rdquo;
                </span>{" "}
                to your agent after setup and your content will appear in Google
                within hours.
              </p>
            </div>

            {/* Right — tools & workflow */}
            <div className="space-y-6">
              <div className="rounded-lg border border-border bg-background p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Available MCP tools
                </p>
                <div className="space-y-2.5">
                  {mcpTools.map((tool) => (
                    <div key={tool.name}>
                      <code className="text-xs font-semibold text-foreground">
                        {tool.name}
                      </code>
                      <p className="text-xs text-muted-foreground">
                        {tool.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-border bg-background p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Auto-index workflow
                </p>
                <ol className="space-y-1.5 text-sm text-muted-foreground">
                  {workflow.map((step, i) => (
                    <li key={i}>
                      {i + 1}. {step}
                    </li>
                  ))}
                </ol>
              </div>

              <Link
                href="/dashboard/mcp"
                className="inline-flex items-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
              >
                Set up your AI agent
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
