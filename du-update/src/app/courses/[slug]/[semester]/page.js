'use client'
import { useState } from 'react'
import Link from 'next/link'
import { COURSE_MAP } from '@/lib/utils'

const S = { navy:'#0F2044', brand:'#FF6B35', border:'#DCE4F5', muted:'#8898B8', off:'#F7F9FF' }
const TABS = ['Notes', 'PYQs', 'Videos', 'Syllabus']

// TODO: Replace with real Supabase fetch
const MOCK_CONTENT = {
  Notes: [
    { id:1, title:'Unit 1 — Introduction & Overview', isPremium: false },
    { id:2, title:'Unit 2 — Core Concepts',           isPremium: true  },
    { id:3, title:'Unit 3 — Advanced Topics',          isPremium: true  },
  ],
  PYQs: [
    { id:4, title:'2023 Annual Exam Paper',  year: 2023, isPremium: false },
    { id:5, title:'2022 Annual Exam Paper',  year: 2022, isPremium: true  },
    { id:6, title:'2021 Annual Exam Paper',  year: 2021, isPremium: true  },
  ],
  Videos: [
    { id:7, title:'Complete Chapter 1 Lecture', channel:'DU Commerce Hub', isPremium: false },
    { id:8, title:'Chapter 2 — Detailed Notes', channel:'Study With DU',   isPremium: true  },
  ],
  Syllabus: [
    { id:9, title:'Official DU Syllabus 2024-25', isPremium: false },
  ],
}

export default function SemesterPage({ params }) {
  const { slug, semester } = params
  const courseName = COURSE_MAP[slug] ?? slug
  const [activeTab, setActiveTab] = useState('Notes')
  const items = MOCK_CONTENT[activeTab] ?? []

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '3rem 1.5rem' }}>

      {/* Breadcrumb */}
      <div style={{ fontSize: 13, color: S.muted, marginBottom: '1.5rem' }}>
        <Link href="/courses" style={{ color: S.brand, textDecoration:'none' }}>Courses</Link>
        {' / '}
        <Link href={`/courses/${slug}`} style={{ color: S.brand, textDecoration:'none' }}>{courseName}</Link>
        {' / '}Semester {semester}
      </div>

      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: '.25rem' }}>
        {courseName} — Semester {semester}
      </h1>
      <p style={{ fontSize: 14, color: S.muted, marginBottom: '2rem' }}>
        Notes, PYQs, and videos for all subjects in this semester.
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: `1px solid ${S.border}`, marginBottom: '1.5rem' }}>
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '10px 18px', border: 'none', background: 'transparent',
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
            color: activeTab === tab ? S.brand : S.muted,
            borderBottom: activeTab === tab ? `2px solid ${S.brand}` : '2px solid transparent',
            marginBottom: -1
          }}>{tab}</button>
        ))}
      </div>

      {/* Content list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
        {items.map(item => (
          <div key={item.id} style={{ background: '#fff', border: `1px solid ${S.border}`,
            borderRadius: 10, padding: '1rem 1.25rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: S.navy }}>{item.title}</div>
              {item.year    && <div style={{ fontSize: 12, color: S.muted, marginTop: 2 }}>Year: {item.year}</div>}
              {item.channel && <div style={{ fontSize: 12, color: S.muted, marginTop: 2 }}>{item.channel}</div>}
            </div>
            {item.isPremium ? (
              <Link href="/login" style={{
                background: S.off, border: `1px solid ${S.border}`,
                color: S.muted, fontSize: 12, fontWeight: 600,
                padding: '6px 14px', borderRadius: 6, textDecoration: 'none',
                whiteSpace: 'nowrap'
              }}>🔒 Premium</Link>
            ) : (
              <button style={{
                background: S.brand, color: '#fff', border: 'none',
                fontSize: 12, fontWeight: 700, padding: '6px 14px',
                borderRadius: 6, cursor: 'pointer', whiteSpace: 'nowrap'
              }}>Download</button>
            )}
          </div>
        ))}
      </div>

      {/* Premium upsell */}
      <div style={{ marginTop: '2rem', background: '#FFF8F5',
        border: `1.5px solid ${S.brand}`, borderRadius: 12, padding: '1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: S.navy }}>
            Unlock all {activeTab} for ₹499/year
          </div>
          <div style={{ fontSize: 13, color: S.muted, marginTop: '.25rem' }}>
            Full access to all courses, all semesters, attendance tracker and more.
          </div>
        </div>
        <Link href="/login" style={{
          background: S.brand, color: '#fff', padding: '10px 20px',
          borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: 'none',
          whiteSpace: 'nowrap'
        }}>Get Premium</Link>
      </div>
    </div>
  )
}
