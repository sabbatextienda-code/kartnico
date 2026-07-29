import { PackageCheck, Search, Send } from 'lucide-react'

const STEPS = [
  {
    icon: Search,
    step: '01',
    title: 'Elegí tu repuesto',
    text: 'Navegá el catálogo, filtrá por categoría y revisá el stock disponible en tiempo real.',
  },
  {
    icon: Send,
    step: '02',
    title: 'Pedí por WhatsApp',
    text: 'Tocá el botón del producto y se abre un mensaje ya armado con el código y el precio.',
  },
  {
    icon: PackageCheck,
    step: '03',
    title: 'Coordinamos la entrega',
    text: 'Confirmamos disponibilidad, forma de pago y el envío o retiro en Chamical.',
  },
]

export function HowToBuy() {
  return (
    <section
      id="como-comprar"
      className="scroll-mt-20 border-y border-border bg-card/60"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="max-w-xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
            Cómo comprar
          </p>
          <h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Tu pedido en tres pasos
          </h2>
          <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
            Sin carritos ni registros. Simple, directo y con atención personalizada.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-3 border-t border-border/60 pt-10">
          {STEPS.map((s) => (
            <div key={s.step} className="flex gap-4">
              <span className="font-mono text-3xl font-bold text-primary/45 shrink-0">
                {s.step}
              </span>
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
