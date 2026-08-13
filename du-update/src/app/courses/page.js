import Link from 'next/link'

const S = { navy:'#0F2044', brand:'#FF6B35', border:'#DCE4F5', muted:'#8898B8', off:'#F7F9FF' }

const ALL_COURSES = [
  { name:'B.Com (Honours)',           slug:'bcom-hons',        icon:'📊', sems:6, notes:'240+' },
  { name:'B.Com (Programme)',         slug:'bcom-prog',         icon:'💼', sems:6, notes:'200+' },
  { name:'BA (Hons) Economics',       slug:'ba-eco-hons',       icon:'📈', sems:6, notes:'190+' },
  { name:'BA (Hons) English',         slug:'ba-eng-hons',       icon:'📚', sems:6, notes:'160+' },
  { name:'BA (Hons) Political Science',slug:'ba-polsci-hons',  icon:'🏛️', sems:6, notes:'150+' },
  { name:'BA (Hons) History',         slug:'ba-hist-hons',      icon:'🏺', sems:6, notes:'140+' },
  { name:'BCA',                       slug:'bca',               icon:'💻', sems:6, notes:'210+' },
  { name:'B.Sc (Hons) Mathematics',   slug:'bsc-maths-hons',   icon:'🔢', sems:6, notes:'180+' },
  { name:'B.Sc (Hons) Physics',       slug:'bsc-physics-hons', icon:'⚛️', sems:6, notes:'170+' },
  { name:'B.Sc (Hons) Chemistry',     slug:'bsc-chem-hons',    icon:'🧪', sems:6, notes:'155+' },
]

export const metadata = { title: 'All Courses — DU Update' }

export default function CoursesPage() {
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em',
        textTransform: 'uppercase', color: S.brand, marginBottom: '.5rem' }}>Browse</div>
      <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, marginBottom: '.75rem' }}>
        All Courses
      </h1>
      <p style={{ fontSize: 15, color: S.muted, marginBottom: '2.5rem' }}>
        Select your course to access notes, PYQs, and video lectures.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1rem' }}>
        {ALL_COURSES.map(c => (
          <Link key={c.slug} href={`/courses/${c.slug}`} style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', border: `1.5px solid ${S.border}`,
              borderRadius: 12, padding: '1.5rem', height: '100%',
              transition: 'border-color .2s, box-shadow .2s' }}>
              <div style={{ fontSize: 28, marginBottom: '.75rem' }}>{c.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: S.navy, marginBottom: '.4rem' }}>{c.name}</div>
              <div style={{ fontSize: 12, color: S.muted }}>{c.sems} Semesters · {c.notes} notes</div>
              <div style={{ marginTop: '1rem', fontSize: 13, color: S.brand, fontWeight: 600 }}>
                View course →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
