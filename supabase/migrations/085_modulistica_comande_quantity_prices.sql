-- Listini quantità dedicati blocchi comande Edipro (imponibile / pezzo).
-- E 5913: 1–20 → 1,10 · 21–30 → 0,95 · 31+ → 0,80
-- E 5911: 1–20 → 1,40 · 21–30 → 1,25 · 31+ → 1,00

update public.products set price = 1.10 where sku in ('E 5913', 'E5913');
update public.products set price = 1.40 where sku in ('E 5911', 'E5911');

do $$
declare
  has_threshold boolean;
  has_min_qty boolean;
  rec record;
  pid uuid;
begin
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
    raise notice 'Tabella product_quantity_prices senza colonne soglia — skip comande tiers';
    return;
  end if;

  for rec in
    select * from (
      values
        ('E 5913'::text, 1, 1.10::numeric),
        ('E 5913', 21, 0.95),
        ('E 5913', 31, 0.80),
        ('E 5911', 1, 1.40),
        ('E 5911', 21, 1.25),
        ('E 5911', 31, 1.00)
    ) as t(sku, min_qty, unit_price)
  loop
    select id into pid
    from public.products
    where sku in (rec.sku, replace(rec.sku, ' ', ''))
    limit 1;

    if pid is null then
      raise notice 'SKU % non trovato — skip tier', rec.sku;
      continue;
    end if;

    if rec.min_qty = 1 then
      delete from public.product_quantity_prices where product_id = pid;
    end if;

    if has_threshold then
      insert into public.product_quantity_prices (product_id, quantity_threshold, price_per_unit)
      values (pid, rec.min_qty, rec.unit_price);
    else
      insert into public.product_quantity_prices (product_id, min_quantity, price_per_unit)
      values (pid, rec.min_qty, rec.unit_price);
    end if;
  end loop;
end $$;
