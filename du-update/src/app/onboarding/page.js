'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const S = { navy:'#0F2044', brand:'#FF6B35', border:'#DCE4F5', muted:'#8898B8', error:'#dc2626' }

export default function OnboardingPage() {
  const router = useRouter()
  const [collegeId, setCollegeId] = useState('')
  const [courseId,  setCourseId]  = useState('')
  const [semester,  setSemester]  = useState('')
  const [colleges,  setColleges]  = useState([])
  const [courses,   setCourses]   = useState([])
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

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

  const handleSave = async () => {
    setError('')
    if (!collegeId || !courseId || !semester) return setError('Please fill all fields.')
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return router.push('/login') }
    await supabase.from('users').update({
      college_id: collegeId, course_id: courseId,
      current_semester: parseInt(semester)
    }).eq('id', user.id)
    setLoading(false)
    router.push('/dashboard')
  }

  const I = { width:'100%', padding:'11px 14px', borderRadius:8, fontSize:14, border:`1.5px solid ${S.border}`, outline:'none', color:S.navy, marginBottom:'0.75rem' }
  const L = { fontSize:11, fontWeight:700, color:S.muted, display:'block', marginBottom:'.3rem', textTransform:'uppercase', letterSpacing:'.05em' }

  return (
    <div style={{ minHeight:'85vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' }}>
      <div style={{ background:'#fff', border:`1px solid ${S.border}`, borderRadius:16, padding:'2.5rem 2rem', maxWidth:420, width:'100%' }}>
        <div style={{ textAlign:'center', marginBottom:'1.75rem' }}>
          <div style={{ fontSize:28 }}>🎓</div>
          <div style={{ fontSize:18, fontWeight:800, color:S.navy, marginTop:'.5rem' }}>Complete Your Profile</div>
          <div style={{ fontSize:13, color:S.muted, marginTop:'.35rem' }}>Help us show you the right content.</div>
        </div>
        {error && <div style={{ background:'#FEE2E2', borderRadius:8, padding:'10px 14px', fontSize:13, color:S.error, marginBottom:'1rem' }}>{error}</div>}
        <label style={L}>Your College</label>
        <select style={I} value={collegeId} onChange={e => setCollegeId(e.target.value)}>
          <option value="">Select college</option>
          {colleges.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <label style={L}>Your Course</label>
        <select style={I} value={courseId} onChange={e => setCourseId(e.target.value)}>
          <option value="">Select course</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <label style={L}>Current Semester</label>
        <select style={{...I, marginBottom:'1.5rem'}} value={semester} onChange={e => setSemester(e.target.value)}>
          <option value="">Select semester</option>
          {[1,2,3,4,5,6].map(s => <option key={s} value={s}>Semester {s}</option>)}
        </select>
        <button onClick={handleSave} disabled={loading} style={{ width:'100%', padding:'12px', borderRadius:9, border:'none', background:S.brand, color:'#fff', fontSize:15, fontWeight:700, cursor:'pointer' }}>
          {loading ? 'Saving...' : 'Take me to my dashboard 🚀'}
        </button>
      </div>
    </div>
  )
}
