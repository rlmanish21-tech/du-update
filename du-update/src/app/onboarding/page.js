'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const S = {
  navy: '#0F2044', brand: '#FF6B35',
  border: '#DCE4F5', muted: '#8898B8'
}

export default function OnboardingPage() {
  const router   = useRouter()
  const supabase = createClient()

  const [collegeId, setCollegeId] = useState('')
  const [courseId,  setCourseId]  = useState('')
  const [semester,  setSemester]  = useState('')
  const [colleges,  setColleges]  = useState([])
  const [courses,   setCourses]   = useState([])
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  useEffect(() => {
    const fetch = async () => {
      const [{ data: cols }, { data: crs }] = await Promise.all([
        supabase.from('colleges').select('id, name').order('name'),
        supabase.from('courses').select('id, name').order('name'),
      ])
      setColleges(cols ?? [])
      setCourses(crs ?? [])
    }
    fetch()
  }, [])

  const handleSave = async () => {
    if (!collegeId || !courseId || !semester)
      return setError('Please fill all fields.')
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('users').upsert({
      id: user.id,
      college_id: collegeId,
      course_id: courseId,
      current_semester: parseInt(semester),
    })
    setLoading(false)
    router.push('/dashboard')
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 8,
    fontSize: 14, border: `1.5px solid ${S.border}`,
    outline: 'none', color: S.navy, marginBottom: '0.75rem'
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: '#fff', border: `1px solid ${S.border}`,
        borderRadius: 16, padding: '2.5rem 2rem', maxWidth: 420, width: '100%' }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: S.navy,
          textAlign: 'center', marginBottom: '.5rem' }}>
          One quick step! 🎓
        </div>
        <p style={{ fontSize: 14, color: S.muted, textAlign: 'center', marginBottom: '2rem' }}>
          Tell us about yourself so we can show you the right content.
        </p>

        {error && (
          <div style={{ background: '#FEE2E2', borderRadius: 8,
            padding: '10px 14px', fontSize: 13, color: '#dc2626', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <label style={{ fontSize: 12, fontWeight: 600, color: S.muted,
          display: 'block', marginBottom: '.3rem', textTransform: 'uppercase' }}>
          Your College
        </label>
        <select style={inputStyle} value={collegeId} onChange={e => setCollegeId(e.target.value)}>
          <option value="">Select your college</option>
          {colleges.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <label style={{ fontSize: 12, fontWeight: 600, color: S.muted,
          display: 'block', marginBottom: '.3rem', textTransform: 'uppercase' }}>
          Your Course
        </label>
        <select style={inputStyle} value={courseId} onChange={e => setCourseId(e.target.value)}>
          <option value="">Select your course</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <label style={{ fontSize: 12, fontWeight: 600, color: S.muted,
          display: 'block', marginBottom: '.3rem', textTransform: 'uppercase' }}>
          Current Semester
        </label>
        <select style={{ ...inputStyle, marginBottom: '1.5rem' }}
          value={semester} onChange={e => setSemester(e.target.value)}>
          <option value="">Select semester</option>
          {[1,2,3,4,5,6].map(s => <option key={s} value={s}>Semester {s}</option>)}
        </select>

        <button onClick={handleSave} disabled={loading} style={{
          width: '100%', padding: '12px', borderRadius: 8, border: 'none',
          background: S.brand, color: '#fff', fontSize: 15,
          fontWeight: 700, cursor: 'pointer'
        }}>
          {loading ? 'Saving...' : 'Take me to my dashboard →'}
        </button>
      </div>
    </div>
  )
}
