'use client'

import { useEffect, useState } from 'react'
import { BUSINESS, whatsappHref } from '@/lib/products'
import { WhatsAppIcon } from '@/components/whatsapp-icon'

export function WhatsAppFab() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <a
      href={whatsappHref(`Hola ${BUSINESS.name}! Quiero hacer una consulta.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className={`fixed bottom-5 right-5 z-50 inline-flex h-14 items-center gap-2.5 rounded-full bg-primary px-4 text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <WhatsAppIcon className="size-6" />
      <span className="pr-1 text-sm font-medium max-sm:hidden">Pedir por WhatsApp</span>
    </a>
  )
}
