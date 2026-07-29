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
export const PRODUCTS: Product[] = [
  {
    id: 'neu-slick-vega',
    name: 'Neumático Slick Competición',
    brand: 'Vega XM',
    sku: 'VEG-XM-104',
    category: 'neumaticos',
    price: 89000,
    image: '/products/neumatico-slick.png',
    stock: 12,
    featured: true,
    description:
      'Compuesto blando para pista seca. Máximo agarre y salida de curva. Medida 10x4.60-5.',
  },
  {
    id: 'neu-llanta-mg',
    name: 'Llanta de Magnesio 5"',
    brand: 'Alu-Race',
    sku: 'ALR-MG-5',
    category: 'neumaticos',
    price: 145000,
    image: '/products/llanta-magnesio.png',
    stock: 6,
    description:
      'Llanta ultraliviana de aleación de magnesio. Menor peso no suspendido y mejor disipación de calor.',
  },
  {
    id: 'cha-crg-rebel',
    name: 'Chasis Road Rebel',
    brand: 'CRG',
    sku: 'CRG-RR-30',
    category: 'chasis',
    price: 1250000,
    image: '/products/chasis-kart.png',
    stock: 3,
    featured: true,
    description:
      'Chasis tubular homologado CIK/FIA de 30mm. Geometría de competición para categorías senior.',
  },
  {
    id: 'cha-carroceria',
    name: 'Kit Carrocería CIK/FIA',
    brand: 'KG 506',
    sku: 'KG-506-KIT',
    category: 'chasis',
    price: 178000,
    image: '/products/carroceria-kit.png',
    stock: 9,
    description:
      'Trompa, pontones laterales y panel frontal homologados. Kit completo con fijaciones.',
  },
  {
    id: 'lub-aceite-2t',
    name: 'Aceite Sintético 2T',
    brand: 'Motul 800',
    sku: 'MTL-800-1L',
    category: 'lubricantes',
    price: 32000,
    image: '/products/aceite-2t.png',
    stock: 40,
    featured: true,
    description:
      'Lubricante 100% sintético para motores 2 tiempos de alta exigencia. Botella 1 litro.',
  },
  {
    id: 'lub-filtro-aire',
    name: 'Filtro de Aire Cónico',
    brand: 'PowerFlow',
    sku: 'PF-CON-52',
    category: 'lubricantes',
    price: 21500,
    image: '/products/filtro-aire.png',
    stock: 18,
    description:
      'Filtro de alto flujo lavable y reutilizable. Boca de 52mm, mejora la respuesta del motor.',
  },
  {
    id: 'equ-casco',
    name: 'Casco Integral',
    brand: 'KartNico Pro',
    sku: 'KN-HLM-01',
    category: 'equipacion',
    price: 235000,
    image: '/products/casco-integral.png',
    stock: 7,
    featured: true,
    description:
      'Casco integral liviano con visor antivaho. Homologado para karting. Talles S a XL.',
  },
  {
    id: 'equ-buzo',
    name: 'Buzo de Piloto CIK',
    brand: 'KartNico Race',
    sku: 'KN-SUIT-2',
    category: 'equipacion',
    price: 198000,
    image: '/products/buzo-piloto.png',
    stock: 0,
    description:
      'Traje de competición homologado CIK nivel 2. Tejido transpirable y refuerzos de alto impacto.',
  },
  {
    id: 'equ-guantes',
    name: 'Guantes de Competición',
    brand: 'KartNico Grip',
    sku: 'KN-GLV-9',
    category: 'equipacion',
    price: 42000,
    image: '/products/guantes-piloto.png',
    stock: 22,
    description:
      'Guantes con palma de silicona antideslizante y protección de nudillos. Máximo control del volante.',
  },
]

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
