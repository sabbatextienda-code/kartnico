import { BUSINESS } from '@/lib/products'

export function SiteFooter() {
  return (
    <footer id="contacto" className="scroll-mt-20 border-t border-border bg-card/40 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()} {BUSINESS.name}. Todos los derechos reservados.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <span>{BUSINESS.location}</span>
          <a
            href={`https://instagram.com/${BUSINESS.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Instagram
          </a>
          <a
            href={`mailto:${BUSINESS.email}`}
            className="hover:text-foreground transition-colors"
          >
            {BUSINESS.email}
          </a>
          <span>{BUSINESS.phoneLabel}</span>
        </div>
      </div>
    </footer>
  )
}
