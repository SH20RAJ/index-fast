const testimonials = [
  {
    quote:
      "We used to wait days for fresh pages to appear. With IndexFast, our launch URLs start getting discovered the same day.",
    name: "Aarav Mehta",
    role: "SEO Manager, Northlane Commerce",
  },
  {
    quote:
      "The sitemap auto-sync plus Bing and IndexNow submissions removed hours of manual SEO ops every week.",
    name: "Sophia Reed",
    role: "Growth Marketer, CloudPilot",
  },
  {
    quote:
      "For a lean team, this became our indexing control center. We publish, submit, and monitor without extra tooling.",
    name: "Priya Nair",
    role: "Founder, Rankforge Studio",
  },
];

export default function Testimonials() {
  return (
    <section className="border-b border-border py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            What teams say after switching
          </h2>
          <p className="mt-3 text-muted-foreground">
            Real operators, real outcomes from faster indexing.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <blockquote
              key={item.name}
              className="flex flex-col justify-between rounded-lg border border-border p-6"
            >
              <p className="text-sm leading-relaxed text-foreground">
                &ldquo;{item.quote}&rdquo;
              </p>
              <footer className="mt-4 pt-4 border-t border-border">
                <p className="text-sm font-medium text-foreground">
                  {item.name}
                </p>
                <p className="text-xs text-muted-foreground">{item.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
