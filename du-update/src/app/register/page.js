'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

const S = { navy:'#0F2044', brand:'#FF6B35', border:'#DCE4F5', muted:'#8898B8', off:'#F7F9FF', error:'#dc2626' }

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name:'', email:'', password:'', confirm:'',
    phone:'', collegeId:'', courseId:'', semester:''
  })
  const [colleges, setColleges] = useState([])
  const [courses,  setCourses]  = useState([])
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const set = (k,v) => setForm(f => ({...f,[k]:v}))

  useEffect(() => {
    const supabase = createClient()
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

  const validate = () => {
    if (!form.name.trim())              return 'Please enter your full name.'
    if (!form.email.includes('@'))      return 'Please enter a valid email address.'
    if (form.phone.length < 10)         return 'Please enter a valid 10-digit mobile number.'
    if (!form.collegeId)                return 'Please select your college.'
    if (!form.courseId)                 return 'Please select your course.'
    if (!form.semester)                 return 'Please select your current semester.'
    if (form.password.length < 6)       return 'Password must be at least 6 characters.'
    if (form.password !== form.confirm) return 'Passwords do not match.'
    return null
  }

  const handleRegister = async () => {
    setError('')
    const err = validate()
    if (err) return setError(err)
    setLoading(true)

    try {
      const supabase = createClient()

      // 1. Create auth account
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: form.email, password: form.password,
        options: { data: { full_name: form.name.trim() } }
      })

      if (signUpError) {
        setLoading(false)
        if (signUpError.message.includes('already registered'))
          return setError('This email is already registered. Please login instead.')
        return setError(signUpError.message)
      }

      // 2. Sign in to get session
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email, password: form.password
      })

      if (signInError) {
        setLoading(false)
        return setError('Account created! Please login.')
      }

      // 3. Save profile — user is now authenticated
      const userId = signUpData?.user?.id
      if (userId) {
        const { error: insertError } = await supabase.from('users').insert({
          id:               userId,
          name:             form.name.trim(),
          phone:            form.phone.trim(),
          college_id:       form.collegeId,
          course_id:        form.courseId,
          current_semester: parseInt(form.semester),
        })
        if (insertError) console.error('Profile save error:', insertError)
      }

      setLoading(false)
      window.location.href = '/dashboard'
    } catch (err) {
      setLoading(false)
      setError('Something went wrong. Please try again.')
    }
  }

  const I = { width:'100%', padding:'11px 14px', borderRadius:8, fontSize:14, border:`1.5px solid ${S.border}`, outline:'none', color:S.navy, background:'#fff', marginBottom:'0.9rem', display:'block' }
  const L = { fontSize:11, fontWeight:700, color:S.muted, display:'block', marginBottom:'.3rem', textTransform:'uppercase', letterSpacing:'.06em' }

  return (
    <div style={{ minHeight:'90vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem 1rem', background:S.off }}>
      <div style={{ background:'#fff', border:`1px solid ${S.border}`, borderRadius:16, padding:'2.5rem 2rem', maxWidth:480, width:'100%', boxShadow:'0 4px 24px rgba(15,32,68,0.07)' }}>

        <div style={{ textAlign:'center', marginBottom:'1.75rem' }}>
          <div style={{ fontSize:22, fontWeight:900, color:S.navy }}>
            DU<span style={{ display:'inline-block', width:7, height:7, borderRadius:'50%', background:S.brand, margin:'0 2px 10px' }}/>Update
          </div>
          <div style={{ fontSize:19, fontWeight:800, color:S.navy, marginTop:'.5rem' }}>Create Your Account</div>
          <div style={{ fontSize:13, color:S.muted, marginTop:'.35rem' }}>
            Already registered?{' '}
            <Link href="/login" style={{ color:S.brand, fontWeight:700 }}>Login here</Link>
          </div>
        </div>

        {error && (
          <div style={{ background:'#FEE2E2', border:'1px solid #FECACA', borderRadius:8, padding:'10px 14px', fontSize:13, color:S.error, marginBottom:'1.25rem' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Personal */}
        <div style={{ fontSize:11, fontWeight:700, color:S.brand, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:'.75rem' }}>Personal Details</div>
        <label style={L}>Full Name</label>
        <input style={I} type="text" placeholder="e.g. Rahul Sharma" value={form.name} onChange={e => set('name', e.target.value)} />
        <label style={L}>Mobile Number</label>
        <input style={I} type="tel" placeholder="10-digit mobile number" value={form.phone} onChange={e => set('phone', e.target.value.replace(/\D/g,'').slice(0,10))} />

        {/* Academic */}
        <div style={{ fontSize:11, fontWeight:700, color:S.brand, letterSpacing:'.08em', textTransform:'uppercase', margin:'.5rem 0 .75rem' }}>Academic Details</div>
        <label style={L}>College</label>
        <select style={I} value={form.collegeId} onChange={e => set('collegeId', e.target.value)}>
          <option value="">Select your college</option>
          {colleges.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <label style={L}>Course</label>
        <select style={I} value={form.courseId} onChange={e => set('courseId', e.target.value)}>
          <option value="">Select your course</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <label style={L}>Current Semester</label>
        <select style={I} value={form.semester} onChange={e => set('semester', e.target.value)}>
          <option value="">Select semester</option>
          {[1,2,3,4,5,6].map(s => <option key={s} value={s}>Semester {s}</option>)}
        </select>

        {/* Account */}
        <div style={{ fontSize:11, fontWeight:700, color:S.brand, letterSpacing:'.08em', textTransform:'uppercase', margin:'.5rem 0 .75rem' }}>Account Details</div>
        <label style={L}>Email Address</label>
        <input style={I} type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
        <label style={L}>Password</label>
        <input style={I} type="password" placeholder="Minimum 6 characters" value={form.password} onChange={e => set('password', e.target.value)} />
        <label style={L}>Confirm Password</label>
        <input style={{...I, marginBottom:'1.5rem'}} type="password" placeholder="Re-enter password" value={form.confirm} onChange={e => set('confirm', e.target.value)} onKeyDown={e => e.key==='Enter' && handleRegister()} />

        <button onClick={handleRegister} disabled={loading} style={{ width:'100%', padding:'13px', borderRadius:9, border:'none', background:S.brand, color:'#fff', fontSize:15, fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer', opacity:loading?.7:1 }}>
          {loading ? 'Creating your account...' : 'Register Now →'}
        </button>
        <p style={{ fontSize:11, color:S.muted, textAlign:'center', marginTop:'1rem', lineHeight:1.5 }}>
          Your details are saved securely and never shared.
        </p>
      </div>
    </div>
  )
}
