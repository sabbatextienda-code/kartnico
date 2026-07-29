'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Loader2, Upload, Trash2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { compressImage } from '@/lib/image-compressor'
import { createProductDb, getCategoriesDb } from '@/app/admin/actions'

interface Category {
  id: string
  label: string
  short: string
}

export default function NewProductPage() {
  const router = useRouter()

  // Auth state
  const [session, setSession] = useState<any>(null)
  const [loadingAuth, setLoadingAuth] = useState(true)

  // Form states
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCats, setLoadingCats] = useState(true)

  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [sku, setSku] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [image, setImage] = useState('')
  const [featured, setFeatured] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const [description, setDescription] = useState('')

  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  // Comprobar autenticación
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoadingAuth(false)
      if (!session) {
        router.push('/admin/login')
      }
    })
  }, [router])

  // Cargar categorías
  useEffect(() => {
    if (session) {
      getCategoriesDb()
        .then((cats) => {
          setCategories(cats)
          if (cats.length > 0) {
            setCategoryId(cats[0].id)
          }
        })
        .finally(() => setLoadingCats(false))
    }
  }, [session])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      // 1. Comprimir imagen localmente en el navegador
      const compressed = await compressImage(file)

      // 2. Subir a Supabase Storage
      const formData = new FormData()
      formData.append('file', compressed)

      const imageUrl = await uploadProductImageDbHelper(formData)
      setImage(imageUrl)
    } catch (err: any) {
      console.error('Error al subir imagen:', err)
      setError(err.message || 'Error al subir la imagen.')
    } finally {
      setUploading(false)
    }
  }

  // Helper para importar upload desde actions
  const uploadProductImageDbHelper = async (formData: FormData) => {
    const { uploadProductImageDb } = await import('@/app/admin/actions')
    return uploadProductImageDb(formData)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    if (!name || !brand || !sku || !categoryId || !price || !stock || !description) {
      setError('Por favor completá todos los campos obligatorios.')
      setSaving(false)
      return
    }

    const priceNum = Math.round(parseFloat(price))
    const stockNum = Math.round(parseFloat(stock))

    if (isNaN(priceNum) || priceNum < 0) {
      setError('El precio debe ser un número positivo.')
      setSaving(false)
      return
    }

    if (isNaN(stockNum) || stockNum < 0) {
      setError('El stock debe ser un número entero mayor o igual a 0.')
      setSaving(false)
      return
    }

    try {
      await createProductDb({
        name: name.trim(),
        brand: brand.trim(),
        sku: sku.trim().toUpperCase(),
        category_id: categoryId,
        price: priceNum,
        image: image || '/placeholder.svg',
        stock: stockNum,
        featured,
        is_active: isActive,
        description: description.trim(),
      })
      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Error al crear el producto. Verificá que el SKU sea único.')
    } finally {
      setSaving(false)
    }
  }

  if (loadingAuth || (session && loadingCats)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-10 text-primary animate-spin" />
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Cargando formulario...</span>
        </div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative py-12 px-4 sm:px-6 lg:px-8">
      {/* Fondo reticular */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col gap-6 animate-fade-up">
        {/* Botón de retroceso */}
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Volver al Panel
          </Link>
        </div>

        {/* Encabezado */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Agregar Nuevo Producto</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Completá la información técnica y de inventario para el nuevo repuesto.
          </p>
        </div>

        {/* Formulario Card */}
        <div className="rounded-2xl border border-border bg-card shadow-lg p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-xs text-destructive">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                  Nombre del Producto *
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Neumático Slick Competición"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="brand" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                  Marca *
                </label>
                <input
                  id="brand"
                  type="text"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Ej. Vega XM"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="sku" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                  Código / SKU *
                </label>
                <input
                  id="sku"
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="Ej. VEG-XM-104"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                  Categoría *
                </label>
                <select
                  id="category"
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="price" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                  Precio Base (ARS) *
                </label>
                <input
                  id="price"
                  type="number"
                  required
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="89000"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono font-bold"
                />
              </div>

              <div>
                <label htmlFor="stock" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                  Stock Inicial Físico *
                </label>
                <input
                  id="stock"
                  type="number"
                  required
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="12"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono font-bold"
                />
              </div>
            </div>

            {/* Selector de Imagen */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                Imagen del Producto
              </label>

              {image ? (
                <div className="relative w-44 h-32 rounded-xl overflow-hidden border border-border group bg-secondary/30">
                  <Image src={image} alt="Vista previa" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setImage('')}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Eliminar imagen"
                  >
                    <Trash2 className="size-6 text-destructive" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-8 bg-secondary/5 hover:bg-secondary/15 hover:border-primary/55 cursor-pointer transition-all duration-200">
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="size-8 text-primary animate-spin" />
                      <span className="text-xs text-muted-foreground font-medium">Comprimiendo y subiendo a Supabase...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-center">
                      <Upload className="size-8 text-muted-foreground" />
                      <span className="text-xs font-semibold">Subir imagen del repuesto</span>
                      <span className="text-[10px] text-muted-foreground">PNG o JPG de hasta 10MB - Autocompresión WebP</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="description" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                Descripción Técnica *
              </label>
              <textarea
                id="description"
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Indicar detalles como compuesto, compatibilidad de chasis, medidas, etc."
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"
              />
            </div>

            {/* Checkboxes de Configuración */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2">
              <label className="flex items-center gap-3 rounded-xl border border-border bg-secondary/5 hover:bg-secondary/10 p-3.5 text-sm cursor-pointer select-none transition-colors">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="size-4.5 rounded accent-primary cursor-pointer shrink-0"
                />
                <div>
                  <span className="block font-semibold text-sm">Destacar repuesto</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5 block leading-normal">Se mostrará en la sección de novedades principales</span>
                </div>
              </label>

              <label className="flex items-center gap-3 rounded-xl border border-border bg-secondary/5 hover:bg-secondary/10 p-3.5 text-sm cursor-pointer select-none transition-colors">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="size-4.5 rounded accent-primary cursor-pointer shrink-0"
                />
                <div>
                  <span className="block font-semibold text-sm">Publicar en la Web</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5 block leading-normal">Hacerlo visible en el catálogo de clientes de inmediato</span>
                </div>
              </label>
            </div>

            {/* Acciones del Formulario */}
            <div className="flex justify-end gap-3 border-t border-border pt-5 mt-4">
              <Link
                href="/admin"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-5 text-sm font-semibold hover:bg-muted transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={saving || uploading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                {saving && <Loader2 className="size-4 animate-spin" />}
                Crear Producto
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
