const engines = [
  { name: "Google", share: "89.85%" },
  { name: "Bing", share: "5.13%" },
  { name: "Yahoo", share: "1.48%" },
  { name: "Yandex", share: "1.30%" },
  { name: "DuckDuckGo", share: "0.75%" },
  { name: "Baidu", share: "0.53%" },
  { name: "Ask", share: "0.51%" },
  { name: "Ecosia", share: "0.45%" },
  { name: "Naver", share: "0.15%" },
];

export default function SupportedEngines() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="space-y-3 pb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Global Reach
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Get indexed on every major search engine
        </h2>
        <p className="max-w-2xl text-base text-muted-foreground">
          We submit your pages directly to Google, Bing, and seven other search
          engines, plus the Internet Archive for preservation.
        </p>
      </div>

      <div className="divide-y divide-border rounded-lg border border-border">
        {engines.map((engine) => (
          <div
            key={engine.name}
            className="flex items-center justify-between px-5 py-3.5"
          >
            <span className="text-sm font-medium text-foreground">
              {engine.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {engine.share} market share
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between px-5 py-3.5">
          <span className="text-sm font-medium text-foreground">
            Internet Archive
          </span>
          <span className="text-xs text-muted-foreground">
            Archival preservation
          </span>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Market share data from Statcounter, March 2026.
      </p>
    </section>
  );
}
