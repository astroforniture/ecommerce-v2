-- Tipo cliente e PEC in checkout
alter table public.orders
  add column if not exists customer_type text,
  add column if not exists pec text;

comment on column public.orders.customer_type is 'Tipo cliente: privato, azienda, ente, scuola.';
comment on column public.orders.pec is 'PEC fatturazione elettronica (facoltativa).';
