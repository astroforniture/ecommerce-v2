-- Colonna totale riga su order_items (quantity * price), usata dal checkout pending.
alter table public.order_items
  add column if not exists total numeric(12, 2);

comment on column public.order_items.total is 'Importo riga (quantity * price / unit_imponibile).';
