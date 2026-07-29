'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  Plus,
  Edit,
  Trash2,
  LogOut,
  Globe,
  Package,
  Loader2,
  SlidersHorizontal,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { currency } from '@/lib/products'
import { EditProductModal } from '@/components/admin/edit-product-modal'
import {
  getProductsDb,
  getCategoriesDb,
  deleteProductDb,
} from '@/app/admin/actions'

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

export default function AdminDashboardPage() {
  const router = useRouter()
  
  // Auth state
  const [session, setSession] = useState<any>(null)
  const [loadingAuth, setLoadingAuth] = useState(true)

  // Data states
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingData, setLoadingData] = useState(true)

  // Filters and Pagination states
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  // Comprobar autenticación
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoadingAuth(false)
      if (!session) {
        router.push('/admin/login')
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (!session) {
        router.push('/admin/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  // Cargar datos
  const loadData = async () => {
    setLoadingData(true)
    try {
      const [dbProducts, dbCategories] = await Promise.all([
        getProductsDb(),
        getCategoriesDb(),
      ])
      setProducts(dbProducts)
      setCategories(dbCategories)
    } catch (error) {
      console.error('Error al cargar datos:', error)
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    if (session) {
      loadData()
    }
  }, [session])

  // Resetear a página 1 si cambian los filtros
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, categoryFilter])

  // Cerrar sesión
  const handleLogout = async () => {
    document.cookie = 'sb-admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  // Filtrado de productos en memoria
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return products.filter((p) => {
      const matchesCat = categoryFilter === 'all' || p.category === categoryFilter
      const matchesQuery =
        q === '' ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      return matchesCat && matchesQuery
    })
  }, [products, searchQuery, categoryFilter])

  // Paginación (10 productos por página)
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * 10
    const end = start + 10
    return filteredProducts.slice(start, end)
  }, [filteredProducts, currentPage])

  const totalPages = useMemo(() => {
    return Math.ceil(filteredProducts.length / 10) || 1
  }, [filteredProducts])

  // Métricas
  const metrics = useMemo(() => {
    const total = products.length
    const totalValuation = products.reduce((acc, p) => acc + p.price * p.stock, 0)
    return { total, totalValuation }
  }, [products])

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.')) {
      return
    }
    setActionLoadingId(id)
    try {
      await deleteProductDb(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      console.error(err)
      alert('Error al eliminar el producto')
    } finally {
      setActionLoadingId(null)
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
              <Image
                src="/logo.webp"
                alt="KartNico"
                width={110}
                height={28}
                className="h-7 w-auto object-contain"
                priority
              />
              <div className="h-4 w-px bg-border hidden sm:block" />
              <span className="hidden sm:inline-block rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-primary font-semibold">
                Control de Stock
              </span>
            </div>

            {/* Menú de Navegación del Panel */}
            <nav className="flex items-center gap-2">
              <Link
                href="/"
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-semibold hover:bg-muted transition-all"
              >
                <Globe className="size-3.5" />
                Ver Tienda
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-destructive/10 border border-destructive/20 px-3 text-xs font-semibold text-destructive hover:bg-destructive hover:text-white transition-all"
              >
                <LogOut className="size-3.5" />
                Salir
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Cuerpo del Dashboard */}
      <main className="relative z-10 mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8 flex-1 flex flex-col gap-6 animate-fade-up">
        
        {/* Encabezado y Accesos Directos Prominentes */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          
          {/* Métrica 1: Total Repuestos */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-3 text-primary shrink-0">
              <Package className="size-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">Total Repuestos</span>
              <span className="text-xl font-bold tracking-tight mt-0.5 block">{loadingData ? '...' : metrics.total}</span>
            </div>
          </div>

          {/* Métrica 2: Valoración */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex items-center gap-4">
            <div className="rounded-xl bg-success/10 p-3 text-success shrink-0">
              <TrendingUp className="size-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">Valorización Stock</span>
              <span className="text-xl font-bold tracking-tight text-success mt-0.5 block">{loadingData ? '...' : currency(metrics.totalValuation)}</span>
            </div>
          </div>

          {/* Acceso Directo 1: Agregar Repuesto (Llamativo) */}
          <Link
            href="/admin/products/new"
            className="rounded-2xl border border-primary/30 bg-primary/5 hover:bg-primary/10 p-5 shadow-sm flex items-center gap-4 transition-all hover:scale-[1.02] active:scale-[0.98] group cursor-pointer"
          >
            <div className="rounded-xl bg-primary text-primary-foreground p-3 shrink-0">
              <Plus className="size-6" />
            </div>
            <div>
              <span className="text-sm font-bold text-primary block leading-none">Agregar Repuesto</span>
              <span className="text-[10px] text-muted-foreground mt-1 block">Cargar nuevo artículo</span>
            </div>
          </Link>

          {/* Acceso Directo 2: Gestionar Categorías (Llamativo) */}
          <Link
            href="/admin/categories"
            className="rounded-2xl border border-border bg-card hover:border-muted-foreground/30 p-5 shadow-sm flex items-center gap-4 transition-all hover:scale-[1.02] active:scale-[0.98] group cursor-pointer"
          >
            <div className="rounded-xl bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary p-3 shrink-0 transition-colors">
              <Bookmark className="size-6" />
            </div>
            <div>
              <span className="text-sm font-bold text-foreground block leading-none">Gestionar Categorías</span>
              <span className="text-[10px] text-muted-foreground mt-1 block">Administrar rubros</span>
            </div>
          </Link>

        </div>

        {/* Panel y Tabla Principal de Productos */}
        <section className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden flex flex-col">
          
          {/* Controles superiores */}
          <div className="p-5 border-b border-border flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card/30">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              
              {/* Buscador */}
              <div className="relative flex-1 max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre, marca o SKU..."
                  className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Selector de Categoría */}
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="h-10 rounded-xl border border-border bg-background px-3.5 pr-9 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer font-semibold"
                >
                  <option value="all">Todas las categorías</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.short}
                    </option>
                  ))}
                </select>
                <SlidersHorizontal className="pointer-events-none absolute right-3.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Tabla Despejada */}
          <div className="overflow-x-auto">
            {loadingData ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="size-8 text-primary animate-spin" />
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Consultando base de datos...</span>
              </div>
            ) : paginatedProducts.length > 0 ? (
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/15 font-mono text-[10px] uppercase tracking-wider text-muted-foreground select-none">
                    <th className="p-4 w-18 text-center">Imagen</th>
                    <th className="p-4 w-28">Código / SKU</th>
                    <th className="p-4">Detalle Producto</th>
                    <th className="p-4">Categoría</th>
                    <th className="p-4 text-right">Precio Base</th>
                    <th className="p-4 text-center w-28">Stock</th>
                    <th className="p-4 text-center w-36">Estado Web</th>
                    <th className="p-4 text-center w-24">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginatedProducts.map((p) => {
                    const cat = categories.find((c) => c.id === p.category)

                    return (
                      <tr
                        key={p.id}
                        className={`hover:bg-secondary/10 transition-colors duration-150 ${
                          p.is_active === false ? 'opacity-70 bg-secondary/5' : ''
                        }`}
                      >
                        {/* Imagen */}
                        <td className="p-4">
                          <div className="relative size-11 rounded-lg border border-border bg-secondary/30 overflow-hidden shrink-0 flex items-center justify-center mx-auto">
                            <Image
                              src={p.image || '/placeholder.svg'}
                              alt={p.name}
                              fill
                              sizes="44px"
                              className="object-cover"
                            />
                          </div>
                        </td>

                        {/* SKU */}
                        <td className="p-4 font-mono text-xs font-semibold">
                          {p.sku}
                        </td>

                        {/* Producto */}
                        <td className="p-4">
                          <div className="font-semibold text-sm text-foreground">{p.name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{p.brand}</div>
                        </td>

                        {/* Categoría */}
                        <td className="p-4">
                          <span className="text-xs font-medium text-muted-foreground border border-border/70 bg-secondary/10 rounded px-2 py-0.5">
                            {cat ? cat.short : p.category}
                          </span>
                        </td>

                        {/* Precio */}
                        <td className="p-4 text-right font-mono font-bold text-sm text-foreground">
                          {currency(p.price)}
                        </td>

                        {/* Stock */}
                        <td className="p-4 text-center font-mono font-semibold text-sm text-foreground">
                          {p.stock} u.
                        </td>

                        {/* Estados (Pills simples) */}
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 justify-center flex-wrap max-w-32 mx-auto">
                            {p.is_active !== false ? (
                              <span className="inline-flex items-center gap-1 rounded bg-success/10 border border-success/20 px-2 py-0.5 text-[10px] font-semibold text-success">
                                Publicado
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded bg-secondary border border-border px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                                Oculto
                              </span>
                            )}

                            {p.featured && (
                              <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-500">
                                Destacado
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Acciones */}
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedProduct(p)
                                setIsEditModalOpen(true)
                              }}
                              className="size-8 rounded-lg border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-all cursor-pointer"
                              title="Editar producto"
                            >
                              <Edit className="size-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
                              disabled={actionLoadingId === p.id}
                              className="size-8 rounded-lg border border-destructive/20 bg-destructive/10 flex items-center justify-center text-destructive hover:bg-destructive hover:text-white active:scale-95 transition-all cursor-pointer"
                              title="Eliminar producto"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Package className="size-12 text-muted-foreground/60 mb-2" />
                <p className="text-sm font-semibold text-muted-foreground">No encontramos productos en el inventario.</p>
              </div>
            )}
          </div>

          {/* Paginación */}
          {filteredProducts.length > 0 && (
            <div className="p-4 border-t border-border flex items-center justify-between gap-4 bg-card/20 select-none">
              <span className="text-xs text-muted-foreground font-medium">
                Mostrando <span className="text-foreground">{(currentPage - 1) * 10 + 1}</span> a{' '}
                <span className="text-foreground">{Math.min(currentPage * 10, filteredProducts.length)}</span> de{' '}
                <span className="text-foreground">{filteredProducts.length}</span> repuestos
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex size-8.5 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted active:scale-90 disabled:opacity-45 disabled:pointer-events-none transition-all cursor-pointer"
                  title="Página Anterior"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <span className="text-xs font-mono font-semibold px-2">
                  Pág. {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="inline-flex size-8.5 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted active:scale-90 disabled:opacity-45 disabled:pointer-events-none transition-all cursor-pointer"
                  title="Siguiente Página"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          )}

        </section>
      </main>

      {/* Modal de Edición Inline */}
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedProduct(null)
        }}
        product={selectedProduct}
        categories={categories}
        onSaveSuccess={loadData}
      />
    </div>
  )
}
