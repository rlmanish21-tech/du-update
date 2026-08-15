'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

const S = { navy:'#0F2044', brand:'#FF6B35', border:'#DCE4F5', muted:'#8898B8' }

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)
  const [error,   setError]   = useState('')

  const handleReset = async () => {
    setError('')
    if (!email.includes('@')) return setError('Please enter a valid email address.')
    setLoading(true)
    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    setLoading(false)
    if (resetError) return setError(resetError.message)
    setSent(true)
  }

  return (
    <div style={{ minHeight:'85vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', background:'#F7F9FF' }}>
      <div style={{ background:'#fff', border:`1px solid ${S.border}`, borderRadius:16, padding:'2.5rem 2rem', maxWidth:400, width:'100%', textAlign:'center', boxShadow:'0 4px 24px rgba(15,32,68,0.07)' }}>
        <div style={{ fontSize:22, fontWeight:900, color:S.navy, marginBottom:'1.5rem' }}>
          DU<span style={{ display:'inline-block', width:7, height:7, borderRadius:'50%', background:S.brand, margin:'0 2px 10px' }}/>Update
        </div>
        {!sent ? (
          <>
            <div style={{ fontSize:32, marginBottom:'1rem' }}>🔑</div>
            <div style={{ fontSize:18, fontWeight:800, color:S.navy, marginBottom:'.5rem' }}>Forgot Password?</div>
            <p style={{ fontSize:13, color:S.muted, marginBottom:'1.75rem', lineHeight:1.5 }}>
              Enter your registered email. We'll send you a link to reset your password.
            </p>
            {error && <div style={{ background:'#FEE2E2', borderRadius:8, padding:'10px 14px', fontSize:13, color:'#dc2626', marginBottom:'1rem', textAlign:'left' }}>{error}</div>}
            <input type="email" placeholder="your@email.com" value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key==='Enter' && handleReset()}
              style={{ width:'100%', padding:'12px 14px', borderRadius:8, fontSize:14, border:`1.5px solid ${S.border}`, outline:'none', color:S.navy, marginBottom:'1rem' }} />
            <button onClick={handleReset} disabled={loading} style={{ width:'100%', padding:'12px', borderRadius:9, border:'none', background:S.brand, color:'#fff', fontSize:15, fontWeight:700, cursor:'pointer' }}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <div style={{ marginTop:'1.25rem' }}>
              <Link href="/login" style={{ fontSize:13, color:S.muted, textDecoration:'none' }}>← Back to Login</Link>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize:48, marginBottom:'1rem' }}>📬</div>
            <div style={{ fontSize:18, fontWeight:800, color:S.navy, marginBottom:'.5rem' }}>Check your inbox!</div>
            <p style={{ fontSize:14, color:S.muted, lineHeight:1.6, marginBottom:'1.5rem' }}>
              We sent a reset link to <strong style={{ color:S.navy }}>{email}</strong>. Check your spam folder if you don't see it.
            </p>
            <Link href="/login" style={{ display:'inline-block', padding:'10px 24px', borderRadius:8, background:S.brand, color:'#fff', fontSize:14, fontWeight:700, textDecoration:'none' }}>
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
