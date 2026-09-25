-- Timestamp notifica email admin nuovo ordine (evita duplicati webhook/client).

do $$
begin
  if to_regclass('public.orders') is null then
    raise notice 'Tabella public.orders non trovata: migrazione saltata.';
    return;
  end if;

  alter table public.orders
    add column if not exists admin_notified_at timestamptz;

  comment on column public.orders.admin_notified_at is
    'Quando e stata inviata la email di notifica nuovo ordine a info@astro-forniture.it.';
end
$$;
