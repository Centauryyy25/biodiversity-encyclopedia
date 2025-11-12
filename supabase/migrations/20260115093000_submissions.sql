-- Submissions table for contributor flow
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  title text not null,
  type text not null check (type in ('text','image')),
  url text,
  content text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected','flagged')),
  created_at timestamptz not null default now()
);

create index if not exists submissions_user_idx on public.submissions (user_id);
create index if not exists submissions_status_idx on public.submissions (status);
create index if not exists submissions_created_idx on public.submissions (created_at desc);

alter table public.submissions enable row level security;

-- Service role policies (reads/writes happen via server only)
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'submissions' and policyname = 'allow_read_all_service_role'
  ) then
    create policy "allow_read_all_service_role" on public.submissions for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'submissions' and policyname = 'allow_write_all_service_role'
  ) then
    create policy "allow_write_all_service_role" on public.submissions for insert with check (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'submissions' and policyname = 'allow_update_all_service_role'
  ) then
    create policy "allow_update_all_service_role" on public.submissions for update using (true) with check (true);
  end if;
end $$;

