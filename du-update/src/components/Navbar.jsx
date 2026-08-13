'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function Navbar() {
  const [user, setUser]         = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const supabase = createClient()
  const router   = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null))
    const { data: listener } = supabase.auth.onAuthStateChange((_, s) =>
      setUser(s?.user ?? null)
    )
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => { listener?.subscription.unsubscribe(); window.removeEventListener('scroll', onScroll) }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 99,
      background: scrolled ? 'rgba(255,255,255,0.97)' : '#fff',
      borderBottom: '1px solid #DCE4F5',
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#0F2044' }}>DU</span>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#FF6B35',
            display: 'inline-block', marginBottom: 10 }}/>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#0F2044' }}>Update</span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
          <Link href="/courses" style={{ fontSize: 14, color: '#6B7FA3', textDecoration: 'none', fontWeight: 500 }}>Courses</Link>
          <Link href="/#features" style={{ fontSize: 14, color: '#6B7FA3', textDecoration: 'none', fontWeight: 500 }}>Features</Link>
          <Link href="/#pricing" style={{ fontSize: 14, color: '#6B7FA3', textDecoration: 'none', fontWeight: 500 }}>Pricing</Link>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link href="/dashboard" style={{
                background: '#0F2044', color: '#fff', padding: '7px 16px',
                borderRadius: 7, fontSize: 14, fontWeight: 600, textDecoration: 'none'
              }}>Dashboard</Link>
              <button onClick={handleLogout} style={{
                background: 'transparent', border: '1px solid #DCE4F5',
                color: '#6B7FA3', padding: '7px 14px', borderRadius: 7,
                fontSize: 14, cursor: 'pointer'
              }}>Logout</button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link href="/login" style={{
                background: 'transparent', border: '1px solid #DCE4F5',
                color: '#0F2044', padding: '7px 16px', borderRadius: 7,
                fontSize: 14, fontWeight: 500, textDecoration: 'none'
              }}>Login</Link>
              <Link href="/login" style={{
                background: '#FF6B35', color: '#fff', padding: '7px 16px',
                borderRadius: 7, fontSize: 14, fontWeight: 700, textDecoration: 'none'
              }}>Join Free</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
