'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function Navbar() {
  const [user,     setUser]     = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const supabase = createClient()
  const router   = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null))
    const { data: listener } = supabase.auth.onAuthStateChange((_, s) =>
      setUser(s?.user ?? null)
    )
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => {
      listener?.subscription.unsubscribe()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 99,
      background: 'rgba(255,255,255,0.97)',
      borderBottom: '1px solid #DCE4F5',
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>

        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: 20, fontWeight: 900, color: '#0F2044' }}>DU</span>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#FF6B35',
            display: 'inline-block', margin: '0 2px 10px' }}/>
          <span style={{ fontSize: 20, fontWeight: 900, color: '#0F2044' }}>Update</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/courses" style={{ fontSize: 14, color: '#8898B8', textDecoration: 'none' }}>
            Courses
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" style={{ background: '#0F2044', color: '#fff',
                padding: '7px 16px', borderRadius: 7,
                fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                Dashboard
              </Link>
              <button onClick={handleLogout} style={{ background: 'transparent',
                border: '1px solid #DCE4F5', color: '#8898B8',
                padding: '7px 14px', borderRadius: 7, fontSize: 14, cursor: 'pointer' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ border: '1px solid #DCE4F5', color: '#0F2044',
                padding: '7px 16px', borderRadius: 7,
                fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
                Login
              </Link>
              <Link href="/register" style={{ background: '#FF6B35', color: '#fff',
                padding: '7px 16px', borderRadius: 7,
                fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
                Register Free
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
