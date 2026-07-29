import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { BrandMarquee } from '@/components/brand-marquee'
import { Catalog } from '@/components/catalog'
import { HowToBuy } from '@/components/how-to-buy'
import { AboutCta } from '@/components/about-cta'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppFab } from '@/components/whatsapp-fab'

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <BrandMarquee />
        <Catalog />
        <HowToBuy />
        <AboutCta />
      </main>
      <SiteFooter />
      <WhatsAppFab />
    </>
  )
}
