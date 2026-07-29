import { SiteHeader } from '@/components/site-header'
import { FullCatalog } from '@/components/full-catalog'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppFab } from '@/components/whatsapp-fab'
import { getCategoriesDb, getProductsDb } from '@/app/admin/actions'

export const metadata = {
  title: 'Catálogo de Repuestos | KartNico',
  description: 'Explorá nuestro catálogo de repuestos de competición, chasis, neumáticos y equipación para karting.',
}

export default async function CatalogPage() {
  const [initialProducts, initialCategories] = await Promise.all([
    getProductsDb(true),
    getCategoriesDb(),
  ])

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background relative">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
        <FullCatalog initialProducts={initialProducts} initialCategories={initialCategories} />
      </main>
      <SiteFooter />
      <WhatsAppFab />
    </>
  )
}
