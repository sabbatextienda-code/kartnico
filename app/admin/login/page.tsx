'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, Eye, EyeOff, ShieldAlert } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { BUSINESS } from '@/lib/products'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage('')
    setLoading(true)

    try {
      if (!email || !password) {
        setErrorMessage('Completá todos los campos.')
        setLoading(false)
        return
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setErrorMessage(
          error.status === 400
            ? 'Credenciales de acceso incorrectas.'
            : error.message
        )
        setLoading(false)
        return
      }

      document.cookie = 'sb-admin-token=true; path=/; max-age=86400; SameSite=Strict'
      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      setErrorMessage(
        'Error de conexión. Verificá si configuraste las claves de Supabase en tu archivo .env.'
      )
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-background flex flex-col justify-center items-center p-4 text-foreground font-sans">
      {/* Fondo reticular característico */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-50" />

      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xl">
        {/* Logo destacado */}
        <div className="flex flex-col items-center mb-6">
          <Link href="/">
            <Image
              src="/logo.webp"
              alt={BUSINESS.name}
              width={170}
              height={46}
              className="h-11 w-auto object-contain"
              priority
            />
          </Link>
          <span className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Administración
          </span>
        </div>

        {errorMessage && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            <ShieldAlert className="size-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="npodluzansky@gmail.com"
              className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? 'Ocultar' : 'Mostrar'}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6 border-t border-border pt-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  )
}
