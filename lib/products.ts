// =============================================================
//  CONFIGURACIÓN DEL NEGOCIO
//  Editá estos valores para actualizar tu catálogo.
// =============================================================

// Número de WhatsApp en formato internacional, SIN "+" ni espacios.
// Ejemplo Argentina: 549 + característica sin 0 + número sin 15.
// Reemplazá este placeholder por tu número real.
export const WHATSAPP_NUMBER = '5493544684799'

export const BUSINESS = {
  name: 'KartNico',
  tagline: 'Venta de repuestos de karting de competición',
  location: 'Chamical, La Rioja',
  email: 'npodluzansky@gmail.com',
  phoneLabel: '+54 9 3544 68-4799',
  hours: 'Lun a Vie 9:00 a 12:00 · Sáb 8:00 a 12:00',
  instagram: 'Kartnico.repuestos',
} as const

export type CategoryId =
  | 'neumaticos'
  | 'chasis'
  | 'lubricantes'
  | 'equipacion'

export const CATEGORIES: { id: CategoryId; label: string; short: string }[] = [
  { id: 'neumaticos', label: 'Neumáticos y llantas', short: 'Neumáticos' },
  { id: 'chasis', label: 'Chasis y carrocería', short: 'Chasis' },
  { id: 'lubricantes', label: 'Lubricantes y consumibles', short: 'Lubricantes' },
  { id: 'equipacion', label: 'Accesorios y equipación piloto', short: 'Equipación' },
]

export type Product = {
  id: string
  name: string
  brand: string
  sku: string
  category: CategoryId
  price: number
  image: string
  stock: number
  featured?: boolean
  is_active?: boolean
  description: string
}

// price en pesos argentinos (ARS). stock = unidades disponibles.
export const PRODUCTS: Product[] = []

export const currency = (value: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value)

export function whatsappHref(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function productOrderMessage(p: Product) {
  return (
    `Hola ${BUSINESS.name}! Quiero hacer un pedido:\n\n` +
    `• Producto: ${p.name} (${p.brand})\n` +
    `• Código: ${p.sku}\n` +
    `• Precio: ${currency(p.price)}\n\n` +
    `¿Me confirman disponibilidad y forma de pago? Gracias.`
  )
}
