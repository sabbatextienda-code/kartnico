const BRANDS = [
  'CST Tires',
  'Motul',
  'NGK',
]

export function BrandMarquee() {
  return (
    <section className="border-y border-border bg-card/60" aria-label="Marcas que trabajamos">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <p className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Las marcas que trabajamos
        </p>
        <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
          <div className="flex w-max animate-marquee items-center gap-12">
            {[...BRANDS, ...BRANDS].map((brand, i) => (
              <span
                key={`${brand}-${i}`}
                className="text-lg font-semibold tracking-tight text-muted-foreground/70"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
