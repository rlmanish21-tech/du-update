'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const S = { navy:'#0F2044', brand:'#FF6B35', border:'#DCE4F5', muted:'#8898B8' }

function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const supabase = createClient()
  const params   = useSearchParams()
  const next     = params.get('next') || '/dashboard'

  const handleMagicLink = async () => {
    if (!email) return
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${next}` }
    })
    if (!error) setSubmitted(true)
    setLoading(false)
  }

  if (submitted) return (
    <div style={{ textAlign:'center', padding:'2rem' }}>
      <div style={{ fontSize:32, marginBottom:'1rem' }}>📬</div>
      <div style={{ fontSize:18, fontWeight:700, color:S.navy }}>Check your email!</div>
      <p style={{ fontSize:14, color:S.muted, marginTop:'.5rem' }}>
        We sent a magic login link to <strong>{email}</strong>
      </p>
    </div>
  )

  return (
    <div>
      <div style={{ fontSize:24, fontWeight:900, color:S.navy, marginBottom:'.5rem', textAlign:'center' }}>
        DU<span style={{ display:'inline-block', width:8, height:8, borderRadius:'50%',
          background:S.brand, marginBottom:14, marginLeft:2, marginRight:2 }}/>Update
      </div>
      <h1 style={{ fontSize:20, fontWeight:800, color:S.navy, marginBottom:'.5rem', textAlign:'center' }}>
        Sign in to your account
      </h1>
      <p style={{ fontSize:14, color:S.muted, marginBottom:'2rem', textAlign:'center' }}>
        Enter your email — we'll send you a magic login link. No password needed.
      </p>
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleMagicLink()}
        style={{ width:'100%', padding:'12px 16px', borderRadius:8, marginBottom:'0.75rem',
          border:`1.5px solid ${S.border}`, fontSize:15, outline:'none', color:S.navy }}
      />
      <button onClick={handleMagicLink} disabled={loading} style={{
        width:'100%', padding:'12px', borderRadius:8, border:'none',
        background:S.brand, color:'#fff', fontSize:15, fontWeight:700,
        cursor:'pointer', opacity:loading ? .7 : 1
      }}>
        {loading ? 'Sending...' : 'Send Magic Link'}
      </button>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div style={{ minHeight:'80vh', display:'flex', alignItems:'center',
      justifyContent:'center', padding:'2rem' }}>
      <div style={{ background:'#fff', border:`1px solid #DCE4F5`,
        borderRadius:16, padding:'2.5rem 2rem', maxWidth:400, width:'100%' }}>
        <Suspense fallback={<div style={{textAlign:'center'}}>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
