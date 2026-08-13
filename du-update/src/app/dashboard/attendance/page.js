'use client'
import { useState } from 'react'

const S = { navy:'#0F2044', brand:'#FF6B35', border:'#DCE4F5', muted:'#8898B8', off:'#F7F9FF' }

// TODO: Replace with real data from Supabase
const MOCK_SUBJECTS = [
  { id:1, name:'Financial Accounting',         present:28, total:36 },
  { id:2, name:'Business Mathematics',          present:30, total:38 },
  { id:3, name:'Principles of Management',      present:22, total:34 },
  { id:4, name:'Business Economics',            present:18, total:30 },
  { id:5, name:'English Communication',         present:26, total:32 },
]

function AttendancePct({ present, total }) {
  const pct = total > 0 ? Math.round((present / total) * 100) : 0
  const color = pct >= 75 ? '#16a34a' : pct >= 60 ? '#ca8a04' : '#dc2626'
  return (
    <div style={{ textAlign: 'right' }}>
      <span style={{ fontSize: 18, fontWeight: 800, color }}>{pct}%</span>
      <div style={{ fontSize: 11, color: S.muted }}>{present}/{total} classes</div>
    </div>
  )
}

export default function AttendancePage() {
  const [subjects, setSubjects] = useState(MOCK_SUBJECTS)

  const mark = (id, status) => {
    setSubjects(prev => prev.map(s => s.id !== id ? s : {
      ...s,
      total:   s.total + 1,
      present: status === 'present' ? s.present + 1 : s.present,
    }))
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: '.5rem' }}>Attendance Tracker</h1>
      <p style={{ fontSize: 14, color: S.muted, marginBottom: '2rem' }}>
        Mark today's attendance. Stay above 75% to be eligible for exams.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
        {subjects.map(sub => (
          <div key={sub.id} style={{ background: '#fff', border: `1px solid ${S.border}`,
            borderRadius: 11, padding: '1rem 1.25rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: S.navy }}>{sub.name}</div>
              {/* Progress bar */}
              <div style={{ marginTop: 6, height: 5, background: S.off,
                borderRadius: 4, overflow: 'hidden', maxWidth: 200 }}>
                <div style={{
                  height: '100%', borderRadius: 4,
                  width: `${Math.min(100, Math.round((sub.present/sub.total)*100))}%`,
                  background: sub.present/sub.total >= .75 ? '#16a34a' : '#dc2626',
                  transition: 'width .3s'
                }}/>
              </div>
            </div>
            <AttendancePct present={sub.present} total={sub.total} />
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => mark(sub.id, 'present')} style={{
                padding: '7px 12px', borderRadius: 7, border: 'none',
                background: '#DCFCE7', color: '#16a34a', fontWeight: 700,
                fontSize: 13, cursor: 'pointer'
              }}>P</button>
              <button onClick={() => mark(sub.id, 'absent')} style={{
                padding: '7px 12px', borderRadius: 7, border: 'none',
                background: '#FEE2E2', color: '#dc2626', fontWeight: 700,
                fontSize: 13, cursor: 'pointer'
              }}>A</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
