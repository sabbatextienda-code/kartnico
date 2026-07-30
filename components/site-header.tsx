'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Lock, MapPin, Menu, X } from 'lucide-react'
import { BUSINESS, whatsappHref } from '@/lib/products'
import { WhatsAppIcon } from '@/components/whatsapp-icon'

const NAV = [
  { href: '/#catalogo', label: 'Catálogo' },
  { href: '/#como-comprar', label: 'Cómo comprar' },
  { href: '/#nosotros', label: 'Nosotros' },
  { href: '/#contacto', label: 'Contacto' },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'border-b border-border bg-background/90 backdrop-blur-md shadow-sm'
          : 'border-b border-transparent bg-background/60 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <Image
            src="/logoblanco.webp"
            alt={BUSINESS.name}
            width={220}
            height={60}
            className="h-12 sm:h-14 w-auto object-contain"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={whatsappHref(`Hola ${BUSINESS.name}! Quiero hacer una consulta.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            <WhatsAppIcon className="size-4" />
            Consultar
          </a>

          {/* Botón de acceso de administración oculto de forma sutil */}
          <Link
            href="/admin/login"
            className="inline-flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground/30 hover:text-foreground/80 hover:border-foreground/20 transition-all"
            title="Acceso de Administración"
          >
            <Lock className="size-4" />
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-9 items-center justify-center rounded-md border border-border text-foreground md:hidden"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-2 sm:px-6">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-border/70 py-3 text-sm font-medium text-foreground last:border-0"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="py-3 text-xs font-mono text-muted-foreground hover:text-foreground"
            >
              Acceso Administración
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
