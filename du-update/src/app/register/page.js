'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

const S = {
  navy: '#0F2044', brand: '#FF6B35',
  border: '#DCE4F5', muted: '#8898B8', error: '#dc2626'
}

export default function RegisterPage() {
  const router   = useRouter()
  const supabase = createClient()

  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const handleRegister = async () => {
    setError('')
    if (!name.trim())         return setError('Please enter your name.')
    if (!email.includes('@')) return setError('Please enter a valid email.')
    if (password.length < 6)  return setError('Password must be at least 6 characters.')
    if (password !== confirm)  return setError('Passwords do not match.')

    setLoading(true)

    // Step 1 — create account
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name.trim() } }
    })

    if (signUpError) {
      setLoading(false)
      return setError(signUpError.message)
    }

    // Step 2 — sign in immediately
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email, password
    })

    setLoading(false)

    if (signInError) {
      return setError('Account created! Please login.')
    }

    // Step 3 — go to onboarding to pick college/course/semester
    router.push('/onboarding')
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
    <div style={{ minHeight: '85vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: '#fff', border: `1px solid ${S.border}`,
        borderRadius: 16, padding: '2.5rem 2rem', maxWidth: 420, width: '100%' }}>

        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: S.navy }}>
            DU<span style={{ display: 'inline-block', width: 7, height: 7,
              borderRadius: '50%', background: S.brand,
              margin: '0 2px 10px' }}/>Update
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: S.navy, marginTop: '.5rem' }}>
            Create your account
          </div>
          <div style={{ fontSize: 13, color: S.muted, marginTop: '.3rem' }}>
            Already registered?{' '}
            <Link href="/login" style={{ color: S.brand, fontWeight: 600 }}>Login</Link>
          </div>
        </div>

        {error && (
          <div style={{ background: '#FEE2E2', borderRadius: 8,
            padding: '10px 14px', fontSize: 13,
            color: S.error, marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <label style={labelStyle}>Full Name</label>
        <input style={inputStyle} type="text"
          placeholder="e.g. Rahul Sharma"
          value={name} onChange={e => setName(e.target.value)} />

        <label style={labelStyle}>Email Address</label>
        <input style={inputStyle} type="email"
          placeholder="your@email.com"
          value={email} onChange={e => setEmail(e.target.value)} />

        <label style={labelStyle}>Password</label>
        <input style={inputStyle} type="password"
          placeholder="Min. 6 characters"
          value={password} onChange={e => setPassword(e.target.value)} />

        <label style={labelStyle}>Confirm Password</label>
        <input style={{ ...inputStyle, marginBottom: '1.5rem' }}
          type="password" placeholder="Re-enter password"
          value={confirm} onChange={e => setConfirm(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleRegister()} />

        <button onClick={handleRegister} disabled={loading} style={{
          width: '100%', padding: '12px', borderRadius: 8,
          border: 'none', background: S.brand, color: '#fff',
          fontSize: 15, fontWeight: 700, cursor: 'pointer',
          opacity: loading ? .7 : 1
        }}>
          {loading ? 'Creating account...' : 'Create Account →'}
        </button>
      </div>
    </div>
  )
}
