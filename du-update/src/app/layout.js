import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'DU Update — Everything Delhi University, One Place',
  description: 'Notes, PYQs, video lectures, timetable and attendance tracker for Delhi University students. B.Com Hons, BA Hons, BCA and more.',
  keywords: 'Delhi University notes, DU PYQ, DU B.Com Hons notes, Delhi University study material',
  openGraph: {
    title: 'DU Update',
    description: 'Everything DU. One place.',
    url: 'https://duupdate.in',
    siteName: 'DU Update',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <footer style={{
          background: '#0F2044', color: '#7A90B5',
          padding: '2rem 1.5rem', textAlign: 'center',
          fontSize: 13, marginTop: 'auto'
        }}>
          <div style={{ maxWidth: 1100, margin: '0 auto',
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>DU Update</span>
            <span>© 2025 DU Update · Built for Delhi University students</span>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {['About','Courses','Pricing','Contact'].map(l => (
                <a key={l} href="#" style={{ color: '#5A7090', textDecoration: 'none', fontSize: 12 }}>{l}</a>
              ))}
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
