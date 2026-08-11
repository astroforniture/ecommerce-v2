-- Listino quantità Modulistica: ≥10 pezzi a −10% sul prezzo di listino (imponibile).
-- Fascia 1–9: products.price · Fascia 10+: price × 0.90

do $$
declare
  has_threshold boolean;
  has_min_qty boolean;
  rec record;
  unit_price numeric(12,2);
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
    raise notice 'Tabella product_quantity_prices senza colonne soglia — skip Modulistica tiers';
    return;
  end if;

  for rec in
    select id, price
    from public.products
    where category = 'Modulistica'
      and price is not null
      and price > 0
  loop
    unit_price := round((rec.price * 0.90)::numeric, 2);

    delete from public.product_quantity_prices where product_id = rec.id;

    if has_threshold then
      insert into public.product_quantity_prices (product_id, quantity_threshold, price_per_unit)
      values (rec.id, 10, unit_price);
    else
      insert into public.product_quantity_prices (product_id, min_quantity, price_per_unit)
      values (rec.id, 10, unit_price);
    end if;
  end loop;
end $$;
