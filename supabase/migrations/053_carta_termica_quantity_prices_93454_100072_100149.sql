-- Listini quantità carta termica (imponibile / conf.)
-- 93454: 1–4 → 17,21 · 5–9 → 16,38 · 10+ → 15,67
-- 100072: 1–4 → 5,77 · 5–9 → 4,51 · 10+ → 4,09
-- 100149: 1–4 → 6,56 · 5–9 → 5,74 · 10+ → 5,29

update public.products set price = 17.21 where sku = '93454';
update public.products set price = 5.77 where sku = '100072';
update public.products set price = 6.56 where sku = '100149';

do $$
declare
  has_threshold boolean;
  has_min_qty boolean;
  rec record;
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
    raise notice 'Tabella product_quantity_prices senza colonne soglia — skip';
    return;
  end if;

  for rec in
    select * from (
      values
        ('93454'::text, 1, 17.21::numeric),
        ('93454', 5, 16.38),
        ('93454', 10, 15.67),
        ('100072', 1, 5.77),
        ('100072', 5, 4.51),
        ('100072', 10, 4.09),
        ('100149', 1, 6.56),
        ('100149', 5, 5.74),
        ('100149', 10, 5.29)
    ) as t(sku, min_qty, unit_price)
  loop
    declare
      pid uuid;
    begin
      select id into pid from public.products where sku = rec.sku limit 1;
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
    end;
  end loop;
end $$;
