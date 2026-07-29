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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
      if (!session) {
        // Borrar cookie por seguridad si no hay sesión real de Supabase
        document.cookie = 'sb-admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
        router.push('/admin/login')
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
      if (!session) {
        document.cookie = 'sb-admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;'
        router.push('/admin/login')
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
