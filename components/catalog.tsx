import Link from 'next/link'
import { ArrowRight, SlidersHorizontal } from 'lucide-react'
import { ProductCard } from '@/components/product-card'
import { getProductsDb } from '@/app/admin/actions'

export async function Catalog() {
  // Obtenemos los productos activos de la base de datos
  const products = await getProductsDb(true)

  // Priorizamos productos destacados (featured), si no hay suficientes completamos con los más recientes
  const featured = products.filter((p) => p.featured)
  const displayProducts = featured.length >= 3 
    ? featured.slice(0, 3) 
    : [...featured, ...products.filter((p) => !p.featured)].slice(0, 3)

  return (
    <section id="catalogo" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-24 animate-fade-up">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
            <SlidersHorizontal className="size-3.5" />
            Novedades
          </p>
          <h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Últimos repuestos ingresados
          </h2>
          <p className="mt-2 max-w-lg text-pretty leading-relaxed text-muted-foreground">
            Una muestra de nuestros últimos ingresos. Hacé clic en "Ver catálogo completo" para explorar y filtrar todos los repuestos disponibles.
          </p>
        </div>
      </div>

      {displayProducts.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 border-t border-border pt-8">
          {displayProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-dashed border-border bg-card/50 py-16 text-center">
          <p className="text-sm text-muted-foreground">No hay repuestos disponibles en este momento.</p>
        </div>
      )}

      <div className="mt-12 flex justify-center">
        <Link
          href="/catalog"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow-md transition-transform hover:-translate-y-0.5"
        >
          Ver catálogo completo
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  )
}
