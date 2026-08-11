-- Rimuove 5 articoli Modulistica dal catalogo shop.
-- E 5279 A · E 5351 · E2133 · E2649 · E2134

do $$
declare
  target_sku text;
  pid uuid;
begin
  foreach target_sku in array array['E 5279 A', 'E 5351', 'E2133', 'E2649', 'E2134']
  loop
    select id into pid
    from public.products
    where sku in (target_sku, replace(target_sku, ' ', ''))
    limit 1;

    if pid is null then
      raise notice 'SKU % non trovato — skip', target_sku;
      continue;
    end if;

    delete from public.product_quantity_prices where product_id = pid;
    delete from public.products where id = pid;
  end loop;
end $$;
