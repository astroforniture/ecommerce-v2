-- Listino quantità rotolo POS 57×7 m blister 3 pz (SKU 93453)
-- 1–5 conf.: 2,87 € + IVA / conf. · 6+ conf.: 2,50 € + IVA / conf.

update public.products
set price = 2.87
where sku = '93453';

do $$
declare
  pid uuid;
  has_threshold boolean;
  has_min_qty boolean;
begin
  select id into pid from public.products where sku = '93453' limit 1;
  if pid is null then
    raise notice 'SKU 93453 non trovato in products — skip product_quantity_prices';
    return;
  end if;

  select exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'product_quantity_prices'
      and column_name = 'quantity_threshold'
  ) into has_threshold;

  select exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'product_quantity_prices'
      and column_name = 'min_quantity'
  ) into has_min_qty;

  if not has_threshold and not has_min_qty then
    raise notice 'Tabella product_quantity_prices senza colonne soglia — skip';
    return;
  end if;

  delete from public.product_quantity_prices where product_id = pid;

  if has_threshold then
    insert into public.product_quantity_prices (product_id, quantity_threshold, price_per_unit)
    values
      (pid, 1, 2.87),
      (pid, 6, 2.50);
  elsif has_min_qty then
    insert into public.product_quantity_prices (product_id, min_quantity, price_per_unit)
    values
      (pid, 1, 2.87),
      (pid, 6, 2.50);
  end if;
end $$;
