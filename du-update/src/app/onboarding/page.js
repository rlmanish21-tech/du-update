'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
export const dynamic = 'force-dynamic'
const S = {
  navy: '#0F2044', brand: '#FF6B35',
  border: '#DCE4F5', muted: '#8898B8', error: '#dc2626'
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
    if (!collegeId) return setError('Please select your college.')
    if (!courseId)  return setError('Please select your course.')
    if (!semester)  return setError('Please select your semester.')

    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setLoading(false)
      return setError('Session expired. Please login again.')
    }

    // User is logged in — UPDATE works with RLS
    const { error: updateError } = await supabase
      .from('users')
      .update({
        college_id:       collegeId,
        course_id:        courseId,
        current_semester: parseInt(semester),
      })
      .eq('id', user.id)

    setLoading(false)

    if (updateError) return setError('Could not save details. Please try again.')

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

  return (
    <div style={{ minHeight: '85vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: '#fff', border: `1px solid ${S.border}`,
        borderRadius: 16, padding: '2.5rem 2rem', maxWidth: 420, width: '100%' }}>

        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ fontSize: 28 }}>🎓</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: S.navy, marginTop: '.5rem' }}>
            One last step!
          </div>
          <div style={{ fontSize: 13, color: S.muted, marginTop: '.3rem' }}>
            Tell us about yourself so we show you the right content.
          </div>
        </div>

        {error && (
          <div style={{ background: '#FEE2E2', borderRadius: 8,
            padding: '10px 14px', fontSize: 13,
            color: S.error, marginBottom: '1rem' }}>
            {error}
          </div>
        )}

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
        <select style={{ ...inputStyle, marginBottom: '1.5rem' }}
          value={semester} onChange={e => setSemester(e.target.value)}>
          <option value="">Select semester</option>
          {[1,2,3,4,5,6].map(s => (
            <option key={s} value={s}>Semester {s}</option>
          ))}
        </select>

        <button onClick={handleSave} disabled={loading} style={{
          width: '100%', padding: '12px', borderRadius: 8,
          border: 'none', background: S.brand, color: '#fff',
          fontSize: 15, fontWeight: 700, cursor: 'pointer',
          opacity: loading ? .7 : 1
        }}>
          {loading ? 'Saving...' : 'Take me to my dashboard 🚀'}
        </button>
      </div>
    </div>
  )
}
