'use client'

import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { ProductCard } from '@/components/product-card'

interface Category {
  id: string
  label: string
  short: string
}

interface Product {
  id: string
  name: string
  brand: string
  sku: string
  category: string
  price: number
  image: string
  stock: number
  featured?: boolean
  is_active?: boolean
  description: string
}

interface FullCatalogProps {
  initialProducts: Product[]
  initialCategories: Category[]
}

export function FullCatalog({ initialProducts, initialCategories }: FullCatalogProps) {
  const [filter, setFilter] = useState<string>('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return initialProducts.filter((p) => {
      const byCat = filter === 'all' || p.category === filter
      const byQuery =
        q === '' ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      return byCat && byQuery
    })
  }, [filter, query, initialProducts])

  const tabs = [
    { id: 'all', label: 'Todo' },
    ...initialCategories.map((c) => ({ id: c.id, label: c.short })),
  ]

  const inStock = initialProducts.filter((p) => p.stock > 0).length

  return (
    <section id="catalogo" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-24 animate-fade-up">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
            <SlidersHorizontal className="size-3.5" />
            Catálogo completo
          </p>
          <h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Repuestos y equipación
          </h2>
          <p className="mt-2 max-w-lg text-pretty leading-relaxed text-muted-foreground">
            {inStock} productos con stock verificado. El precio y la
            disponibilidad se confirman al hacer el pedido por WhatsApp.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, marca o código…"
            className="h-11 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/15"
            aria-label="Buscar productos"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-6">
        {tabs.map((t) => {
          const active = filter === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setFilter(t.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-xl border border-dashed border-border bg-card/50 py-16 text-center">
          <p className="text-sm text-muted-foreground">
            No encontramos productos para{' '}
            <span className="font-medium text-foreground">“{query}”</span>.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setFilter('all')
            }}
            className="mt-3 text-sm font-medium text-primary hover:underline"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </section>
  )
}
