import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabaseServer'
import Link from 'next/link'

const S = {
  navy: '#0F2044', brand: '#FF6B35',
  border: '#DCE4F5', muted: '#8898B8', off: '#F7F9FF'
}

export const metadata = { title: 'Dashboard — DU Update' }

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch profile
  const { data: profile } = await supabase
    .from('users')
    .select('name, current_semester, is_premium, college_id, course_id')
    .eq('id', user.id)
    .single()

  // If profile incomplete → send to onboarding
  if (!profile?.college_id || !profile?.course_id || !profile?.current_semester) {
    redirect('/onboarding')
  }

  // Fetch college name
  const { data: college } = await supabase
    .from('colleges')
    .select('name')
    .eq('id', profile.college_id)
    .single()

  // Fetch course details
  const { data: course } = await supabase
    .from('courses')
    .select('id, name, short_name')
    .eq('id', profile.course_id)
    .single()

  const firstName  = profile?.name?.split(' ')[0] ?? 'Student'
  const collegeName = college?.name ?? ''
  const courseName  = course?.short_name ?? ''
  const courseId    = course?.id ?? ''
  const sem         = profile?.current_semester ?? 1
  const isPremium   = profile?.is_premium ?? false

  // Fetch subjects for their specific course + semester
  const { data: subjects } = await supabase
    .from('subjects')
    .select('id, name, paper_code, category')
    .eq('course_id', courseId)
    .eq('semester', sem)
    .order('name')

  return (
    <div style={{ maxWidth: 940, margin: '0 auto', padding: '2.5rem 1.5rem' }}>

      {/* ── Welcome Banner ── */}
      <div style={{
        background: S.navy, borderRadius: 14,
        padding: '1.75rem 2rem', marginBottom: '2rem',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
      }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>
            Welcome back, {firstName}! 👋
          </div>
          <div style={{ fontSize: 14, color: '#A0B4D6', marginTop: '.35rem' }}>
            📍 {collegeName} &nbsp;·&nbsp; 📚 {courseName} &nbsp;·&nbsp; 📅 Semester {sem}
          </div>
        </div>
        {!isPremium && (
          <Link href="/#pricing" style={{
            background: S.brand, color: '#fff',
            padding: '9px 20px', borderRadius: 8,
            fontSize: 13, fontWeight: 700, textDecoration: 'none',
            whiteSpace: 'nowrap', border: 'none'
          }}>
            ⭐ Upgrade — ₹499/yr
          </Link>
        )}
      </div>

      {/* ── Quick Action Cards ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))',
        gap: '1rem', marginBottom: '2rem'
      }}>
        {[
          { icon: '📝', label: 'My Notes',     sub: `${courseName} · Sem ${sem}`, href: `/courses/${courseId}/${sem}?tab=notes`     },
          { icon: '📋', label: 'PYQs',          sub: `${courseName} · Sem ${sem}`, href: `/courses/${courseId}/${sem}?tab=pyq`       },
          { icon: '▶️', label: 'Video Lectures', sub: `${courseName} · Sem ${sem}`, href: `/courses/${courseId}/${sem}?tab=videos`    },
          { icon: '✅', label: 'Attendance',     sub: 'Stay above 75%',             href: '/dashboard/attendance'                     },
          { icon: '📅', label: 'Timetable',      sub: collegeName,                  href: '/dashboard/timetable'                      },
          { icon: '⚙️', label: 'Edit Profile',   sub: 'Change course or semester',  href: '/dashboard/profile'                        },
        ].map(item => (
          <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#fff', border: `1.5px solid ${S.border}`,
              borderRadius: 12, padding: '1.25rem', height: '100%',
              transition: 'border-color .2s, box-shadow .2s'
            }}>
              <div style={{ fontSize: 24, marginBottom: '.6rem' }}>{item.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: S.navy }}>{item.label}</div>
              <div style={{ fontSize: 11, color: S.muted, marginTop: '.25rem' }}>{item.sub}</div>
              <div style={{ fontSize: 12, color: S.brand, fontWeight: 600, marginTop: '.75rem' }}>
                Open →
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── My Subjects This Semester ── */}
      <div style={{
        background: '#fff', border: `1px solid ${S.border}`,
        borderRadius: 12, padding: '1.5rem', marginBottom: '1.5rem'
      }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: S.navy, marginBottom: '1rem' }}>
          📚 Your Subjects — {courseName} Semester {sem}
        </div>

        {subjects && subjects.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
            {subjects.map(sub => (
              <div key={sub.id} style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', padding: '10px 14px',
                background: S.off, borderRadius: 9,
                border: `1px solid ${S.border}`
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: S.navy }}>
                    {sub.name}
                  </div>
                  {sub.paper_code && (
                    <div style={{ fontSize: 11, color: S.muted, marginTop: 2 }}>
                      {sub.paper_code} · {sub.category?.toUpperCase()}
                    </div>
                  )}
                </div>
                <Link href={`/courses/${courseId}/${sem}`} style={{
                  fontSize: 12, color: S.brand,
                  fontWeight: 600, textDecoration: 'none'
                }}>
                  Study →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: S.muted }}>
            <div style={{ fontSize: 32, marginBottom: '.75rem' }}>📭</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: '.4rem' }}>
              No subjects added yet for this semester
            </div>
            <div style={{ fontSize: 13 }}>
              Content for {courseName} Sem {sem} is being added soon.
            </div>
          </div>
        )}
      </div>

      {/* ── Browse Other Semesters ── */}
      <div style={{
        background: '#fff', border: `1px solid ${S.border}`,
        borderRadius: 12, padding: '1.5rem'
      }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: S.navy, marginBottom: '1rem' }}>
          Browse Other Semesters — {courseName}
        </div>
        <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap' }}>
          {[1, 2, 3, 4, 5, 6].map(s => (
            <Link key={s} href={`/courses/${courseId}/${s}`} style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '9px 18px', borderRadius: 8, fontSize: 14,
                border: `1.5px solid ${s === sem ? S.brand : S.border}`,
                background: s === sem ? '#FFF8F5' : S.off,
                color: s === sem ? S.brand : S.muted,
                fontWeight: s === sem ? 700 : 500, cursor: 'pointer'
              }}>
                Sem {s}{s === sem ? ' ✓' : ''}
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
