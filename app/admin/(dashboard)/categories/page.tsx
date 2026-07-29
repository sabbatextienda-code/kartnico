'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Plus, Edit, Trash2, Globe, Package, Bookmark, Star } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getCategoriesDb, createCategoryDb, updateCategoryDb, deleteCategoryDb } from '@/app/admin/actions'

interface Category {
  id: string
  label: string
  short: string
}

export default function CategoriesAdminPage() {
  const router = useRouter()

  // Auth state
  const [session, setSession] = useState<any>(null)
  const [loadingAuth, setLoadingAuth] = useState(true)

  // Data states
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingData, setLoadingData] = useState(true)

  // Form states
  const [catId, setCatId] = useState('')
  const [catLabel, setCatLabel] = useState('')
  const [catShort, setCatShort] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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
  const loadCategories = async () => {
    setLoadingData(true)
    try {
      const cats = await getCategoriesDb()
      setCategories(cats)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    if (session) {
      loadCategories()
    }
  }, [session])

  const handleEditInit = (c: Category) => {
    setEditingId(c.id)
    setCatId(c.id) // El ID de la categoría no es editable en base de datos al ser PRIMARY KEY, pero lo mostramos
    setCatLabel(c.label)
    setCatShort(c.short)
    setError('')
    setSuccess('')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setCatId('')
    setCatLabel('')
    setCatShort('')
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    if (!catId || !catLabel || !catShort) {
      setError('Por favor completa todos los campos.')
      setSaving(false)
      return
    }

    try {
      if (editingId) {
        // Actualizar
        await updateCategoryDb(editingId, {
          label: catLabel.trim(),
          short: catShort.trim(),
        })
        setSuccess('Categoría actualizada con éxito.')
      } else {
        // Crear nueva
        await createCategoryDb({
          id: catId.trim().toLowerCase(),
          label: catLabel.trim(),
          short: catShort.trim(),
        })
        setSuccess('Categoría creada con éxito.')
      }

      // Limpiar campos y refrescar
      setCatId('')
      setCatLabel('')
      setCatShort('')
      setEditingId(null)
      await loadCategories()
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Error al guardar la categoría. Comprueba que el código no esté repetido.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta categoría? Solo se podrá eliminar si no tiene repuestos asignados.')) {
      return
    }

    setError('')
    setSuccess('')

    try {
      await deleteCategoryDb(id)
      setSuccess('Categoría eliminada con éxito.')
      await loadCategories()
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'No se pudo eliminar la categoría. Asegúrate de que no tenga ningún producto asignado.')
    }
  }

  if (loadingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-10 text-primary animate-spin" />
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Verificando sesión...</span>
        </div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative flex flex-col">
      {/* Fondo reticular */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />

      {/* Cabecera del Dashboard */}
      <header className="relative z-10 border-b border-border bg-card/65 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/admin">
                <img
                  src="/logo.webp"
                  alt="KartNico"
                  className="h-7 w-auto object-contain transition-opacity hover:opacity-85"
                />
              </Link>
              <div className="h-4 w-px bg-border hidden sm:block" />
              <span className="hidden sm:inline-block rounded-full bg-primary/10 border border-primary/25 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary font-semibold">
                Gestión de Categorías
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3.5 text-xs font-semibold hover:bg-muted transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Package className="size-3.5" />
                Administrar Productos
              </Link>
              <Link
                href="/"
                target="_blank"
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3.5 text-xs font-semibold hover:bg-muted transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Globe className="size-3.5" />
                Ver Tienda
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="relative z-10 mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8 flex-1 flex flex-col gap-6 animate-fade-up">
        
        {/* Encabezado */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Categorías del Catálogo</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Administrá los rubros o secciones de la tienda. Los cambios se verán reflejados en los filtros de clientes.
          </p>
        </div>

        {/* Notificaciones */}
        {(error || success) && (
          <div className="max-w-4xl w-full">
            {error && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-xs text-destructive font-medium">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-xl border border-success/20 bg-success/10 p-4 text-xs text-success font-medium">
                {success}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-start">
          
          {/* Formulario (Columna Izquierda / 1 tercio) */}
          <div className="rounded-2xl border border-border bg-card shadow-sm p-6 flex flex-col gap-4">
            <h2 className="text-base font-bold tracking-tight border-b border-border pb-3 flex items-center gap-2">
              <Bookmark className="size-4.5 text-primary" />
              {editingId ? 'Editar Categoría' : 'Agregar Categoría'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="cat-id" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                  Código Único / ID *
                </label>
                <input
                  id="cat-id"
                  type="text"
                  required
                  disabled={!!editingId}
                  value={catId}
                  onChange={(e) => setCatId(e.target.value)}
                  placeholder="Ej. neumaticos"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono disabled:opacity-60 disabled:bg-secondary/40"
                />
                {!editingId && (
                  <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                    Identificador único para URL/Base de datos (letras y números sin espacios).
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="cat-label" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                  Nombre Largo (Label) *
                </label>
                <input
                  id="cat-label"
                  type="text"
                  required
                  value={catLabel}
                  onChange={(e) => setCatLabel(e.target.value)}
                  placeholder="Ej. Neumáticos y llantas"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium"
                />
              </div>

              <div>
                <label htmlFor="cat-short" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                  Nombre Corto *
                </label>
                <input
                  id="cat-short"
                  type="text"
                  required
                  value={catShort}
                  onChange={(e) => setCatShort(e.target.value)}
                  placeholder="Ej. Neumáticos"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium"
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                  Se usa en los botones de filtro rápido de la portada.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="h-10 rounded-xl border border-border px-4 text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-primary px-5 text-xs font-semibold text-primary-foreground shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-55"
                >
                  {saving && <Loader2 className="size-3.5 animate-spin" />}
                  {editingId ? 'Guardar Cambios' : 'Crear Categoría'}
                </button>
              </div>
            </form>
          </div>

          {/* Tabla de Categorías (Columna Derecha / 2 tercios) */}
          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden md:col-span-2">
            <div className="overflow-x-auto">
              {loadingData ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Loader2 className="size-8 text-primary animate-spin" />
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Cargando categorías...</span>
                </div>
              ) : categories.length > 0 ? (
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/20 font-mono text-[10px] uppercase tracking-wider text-muted-foreground select-none">
                      <th className="p-4 w-28">Código (ID)</th>
                      <th className="p-4">Nombre Largo</th>
                      <th className="p-4 w-36">Nombre Corto</th>
                      <th className="p-4 text-center w-28">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {categories.map((c) => (
                      <tr key={c.id} className="hover:bg-secondary/10 transition-colors group">
                        <td className="p-4 font-mono text-xs">
                          <span className="rounded-md bg-secondary border border-border px-2 py-0.5 font-semibold text-muted-foreground">
                            {c.id}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-sm">
                          {c.label}
                        </td>
                        <td className="p-4">
                          <span className="text-xs font-semibold text-muted-foreground border border-border/70 bg-secondary/15 rounded-md px-2 py-0.5">
                            {c.short}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleEditInit(c)}
                              className="size-8 rounded-lg border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-all cursor-pointer"
                              title="Editar categoría"
                            >
                              <Edit className="size-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(c.id)}
                              className="size-8 rounded-lg border border-destructive/20 bg-destructive/10 flex items-center justify-center text-destructive hover:bg-destructive hover:text-white active:scale-95 transition-all cursor-pointer"
                              title="Eliminar categoría"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <Bookmark className="size-12 text-muted-foreground/60 mb-2" />
                  <p className="text-sm font-semibold text-muted-foreground">No hay categorías cargadas.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
