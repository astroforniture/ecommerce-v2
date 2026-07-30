-- Tracking spedizione per email "ordine spedito"
alter table public.orders
  add column if not exists tracking_number text;

comment on column public.orders.tracking_number is
  'Codice tracking corriere; usato nelle email transazionali quando status = Spedito';
