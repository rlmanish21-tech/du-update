# DU Update

Student platform for Delhi University — notes, PYQs, video lectures, timetable, and attendance tracker.

## Tech Stack
- **Frontend:** Next.js 14 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (Google OAuth)
- **Payments:** Razorpay
- **Hosting:** Vercel

---

## Local Setup

### 1. Clone and install
```bash
git clone https://github.com/YOUR_USERNAME/du-update.git
cd du-update
npm install
```

### 2. Set up Supabase
1. Go to [supabase.com](https://supabase.com) → New Project
2. Go to **SQL Editor** → paste contents of `migration.sql` → Run
3. Go to **Authentication → Providers** → enable **Google**
   - Add your Google OAuth Client ID + Secret
   - Set Redirect URL to: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`

### 3. Environment variables
```bash
cp .env.local.example .env.local
```
Fill in your Supabase URL and anon key from:
Supabase Dashboard → Settings → API

### 4. Run locally
```bash
npm run dev
# Open http://localhost:3000
```

---

## Deploy to Vercel

### First time
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project → select your repo
3. Add Environment Variables (same as `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - `NEXT_PUBLIC_APP_URL` → set to your Vercel URL
4. Click Deploy

### After that
Every `git push` to `main` auto-deploys to Vercel.

---

## Project Structure
```
src/
├── app/
│   ├── page.js                        # Landing page
│   ├── login/page.js                  # Google login
│   ├── auth/callback/route.js         # OAuth callback
│   ├── courses/page.js                # All courses
│   ├── courses/[slug]/page.js         # Course detail
│   ├── courses/[slug]/[semester]/     # Semester content
│   └── dashboard/
│       ├── page.js                    # Dashboard home
│       └── attendance/page.js         # Attendance tracker
├── components/
│   └── Navbar.jsx
├── lib/
│   ├── supabase.js                    # Client-side client
│   ├── supabaseServer.js              # Server-side client
│   └── utils.js                       # Helpers + course map
└── middleware.js                       # Auth route protection
```

---

## Adding Content
Content (notes, PYQs) is stored in **Supabase Storage**.
1. Upload PDFs to Supabase Storage bucket
2. Insert row in `content` table with the file URL
3. Set `is_premium = true` for paid content

## Adding a New Course
1. Add a row to `courses` table in Supabase
2. Add subjects to `subjects` table
3. Add the slug → display name mapping in `src/lib/utils.js`
