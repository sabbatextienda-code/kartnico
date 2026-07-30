'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Comprobación inicial de la cookie para dar respuesta inmediata
    const hasCookie = document.cookie.split(';').some((item) => item.trim().startsWith('sb-admin-token='))
    if (hasCookie) {
      setSession({ user: true })
      setLoading(false)
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session)
        setLoading(false)
      } else {
        const hasCookieNow = document.cookie.split(';').some((item) => item.trim().startsWith('sb-admin-token='))
        if (!hasCookieNow) {
          setSession(null)
          setLoading(false)
          router.push('/admin/login')
        } else {
          setSession({ user: true })
          setLoading(false)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-10 text-primary animate-spin" />
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Verificando sesión...
          </span>
        </div>
      </div>
    )
  }

  if (!session) return null

  return <>{children}</>
}
