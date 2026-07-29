'use client'

import { useEffect, useState } from 'react'
import { X, Upload, Loader2, Trash2 } from 'lucide-react'
import { compressImage } from '@/lib/image-compressor'
import { updateProductDb, uploadProductImageDb } from '@/app/admin/actions'

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

interface EditProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  categories: Category[]
  onSaveSuccess: () => void
}

export function EditProductModal({
  isOpen,
  onClose,
  product,
  categories,
  onSaveSuccess,
}: EditProductModalProps) {
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

  useEffect(() => {
    if (product) {
      setName(product.name)
      setBrand(product.brand)
      setSku(product.sku)
      setCategoryId(product.category)
      setPrice(String(product.price))
      setStock(String(product.stock))
      setImage(product.image)
      setFeatured(product.featured ?? false)
      setIsActive(product.is_active ?? true)
      setDescription(product.description)
    }
    setError('')
  }, [product, isOpen])

  if (!isOpen || !product) return null

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

      const imageUrl = await uploadProductImageDb(formData)
      setImage(imageUrl)
    } catch (err: any) {
      console.error('Error al subir imagen:', err)
      setError(err.message || 'Error al subir la imagen.')
    } finally {
      setUploading(false)
    }
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
      await updateProductDb(product.id, {
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
      onSaveSuccess()
      onClose()
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Error al actualizar el producto. Verificá que el SKU sea único.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <h3 className="text-base font-bold">Editar Producto</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 flex-1">
          {error && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-xs text-destructive">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="modal-name" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                Nombre *
              </label>
              <input
                id="modal-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre del producto"
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="modal-brand" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                Marca *
              </label>
              <input
                id="modal-brand"
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ej. Vega"
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="modal-sku" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                Código / SKU *
              </label>
              <input
                id="modal-sku"
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="Ej. VEG-XM-104"
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="modal-category" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                Categoría *
              </label>
              <select
                id="modal-category"
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="modal-price" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                Precio (ARS) *
              </label>
              <input
                id="modal-price"
                type="number"
                required
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="89000"
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono font-bold"
              />
            </div>

            <div>
              <label htmlFor="modal-stock" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
                Stock Físico *
              </label>
              <input
                id="modal-stock"
                type="number"
                required
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="12"
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono font-bold"
              />
            </div>
          </div>

          {/* Cargador de Imágenes */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
              Imagen del Producto
            </label>
            
            {image ? (
              <div className="relative w-40 h-28 rounded-xl overflow-hidden border border-border group bg-secondary/35">
                <img src={image} alt="Vista previa" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImage('')}
                  className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Eliminar imagen"
                >
                  <Trash2 className="size-5 text-destructive" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-6 bg-secondary/5 hover:bg-secondary/15 hover:border-primary/55 cursor-pointer transition-colors duration-200">
                {uploading ? (
                  <div className="flex flex-col items-center gap-1.5">
                    <Loader2 className="size-6 text-primary animate-spin" />
                    <span className="text-xs text-muted-foreground font-medium">Subiendo imagen...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-center">
                    <Upload className="size-6 text-muted-foreground" />
                    <span className="text-xs font-semibold">Subir imagen</span>
                    <span className="text-[10px] text-muted-foreground">Auto-optimiza a WebP</span>
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

          <div>
            <label htmlFor="modal-description" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
              Descripción Técnica *
            </label>
            <textarea
              id="modal-description"
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles técnicos..."
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-y"
            />
          </div>

          <div className="flex flex-col gap-2 pt-2 sm:flex-row">
            <label className="flex items-center gap-3 rounded-xl border border-border bg-secondary/5 p-3 text-sm cursor-pointer flex-1 select-none">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="size-4.5 rounded accent-primary cursor-pointer"
              />
              <div>
                <span className="block font-semibold">Destacado</span>
                <span className="text-[10px] text-muted-foreground mt-0.5 block">Sección Novedades</span>
              </div>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-border bg-secondary/5 p-3 text-sm cursor-pointer flex-1 select-none">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="size-4.5 rounded accent-primary cursor-pointer"
              />
              <div>
                <span className="block font-semibold">Publicado Web</span>
                <span className="text-[10px] text-muted-foreground mt-0.5 block">Visible en la web</span>
              </div>
            </label>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="h-10 rounded-xl border border-border bg-background px-4 text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-primary px-5 text-xs font-semibold text-primary-foreground hover:-translate-y-0.5 transition-transform disabled:opacity-50 cursor-pointer"
            >
              {saving && <Loader2 className="size-3.5 animate-spin" />}
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
