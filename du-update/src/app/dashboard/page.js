import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabaseServer'
import Link from 'next/link'

const S = { navy:'#0F2044', brand:'#FF6B35', border:'#DCE4F5', muted:'#8898B8', off:'#F7F9FF', gold:'#F7C948' }

export const metadata = { title: 'Dashboard — DU Update' }

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch profile
  const { data: profile } = await supabase
    .from('users')
    .select('name, phone, current_semester, is_premium, college_id, course_id')
    .eq('id', user.id)
    .single()

  // If no profile at all → they need to complete registration
  if (!profile) redirect('/login')

  // If profile incomplete → onboarding
  if (!profile.college_id || !profile.course_id || !profile.current_semester)
    redirect('/onboarding')

  // Fetch college + course separately to avoid RLS join issues
  const [{ data: college }, { data: course }] = await Promise.all([
    supabase.from('colleges').select('name').eq('id', profile.college_id).single(),
    supabase.from('courses').select('id, name, short_name').eq('id', profile.course_id).single(),
  ])

  const firstName   = profile.name?.split(' ')[0] ?? 'Student'
  const fullName    = profile.name ?? 'Student'
  const phone       = profile.phone ?? '—'
  const collegeName = college?.name ?? '—'
  const courseName  = course?.short_name ?? '—'
  const courseId    = course?.id ?? ''
  const sem         = profile.current_semester ?? 1
  const isPremium   = profile.is_premium ?? false
  const initial     = fullName.charAt(0).toUpperCase()

  return (
    <div style={{ maxWidth: 940, margin: '0 auto', padding: '2.5rem 1.5rem' }}>

      {/* ── Profile Card ── */}
      <div style={{ background: S.navy, borderRadius: 16, padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>

          {/* Avatar */}
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: S.brand, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 900, color: '#fff', flexShrink: 0 }}>
            {initial}
          </div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>
              {fullName}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', marginTop: '.5rem' }}>
              {[
                { icon: '🏛️', label: collegeName },
                { icon: '📚', label: courseName },
                { icon: '📅', label: `Semester ${sem}` },
                { icon: '📱', label: phone },
              ].map(item => (
                <span key={item.label} style={{ background: 'rgba(255,255,255,0.1)', color: '#C8D8F0', fontSize: 12, fontWeight: 500, padding: '4px 10px', borderRadius: 20 }}>
                  {item.icon} {item.label}
                </span>
              ))}
            </div>
          </div>

          {/* Edit + Premium */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', alignItems: 'flex-end' }}>
            <Link href="/dashboard/profile" style={{ fontSize: 12, color: '#A0B4D6', textDecoration: 'none', background: 'rgba(255,255,255,0.08)', padding: '6px 14px', borderRadius: 7, fontWeight: 600 }}>
              ✏️ Edit Profile
            </Link>
            {isPremium ? (
              <span style={{ fontSize: 11, color: S.gold, fontWeight: 700, background: 'rgba(247,201,72,0.15)', padding: '4px 12px', borderRadius: 20 }}>
                ⭐ Premium Member
              </span>
            ) : (
              <Link href="/#pricing" style={{ fontSize: 12, color: '#fff', background: S.brand, padding: '6px 14px', borderRadius: 7, textDecoration: 'none', fontWeight: 700 }}>
                Upgrade ₹499/yr
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Feature Buttons ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>

        {/* PYQ — fully functional */}
        <Link href={`/courses/${courseId}/${sem}?tab=pyq`} style={{ textDecoration: 'none' }}>
          <div style={{ background: S.brand, borderRadius: 14, padding: '1.5rem', color: '#fff', position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontSize: 28, marginBottom: '.5rem' }}>📋</div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>Previous Year Questions</div>
            <div style={{ fontSize: 12, opacity: .85, marginTop: '.3rem' }}>{courseName} · Sem {sem}</div>
            <div style={{ fontSize: 12, fontWeight: 700, marginTop: '.75rem', background: 'rgba(255,255,255,0.2)', display: 'inline-block', padding: '4px 12px', borderRadius: 20 }}>
              Open PYQs →
            </div>
          </div>
        </Link>

        {/* Notes */}
        <Link href={`/courses/${courseId}/${sem}?tab=notes`} style={{ textDecoration: 'none' }}>
          <div style={{ background: '#fff', border: `1.5px solid ${S.border}`, borderRadius: 14, padding: '1.5rem' }}>
            <div style={{ fontSize: 28, marginBottom: '.5rem' }}>📝</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: S.navy }}>Notes</div>
            <div style={{ fontSize: 12, color: S.muted, marginTop: '.3rem' }}>{courseName} · Sem {sem}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: S.brand, marginTop: '.75rem' }}>Open Notes →</div>
          </div>
        </Link>

        {/* Attendance */}
        <Link href="/dashboard/attendance" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#fff', border: `1.5px solid ${S.border}`, borderRadius: 14, padding: '1.5rem' }}>
            <div style={{ fontSize: 28, marginBottom: '.5rem' }}>✅</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: S.navy }}>Attendance</div>
            <div style={{ fontSize: 12, color: S.muted, marginTop: '.3rem' }}>Stay above 75%</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: S.brand, marginTop: '.75rem' }}>Track Now →</div>
          </div>
        </Link>

        {/* Timetable — Coming Soon */}
        <div style={{ background: '#fff', border: `1.5px solid ${S.border}`, borderRadius: 14, padding: '1.5rem', opacity: .7, cursor: 'not-allowed' }}>
          <div style={{ fontSize: 28, marginBottom: '.5rem' }}>📅</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: S.navy }}>Timetable</div>
          <div style={{ fontSize: 12, color: S.muted, marginTop: '.3rem' }}>{collegeName}</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', marginTop: '.75rem', background: S.muted, display: 'inline-block', padding: '4px 12px', borderRadius: 20 }}>
            Coming Soon
          </div>
        </div>

        {/* College Notices — Coming Soon */}
        <div style={{ background: '#fff', border: `1.5px solid ${S.border}`, borderRadius: 14, padding: '1.5rem', opacity: .7, cursor: 'not-allowed' }}>
          <div style={{ fontSize: 28, marginBottom: '.5rem' }}>🏛️</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: S.navy }}>College Notices</div>
          <div style={{ fontSize: 12, color: S.muted, marginTop: '.3rem' }}>Latest from {collegeName}</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', marginTop: '.75rem', background: S.muted, display: 'inline-block', padding: '4px 12px', borderRadius: 20 }}>
            Coming Soon
          </div>
        </div>

        {/* DU Notices — Coming Soon */}
        <div style={{ background: '#fff', border: `1.5px solid ${S.border}`, borderRadius: 14, padding: '1.5rem', opacity: .7, cursor: 'not-allowed' }}>
          <div style={{ fontSize: 28, marginBottom: '.5rem' }}>📢</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: S.navy }}>DU Notices</div>
          <div style={{ fontSize: 12, color: S.muted, marginTop: '.3rem' }}>Latest from Delhi University</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', marginTop: '.75rem', background: S.muted, display: 'inline-block', padding: '4px 12px', borderRadius: 20 }}>
            Coming Soon
          </div>
        </div>
      </div>

      {/* ── Semester Switcher ── */}
      <div style={{ background: '#fff', border: `1px solid ${S.border}`, borderRadius: 12, padding: '1.5rem' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: S.navy, marginBottom: '1rem' }}>
          📚 Browse All Semesters — {courseName}
        </div>
        <div style={{ display: 'flex', gap: '.6rem', flexWrap: 'wrap' }}>
          {[1,2,3,4,5,6].map(s => (
            <Link key={s} href={`/courses/${courseId}/${s}`} style={{ textDecoration: 'none' }}>
              <div style={{ padding: '9px 18px', borderRadius: 8, fontSize: 14,
                border: `1.5px solid ${s === sem ? S.brand : S.border}`,
                background: s === sem ? '#FFF8F5' : S.off,
                color: s === sem ? S.brand : S.muted,
                fontWeight: s === sem ? 700 : 500 }}>
                Sem {s}{s === sem ? ' ✓' : ''}
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
