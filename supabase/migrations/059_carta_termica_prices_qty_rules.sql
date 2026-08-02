-- Prezzi aggiornati carta termica (imponibile) + vincolo acquisto multipli di 24 per SKU 100195.

alter table public.products
  add column if not exists min_order_quantity integer;

alter table public.products
  add column if not exists order_quantity_step integer;

comment on column public.products.min_order_quantity is
  'Quantità minima d''acquisto (pezzi/conf.). NULL = 1.';
comment on column public.products.order_quantity_step is
  'Incremento quantità (es. 24 → solo multipli). NULL = 1.';

update public.products set price = 18.50 where sku = '100335';
update public.products set price = 10.50 where sku = '100332';
update public.products set price = 21.00 where sku = '100337';
update public.products set price = 2.00 where sku = '100195';
update public.products set price = 15.00 where sku = '104279';

update public.products
set
  min_order_quantity = 24,
  order_quantity_step = 24
where sku = '100195';

-- Nessun listino quantità a fasce per questi SKU a prezzo fisso.
do $$
declare
  pid uuid;
  target_sku text;
begin
  foreach target_sku in array array['100335', '100332', '100337', '100195', '104279']
  loop
    select id into pid from public.products where public.products.sku = target_sku limit 1;
    if pid is null then
      raise notice 'SKU % non trovato — skip product_quantity_prices cleanup', target_sku;
      continue;
    end if;
    delete from public.product_quantity_prices where product_id = pid;
  end loop;
end $$;
