-- Campi opzionali per pagamenti Stripe (ordini pagati online)
alter table public.orders
  add column if not exists stripe_payment_intent_id text,
  add column if not exists payment_method text;

comment on column public.orders.stripe_payment_intent_id is 'ID PaymentIntent Stripe (pi_…).';
comment on column public.orders.payment_method is 'Metodo di pagamento, es. stripe.';
