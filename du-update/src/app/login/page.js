'use client'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

const S = { navy:'#0F2044', brand:'#FF6B35', border:'#DCE4F5', muted:'#8898B8', off:'#F7F9FF', error:'#dc2626' }

function LoginForm() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const params = useSearchParams()
  const next   = params.get('next') || '/dashboard'

  const handleLogin = async () => {
    setError('')
    if (!email.includes('@')) return setError('Please enter a valid email address.')
    if (!password)             return setError('Please enter your password.')
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

      if (signInError) {
        setLoading(false)
        if (signInError.message.toLowerCase().includes('invalid'))
          return setError('Wrong email or password. Please try again.')
        return setError(signInError.message)
      }

      // Full page reload — forces server to read new cookie session
      window.location.href = next

    } catch (err) {
      setLoading(false)
      setError('Something went wrong. Please try again.')
    }
  }

  const I = { width:'100%', padding:'12px 14px', borderRadius:8, fontSize:15, border:`1.5px solid ${S.border}`, outline:'none', color:S.navy, background:'#fff', marginBottom:'1rem', display:'block' }
  const L = { fontSize:11, fontWeight:700, color:S.muted, display:'block', marginBottom:'.35rem', textTransform:'uppercase', letterSpacing:'.06em' }

  return (
    <div>
      <div style={{ textAlign:'center', marginBottom:'2rem' }}>
        <div style={{ fontSize:22, fontWeight:900, color:S.navy }}>
          DU<span style={{ display:'inline-block', width:7, height:7,
            borderRadius:'50%', background:S.brand, margin:'0 2px 10px' }}/>Update
        </div>
        <div style={{ fontSize:19, fontWeight:800, color:S.navy, marginTop:'.5rem' }}>Welcome Back</div>
        <div style={{ fontSize:13, color:S.muted, marginTop:'.35rem' }}>
          New student?{' '}
          <Link href="/register" style={{ color:S.brand, fontWeight:700 }}>Create account</Link>
        </div>
      </div>

      {error && (
        <div style={{ background:'#FEE2E2', border:'1px solid #FECACA', borderRadius:8,
          padding:'11px 14px', fontSize:13, color:S.error,
          marginBottom:'1.25rem', display:'flex', alignItems:'center', gap:8 }}>
          ⚠️ {error}
        </div>
      )}

      <label style={L}>Email Address</label>
      <input style={I} type="email" placeholder="your@email.com"
        value={email} onChange={e => setEmail(e.target.value)} />

      <label style={L}>Password</label>
      <input style={{...I, marginBottom:'.5rem'}} type="password"
        placeholder="Enter your password"
        value={password} onChange={e => setPassword(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleLogin()} />

      <div style={{ textAlign:'right', marginBottom:'1.5rem' }}>
        <Link href="/forgot-password" style={{ fontSize:13, color:S.brand, fontWeight:600, textDecoration:'none' }}>
          Forgot Password?
        </Link>
      </div>

      <button onClick={handleLogin} disabled={loading} style={{
        width:'100%', padding:'13px', borderRadius:9, border:'none',
        background:S.brand, color:'#fff', fontSize:15, fontWeight:700,
        cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .7 : 1
      }}>
        {loading ? 'Signing in...' : 'Login →'}
      </button>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div style={{ minHeight:'85vh', display:'flex', alignItems:'center',
      justifyContent:'center', padding:'2rem', background:'#F7F9FF' }}>
      <div style={{ background:'#fff', border:'1px solid #DCE4F5', borderRadius:16,
        padding:'2.5rem 2rem', maxWidth:400, width:'100%',
        boxShadow:'0 4px 24px rgba(15,32,68,0.07)' }}>
        <Suspense fallback={<div style={{ textAlign:'center' }}>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
