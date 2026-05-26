export default function PainSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
          Not indexed? You don't exist.
        </h2>

        <div className="mt-6 space-y-4 text-base text-muted-foreground leading-relaxed">
          <p>
            You spent hours writing great content. You published it, waited, and
            checked your rankings. Nothing.
          </p>
          <p>
            The truth is simple: if Google doesn't index your page, it will
            never rank. Most sites wait weeks for a crawl. You can't afford to
            wait.
          </p>
        </div>
      </div>
    </section>
  );
}
