'use client'
import { useState, useEffect, Suspense } from 'react'
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

  const [name,      setName]      = useState('')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [collegeId, setCollegeId] = useState('')
  const [courseId,  setCourseId]  = useState('')
  const [semester,  setSemester]  = useState('')
  const [colleges,  setColleges]  = useState([])
  const [courses,   setCourses]   = useState([])
  const [step,      setStep]      = useState(1)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: cols }, { data: crs }] = await Promise.all([
        supabase.from('colleges').select('id, name').order('name'),
        supabase.from('courses').select('id, name').order('name'),
      ])
      setColleges(cols ?? [])
      setCourses(crs ?? [])
    }
    fetchData()
  }, [])

  const handleStep1 = () => {
    setError('')
    if (!name.trim())         return setError('Please enter your name.')
    if (!email.includes('@')) return setError('Please enter a valid email.')
    if (password.length < 6)  return setError('Password must be at least 6 characters.')
    if (password !== confirm)  return setError('Passwords do not match.')
    setStep(2)
  }

  const handleRegister = async () => {
    setError('')
    if (!collegeId) return setError('Please select your college.')
    if (!courseId)  return setError('Please select your course.')
    if (!semester)  return setError('Please select your semester.')

    setLoading(true)

    // All profile data goes into options.data
    // The trigger reads this and saves to users table automatically
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name:        name.trim(),
          college_id:       collegeId,
          course_id:        courseId,
          current_semester: semester,
        }
      }
    })

    setLoading(false)

    if (signUpError) return setError(signUpError.message)

    // Sign in immediately after signup
    await supabase.auth.signInWithPassword({ email, password })
    router.push('/dashboard')
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
  const btnStyle = {
    width: '100%', padding: '12px', borderRadius: 8,
    border: 'none', background: S.brand, color: '#fff',
    fontSize: 15, fontWeight: 700, cursor: 'pointer',
    opacity: loading ? .7 : 1
  }

  return (
    <div style={{ minHeight: '85vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: '#fff', border: `1px solid ${S.border}`,
        borderRadius: 16, padding: '2.5rem 2rem', maxWidth: 440, width: '100%' }}>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: S.navy }}>
            DU<span style={{ display: 'inline-block', width: 7, height: 7,
              borderRadius: '50%', background: S.brand,
              margin: '0 2px 10px' }}/>Update
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: S.navy, marginTop: '.5rem' }}>
            {step === 1 ? 'Create your account' : 'Your college details'}
          </div>
          <div style={{ fontSize: 13, color: S.muted, marginTop: '.3rem' }}>
            {step === 1 && (
              <>Already registered?{' '}
                <Link href="/login" style={{ color: S.brand, fontWeight: 600 }}>Login</Link>
              </>
            )}
            {step === 2 && 'Step 2 of 2 — almost done!'}
          </div>
        </div>

        {/* Step bar */}
        <div style={{ display: 'flex', gap: 6, marginBottom: '1.5rem' }}>
          {[1, 2].map(s => (
            <div key={s} style={{ flex: 1, height: 4, borderRadius: 2,
              background: s <= step ? S.brand : S.border }} />
          ))}
        </div>

        {error && (
          <div style={{ background: '#FEE2E2', borderRadius: 8,
            padding: '10px 14px', fontSize: 13,
            color: S.error, marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {step === 1 && (
          <div>
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
            <input style={{ ...inputStyle, marginBottom: '1.25rem' }}
              type="password" placeholder="Re-enter password"
              value={confirm} onChange={e => setConfirm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleStep1()} />

            <button style={btnStyle} onClick={handleStep1}>
              Continue →
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <label style={labelStyle}>Your College</label>
            <select style={inputStyle} value={collegeId}
              onChange={e => setCollegeId(e.target.value)}>
              <option value="">Select your college</option>
              {colleges.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <label style={labelStyle}>Your Course</label>
            <select style={inputStyle} value={courseId}
              onChange={e => setCourseId(e.target.value)}>
              <option value="">Select your course</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <label style={labelStyle}>Current Semester</label>
            <select style={{ ...inputStyle, marginBottom: '1.25rem' }}
              value={semester} onChange={e => setSemester(e.target.value)}>
              <option value="">Select semester</option>
              {[1,2,3,4,5,6].map(s => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>

            <button style={btnStyle} onClick={handleRegister} disabled={loading}>
              {loading ? 'Creating your account...' : 'Complete Registration 🎓'}
            </button>

            <button onClick={() => { setStep(1); setError('') }} style={{
              width: '100%', marginTop: '0.75rem', padding: '10px',
              borderRadius: 8, border: `1px solid ${S.border}`,
              background: 'transparent', color: S.muted,
              fontSize: 14, cursor: 'pointer'
            }}>← Back</button>
          </div>
        )}
      </div>
    </div>
  )
}
