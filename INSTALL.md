# 📦 Synapse - Installation Guide

---

## 1. Clone repository

```bash
git clone https://github.com/lucjanmnm/synapse.git
cd synapse
```

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Create Supabase project

Go to 👉 https://supabase.com and create a new project.

Then go to:
**Project Settings → API**

Copy:
- `Project URL`
- `Publishable Key` (anon key)

---

## 4. Create environment file

Create `.env.local` in the root of the project:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

---

## 5. Run SQL migrations

Go to your Supabase project → **SQL Editor** and run the following SQL in order.

---

### 5.1 - logs

Main table for all Quick Add entries.

```sql
create table logs (
  id           uuid primary key default gen_random_uuid(),
  category     text not null,
  value_num    numeric,
  value_text   text,
  raw_input    text not null,
  mood_score   smallint check (mood_score between 1 and 10),
  stress_score smallint check (stress_score between 1 and 10),
  energy_score smallint check (energy_score between 1 and 10),
  tags         text[],
  logged_at    timestamptz not null default now(),
  created_at   timestamptz not null default now()
);
```

---

### 5.2 - goals

Weekly and monthly goals.

```sql
create table goals (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  type       text not null check (type in ('weekly', 'monthly')),
  priority   text not null check (priority in ('health', 'relationship', 'work', 'other')),
  completed  boolean not null default false,
  week_start date,
  due_date   date,
  created_at timestamptz not null default now()
);
```

---

### 5.3 - weekly_reviews

One record per week.

```sql
create table weekly_reviews (
  id              uuid primary key default gen_random_uuid(),
  week_start      date not null unique,
  energy_avg      numeric,
  stress_avg      numeric,
  productivity    smallint,
  relationship    smallint,
  physical        smallint,
  wins            text,
  mistakes        text,
  chaos_sources   text,
  next_priorities text[],
  created_at      timestamptz not null default now()
);
```

---

### 5.4 - events

Calendar events.

```sql
create table events (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  date        date not null,
  time        time,
  description text,
  created_at  timestamptz not null default now()
);
```

---

### 5.5 - settings

User settings - one row only.

```sql
create table settings (
  id           uuid primary key default gen_random_uuid(),
  display_name text,
  context_bio  text,
  timezone     text default 'Europe/Warsaw',
  shortcuts    text[] default array['waga 72.1', 'sen 7h', 'stres 7', 'mood 8', 'trening push'],
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Required: insert one default row
insert into settings (display_name) values ('Użytkownik');
```

---

### 5.6 - priorities

Weekly priorities shown on dashboard.

```sql
create table priorities (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  completed  boolean not null default false,
  week_start date not null,
  created_at timestamptz not null default now()
);
```

---

## 6. Run locally

```bash
npm run dev
```

Open 👉 http://localhost:3000

---

## 7. Optional - allow dev access from other devices (mobile)

```bash
npm run dev -- --host
```

Then add your local IP to `next.config.ts`:

```ts
const nextConfig = {
  allowedDevOrigins: ['your-local-ip'],
}

export default nextConfig
```

---

## ✅ Done

Your Synapse instance is ready.

Open the dashboard and start logging with Quick Add:

```txt
waga 72.1
sen 7:30
stres 6
mood 8
trening push
```