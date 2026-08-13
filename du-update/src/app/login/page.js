'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const S = { navy:'#0F2044', brand:'#FF6B35', border:'#DCE4F5', muted:'#8898B8' }

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const supabase    = createClient()
  const router      = useRouter()
  const params      = useSearchParams()
  const next        = params.get('next') || '/dashboard'

  const handleGoogle = async () => {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${next}` },
    })
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: '#fff', border: `1px solid ${S.border}`,
        borderRadius: 16, padding: '2.5rem 2rem', maxWidth: 400, width: '100%',
        textAlign: 'center' }}>

        {/* Logo */}
        <div style={{ fontSize: 24, fontWeight: 900, color: S.navy, marginBottom: '.5rem' }}>
          DU<span style={{ display: 'inline-block', width: 8, height: 8,
            borderRadius: '50%', background: S.brand,
            marginBottom: 14, marginLeft: 2, marginRight: 2 }}/>Update
        </div>

        <h1 style={{ fontSize: 20, fontWeight: 800, color: S.navy, marginBottom: '.5rem' }}>
          Sign in to your account
        </h1>
        <p style={{ fontSize: 14, color: S.muted, marginBottom: '2rem', lineHeight: 1.5 }}>
          Access your notes, PYQs, timetable and attendance tracker.
        </p>

        {/* Google button */}
        <button onClick={handleGoogle} disabled={loading} style={{
          width: '100%', padding: '12px 20px', borderRadius: 9,
          border: `1.5px solid ${S.border}`, background: '#fff',
          fontSize: 15, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          color: S.navy, opacity: loading ? .7 : 1
        }}>
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.8 2.4 30.3 0 24 0 14.8 0 6.9 5.4 3 13.3l7.9 6.1C12.8 13.3 17.9 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.4c-.5 2.7-2.1 5-4.5 6.6l7 5.4c4.1-3.8 6.5-9.4 6.5-16z"/>
            <path fill="#FBBC05" d="M10.9 28.6A14.8 14.8 0 0 1 9.5 24c0-1.6.3-3.1.8-4.6L2.4 13.3A23.9 23.9 0 0 0 0 24c0 3.8.9 7.4 2.5 10.6l8.4-6z"/>
            <path fill="#34A853" d="M24 48c6.5 0 12-2.1 16-5.8l-7-5.4c-2 1.3-4.6 2.1-7.6 2.1-6.1 0-11.3-4.1-13.1-9.6l-7.9 6.1C6.9 42.6 14.8 48 24 48z"/>
          </svg>
          {loading ? 'Redirecting...' : 'Continue with Google'}
        </button>

        <p style={{ fontSize: 12, color: S.muted, marginTop: '1.5rem', lineHeight: 1.5 }}>
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}
