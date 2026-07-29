import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { BUSINESS, whatsappHref } from '@/lib/products'
import { WhatsAppIcon } from '@/components/whatsapp-icon'

export function Hero() {
  return (
    <section id="top" className="relative w-full overflow-hidden bg-background">
      {/* Banner horizontal a pantalla completa con la imagen del kart */}
      <div className="absolute inset-0 z-0 h-full w-full pointer-events-none">
        <Image
          src="/products/hero-kart.png"
          alt="Kart de competición"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-35 dark:opacity-45 filter brightness-105 contrast-125 saturate-150 transition-all duration-700"
        />
        {/* Degradado superior para suavizar con el header */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background via-background/70 to-transparent" />
        
        {/* Degradado inferior para fusionar perfectamente con el resto de la web */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-background via-background/80 to-transparent" />
        
        {/* Degradado lateral (izquierda y derecha) para integrarse horizontalmente */}
        <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background to-transparent" />
        <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background to-transparent" />
        
        {/* Patrón reticular sutíl */}
        <div className="absolute inset-0 grid-bg opacity-30" />
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px z-10"
        style={{ background: 'linear-gradient(90deg, transparent, var(--border), transparent)' }}
      />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28 lg:py-36">
        <div className="animate-fade-up flex flex-col items-center text-center">
          <h1 className="text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            Venta Minorista de repuestos,
            <span className="block text-primary sm:inline"> y accesorios de karting.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl">
            Consultá el catalogo en tiempo real y completá tu pedido
            por WhatsApp.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3.5 sm:flex-row">
            <a
              href="#catalogo"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-7 text-sm font-medium text-primary-foreground shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              Ver catálogo
              <ArrowRight className="size-4" />
            </a>
            <a
              href={whatsappHref(`Hola ${BUSINESS.name}! Quiero hacer una consulta.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-border bg-card/80 px-7 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-muted"
            >
              <WhatsAppIcon className="size-4 text-primary" />
              Pedir por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

