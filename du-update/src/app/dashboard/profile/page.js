'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const S = { navy:'#0F2044', brand:'#FF6B35', border:'#DCE4F5', muted:'#8898B8' }

export default function ProfilePage() {
  const router   = useRouter()
  const supabase = createClient()

  const [collegeId, setCollegeId] = useState('')
  const [courseId,  setCourseId]  = useState('')
  const [semester,  setSemester]  = useState('')
  const [name,      setName]      = useState('')
  const [colleges,  setColleges]  = useState([])
  const [courses,   setCourses]   = useState([])
  const [loading,   setLoading]   = useState(false)
  const [saved,     setSaved]     = useState(false)
  const [error,     setError]     = useState('')

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')

      const [{ data: profile }, { data: cols }, { data: crs }] = await Promise.all([
        supabase.from('users').select('name, college_id, course_id, current_semester').eq('id', user.id).single(),
        supabase.from('colleges').select('id, name').order('name'),
        supabase.from('courses').select('id, name').order('name'),
      ])
      if (profile) {
        setName(profile.name ?? '')
        setCollegeId(profile.college_id ?? '')
        setCourseId(profile.course_id ?? '')
        setSemester(profile.current_semester?.toString() ?? '')
      }
      setColleges(cols ?? [])
      setCourses(crs ?? [])
    }
    init()
  }, [])

  const handleSave = async () => {
    setError('')
    if (!collegeId || !courseId || !semester)
      return setError('Please fill all fields.')
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { error: err } = await supabase.from('users').update({
      name, college_id: collegeId,
      course_id: courseId,
      current_semester: parseInt(semester)
    }).eq('id', user.id)
    setLoading(false)
    if (err) return setError('Could not save. Please try again.')
    setSaved(true)
    setTimeout(() => router.push('/dashboard'), 1200)
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 8,
    fontSize: 14, border: `1.5px solid ${S.border}`,
    outline: 'none', color: S.navy, marginBottom: '0.75rem'
  }
  const labelStyle = {
    fontSize: 12, fontWeight: 600, color: S.muted,
    display: 'block', marginBottom: '.3rem',
    textTransform: 'uppercase', letterSpacing: '.05em'
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: '#fff', border: `1px solid ${S.border}`,
        borderRadius: 16, padding: '2.5rem 2rem', maxWidth: 440, width: '100%' }}>

        <div style={{ fontSize: 18, fontWeight: 800, color: S.navy,
          marginBottom: '.4rem' }}>Edit Profile</div>
        <p style={{ fontSize: 13, color: S.muted, marginBottom: '1.75rem' }}>
          Update your college, course or semester anytime.
        </p>

        {error && (
          <div style={{ background: '#FEE2E2', borderRadius: 8,
            padding: '10px 14px', fontSize: 13,
            color: '#dc2626', marginBottom: '1rem' }}>{error}</div>
        )}
        {saved && (
          <div style={{ background: '#DCFCE7', borderRadius: 8,
            padding: '10px 14px', fontSize: 13,
            color: '#16a34a', marginBottom: '1rem' }}>
            ✓ Profile saved! Redirecting...
          </div>
        )}

        <label style={labelStyle}>Full Name</label>
        <input style={inputStyle} type="text" value={name}
          onChange={e => setName(e.target.value)} placeholder="Your name" />

        <label style={labelStyle}>College</label>
        <select style={inputStyle} value={collegeId}
          onChange={e => setCollegeId(e.target.value)}>
          <option value="">Select college</option>
          {colleges.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <label style={labelStyle}>Course</label>
        <select style={inputStyle} value={courseId}
          onChange={e => setCourseId(e.target.value)}>
          <option value="">Select course</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <label style={labelStyle}>Current Semester</label>
        <select style={{ ...inputStyle, marginBottom: '1.5rem' }}
          value={semester} onChange={e => setSemester(e.target.value)}>
          <option value="">Select semester</option>
          {[1,2,3,4,5,6].map(s =>
            <option key={s} value={s}>Semester {s}</option>
          )}
        </select>

        <button onClick={handleSave} disabled={loading} style={{
          width: '100%', padding: '12px', borderRadius: 8,
          border: 'none', background: S.brand, color: '#fff',
          fontSize: 15, fontWeight: 700, cursor: 'pointer'
        }}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
