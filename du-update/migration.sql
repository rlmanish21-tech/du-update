-- ============================================================
-- DU Update — Supabase SQL Migration
-- Run this in Supabase > SQL Editor
-- ============================================================

-- ─── EXTENSIONS ─────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── ENUMS ──────────────────────────────────────────────────
create type course_type       as enum ('hons', 'programme', 'bsc', 'ba', 'bca', 'msc', 'ma');
create type college_type      as enum ('constituent', 'affiliated', 'correspondence');
create type subject_category  as enum ('core', 'elective', 'aecc', 'sec', 'vac', 'dse', 'ge');
create type content_type      as enum ('notes', 'pyq', 'syllabus', 'assignment');
create type attendance_status as enum ('present', 'absent', 'medical');
create type subscription_plan as enum ('free', 'premium');
create type subscription_status as enum ('active', 'expired', 'failed', 'pending');

-- ============================================================
-- TABLES
-- ============================================================

-- ─── COLLEGES ───────────────────────────────────────────────
create table colleges (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  short_name  text,
  du_code     text unique,
  type        college_type not null default 'affiliated',
  address     text,
  created_at  timestamptz not null default now()
);

-- ─── COURSES ────────────────────────────────────────────────
create table courses (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  short_name  text not null,
  type        course_type not null,
  total_semesters int not null default 6,
  created_at  timestamptz not null default now()
);

-- ─── SUBJECTS ───────────────────────────────────────────────
create table subjects (
  id          uuid primary key default uuid_generate_v4(),
  course_id   uuid not null references courses(id) on delete cascade,
  semester    int not null check (semester between 1 and 8),
  name        text not null,
  paper_code  text,
  category    subject_category not null default 'core',
  created_at  timestamptz not null default now(),
  unique (course_id, semester, paper_code)
);

-- ─── USERS ──────────────────────────────────────────────────
-- Extends Supabase auth.users (one row per authenticated user)
create table users (
  id                  uuid primary key references auth.users(id) on delete cascade,
  name                text,
  phone               text,
  college_id          uuid references colleges(id) on delete set null,
  course_id           uuid references courses(id) on delete set null,
  current_semester    int check (current_semester between 1 and 8),
  is_premium          boolean not null default false,
  premium_expires_at  timestamptz,
  created_at          timestamptz not null default now()
);

-- ─── CONTENT (notes / PYQs / syllabus) ──────────────────────
create table content (
  id          uuid primary key default uuid_generate_v4(),
  subject_id  uuid not null references subjects(id) on delete cascade,
  type        content_type not null,
  title       text not null,
  file_url    text not null,
  year        int,                           -- populated for PYQs only
  is_premium  boolean not null default true,
  uploaded_by uuid references users(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- ─── VIDEOS (curated YouTube links) ─────────────────────────
create table videos (
  id          uuid primary key default uuid_generate_v4(),
  subject_id  uuid not null references subjects(id) on delete cascade,
  title       text not null,
  youtube_url text not null,
  topic       text,
  duration_s  int,                           -- video duration in seconds
  created_at  timestamptz not null default now()
);

-- ─── TIMETABLES (crowdsourced per college × course × sem) ───
create table timetables (
  id              uuid primary key default uuid_generate_v4(),
  college_id      uuid not null references colleges(id) on delete cascade,
  course_id       uuid not null references courses(id) on delete cascade,
  semester        int not null check (semester between 1 and 8),
  slots           jsonb not null default '[]',
  -- slots shape: [{day:"Mon", time_start:"09:00", time_end:"10:00", subject_id:"..."}]
  contributed_by  uuid references users(id) on delete set null,
  created_at      timestamptz not null default now(),
  unique (college_id, course_id, semester)
);

-- ─── ATTENDANCE ──────────────────────────────────────────────
create table attendance (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references users(id) on delete cascade,
  subject_id  uuid not null references subjects(id) on delete cascade,
  date        date not null,
  status      attendance_status not null,
  created_at  timestamptz not null default now(),
  unique (user_id, subject_id, date)
);

-- ─── SUBSCRIPTIONS ───────────────────────────────────────────
create table subscriptions (
  id                   uuid primary key default uuid_generate_v4(),
  user_id              uuid not null references users(id) on delete cascade,
  plan                 subscription_plan not null default 'premium',
  amount_paise         int not null,         -- e.g. ₹499 stored as 49900
  razorpay_order_id    text unique,
  razorpay_payment_id  text unique,
  starts_at            timestamptz,
  expires_at           timestamptz,
  status               subscription_status not null default 'pending',
  created_at           timestamptz not null default now()
);

-- ─── BOOKMARKS ───────────────────────────────────────────────
create table bookmarks (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references users(id) on delete cascade,
  content_id  uuid not null references content(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (user_id, content_id)
);

-- ─── WAITLIST ────────────────────────────────────────────────
create table waitlist (
  id               uuid primary key default uuid_generate_v4(),
  email            text not null unique,
  course_interest  text,
  created_at       timestamptz not null default now()
);

-- ============================================================
-- INDEXES (for common query patterns)
-- ============================================================

-- Subject lookup by course + semester (most common query)
create index idx_subjects_course_sem    on subjects(course_id, semester);

-- Content lookup by subject + type (notes vs pyq vs syllabus)
create index idx_content_subject_type   on content(subject_id, type);

-- Content free tier filter
create index idx_content_premium        on content(is_premium);

-- Videos by subject
create index idx_videos_subject         on videos(subject_id);

-- Attendance: user's full history; per-subject summary
create index idx_attendance_user        on attendance(user_id);
create index idx_attendance_user_sub    on attendance(user_id, subject_id);

-- Subscriptions: active check (most frequent)
create index idx_subs_user_status       on subscriptions(user_id, status);

-- Bookmarks by user
create index idx_bookmarks_user         on bookmarks(user_id);

-- Timetable lookup
create index idx_timetables_college_course on timetables(college_id, course_id, semester);

-- ============================================================
-- HELPER FUNCTION — auto-create user row on sign-up
-- ============================================================
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into users (id)
  values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================================
-- HELPER FUNCTION — auto-sync is_premium from subscriptions
-- ============================================================
create or replace function sync_premium_status()
returns trigger language plpgsql security definer as $$
begin
  update users
  set
    is_premium         = (new.status = 'active' and new.expires_at > now()),
    premium_expires_at = new.expires_at
  where id = new.user_id;
  return new;
end;
$$;

create trigger on_subscription_change
  after insert or update on subscriptions
  for each row execute procedure sync_premium_status();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table users        enable row level security;
alter table colleges     enable row level security;
alter table courses      enable row level security;
alter table subjects     enable row level security;
alter table content      enable row level security;
alter table videos       enable row level security;
alter table timetables   enable row level security;
alter table attendance   enable row level security;
alter table subscriptions enable row level security;
alter table bookmarks    enable row level security;
alter table waitlist     enable row level security;

-- ── Public read (colleges, courses, subjects, videos, free content) ──
create policy "Public read colleges"
  on colleges for select using (true);

create policy "Public read courses"
  on courses for select using (true);

create policy "Public read subjects"
  on subjects for select using (true);

create policy "Public read videos"
  on videos for select using (true);

create policy "Public read free content"
  on content for select
  using (is_premium = false);

create policy "Premium users read all content"
  on content for select
  using (
    is_premium = false
    or exists (
      select 1 from users u
      where u.id = auth.uid()
        and u.is_premium = true
        and u.premium_expires_at > now()
    )
  );

create policy "Public read timetables"
  on timetables for select using (true);

-- ── Users: own row only ──
create policy "Users read own row"
  on users for select
  using (id = auth.uid());

create policy "Users update own row"
  on users for update
  using (id = auth.uid());

-- ── Attendance: own records only ──
create policy "Users manage own attendance"
  on attendance for all
  using (user_id = auth.uid());

-- ── Subscriptions: own records only ──
create policy "Users read own subscriptions"
  on subscriptions for select
  using (user_id = auth.uid());

-- Subscriptions are created server-side via Razorpay webhook (service role)
-- No client insert policy needed here

-- ── Bookmarks: own only ──
create policy "Users manage own bookmarks"
  on bookmarks for all
  using (user_id = auth.uid());

-- ── Timetable contributions: auth users can insert ──
create policy "Authenticated users contribute timetables"
  on timetables for insert
  with check (auth.uid() is not null);

-- ── Waitlist: anyone can insert ──
create policy "Anyone can join waitlist"
  on waitlist for insert
  with check (true);

-- ============================================================
-- SEED DATA — starter colleges and courses
-- ============================================================

insert into colleges (name, short_name, du_code, type) values
  ('Hindu College', 'Hindu', 'HC', 'constituent'),
  ('Lady Shri Ram College', 'LSR', 'LSR', 'constituent'),
  ('Kirori Mal College', 'KMC', 'KMC', 'constituent'),
  ('Ramjas College', 'Ramjas', 'RC', 'constituent'),
  ('Miranda House', 'Miranda', 'MH', 'constituent'),
  ('Hansraj College', 'Hansraj', 'HRC', 'constituent'),
  ('SRCC', 'SRCC', 'SRCC', 'constituent'),
  ('Dyal Singh College', 'DSC', 'DSC', 'affiliated'),
  ('Gargi College', 'Gargi', 'GC', 'constituent'),
  ('Jesus and Mary College', 'JMC', 'JMC', 'constituent');

insert into courses (name, short_name, type, total_semesters) values
  ('Bachelor of Commerce (Honours)', 'B.Com Hons', 'hons', 6),
  ('Bachelor of Commerce (Programme)', 'B.Com Prog', 'programme', 6),
  ('Bachelor of Arts (Honours) Economics', 'BA Eco Hons', 'hons', 6),
  ('Bachelor of Arts (Honours) English', 'BA Eng Hons', 'hons', 6),
  ('Bachelor of Arts (Honours) Political Science', 'BA PolSci Hons', 'hons', 6),
  ('Bachelor of Arts (Honours) History', 'BA Hist Hons', 'hons', 6),
  ('Bachelor of Computer Applications', 'BCA', 'bca', 6),
  ('Bachelor of Science (Honours) Mathematics', 'B.Sc Maths Hons', 'hons', 6),
  ('Bachelor of Science (Honours) Physics', 'B.Sc Physics Hons', 'hons', 6),
  ('Bachelor of Science (Honours) Chemistry', 'B.Sc Chem Hons', 'hons', 6);

