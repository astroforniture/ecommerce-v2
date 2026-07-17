-- RLS orders: accesso riservato ad admin
-- Consente SELECT/UPDATE solo a:
-- 1) utenti con claim role = 'admin'
-- 2) email amministratore specifica (sostituire sotto)

do $$
declare
  pol record;
begin
  if to_regclass('public.orders') is null then
    raise notice 'Tabella public.orders non trovata: migrazione RLS saltata.';
    return;
  end if;

  alter table public.orders enable row level security;

  -- Rimuove eventuali policy esistenti per evitare leak di dati.
  for pol in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'orders'
  loop
    execute format('drop policy if exists %I on public.orders;', pol.policyname);
  end loop;

  -- SELECT: solo admin (claim role) o email amministratore.
  create policy "orders_select_admin_only"
    on public.orders
    for select
    to authenticated
    using (
      coalesce(auth.jwt() ->> 'role', '') = 'admin'
      or lower(coalesce(auth.jwt() ->> 'email', '')) = lower('INSERISCI_LA_TUA_EMAIL_ADMIN')
    );

  -- UPDATE: solo admin (claim role) o email amministratore.
  create policy "orders_update_admin_only"
    on public.orders
    for update
    to authenticated
    using (
      coalesce(auth.jwt() ->> 'role', '') = 'admin'
      or lower(coalesce(auth.jwt() ->> 'email', '')) = lower('INSERISCI_LA_TUA_EMAIL_ADMIN')
    )
    with check (
      coalesce(auth.jwt() ->> 'role', '') = 'admin'
      or lower(coalesce(auth.jwt() ->> 'email', '')) = lower('INSERISCI_LA_TUA_EMAIL_ADMIN')
    );
end $$;

comment on table public.orders is 'Ordini ecommerce; accesso RLS riservato ad admin.';
