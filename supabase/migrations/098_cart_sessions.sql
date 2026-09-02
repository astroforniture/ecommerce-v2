-- Cart sessions: bozze checkout / carrelli abbandonati (PaymentIntent Stripe).
create table if not exists public.cart_sessions (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  user_id uuid references auth.users (id) on delete set null,
  items_json jsonb not null default '[]'::jsonb,
  amount_cents integer,
  currency text not null default 'eur',
  billing_json jsonb,
  stripe_payment_intent_id text unique,
  status text not null default 'pending'
    check (status in ('pending', 'completed', 'abandoned', 'canceled', 'reminded')),
  reminder_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cart_sessions_status_updated_idx
  on public.cart_sessions (status, updated_at desc);

create index if not exists cart_sessions_email_idx
  on public.cart_sessions (lower(email));

comment on table public.cart_sessions is
  'Bozze checkout Stripe: pending all avvio PI, completed al pagamento, abandoned se scadute/pending > 2h.';

comment on column public.cart_sessions.items_json is
  'Snapshot carrello (id, sku, name, quantity, prezzi).';

comment on column public.cart_sessions.status is
  'pending | completed | abandoned | canceled | reminded';

create or replace function public.set_cart_sessions_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_cart_sessions_updated_at on public.cart_sessions;
create trigger trg_cart_sessions_updated_at
  before update on public.cart_sessions
  for each row
  execute function public.set_cart_sessions_updated_at();

alter table public.cart_sessions enable row level security;

-- Nessuna policy per anon/authenticated: accesso solo service_role (Edge Functions).
revoke all on table public.cart_sessions from anon, authenticated;
grant all on table public.cart_sessions to service_role;

-- Opzionale: marca abandoned i pending piu vecchi di 2 ore (invocabile da cron SQL).
create or replace function public.mark_stale_cart_sessions_abandoned(
  p_older_than interval default interval '2 hours'
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_count integer;
begin
  update public.cart_sessions
  set status = 'abandoned',
      updated_at = now()
  where status = 'pending'
    and updated_at < now() - p_older_than;
  get diagnostics updated_count = row_count;
  return updated_count;
end;
$$;

revoke all on function public.mark_stale_cart_sessions_abandoned(interval) from public;
grant execute on function public.mark_stale_cart_sessions_abandoned(interval) to service_role;
