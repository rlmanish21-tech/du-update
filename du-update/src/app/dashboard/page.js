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

  // Fetch full profile with college and course details
  const { data: profile } = await supabase
    .from('users')
    .select(`
      name, current_semester, is_premium,
      colleges ( name ),
      courses ( id, name, short_name )
    `)
    .eq('id', user.id)
    .single()

  // If profile not complete → send to complete profile
  const isProfileComplete = profile?.colleges && profile?.courses && profile?.current_semester
  if (!isProfileComplete) redirect('/onboarding')

  const name       = profile?.name ?? user.email
  const firstName  = name.split(' ')[0]
  const college    = profile?.colleges?.name ?? ''
  const course     = profile?.courses?.short_name ?? ''
  const courseId   = profile?.courses?.id ?? ''
  const sem        = profile?.current_semester ?? ''
  const isPremium  = profile?.is_premium ?? false

  // Build course slug for links
  // We'll use courseId directly in the link for now
  const semLink = `/courses/${courseId}/${sem}`

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem 1.5rem' }}>

      {/* Welcome banner */}
      <div style={{ background: S.navy, borderRadius: 14,
        padding: '1.5rem 2rem', marginBottom: '2rem',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>
            Welcome back, {firstName}! 👋
          </div>
          <div style={{ fontSize: 14, color: '#A0B4D6', marginTop: '.3rem' }}>
            {college} · {course} · Semester {sem}
          </div>
        </div>
        {!isPremium && (
          <Link href="/pricing" style={{
            background: S.brand, color: '#fff',
            padding: '9px 18px', borderRadius: 8,
            fontSize: 13, fontWeight: 700, textDecoration: 'none',
            whiteSpace: 'nowrap'
          }}>Upgrade to Premium ₹499/yr</Link>
        )}
      </div>

      {/* Quick action cards */}
      <div style={{ display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem', marginBottom: '2rem' }}>

        <Link href={semLink} style={{ textDecoration: 'none' }}>
          <div style={{ background: '#fff', border: `1.5px solid ${S.brand}`,
            borderRadius: 12, padding: '1.25rem', height: '100%' }}>
            <div style={{ fontSize: 26, marginBottom: '.5rem' }}>📝</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: S.navy }}>
              My Notes
            </div>
            <div style={{ fontSize: 12, color: S.muted, marginTop: '.25rem' }}>
              {course} · Sem {sem}
            </div>
            <div style={{ fontSize: 12, color: S.brand, fontWeight: 600, marginTop: '.75rem' }}>
              Open →
            </div>
          </div>
        </Link>

        <Link href={`${semLink}?tab=pyq`} style={{ textDecoration: 'none' }}>
          <div style={{ background: '#fff', border: `1px solid ${S.border}`,
            borderRadius: 12, padding: '1.25rem', height: '100%' }}>
            <div style={{ fontSize: 26, marginBottom: '.5rem' }}>📋</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: S.navy }}>Previous Year Questions</div>
            <div style={{ fontSize: 12, color: S.muted, marginTop: '.25rem' }}>
              {course} · Sem {sem}
            </div>
            <div style={{ fontSize: 12, color: S.brand, fontWeight: 600, marginTop: '.75rem' }}>
              Open →
            </div>
          </div>
        </Link>

        <Link href="/dashboard/attendance" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#fff', border: `1px solid ${S.border}`,
            borderRadius: 12, padding: '1.25rem', height: '100%' }}>
            <div style={{ fontSize: 26, marginBottom: '.5rem' }}>✅</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: S.navy }}>Attendance Tracker</div>
            <div style={{ fontSize: 12, color: S.muted, marginTop: '.25rem' }}>
              Stay above 75%
            </div>
            <div style={{ fontSize: 12, color: S.brand, fontWeight: 600, marginTop: '.75rem' }}>
              Open →
            </div>
          </div>
        </Link>

        <Link href="/dashboard/timetable" style={{ textDecoration: 'none' }}>
          <div style={{ background: '#fff', border: `1px solid ${S.border}`,
            borderRadius: 12, padding: '1.25rem', height: '100%' }}>
            <div style={{ fontSize: 26, marginBottom: '.5rem' }}>📅</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: S.navy }}>My Timetable</div>
            <div style={{ fontSize: 12, color: S.muted, marginTop: '.25rem' }}>
              {college}
            </div>
            <div style={{ fontSize: 12, color: S.brand, fontWeight: 600, marginTop: '.75rem' }}>
              Open →
            </div>
          </div>
        </Link>
      </div>

      {/* Browse all semesters for their course */}
      <div style={{ background: '#fff', border: `1px solid ${S.border}`,
        borderRadius: 12, padding: '1.5rem' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: S.navy, marginBottom: '1rem' }}>
          All Semesters — {course}
        </div>
        <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
          {[1,2,3,4,5,6].map(s => (
            <Link key={s} href={`/courses/${courseId}/${s}`} style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '10px 18px', borderRadius: 8,
                border: `1.5px solid ${s === sem ? S.brand : S.border}`,
                background: s === sem ? '#FFF8F5' : S.off,
                color: s === sem ? S.brand : S.muted,
                fontSize: 14, fontWeight: s === sem ? 700 : 500,
                cursor: 'pointer'
              }}>
                Sem {s} {s === sem ? '← You are here' : ''}
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
