-- Collegamento ordini ? profiles + idempotenza PaymentIntent Stripe (Klarna/async).

alter table public.orders
  add column if not exists user_id uuid references auth.users (id) on delete set null;

comment on column public.orders.user_id is 'Utente autenticato (profiles.id / auth.users.id) al momento del checkout.';

create index if not exists orders_user_id_idx on public.orders (user_id);

-- Un solo ordine per PaymentIntent (upsert client + webhook).
create unique index if not exists orders_stripe_payment_intent_id_uidx
  on public.orders (stripe_payment_intent_id)
  where stripe_payment_intent_id is not null
    and btrim(stripe_payment_intent_id) <> '';
