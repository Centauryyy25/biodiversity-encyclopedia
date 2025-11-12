-- Quiz results storage for Learn module
create table if not exists public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  quiz_id text not null,
  topic text not null,
  difficulty text not null,
  questions_count integer not null check (questions_count >= 0),
  correct_count integer not null check (correct_count >= 0),
  score numeric generated always as ((case when questions_count > 0 then (correct_count::numeric / questions_count::numeric) * 100 else 0 end)) stored,
  started_at timestamptz default now(),
  finished_at timestamptz default now(),
  metadata jsonb
);

create index if not exists quiz_results_user_idx on public.quiz_results (user_id);
create index if not exists quiz_results_created_idx on public.quiz_results (finished_at desc);

-- Enable RLS for safety. Access from app via service role API route.
alter table public.quiz_results enable row level security;

-- Allow service role full access; user policies can be added later if using Supabase auth directly.
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'quiz_results' and policyname = 'allow_read_all_service_role'
  ) then
    create policy "allow_read_all_service_role" on public.quiz_results for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'quiz_results' and policyname = 'allow_write_all_service_role'
  ) then
    create policy "allow_write_all_service_role" on public.quiz_results for insert with check (true);
  end if;
end $$;

