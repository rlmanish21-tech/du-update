import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabaseServer'
import Link from 'next/link'

const S = { navy:'#0F2044', brand:'#FF6B35', border:'#DCE4F5', muted:'#8898B8', off:'#F7F9FF' }

export const metadata = { title: 'Dashboard — DU Update' }

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch user profile
  const { data: profile } = await supabase
    .from('users')
    .select('*, colleges(name), courses(name, short_name)')
    .eq('id', user.id)
    .single()

  const isPremium   = profile?.is_premium ?? false
  const courseName  = profile?.courses?.short_name ?? 'Not set'
  const collegeName = profile?.colleges?.name ?? 'Not set'
  const sem         = profile?.current_semester ?? '—'

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 1.5rem' }}>

      {/* Welcome */}
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: '.25rem' }}>
        Welcome back, {user.user_metadata?.full_name?.split(' ')[0] ?? 'Student'} 👋
      </h1>
      <p style={{ fontSize: 14, color: S.muted, marginBottom: '2rem' }}>
        {courseName} · Semester {sem} · {collegeName}
      </p>

      {/* Premium banner */}
      {!isPremium && (
        <div style={{ background: '#FFF8F5', border: `1.5px solid ${S.brand}`,
          borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '2rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: S.navy }}>
              Upgrade to Premium — ₹499/year
            </div>
            <div style={{ fontSize: 13, color: S.muted }}>
              Unlock all notes, PYQs, attendance tracker, and timetable.
            </div>
          </div>
          <Link href="/pricing" style={{
            background: S.brand, color: '#fff', padding: '9px 18px',
            borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap'
          }}>Upgrade Now</Link>
        </div>
      )}

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label:'My Notes',         href:'/courses',              icon:'📝', desc:'Browse your course notes'    },
          { label:'Attendance',        href:'/dashboard/attendance', icon:'✅', desc:'Track subject attendance'    },
          { label:'Timetable',         href:'/dashboard/timetable',  icon:'📅', desc:'Your weekly schedule'        },
          { label:'Bookmarks',         href:'/dashboard/bookmarks',  icon:'🔖', desc:'Saved notes and PYQs'        },
        ].map(item => (
          <Link key={item.label} href={item.href} style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', border: `1px solid ${S.border}`,
              borderRadius: 12, padding: '1.25rem', height: '100%' }}>
              <div style={{ fontSize: 24, marginBottom: '.5rem' }}>{item.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: S.navy, marginBottom: '.25rem' }}>{item.label}</div>
              <div style={{ fontSize: 12, color: S.muted }}>{item.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Profile setup prompt if incomplete */}
      {!profile?.college_id && (
        <div style={{ background: S.off, border: `1px solid ${S.border}`,
          borderRadius: 12, padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: S.navy, marginBottom: '.5rem' }}>
            Complete your profile
          </div>
          <p style={{ fontSize: 13, color: S.muted, marginBottom: '1rem' }}>
            Tell us your college, course and semester to get personalised content.
          </p>
          <Link href="/dashboard/profile" style={{
            background: S.brand, color: '#fff', padding: '9px 18px',
            borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none'
          }}>Set Up Profile</Link>
        </div>
      )}
    </div>
  )
}
