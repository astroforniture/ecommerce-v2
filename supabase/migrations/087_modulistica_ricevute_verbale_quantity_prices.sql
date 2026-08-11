-- Listini quantità dedicati Modulistica (imponibile / pezzo).
-- E 5504 C: ricevuta d'affitto — 1–10 → 4,00 · 11–20 → 3,20 · 21+ → 2,90
-- E 5563 C: ricevuta generica — 1–10 → 4,00 · 11–20 → 3,20 · 21+ → 2,90
-- E 2529: verbale assemblea — 1–4 → 12,90 · 5+ → 10,90

update public.products set price = 4.00
where sku in ('E 5504 C', 'E5504C', 'E 5504C', 'E 5563 C', 'E5563C', 'E 5563C');

update public.products set price = 12.90
where sku in ('E 2529', 'E2529');

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
    raise notice 'Tabella product_quantity_prices senza colonne soglia — skip ricevute/verbale tiers';
    return;
  end if;

  for rec in
    select * from (
      values
        ('E 5504 C'::text, 1, 4.00::numeric),
        ('E 5504 C', 11, 3.20),
        ('E 5504 C', 21, 2.90),
        ('E 5563 C', 1, 4.00),
        ('E 5563 C', 11, 3.20),
        ('E 5563 C', 21, 2.90),
        ('E 2529', 1, 12.90),
        ('E 2529', 5, 10.90)
    ) as t(sku, min_qty, unit_price)
  loop
    select id into pid
    from public.products
    where sku in (
      rec.sku,
      replace(rec.sku, ' ', ''),
      regexp_replace(rec.sku, '\s+', ' ', 'g')
    )
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
