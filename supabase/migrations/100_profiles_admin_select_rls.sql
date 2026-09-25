-- Backoffice /admin/customers: admin può elencare tutti i profili.
-- Gli utenti autenticati restano limitati al proprio profilo.

do $$
begin
  if to_regclass('public.profiles') is null then
    raise notice 'Tabella public.profiles non trovata: migrazione RLS saltata.';
    return;
  end if;

  alter table public.profiles enable row level security;

  -- Colonna utile per data registrazione in UI admin (se assente).
  alter table public.profiles
    add column if not exists created_at timestamptz default now();

  drop policy if exists "profiles_select_own" on public.profiles;
  create policy "profiles_select_own"
    on public.profiles
    for select
    to authenticated
    using (auth.uid() = id);

  drop policy if exists "profiles_select_admin" on public.profiles;
  create policy "profiles_select_admin"
    on public.profiles
    for select
    to authenticated
    using (
      coalesce(auth.jwt() ->> 'role', '') = 'admin'
      or upper(coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '')) = 'ADMIN'
      or upper(coalesce(auth.jwt() -> 'user_metadata' ->> 'role', '')) = 'ADMIN'
    );
end
$$;

comment on table public.profiles is
  'Profili utenti; select proprio profilo oppure admin (JWT role).';
