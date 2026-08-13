import Link from 'next/link'
import { COURSE_MAP } from '@/lib/utils'

const S = { navy:'#0F2044', brand:'#FF6B35', border:'#DCE4F5', muted:'#8898B8', off:'#F7F9FF' }

export async function generateMetadata({ params }) {
  const name = COURSE_MAP[params.slug] ?? params.slug
  return { title: `${name} — DU Update` }
}

export default function CoursePage({ params }) {
  const { slug } = params
  const courseName = COURSE_MAP[slug] ?? slug.replace(/-/g,' ').toUpperCase()
  const semesters  = [1, 2, 3, 4, 5, 6]

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 1.5rem' }}>

      {/* Breadcrumb */}
      <div style={{ fontSize: 13, color: S.muted, marginBottom: '1.5rem' }}>
        <Link href="/courses" style={{ color: S.brand, textDecoration: 'none' }}>Courses</Link>
        {' / '}{courseName}
      </div>

      <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, marginBottom: '.5rem' }}>
        {courseName}
      </h1>
      <p style={{ fontSize: 15, color: S.muted, marginBottom: '2.5rem' }}>
        Select a semester to access notes, PYQs, and video lectures.
      </p>

      {/* Semester grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '1rem' }}>
        {semesters.map(sem => (
          <Link key={sem} href={`/courses/${slug}/${sem}`} style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', border: `1.5px solid ${S.border}`,
              borderRadius: 12, padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: S.navy, marginBottom: '.5rem' }}>
                {sem}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: S.navy }}>Semester {sem}</div>
              <div style={{ fontSize: 12, color: S.muted, marginTop: '.25rem' }}>
                Notes · PYQs · Videos
              </div>
              <div style={{ marginTop: '1rem', fontSize: 13, color: S.brand, fontWeight: 600 }}>
                Open →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
