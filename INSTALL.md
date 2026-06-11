# 📦 Synapse — Installation Guide

---

## 1️⃣ Clone & install

```bash
git clone https://github.com/lucjanmnm/synapse.git
cd synapse
npm install
```

---

## 2️⃣ Supabase setup

1. Go to 👉 https://supabase.com — create a new project
2. **Project Settings → API** → copy:
   - `Project URL`
   - `Publishable Key`

---

## 3️⃣ Environment file

Create `.env.local` in project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

---

## 4️⃣ SQL migrations

Go to **Supabase → SQL Editor** and run each block below in order.

---

### logs
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

### goals
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

### weekly_reviews
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

### event_categories
```sql
create table event_categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  color      text not null default '#888888',
  created_at timestamptz not null default now()
);

insert into event_categories (name, color) values
  ('Szkoła',      '#6B7280'),
  ('Transport',   '#F97316'),
  ('Życie',       '#3B82F6'),
  ('Życie ważne', '#EF4444'),
  ('Trening',     '#22C55E');
```

### events
```sql
create table events (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  date          date not null,
  time_start    time,
  time_end      time,
  description   text,
  category_id   uuid references event_categories(id) on delete set null,
  recurring     boolean not null default false,
  recurring_days int[] default null,
  created_at    timestamptz not null default now()
);
```

### settings
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

insert into settings (display_name) values ('Użytkownik');
```

### priorities
```sql
create table priorities (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  completed  boolean not null default false,
  week_start date not null,
  created_at timestamptz not null default now()
);
```

### budget_categories
```sql
create table budget_categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  type       text not null check (type in ('expense', 'income')),
  color      text not null default '#888888',
  created_at timestamptz not null default now()
);

insert into budget_categories (name, type, color) values
  ('Jedzenie',    'expense', '#F97316'),
  ('Transport',   'expense', '#6B7280'),
  ('Rozrywka',    'expense', '#8B5CF6'),
  ('Ubrania',     'expense', '#EC4899'),
  ('Zdrowie',     'expense', '#22C55E'),
  ('Inne',        'expense', '#94A3B8'),
  ('Kieszonkowe', 'income',  '#4ADE80'),
  ('Praca',       'income',  '#60A5FA'),
  ('Inne',        'income',  '#A3E635');
```

### transactions
```sql
create table transactions (
  id          uuid primary key default gen_random_uuid(),
  type        text not null check (type in ('expense', 'income')),
  amount      numeric not null,
  description text,
  category_id uuid references budget_categories(id) on delete set null,
  date        date not null default current_date,
  created_at  timestamptz not null default now()
);
```

### budget_goals
```sql
create table budget_goals (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  target     numeric not null,
  saved      numeric not null default 0,
  color      text default '#60A5FA',
  created_at timestamptz not null default now()
);
```

---

## 5️⃣ Run locally

```bash
npm run dev
```

Open 👉 http://localhost:3000

---

## 6️⃣ Mobile access (optional)

```bash
npm run dev -- --host
```

Add your local IP to `next.config.ts`:

```ts
const nextConfig = {
  allowedDevOrigins: ['192.168.x.x'],
}
export default nextConfig
```

---

## ✅ Done

Start logging:

```
waga 72.1
sen 7:30
stres 6
mood 8
wydatek 45 jedzenie
przychód 500 praca
```