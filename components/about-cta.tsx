import { BUSINESS, whatsappHref } from '@/lib/products'
import { WhatsAppIcon } from '@/components/whatsapp-icon'

export function AboutCta() {
  return (
    <section id="nosotros" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-24">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
            Nosotros
          </p>
          <h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Sobre Nosotros
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
            Hola! Soy Nico y me dedico a la venta de repuestos y accesorios de karting.
            Me podés encontrar en las redes como <strong className="font-semibold text-foreground">@{BUSINESS.instagram}</strong>.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 sm:p-10">
          <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" />
          <div className="relative">
            <h3 className="text-balance text-2xl font-semibold tracking-tight">
              ¿No encontrás el repuesto que buscás?
            </h3>
            <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
              Escribinos y lo conseguimos. Trabajamos a pedido.
            </p>
            <a
              href={whatsappHref(
                `Hola ${BUSINESS.name}! Estoy buscando un repuesto específico y quería consultar disponibilidad.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              <WhatsAppIcon className="size-4" />
              Escribinos por WhatsApp
            </a>
            <p className="mt-4 font-mono text-xs text-muted-foreground">
              {BUSINESS.hours}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
