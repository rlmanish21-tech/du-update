'use client'
import { useState } from 'react'
import Link from 'next/link'

const S = {
  navy: '#0F2044', navyLight: '#1B3465',
  brand: '#FF6B35', gold: '#F7C948',
  white: '#fff', off: '#F7F9FF',
  muted: '#8898B8', border: '#DCE4F5',
}

const courses = [
  { name: 'B.Com Hons',   notes: '240+', pyqs: '520+', videos: '380+', slug: 'bcom-hons',        icon: '📊' },
  { name: 'BA Eco',       notes: '190+', pyqs: '450+', videos: '320+', slug: 'ba-eco-hons',       icon: '📈' },
  { name: 'BCA',          notes: '210+', pyqs: '380+', videos: '420+', slug: 'bca',               icon: '💻' },
  { name: 'BA English',   notes: '160+', pyqs: '300+', videos: '280+', slug: 'ba-eng-hons',       icon: '📚' },
  { name: 'B.Sc Maths',   notes: '180+', pyqs: '420+', videos: '350+', slug: 'bsc-maths-hons',   icon: '🔢' },
  { name: 'B.Com Prog',   notes: '200+', pyqs: '480+', videos: '340+', slug: 'bcom-prog',         icon: '💼' },
  { name: 'BA Pol Sci',   notes: '150+', pyqs: '280+', videos: '260+', slug: 'ba-polsci-hons',   icon: '🏛️' },
  { name: 'B.Sc Physics', notes: '170+', pyqs: '390+', videos: '310+', slug: 'bsc-physics-hons', icon: '⚛️' },
]

const features = [
  { icon: '📝', title: 'Semester-wise Notes',     desc: 'Structured notes for every subject, exactly as per DU NEP syllabus.' },
  { icon: '📋', title: 'PYQ Bank',                desc: 'Previous year questions with solutions, sorted by paper and year.' },
  { icon: '▶️', title: 'Curated Video Lectures',  desc: 'Best YouTube classes handpicked and tagged for your course.' },
  { icon: '📅', title: 'College Timetable',        desc: 'Timetables contributed by students from your own college.' },
  { icon: '✅', title: 'Attendance Tracker',       desc: 'Subject-wise tracker. Alerts before you fall below 75%.' },
  { icon: '🔔', title: 'Exam Alerts',              desc: 'Admit card dates, exam schedules — never miss a deadline.' },
]

export default function Home() {
  const [active, setActive]       = useState(0)
  const [email, setEmail]         = useState('')
  const [submitted, setSubmitted] = useState(false)
  const sel = courses[active]

  const handleSignup = () => {
    if (email.includes('@')) setSubmitted(true)
  }

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: S.navy }}>

      {/* ── HERO ── */}
      <section style={{ background: S.navy, padding: '4rem 1.5rem 3rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(255,107,53,0.15)', color: '#FF9B73',
          fontSize: 12, fontWeight: 600, letterSpacing: '.06em',
          padding: '5px 14px', borderRadius: 20, marginBottom: '1.25rem',
          textTransform: 'uppercase' }}>
          For Delhi University Students
        </div>

        <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 900,
          color: '#fff', lineHeight: 1.1, margin: '0 0 1rem' }}>
          Everything DU.<br />
          <span style={{ color: S.brand }}>One place.</span>
        </h1>

        <p style={{ fontSize: 16, color: '#A0B4D6', maxWidth: 460,
          margin: '0 auto 2rem', lineHeight: 1.6 }}>
          Notes, PYQs, videos, timetable, attendance — all organised for your exact course and semester.
        </p>

        {/* Course pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: '1.5rem' }}>
          {courses.map((c, i) => (
            <button key={c.slug} onClick={() => setActive(i)} style={{
              padding: '7px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500,
              cursor: 'pointer', border: `1.5px solid ${i === active ? S.brand : 'rgba(255,255,255,0.2)'}`,
              background: i === active ? S.brand : 'transparent',
              color: i === active ? '#fff' : '#A0B4D6',
              transition: 'all .2s'
            }}>{c.name}</button>
          ))}
        </div>

        {/* Dynamic stats */}
        <div style={{ display: 'inline-flex', gap: '2rem',
          background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 12, padding: '1rem 2rem', marginBottom: '2rem' }}>
          {[['Notes', sel.notes], ['PYQs', sel.pyqs], ['Videos', sel.videos]].map(([label, val]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: S.gold }}>{val}</div>
              <div style={{ fontSize: 11, color: '#7A90B5', textTransform: 'uppercase',
                letterSpacing: '.05em', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Email capture */}
        {!submitted ? (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center',
            flexWrap: 'wrap', maxWidth: 420, margin: '0 auto' }}>
            <input
              type="email"
              placeholder="Enter your email for early access"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSignup()}
              style={{ flex: 1, minWidth: 200, padding: '11px 16px',
                borderRadius: 8, border: '1.5px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.08)', color: '#fff',
                fontSize: 14, outline: 'none' }}
            />
            <button onClick={handleSignup} style={{
              background: S.brand, color: '#fff', padding: '11px 22px',
              borderRadius: 8, border: 'none', fontSize: 14,
              fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap'
            }}>Get Early Access</button>
          </div>
        ) : (
          <p style={{ color: '#6BE8A8', fontSize: 15, fontWeight: 600, marginTop: '0.5rem' }}>
            You're on the list! We'll notify you at launch. 🎉
          </p>
        )}
      </section>

      {/* ── STATS STRIP ── */}
      <div style={{ background: S.off, borderBottom: `1px solid ${S.border}`,
        display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        {[['80+','DU Colleges'],['50+','Courses'],['10,000+','Study Materials'],['100%','NEP Aligned']].map(([n, l]) => (
          <div key={l} style={{ textAlign: 'center', padding: '1.25rem 2.5rem',
            borderRight: `1px solid ${S.border}` }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: S.navy }}>{n}</div>
            <div style={{ fontSize: 12, color: S.muted, marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '4rem 1.5rem', maxWidth: 960, margin: '0 auto' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em',
          textTransform: 'uppercase', color: S.brand, marginBottom: '.5rem' }}>Why DU Update</div>
        <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, marginBottom: '.75rem' }}>
          Built for DU. Not just for exams.
        </h2>
        <p style={{ fontSize: 15, color: S.muted, lineHeight: 1.6, maxWidth: 500, marginBottom: '2.5rem' }}>
          Everything a DU student needs — structured, searchable, and updated every semester.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '1rem' }}>
          {features.map(f => (
            <div key={f.title} style={{ background: S.off, border: `1px solid ${S.border}`,
              borderRadius: 12, padding: '1.5rem' }}>
              <div style={{ fontSize: 22, marginBottom: '0.75rem' }}>{f.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: '.4rem' }}>{f.title}</div>
              <div style={{ fontSize: 13, color: S.muted, lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── COURSES GRID ── */}
      <section id="courses" style={{ background: S.off, padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em',
            textTransform: 'uppercase', color: S.brand, marginBottom: '.5rem' }}>Courses Available</div>
          <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, marginBottom: '2rem' }}>
            Your course. Your content.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '.75rem' }}>
            {courses.map(c => (
              <Link key={c.slug} href={`/courses/${c.slug}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: S.white, border: `1.5px solid ${S.border}`,
                  borderRadius: 10, padding: '1rem', cursor: 'pointer',
                  transition: 'border-color .2s' }}>
                  <div style={{ fontSize: 22, marginBottom: '.5rem' }}>{c.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: S.navy, marginBottom: '.25rem' }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: S.muted }}>{c.notes} notes · {c.pyqs} PYQs</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: '4rem 1.5rem', maxWidth: 760, margin: '0 auto' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em',
          textTransform: 'uppercase', color: S.brand, marginBottom: '.5rem' }}>Pricing</div>
        <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, marginBottom: '.75rem' }}>
          Cheaper than one coaching class.
        </h2>
        <p style={{ fontSize: 15, color: S.muted, marginBottom: '2.5rem' }}>
          A full year of DU Update costs less than a single private tuition session.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '1.25rem' }}>

          {/* Free */}
          <div style={{ border: `1.5px solid ${S.border}`, borderRadius: 14, padding: '2rem' }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.08em',
              textTransform: 'uppercase', color: S.muted, marginBottom: '.75rem' }}>Free</div>
            <div style={{ fontSize: 36, fontWeight: 900, marginBottom: '1.25rem' }}>
              <sup style={{ fontSize: 16 }}>₹</sup>0
              <span style={{ fontSize: 14, fontWeight: 400, color: S.muted }}> / forever</span>
            </div>
            {['Syllabus for all courses','1 PYQ per subject','YouTube links','Exam calendar'].map(f => (
              <div key={f} style={{ fontSize: 13, padding: '6px 0',
                borderBottom: `1px solid ${S.border}`, display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ color: '#22C55E', fontWeight: 700 }}>✓</span>{f}
              </div>
            ))}
            <Link href="/login" style={{
              display: 'block', textAlign: 'center', marginTop: '1.5rem',
              padding: 11, borderRadius: 8, fontSize: 14, fontWeight: 700,
              background: S.off, color: S.navy, border: `1.5px solid ${S.border}`,
              textDecoration: 'none'
            }}>Get Started Free</Link>
          </div>

          {/* Premium */}
          <div style={{ border: `2px solid ${S.brand}`, borderRadius: 14,
            padding: '2rem', background: '#FFF8F5', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -14, left: '50%',
              transform: 'translateX(-50%)', background: S.brand, color: '#fff',
              fontSize: 11, fontWeight: 700, padding: '4px 14px',
              borderRadius: 20, whiteSpace: 'nowrap', letterSpacing: '.04em' }}>
              MOST POPULAR
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.08em',
              textTransform: 'uppercase', color: S.muted, marginBottom: '.75rem' }}>Premium</div>
            <div style={{ fontSize: 36, fontWeight: 900 }}>
              <sup style={{ fontSize: 16 }}>₹</sup>499
              <span style={{ fontSize: 14, fontWeight: 400, color: S.muted }}> / year</span>
            </div>
            <div style={{ fontSize: 12, color: S.muted, textDecoration: 'line-through', margin: '.2rem 0' }}>₹999/year</div>
            <div style={{ fontSize: 12, color: '#22C55E', fontWeight: 600, marginBottom: '1.25rem' }}>Save 50% — Launch offer</div>
            {['Everything in Free','All notes & study material','Full PYQ bank with solutions',
              'College timetable','Attendance tracker','Exam & admit card alerts'].map(f => (
              <div key={f} style={{ fontSize: 13, padding: '6px 0',
                borderBottom: `1px solid #FFD9C9`, display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ color: '#22C55E', fontWeight: 700 }}>✓</span>{f}
              </div>
            ))}
            <Link href="/login" style={{
              display: 'block', textAlign: 'center', marginTop: '1.5rem',
              padding: 11, borderRadius: 8, fontSize: 14, fontWeight: 700,
              background: S.brand, color: '#fff', border: 'none', textDecoration: 'none'
            }}>Get Premium — ₹499/yr</Link>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section style={{ background: S.navy, padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, color: '#fff', marginBottom: '.75rem' }}>
          Join 10,000+ DU students on the waitlist
        </h2>
        <p style={{ fontSize: 15, color: '#7A90B5', marginBottom: '2rem' }}>
          Early access members get 6 months free.
        </p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center',
          flexWrap: 'wrap', maxWidth: 420, margin: '0 auto' }}>
          <input type="email" placeholder="your@email.com"
            style={{ flex: 1, minWidth: 200, padding: '11px 16px', borderRadius: 8,
              border: '1.5px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)',
              color: '#fff', fontSize: 14, outline: 'none' }} />
          <button style={{ background: S.brand, color: '#fff', padding: '11px 22px',
            borderRadius: 8, border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            Join Waitlist
          </button>
        </div>
      </section>

    </div>
  )
}
