import Image from 'next/image'
import {
  BUSINESS,
  currency,
  productOrderMessage,
  whatsappHref,
  type Product,
} from '@/lib/products'
import { WhatsAppIcon } from '@/components/whatsapp-icon'

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
        <span className="size-1.5 rounded-full bg-muted-foreground/50" />
        Sin stock
      </span>
    )
  }
  if (stock <= 3) {
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-primary">
        <span className="size-1.5 rounded-full bg-primary animate-pulse-dot" />
        Últimas {stock} u.
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-success">
      <span className="size-1.5 rounded-full bg-success" />
      Disponible · {stock} u.
    </span>
  )
}

export function ProductCard({ product }: { product: Product }) {
  const out = product.stock === 0
  const message = out
    ? `Hola ${BUSINESS.name}! Quiero que me avisen cuando llegue stock de ${product.name} (${product.sku}).`
    : productOrderMessage(product)

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.18)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <Image
          src={product.image || '/placeholder.svg'}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-md border border-border bg-background/85 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground backdrop-blur">
          {product.sku}
        </span>
        {out && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-[1px]">
            <span className="rounded-md bg-foreground/90 px-3 py-1 text-xs font-medium text-background">
              Agotado
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary">
          {product.brand}
        </p>
        <h3 className="mt-1 text-base font-semibold leading-snug tracking-tight">
          {product.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>

        <div className="mt-4 flex items-end justify-between gap-2">
          <span className="text-xl font-semibold tracking-tight">
            {currency(product.price)}
          </span>
          <StockBadge stock={product.stock} />
        </div>

        <a
          href={whatsappHref(message)}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all ${out
              ? 'border border-border bg-background text-foreground hover:bg-muted'
              : 'bg-primary text-primary-foreground hover:-translate-y-0.5'
            }`}
        >
          <WhatsAppIcon className="size-4" />
          {out ? 'Avisame cuando llegue' : 'Pedir por WhatsApp'}
        </a>
      </div>
    </article>
  )
}
