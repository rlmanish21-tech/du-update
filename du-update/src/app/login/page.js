'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

const S = {
  navy: '#0F2044', brand: '#FF6B35',
  border: '#DCE4F5', muted: '#8898B8', error: '#dc2626'
}

function LoginForm() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const supabase = createClient()
  const router   = useRouter()
  const params   = useSearchParams()
  const next     = params.get('next') || '/dashboard'

  const handleLogin = async () => {
    setError('')
    if (!email.includes('@')) return setError('Please enter a valid email.')
    if (!password)            return setError('Please enter your password.')

    setLoading(true)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email, password
    })
    setLoading(false)

    if (signInError) {
      if (signInError.message.includes('Invalid login'))
        return setError('Wrong email or password. Please try again.')
      return setError(signInError.message)
    }

    router.push(next)
    router.refresh()
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 8,
    fontSize: 14, border: `1.5px solid ${S.border}`,
    outline: 'none', color: S.navy, background: '#fff',
    marginBottom: '0.75rem', display: 'block'
  }
  const labelStyle = {
    fontSize: 12, fontWeight: 600, color: S.muted,
    display: 'block', marginBottom: '.3rem',
    textTransform: 'uppercase', letterSpacing: '.05em'
  }

  return (
    <div>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: S.navy }}>
          DU<span style={{ display: 'inline-block', width: 7, height: 7,
            borderRadius: '50%', background: S.brand,
            marginBottom: 12, marginLeft: 2, marginRight: 2 }}/>Update
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: S.navy, marginTop: '.5rem' }}>
          Welcome back
        </div>
        <div style={{ fontSize: 13, color: S.muted, marginTop: '.3rem' }}>
          New student?{' '}
          <Link href="/register" style={{ color: S.brand, fontWeight: 600 }}>
            Create account
          </Link>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: '#FEE2E2', border: '1px solid #FECACA',
          borderRadius: 8, padding: '10px 14px', fontSize: 13,
          color: S.error, marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <label style={labelStyle}>Email Address</label>
      <input style={inputStyle} type="email" placeholder="your@email.com"
        value={email} onChange={e => setEmail(e.target.value)} />

      <label style={labelStyle}>Password</label>
      <input style={{ ...inputStyle, marginBottom: '0.5rem' }}
        type="password" placeholder="Your password"
        value={password} onChange={e => setPassword(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleLogin()} />

      {/* Forgot password — placeholder for later */}
      <div style={{ textAlign: 'right', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: 12, color: S.muted }}>Forgot password? Contact support</span>
      </div>

      <button onClick={handleLogin} disabled={loading} style={{
        width: '100%', padding: '12px', borderRadius: 8, border: 'none',
        background: S.brand, color: '#fff', fontSize: 15,
        fontWeight: 700, cursor: 'pointer', opacity: loading ? .7 : 1
      }}>
        {loading ? 'Signing in...' : 'Login'}
      </button>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div style={{ minHeight: '85vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: '#fff', border: '1px solid #DCE4F5',
        borderRadius: 16, padding: '2.5rem 2rem', maxWidth: 400, width: '100%' }}>
        <Suspense fallback={<div style={{ textAlign: 'center' }}>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
