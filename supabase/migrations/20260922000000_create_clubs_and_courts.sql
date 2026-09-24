create table if not exists public.clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  address text not null,
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  phone text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index if not exists clubs_name_key on public.clubs (name);

create table if not exists public.courts (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  name text not null,
  surface_type text not null,
  is_indoor boolean not null default false,
  price numeric(10, 2) not null check (price >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (club_id, name)
);

create index if not exists courts_club_id_active_idx on public.courts (club_id) where active;

alter table public.clubs enable row level security;
alter table public.courts enable row level security;

create policy "Public users can view active clubs"
  on public.clubs for select
  using (active = true);

create policy "Public users can view active courts of active clubs"
  on public.courts for select
  using (
    active = true
    and exists (
      select 1 from public.clubs where clubs.id = courts.club_id and clubs.active = true
    )
  );
